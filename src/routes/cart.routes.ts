import Product from '../models/Product'
import { Router } from 'express'
import passport from 'passport'
import sendResponse from '../utils/sendResponse'
import User from '../models/User'
const router = Router()

router.get('/', passport.authenticate('token'), async (req, res) => {
  try {
    let { cart }: any = req.user

    if (cart.length === 0) {
      return sendResponse(res, 200, { cart, totalPrice: 0 })
    }

    let totalPrice = 0
    for (const i in cart) {
      totalPrice += cart[i].price * cart[i].amount
    }

    cart = await Product.populate(cart, { path: 'productID' })
    const cartSend = []
    for (const i in cart) {
      if (cart[i].productID === null) {
        cart[i].product = 'deleted'
        cart[i].productID = undefined
      } else {
        const { amount, price, productID: { title, _id, image } } = cart[i]
        cart[i].productID = undefined
        cartSend.push({
          _id: cart[i]._id,
          amount: amount,
          price: price,
          product: {
            title,
            _id,
            image
          }
        })
      }
    }

    return sendResponse(res, 200, { cart: cartSend, totalPrice })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.put('/:id/:amount?', passport.authenticate('token'), async (req, res) => {
  try {
    let { id, amount } = req.params
    if (!amount) {
      amount = '1'
    }
    const { cart } = req.user
    const product = await Product.findById(id)

    if (!product) {
      return sendResponse(res, 404, 'The product doesn\'t exist')
    }

    let verify: boolean = false

    if (cart.length > 0) {
      for (const i in cart) {
        if (cart[i].productID + '' === id + '') {
          cart[i].amount += parseInt(amount)
          verify = true
        }
      }
    }

    if (!verify) {
      cart.push({
        productID: product._id,
        price: product.price,
        amount: parseInt(amount)
      })
    }

    const newUser = await User.findByIdAndUpdate(req.user._id, { cart })

    if (!newUser) {
      return sendResponse(res, 500, 'Error to save product in cart')
    }

    return sendResponse(res, 200, 'Added to cart')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.delete('/:id/:amount?', passport.authenticate('token'), async (req, res) => {
  try {
    const { id, amount } = req.params

    const { cart } = req.user

    let verify: boolean = false

    if (cart.length > 0) {
      for (const i in cart) {
        if (cart[i].productID + '' === id + '') {
          if (!amount || cart[i].amount >= parseInt(amount)) {
            cart.splice(i, 1)
            verify = true
          } else {
            cart[i].amount -= parseInt(amount)
            verify = true
          }
        }
      }
    } else {
      return sendResponse(res, 404, 'The cart is empty')
    }

    if (!verify) {
      return sendResponse(res, 404, 'The product doesn\'t exist')
    }

    const newUser = await User.findByIdAndUpdate(req.user._id, { cart })
    if (!newUser) {
      return sendResponse(res, 500, 'Error to save user')
    }

    return sendResponse(res, 200, 'Product removed to cart')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.delete('/', passport.authenticate('token'), async (req, res) => {
  try {
    const userUpdate = await User.findByIdAndUpdate(req.user._id, { cart: [] })

    if (!userUpdate) {
      return sendResponse(res, 500, 'Error to remove products in the cart')
    }

    return sendResponse(res, 200, 'Cart empty')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

export default router
