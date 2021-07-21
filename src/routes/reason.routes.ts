import { Router } from 'express'
import passport from 'passport'
import sendResponse from '../utils/sendResponse'
import Reason from '../models/Reason'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const reasons = await Reason.find()

    if (!reasons || reasons.length <= 0) {
      return sendResponse(res, 500, 'Error to find or you don\'t have a reasons')
    }

    return sendResponse(res, 200, { reasons })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.post('/', passport.authenticate('admin-token'), async (req, res) => {
  try {
    const { reason } = req.body

    if (!reason || reason === '') {
      return sendResponse(res, 404, 'Your reason is invalid')
    }

    const verifyReason = await Reason.findOne({ reason })

    if (verifyReason) {
      return sendResponse(res, 402, 'The reason exist')
    }

    const reasonSave = await Reason.create({ reason })

    if (!reasonSave) {
      return sendResponse(res, 500, 'Error to save reason')
    }

    return sendResponse(res, 200, 'Reason saved')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.delete('/:id', passport.authenticate('admin-token'), async (req, res) => {
  try {
    const { id } = req.params
    const reasonDelete = await Reason.findByIdAndDelete(id)

    if (!reasonDelete) {
      return sendResponse(res, 500, 'Error to delete reason or doesn\'t exist')
    }

    return sendResponse(res, 200, 'Reason deleted')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

export default router
