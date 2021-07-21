import Product from '../models/Product'
import { Router } from 'express'
import sendResponse from '../utils/sendResponse'
import validateReq from '../middlewares/validateReq'
import { saveReview } from '../validators/reviews'
import pagination from '../utils/pagination'
import calculateRating from '../utils/calculateRating'
import passport from 'passport'
import { ReviewInterface } from '../interfaces/ProductInterface'
import User from '../models/User'
import Work from '../models/Work'
const router = Router()

router.get('/:id/:type/:amount/:page?', async (req, res) => {
  try {
    let { id, type, page, amount } = req.params
    let object
    if (type === 'product') {
      object = await Product.findById(id)
    } else if (type + '' === 'work') {
      object = await Work.findById(id)
    } else {
      return sendResponse(res, 404, 'The type is invalid')
    }

    if (!page) {
      page = '1'
    }

    if (!parseInt(amount)) {
      return sendResponse(res, 500, 'The amount is invalid')
    }

    if (!object) {
      return sendResponse(res, 400, 'The object doesn\'t exist')
    }

    let reviews = object.reviews

    const pages: number = Math.round(reviews.length / parseInt(amount))
    reviews = pagination(parseInt(amount), reviews, parseInt(page))
    const reviewsSend = []
    const reviewUser = []

    for (const i in reviews) {
      reviewsSend.push(await User.populate(reviews[i], { path: 'userID' }))
      reviewsSend[i].userID.password = undefined
      if (reviewsSend[i].userID === null) {
        reviewsSend[i].userID = 'anonymous'
      } else {
        const { date, review, rating, userID: { image, username, _id } } = reviewsSend[i]
        reviewsSend[i].userID = undefined
        reviewUser.push({
          date,
          review,
          rating,
          user: {
            image,
            username,
            userID: _id
          }
        })
      }
    }

    if (!reviewUser || reviewUser.length <= 0) {
      return sendResponse(res, 500, 'Error to send reviews')
    }

    return sendResponse(res, 200, { pages, reviews: reviewUser })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.post('/:id/:type',
  passport.authenticate('token'),
  validateReq(saveReview, 'body'),
  async (req, res) => {
    const { review, rating } = req.body

    try {
      const { id, type } = req.params
      let object
      if (type === 'product') {
        object = await Product.findById(id)
      } else if (type === 'work') {
        object = await Work.findById(id)
      } else {
        return sendResponse(res, 404, 'The type is invalid')
      }

      if (!object) {
        return sendResponse(res, 404, 'The object doesn\'t exists')
      }

      const userID = req.user._id
      if (!userID) {
        return sendResponse(res, 500, 'Error to find userID')
      }

      const verifyReview = object.reviews.find(review => review.userID + '' === userID + '')
      if (verifyReview) {
        return sendResponse(res, 404, 'You already rated the object')
      }

      const totalReview: ReviewInterface = {
        userID,
        review,
        rating,
        date: Date.now()
      }

      object.reviews.push(totalReview)

      object.rating = await calculateRating(object.reviews.map(pro => { return pro.rating }))

      const newObject = await object.save()

      if (!newObject) {
        return sendResponse(res, 500, 'Error to add review')
      }

      return sendResponse(res, 200, 'Review added')
    } catch (err) {
      return sendResponse(res, 500, err.message || 'Server error')
    }
  })

router.delete('/:id/:reviewID/:type', passport.authenticate('admin-token'), async (req, res) => {
  try {
    const { id, reviewID, type } = req.params
    let object
    if (type === 'work') {
      object = await Work.findById(id)
    } else if (type === 'product') {
      object = await Product.findById(id)
    } else {
      return sendResponse(res, 404, 'The type is invalid')
    }

    if (!object) {
      return sendResponse(res, 500, 'Error to find object')
    }

    const reviews = object.reviews

    let verify: boolean = false
    for (const i in reviews) {
      if (reviews[i]._id + '' === reviewID + '') {
        object.reviews.splice(parseInt(i), 1)
        verify = true
      }
    }
    if (!verify) {
      return sendResponse(res, 400, 'The review doesn\'t exist')
    }

    if (object.reviews.length === 0) {
      object.rating = 0
    } else {
      object.rating = await calculateRating(object.reviews.map(pro => { return pro.rating }))
    }
    const newObject = await object.save()

    if (!newObject) {
      return sendResponse(res, 500, 'Server error')
    }

    return sendResponse(res, 200, 'Review deleted')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

export default router
