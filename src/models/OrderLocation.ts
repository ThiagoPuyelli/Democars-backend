import OrderLocationInterface from '../interfaces/OrderLocationInterface'
import { Schema, Document, model } from 'mongoose'

const orderLocationSchema = new Schema<OrderLocationInterface & Document>({
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  products: {
    type: [{
      productID: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
      },
      amount: {
        type: Number,
        required: true
      },
      price: {
        type: Number
      }
    }],
    required: true,
    minLength: 1
  },
  date: {
    type: Date,
    default: new Date()
  }
}, { versionKey: false })

export default model('OrderLocation', orderLocationSchema)
