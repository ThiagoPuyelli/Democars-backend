import { Schema, Document, model } from 'mongoose'
import ServiceInterface from '../interfaces/ServiceInterface'

const serviceSchema = new Schema<ServiceInterface & Document>({
  title: {
    type: String,
    required: true,
    maxLength: 50
  },
  description: {
    type: String,
    required: true,
    maxLength: 500
  },
  image: {
    type: String,
    required: true
  },
  works: {
    type: [Schema.Types.ObjectId],
    ref: 'Work',
    default: []
  },
  schedule: {
    type: [Schema.Types.ObjectId],
    ref: 'Turn',
    default: []
  }
}, { versionKey: false })

export default model<ServiceInterface>('Service', serviceSchema)
