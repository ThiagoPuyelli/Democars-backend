import joi from 'joi'
import gen from '../utils/genValidator'

export const saveArticle = joi.object({
  title: gen('string', true).max(60),
  description: gen('string', true).max(200),
  image: gen('string', true)
})

export const updateArticle = joi.object({
  title: gen('string', false).max(60),
  description: gen('string', false).max(200),
  image: gen('string', false)
})
