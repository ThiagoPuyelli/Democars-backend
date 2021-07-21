import { Schema, Document, model } from 'mongoose'
import ArticleInterface from '../interfaces/ArticleInterface'

const articleSchema = new Schema<ArticleInterface & Document>({
  title: {
    type: String,
    maxLength: 60,
    required: true
  },
  description: {
    type: String,
    maxLength: 200,
    required: true
  },
  date: {
    type: Number,
    default: Date.now()
  },
  image: {
    type: String,
    required: true,
    length: 10
  }
}, { versionKey: false })

export default model<ArticleInterface>('Article', articleSchema)
