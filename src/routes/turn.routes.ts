import { Router } from 'express'
import verifyReq from '../middlewares/validateReq'
import { saveTurn } from '../validators/turns'
import Turn from '../models/Turn'
import Service from '../models/Service'
import sendResponse from '../utils/sendResponse'
import passport from 'passport'
import Reason from '../models/Reason'
const router = Router()

router.get('/', passport.authenticate('admin-token'), async (req, res) => {
  try {
    const turns = await Turn.find()

    if (!turns) {
      return sendResponse(res, 404, 'Don\'t have turns')
    }

    return sendResponse(res, 200, { turns })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.get('/:id', passport.authenticate('admin-token'), async (req, res) => {
  try {
    const turn = await Turn.findById(req.params.id)

    if (!turn) {
      return sendResponse(res, 404, 'The turn doesn\'t exist')
    }

    return sendResponse(res, 200, { turn })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.get('/service/:id', passport.authenticate('admin-token'), async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)

    if (!service) {
      return sendResponse(res, 404, 'The service doesn\'t exist')
    }

    let turns: any = await Turn.populate(service, { path: 'schedule' })
    turns = turns.schedule

    if (!turns || turns.length <= 0) {
      return sendResponse(res, 404, 'The service don\'t have a turns')
    }

    return sendResponse(res, 200, { turns })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.post('/:id', verifyReq(saveTurn, 'body'), async (req, res) => {
  try {
    const { reason } = req.body

    const verifyReason = await Reason.findOne({ reason })

    if (!verifyReason) {
      return sendResponse(res, 404, 'The reason is invalid')
    }

    const service = await Service.findById(req.params.id)

    if (!service) {
      return sendResponse(res, 404, 'Don\'t find service')
    }

    const turn = await Turn.create({ ...req.body, serviceID: service._id })

    if (!turn) {
      return sendResponse(res, 500, 'Error to save turn')
    }

    service.schedule.push(turn._id)

    const serviceUpdate = await service.save()

    if (!serviceUpdate) {
      return sendResponse(res, 500, 'Error to add turn in service')
    }

    return sendResponse(res, 200, 'Turn saved')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.delete('/:id', passport.authenticate('admin-token'), async (req, res) => {
  try {
    const turn = await Turn.findById(req.params.id)

    if (!turn) {
      return sendResponse(res, 404, 'The turn doesn\'t exist')
    }

    const service = await Service.findById(turn.serviceID)

    if (!service) {
      return sendResponse(res, 500, 'Error to find service')
    }

    const turnDelete = await Turn.findByIdAndRemove(turn._id)

    if (!turnDelete) {
      return sendResponse(res, 500, 'Error to delete turn')
    }

    service.schedule = service.schedule.filter(tur => {
      if (tur + '' === turn._id + '') {
        return false
      } else {
        return true
      }
    })

    const serviceUpdate = await service.save()

    if (!serviceUpdate) {
      return sendResponse(res, 500, 'Error to update service')
    }

    return sendResponse(res, 200, 'Turn deleted')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

export default router
