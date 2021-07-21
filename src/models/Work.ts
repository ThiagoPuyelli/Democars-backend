import { WorkInterface } from '../interfaces/ServiceInterface'
import { Schema, model, Document } from 'mongoose'

const workSchema = new Schema<WorkInterface & Document>({
  title: {
    type: String,
    required: true,
    maxLength: 50
  },
  description: {
    type: String,
    required: true,
    maxLength: 300
  },
  images: {
    type: [String],
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  likes: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'User'
  },
  serviceID: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  reviews: {
    type: [{
      _id: false,
      userID: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      },
      review: {
        type: String,
        required: true,
        maxLength: 200
      },
      rating: {
        type: Number,
        max: 5,
        min: 0,
        default: 0
      },
      date: {
        type: Number,
        default: Date.now()
      }
    }],
    default: []
  }
}, { versionKey: false })

export default model<WorkInterface>('Work', workSchema)
