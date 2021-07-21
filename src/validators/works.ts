import joi from 'joi'
import gen from '../utils/genValidator'

export const saveWork = joi.object({
  title: gen('string', true, 1, 50),
  description: gen('string', true, 1, 300),
  images: gen('array', true).items(gen('string', true))
})

export const modifyWork = joi.object({
  title: gen('string', false, 1, 50),
  description: gen('string', false, 1, 300),
  images: gen('array', false).items(gen('string', true))
})
