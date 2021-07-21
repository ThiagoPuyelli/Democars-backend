import { Router } from 'express'
import passport from 'passport'
import sendResponse from '../utils/sendResponse'
import { payOrder } from '../validators/orderLocations'
import validateReq from '../middlewares/validateReq'
import OrderLocation from '../models/OrderLocation'
import User from '../models/User'
import Product from '../models/Product'
const stripe = require('stripe')(process.env.STRIPE_CODE)
const router = Router()

router.get('/:id?', passport.authenticate('admin-token'), async (req, res) => {
  try {
    const { id } = req.params
    let orders
    if (id) {
      orders = await OrderLocation.findById(id)
    } else {
      orders = await OrderLocation.find()
    }

    if (!orders || orders.length <= 0) {
      return sendResponse(res, 404, 'Don\'t find orders')
    }

    return sendResponse(res, 200, { orders })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.post('/', passport.authenticate('token'), validateReq(payOrder, 'body'), async (req, res) => {
  try {
    let { cart } = req.user
    if (!cart || cart.length <= 0) {
      return sendResponse(res, 404, 'You don\'t have products in the cart')
    }

    cart = await Product.populate(cart, { path: 'productID' })

    let amount = 0
    for (const i of cart) {
      amount += i.price * i.amount
    }

    const pay = await stripe.paymentIntents.create({
      amount,
      currency: 'USD',
      payment_method: req.body.id,
      confirm: true
    })

    if (!pay) {
      return sendResponse(res, 500, 'The pay is error')
    }

    const userUpdate = await User.findByIdAndUpdate(req.user._id, { cart: [] })

    if (!userUpdate) {
      return sendResponse(res, 500, 'Error to update cart')
    }

    const orderLocation = await OrderLocation.create({ ...req.body, products: cart })

    if (!orderLocation) {
      return sendResponse(res, 500, 'Error to save location')
    }

    return sendResponse(res, 200, { client_secret: pay.client_secret })
  } catch (err) {
    return sendResponse(res, 500, err.raw.message || err.message || 'Server error')
  }
})

router.delete('/:id', passport.authenticate('admin-token'), async (req, res) => {
  try {
    const orderDelete = await OrderLocation.findByIdAndRemove(req.params.id)

    if (!orderDelete) {
      return sendResponse(res, 404, 'The order doesn\'t exist')
    }

    return sendResponse(res, 200, 'Order deleted')
  } catch (err) {
    return sendResponse(res, 500, 'Server error')
  }
})

export default router
