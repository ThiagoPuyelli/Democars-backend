import joi from 'joi'
import gen from '../utils/genValidator'

export const saveService = joi.object({
  title: gen('string', true, 1, 50),
  description: gen('string', true, 1, 500),
  image: gen('string', true)
})

export const modifyService = joi.object({
  title: gen('string', false, 1, 50),
  description: gen('string', false, 1, 500),
  image: gen('string', false)
})
