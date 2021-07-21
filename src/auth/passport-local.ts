import { BasicStrategy } from 'passport-http'
import passport from 'passport'
import User from '../models/User'

const passportFunctions = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id)
    done(null, user)
  })

  passport.use('login', new BasicStrategy(async (email, password, done) => {
    try {
      let user: any = await User.findOne({ email })
      if (!user) {
        user = await User.findOne({ username: email })
        if (!user) {
          return done(false)
        }
      }

      if (user.role === 'Admin') {
        return done(false)
      }

      const validPassword = await user.comparePasswords(password)
      if (!validPassword) {
        return done(false)
      }
      if (user.toObject) {
        user = user.toObject()
        user.password = undefined
        if (user.status === 'Desactive') {
          return done('The account is desactive')
        }
      }
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  }
  ))

  passport.use('admin-login', new BasicStrategy(async (email, password, done) => {
    try {
      let admin: any = await User.findOne({ email })
      if (!admin || admin.role === 'User') {
        return done(false)
      }
      const validPassword = await admin.comparePasswords(password)
      if (!validPassword) {
        return done(false)
      }
      if (admin.toObject) {
        admin = admin.toObject()
        delete admin.password
      }
      return done(null, admin)
    } catch (err) {
      return done(err)
    }
  }
  ))
}

export default passportFunctions
