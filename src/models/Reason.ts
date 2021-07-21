import { Schema, model } from 'mongoose'

const reasonSchema = new Schema({
  reason: {
    type: String,
    required: true
  }
}, { versionKey: false })

export default model('Reason', reasonSchema)
