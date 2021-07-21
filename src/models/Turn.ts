import { Schema, Document, model } from 'mongoose'
import { TurnInterface } from '../interfaces/ServiceInterface'

const turnSchema = new Schema<TurnInterface & Document>({
  name: {
    type: String,
    required: true,
    maxLength: 50
  },
  email: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  serviceID: {
    type: Schema.Types.ObjectId,
    required: true
  }
}, { versionKey: false })

export default model<TurnInterface>('Turn', turnSchema)
