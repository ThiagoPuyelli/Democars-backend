import { Router } from 'express'
import sendResponse from '../utils/sendResponse'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import validateReq from '../middlewares/validateReq'
import { registerJoi, nameJoi, recoverJoi, changePasswordJoi } from '../validators/users'
import passport from 'passport'
import transportEmail from '../utils/transportMail'
import generateID from '../utils/generateID'
const router = Router()

router.get('/user', passport.authenticate('token'), (req, res) => {
  try {
    const user = req.user
    user.password = undefined
    return sendResponse(res, 200, user)
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.post('/sign-up', validateReq(registerJoi, 'body'), async (req, res) => {
  const user = req.body

  try {
    // Verify email
    const userEmail = await User.exists({ email: user.email })
    if (userEmail) {
      return sendResponse(res, 400, 'The email is taken')
    }

    // Verify username
    const userNick = await User.exists({ username: user.username })
    if (userNick) {
      return sendResponse(res, 400, 'The username is taken')
    }

    user.status = 'Active'
    user.role = 'User'

    const newUser = await User.create(user)

    const token = jwt.sign({ userID: newUser._id }, process.env.JWT_PASSWORD, {
      expiresIn: 24 * 24 * 60
    })

    return sendResponse(res, 200, { token })
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server failed')
  }
})

router.post('/sign-in',
  passport.authenticate('login'),
  async (req, res) => {
    try {
      const { _id, status } = req.user
      if (status === 'Desactive') {
        const userUpdate = await User.findByIdAndUpdate(_id, { status: 'Active' })

        if (!userUpdate) {
          return sendResponse(res, 500, 'Error to active account')
        }
      }

      const token = jwt.sign({ userID: _id }, process.env.JWT_PASSWORD, {
        expiresIn: 24 * 24 * 60
      })

      return sendResponse(res, 200, { token })
    } catch (error) {
      return sendResponse(res, 500, error.message || 'Server error')
    }
  })

router.post('/recover-password', validateReq(recoverJoi, 'body'), async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return sendResponse(res, 404, 'Don\'t find user')
    }

    // Generate code
    let code = await generateID(7)
    code = code.toUpperCase()
    user.codePassword = { code, date: Date.now() }

    const newUser = await User.findOneAndUpdate({ email }, user)

    if (!newUser) {
      return sendResponse(res, 500, 'Error to save User')
    }

    await transportEmail.sendMail({
      from: '\'Cambio de contraseña\' <cloudinaryprueba@gmail.com>',
      to: user.email,
      subject: 'Code for recover password',
      html: `<b>Code: ${code}</b>`
    })

    return sendResponse(res, 200, 'Mail sended')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.post('/change-password', validateReq(changePasswordJoi, 'body'), async (req, res) => {
  try {
    const { code, password, email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return sendResponse(res, 500, 'Error to find user')
    }

    const { codePassword } = user
    const timeLapse: number = Date.now() - codePassword.date

    if (codePassword.code === code && timeLapse < 3600000) {
      user.password = password
      user.codePassword = undefined

      const newUser = await user.save()
      if (!newUser) {
        return sendResponse(res, 500, 'Error to save user')
      }

      return sendResponse(res, 200, 'Password changed')
    } else if (codePassword.code !== code) {
      return sendResponse(res, 400, 'The code is incorrect')
    } else if (codePassword.date >= 3600000) {
      return sendResponse(res, 400, 'The code expired')
    }
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.put('/', passport.authenticate('token'), validateReq(nameJoi, 'body'), async (req, res) => {
  try {
    const user = await User.findById(req.user._id, { ...req.body })

    if (!user) {
      return sendResponse(res, 500, 'Error to update user')
    }

    return sendResponse(res, 200, 'User updated')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

router.delete('/', passport.authenticate('token'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { status: 'Desactive' })
    if (!user) {
      return sendResponse(res, 404, 'User doesn\'t exist')
    }

    return sendResponse(res, 200, 'User desactived')
  } catch (err) {
    return sendResponse(res, 500, err.message || 'Server error')
  }
})

export default router
