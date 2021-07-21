import { Router } from 'express'
import passport from 'passport'
import { modifyService, saveService } from '../validators/services'
import validateReq from '../middlewares/validateReq'
import Service from '../models/Service'
import sendResponse from '../utils/sendResponse'
import Turn from '../models/Turn'
import Work from '../models/Work'
const router = Router()

router.get('/', async (req, res) => {
  try {
    const services = await Service.find()

    if (!services) {
      return sendResponse(res, 404, 'Don\'t find services')
    }

    return sendResponse(res, 200, { services })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)

    if (!service) {
      return sendResponse(res, 404, 'Don\'t find service')
    }

    return sendResponse(res, 200, { service })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.post('/', passport.authenticate('admin-token'), validateReq(saveService, 'body'), async (req, res) => {
  try {
    const service = await Service.create({ ...req.body })

    if (!service) {
      return sendResponse(res, 500, 'Error to save service')
    }

    return sendResponse(res, 200, 'Service saved')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.put('/:id', passport.authenticate('admin-token'), validateReq(modifyService, 'body'), async (req, res) => {
  try {
    const serviceUpdate = await Service.findByIdAndUpdate(req.params.id, { ...req.body })

    if (!serviceUpdate) {
      return sendResponse(res, 500, 'Error to modify service')
    }

    return sendResponse(res, 200, 'Service modified')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.delete('/:id', passport.authenticate('admin-token'), async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)

    if (!service) {
      return sendResponse(res, 404, 'The service doesn\'t exist')
    }

    if (service.schedule.length > 0) {
      await Turn.deleteMany({ serviceID: service._id })
    }

    if (service.works.length > 0) {
      await Work.deleteMany({ serviceID: service._id })
    }

    const serviceDelete = await Service.findByIdAndRemove(service._id)

    if (!serviceDelete) {
      return sendResponse(res, 500, 'Error to delete service')
    }

    return sendResponse(res, 200, 'Service deleted')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

export default router
