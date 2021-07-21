import UserInterface from '../interfaces/UserInterface'
import { model, Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'
import { NextFunction } from 'express'

const userSchema = new Schema<UserInterface & Document >({
  username: {
    type: String,
    minLength: 4,
    maxLength: 30
  },
  image: {
    type: String
  },
  name: {
    type: String,
    minLength: 4,
    maxLength: 80
  },
  lastname: {
    type: String,
    minLength: 4,
    maxLength: 80
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 50
  },
  role: {
    type: String,
    enum: ['Admin', 'User'],
    required: true
  },
  status: {
    type: String
  },
  cart: {
    type: [{
      productID: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      amount: {
        type: Number,
        default: 1
      }
    }]
  },
  favourites: {
    type: [{
      productID: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      }
    }]
  },
  codePassword: {
    type: {
      code: {
        type: String,
        required: true
      },
      date: {
        type: Number,
        default: Date.now()
      }
    }
  }
}, { versionKey: false })

userSchema.pre('save', async function (next: NextFunction) {
  if (!this.isModified('password')) return next()

  try {
    const passwordHased = await bcrypt.hash(this.password, 10)
    this.password = passwordHased
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.comparePasswords = async function (password: string) {
  try {
    const comparePassword = await bcrypt.compare(password, this.password)
    return comparePassword
  } catch (err) {
    return false
  }
}

export default model<UserInterface>('User', userSchema)
