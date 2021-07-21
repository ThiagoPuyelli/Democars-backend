import { Router } from 'express'
import passport from 'passport'
import Product from '../models/Product'
import User from '../models/User'
import sendResponse from '../utils/sendResponse'
const router = Router()

router.get('/:id', passport.authenticate('token'), async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)

    if (!product) {
      return sendResponse(res, 404, 'The product doesn\'t exist')
    }

    const { favourites } = req.user

    const verify = favourites.find(fav => fav.productID + '' === id + '')

    if (verify) {
      return sendResponse(res, 403, 'The product is already in favorites')
    }

    favourites.push({
      productID: id
    })

    const newUser = await User.findByIdAndUpdate(req.user._id, { favourites })

    if (!newUser) {
      return sendResponse(res, 500, 'Error to save favourite')
    }

    return sendResponse(res, 200, 'The product added in favourites')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.get('/', passport.authenticate('token'), async (req, res) => {
  try {
    const { favourites } = req.user
    if (!favourites || favourites.length <= 0) {
      return sendResponse(res, 404, 'You dont have products in favourites')
    }

    for (const i in favourites) {
      if (favourites[i].productID === null) {
        favourites[i].productID = 'deleted'
      }
    }

    return sendResponse(res, 200, { favourites })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.delete('/:id', passport.authenticate('token'), async (req, res) => {
  try {
    const { id } = req.params
    const { favourites } = req.user

    if (!favourites || favourites.length <= 0) {
      return sendResponse(res, 404, 'You don\'t have products in favourites')
    }

    let verify: boolean = false

    for (const i in favourites) {
      if (favourites[i]._id + '' === id + '') {
        favourites.splice(i, 1)
        verify = true
      }
    }

    if (!verify) {
      return sendResponse(res, 404, 'The product doesn\'t exist')
    }

    const newUser = await User.findByIdAndUpdate(req.user._id, { favourites })

    if (!newUser) {
      return sendResponse(res, 500, 'Error to remove product of favourites')
    }

    return sendResponse(res, 200, 'Product removed of favourites')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

export default router
