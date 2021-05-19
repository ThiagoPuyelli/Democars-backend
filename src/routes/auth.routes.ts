import { Router, Request, Response } from 'express'
import sendResponse from '../utils/sendResponse'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import validateReq from '../middlewares/validateReq'
import { registerJoi } from '../validators/users'
const router = Router()

router.post('/sign-up', validateReq(registerJoi, 'body'), async (req: Request, res: Response) => {
  const user = req.body

  try {
    // Verify email
    const userEmail = await User.exists({ email: user.email })
    if (userEmail) {
      return sendResponse(res, 400, 'The email is taken')
    }

    const newUser = await User.create(user)

    const token = jwt.sign({ userID: newUser._id }, process.env.JWT_PASSWORD, {
      expiresIn: 24 * 24 * 60
    })

    return sendResponse(res, 200, { token })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server failed')
  }
})

export default router
