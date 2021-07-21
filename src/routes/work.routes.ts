import { Router } from 'express'
import Service from '../models/Service'
import Work from '../models/Work'
import passport from 'passport'
import validateReq from '../middlewares/validateReq'
import { modifyWork, saveWork } from '../validators/works'
import sendResponse from '../utils/sendResponse'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const works = await Work.find()

    if (!works) {
      return sendResponse(res, 404, 'Dont\'t find works')
    }

    return sendResponse(res, 200, { works })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.get('/:id', async (req, res) => {
  try {
    const work = await Work.findById(req.params.id)

    if (!work) {
      return sendResponse(res, 404, 'Dont\'t find work')
    }

    return sendResponse(res, 200, { work })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.get('/service/:serviceID', async (req, res) => {
  try {
    const service = await Service.findById(req.params.serviceID)

    if (!service) {
      return sendResponse(res, 404, 'Don\'t find service')
    }

    const serviceWorks: any = await Work.populate(service, { path: 'works' })

    const works = serviceWorks.works

    if (!works || works.length <= 0) {
      return sendResponse(res, 404, 'The service don\'t have works')
    }

    return sendResponse(res, 200, { works })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.put('/like/:id', passport.authenticate('token'), async (req, res) => {
  try {
    const work = await Work.findById(req.params.id)

    if (!work) {
      return sendResponse(res, 404, 'Don\'t find work')
    }

    const { _id } = req.user

    const verifyLike = work.likes.filter(wor => {
      if (wor.userID + '' === _id + '') {
        return true
      } else {
        return false
      }
    })

    if (verifyLike.length > 0) {
      return sendResponse(res, 402, 'Work already liked for you')
    }
    work.likes.push(_id)

    const workUpdate = await work.save()

    if (!workUpdate) {
      return sendResponse(res, 500, 'Error to save like')
    }

    return sendResponse(res, 200, 'Like added')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.get('/verify-like/:id', passport.authenticate('token'), async (req, res) => {
  try {
    const work = await Work.findById(req.params.id)

    if (!work) {
      return sendResponse(res, 404, 'The work doesn\'t exist')
    }

    const verify = work.likes.filter(like => {
      if (like.userID + '' === req.user._id + '') {
        return true
      } else {
        return false
      }
    })

    if (verify.length > 0) {
      return sendResponse(res, 200, { verify: true })
    } else {
      return sendResponse(res, 200, { verify: false })
    }
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.post('/:id', passport.authenticate('admin-token'), validateReq(saveWork, 'body'), async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)

    if (!service) {
      return sendResponse(res, 404, 'Don\'t find service')
    }

    const work = await Work.create({ ...req.body, serviceID: service._id })

    if (!work) {
      return sendResponse(res, 500, 'Error to save work')
    }

    service.works.push(work)

    const saveService = await service.save()

    if (!saveService) {
      return sendResponse(res, 500, 'Error to save work in the service')
    }

    return sendResponse(res, 200, 'Work saved')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.put('/:id', passport.authenticate('admin-token'), validateReq(modifyWork, 'body'), async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return sendResponse(res, 404, 'The body is empty')
    }
    const work = await Work.findByIdAndUpdate(req.params.id, { ...req.body })
    if (!work) {
      return sendResponse(res, 500, 'Error to modify work')
    }

    return sendResponse(res, 200, 'Work modified')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.delete('/:id', passport.authenticate('admin-token'), async (req, res) => {
  try {
    const work = await Work.findById(req.params.id)

    if (!work) {
      return sendResponse(res, 404, 'The work doesn\'t exist')
    }

    const service = await Service.findById(work.serviceID)

    if (!service) {
      return sendResponse(res, 500, 'Error to find service')
    }

    service.works = service.works.filter(i => {
      if (i + '' === work._id + '') {
        return false
      } else {
        return true
      }
    })

    const workDelete = await Work.findByIdAndRemove(work._id)

    if (!workDelete) {
      return sendResponse(res, 500, 'Error to delete work')
    }

    const serviceUpdate = await service.save()

    if (!serviceUpdate) {
      return sendResponse(res, 500, 'Error to update service')
    }

    return sendResponse(res, 200, 'Work deleted')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.delete('/like/:id', passport.authenticate('token'), async (req, res) => {
  try {
    const work = await Work.findById(req.params.id)

    if (!work) {
      return sendResponse(res, 404, 'The work doesn\'t exist')
    }

    let verify: boolean = false
    work.likes = work.likes.filter(wor => {
      if (wor + '' === req.user._id + '') {
        verify = true
        return false
      } else {
        return true
      }
    })

    if (!verify) {
      return sendResponse(res, 404, 'Don\'t find like')
    }

    const workUpdate = await work.save()

    if (!workUpdate) {
      return sendResponse(res, 500, 'Error to delete like')
    }

    return sendResponse(res, 200, 'Like deleted')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

export default router
