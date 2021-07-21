import { ExtractJwt, Strategy } from 'passport-jwt'
import passport from 'passport'
import User from '../models/User'

export default () => {
  passport.use('token', new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_PASSWORD
  }, async (payload, done) => {
    const user = await User.findById(payload.userID)
    if (!user || user.role !== 'User') {
      return done('Error to authorize user', false)
    }

    done(null, user)
  }
  ))

  passport.use('admin-token', new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_PASSWORD
  }, async (payload, done) => {
    const admin = await User.findById(payload.adminID)
    if (!admin || admin.role !== 'Admin') {
      return done('Error to authorize admin', false)
    }

    done(null, admin)
  }
  ))
}
