import { Router } from 'express'
// import { updateAdmin } from '../validators/admin'
// import validateReq from '../middlewares/validateReq'
import sendResponse from '../utils/sendResponse'
import jwt from 'jsonwebtoken'
import passport from 'passport'
const router = Router()

/* router.get('/', passport.authenticate('admin-token'), async (req, res) => {
  try {
    const admins = await Admin.find()

    if (!admins) {
      return sendResponse(res, 500, 'Error to find admins')
    }

    for (const i in admins) {
      admins[i].password = undefined
    }

    return sendResponse(res, 200, { admins })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
}) */

router.post('/login', passport.authenticate('admin-login'), async (req, res) => {
  try {
    const token = jwt.sign({ adminID: req.user._id }, process.env.JWT_PASSWORD, ({
      expiresIn: 24 * 24 * 60
    }))

    return sendResponse(res, 200, { token })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})
/*
router.put('/:id', passport.authenticate('admin-token'), validateReq(updateAdmin, 'body'), async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, { ...req.body })

    if (!admin) {
      return sendResponse(res, 500, 'Error to modify admin')
    }

    return sendResponse(res, 200, 'Admin modified')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.delete('/:id', passport.authenticate('admin-token'), async (req, res) => {
  try {
    const adminDelete = await Admin.findByIdAndRemove(req.params.id)
    if (!adminDelete) {
      return sendResponse(res, 500, 'Error to delete Admin')
    }
    return sendResponse(res, 200, 'Admin deleted')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
}) */

export default router
