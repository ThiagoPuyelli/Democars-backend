import UserInterface from '../interfaces/UserInterface'
import { model, Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new Schema<UserInterface & Document>({
  name: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 80
  },
  lastname: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 80
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 50
  },
  cart: [],
  favourites: []
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  try {
    const passwordHased = await bcrypt.hash(this.password, 10)
    this.password = passwordHased
    next()
  } catch (error) {
    next(error)
  }
})

export default model('User', userSchema)
