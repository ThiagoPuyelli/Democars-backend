import { Schema, model, Document } from 'mongoose'
import CategoryInterface from '../interfaces/CategoryInterface'

const categorySchema = new Schema<CategoryInterface & Document>({
  category: {
    type: String,
    required: true
  }
}, { versionKey: false })

export default model<CategoryInterface>('Category', categorySchema)
