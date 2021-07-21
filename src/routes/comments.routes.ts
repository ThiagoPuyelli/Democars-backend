import { Router } from 'express'
import Product from '../models/Product'
import passport from 'passport'
import User from '../models/User'
import pagination from '../utils/pagination'
import sendResponse from '../utils/sendResponse'
const router = Router()

router.get('/:id/:amount/:page?', async (req, res) => {
  try {
    let { id, page, amount } = req.params
    if (page) {
      page = '1'
    }

    if (!parseInt(amount)) {
      return sendResponse(res, 500, 'The amount is invalid')
    }

    let { comments }: any = await Product.findById(id)

    if (!comments) {
      return sendResponse(res, 500, 'Error to find comments')
    }
    const pages = Math.round(comments.length / parseInt(amount))

    comments = comments.toObject()

    comments = pagination(parseInt(amount), comments, parseInt(page) || 1)

    comments = await User.populate(comments, { path: 'userID' })

    for (const i in comments) {
      if (comments[i].userID === null) {
        comments[i].userID = 'anonymous'
      } else {
        const { image, username, _id } = comments[i].userID
        comments[i].userID = undefined
        comments[i].user = {
          _id,
          image,
          username
        }
      }
    }

    return sendResponse(res, 200, { comments, pages })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.post('/:id', passport.authenticate('token'), async (req, res) => {
  const { comment } = req.body
  if (!comment || comment === '') {
    return sendResponse(res, 400, 'Comment invalid')
  }

  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return sendResponse(res, 500, 'The product doesn\'t exist')
    }

    product.comments.push({ comment, userID: req.user._id, date: Date.now() })
    const saveProduct = product.save()
    if (!saveProduct) {
      return sendResponse(res, 500, 'Error to save comment')
    }

    return sendResponse(res, 200, 'Comment sended')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.delete('/user/:productID/:commentID', passport.authenticate('token'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.productID)
    if (!product.comments) {
      return sendResponse(res, 400, 'The product doesn\'t exist')
    }

    let verify: boolean = false

    for (const i in product.comments) {
      if (product.comments[i]._id + '' === req.params.commentID + '') {
        if (product.comments[i].userID + '' === req.user._id + '') {
          product.comments.splice(parseInt(i), 1)
          verify = true
        } else {
          return sendResponse(res, 404, 'The comment is not yours')
        }
      }
    }

    if (!verify) {
      return sendResponse(res, 404, 'Doesn\'t find the comment')
    }

    const saveProduct = await product.save()

    if (!saveProduct) {
      return sendResponse(res, 500, 'Error to delete comment')
    }

    return sendResponse(res, 200, 'Comment deleted')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.delete('/admin/:productID/:commentID', passport.authenticate('admin-token'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.productID)
    if (!product.comments) {
      return sendResponse(res, 400, 'The product doesn\'t exist')
    }

    let verify: boolean = false

    for (const i in product.comments) {
      if (product.comments[i]._id + '' === req.params.commentID + '') {
        product.comments.splice(parseInt(i), 1)
        verify = true
      }
    }

    if (!verify) {
      return sendResponse(res, 404, 'Doesn\'t find the comment')
    }

    const saveProduct = await product.save()

    if (!saveProduct) {
      return sendResponse(res, 500, 'Error to delete comment')
    }

    return sendResponse(res, 200, 'Comment deleted')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

export default router
