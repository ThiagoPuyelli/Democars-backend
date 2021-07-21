import { Schema, Document, model } from 'mongoose'
import ProductInterface from '../interfaces/ProductInterface'

const productSchema = new Schema<ProductInterface & Document>({
  title: {
    type: String,
    required: true,
    maxLength: 50,
    minLength: 6
  },
  description: {
    type: String,
    required: true,
    maxLength: 500,
    minLength: 10
  },
  price: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  categories: {
    type: [String],
    minLength: 1
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  comments: {
    type: [{
      userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      comment: {
        type: String,
        maxLength: 200
      },
      date: {
        type: Number,
        date: Date.now()
      }
    }],
    default: []
  },
  reviews: {
    type: [{
      _id: false,
      userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      review: {
        type: String,
        required: true,
        maxLength: 200
      },
      rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
      },
      date: {
        type: Number,
        default: Date.now()
      }
    }],
    default: []
  },
  date: {
    type: Number,
    default: Date.now()
  },
  stock: {
    type: Number,
    default: 0
  }
}, { versionKey: false })

export default model<ProductInterface>('Product', productSchema)
