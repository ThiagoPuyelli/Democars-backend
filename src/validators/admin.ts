import joi from 'joi'
import gen from '../utils/genValidator'

export const saveAndLoginAdmin = joi.object({
  email: gen('string', true).email(),
  password: gen('string', true, 6, 50)
})

export const updateAdmin = joi.object({
  email: gen('string', false).email(),
  password: gen('string', false, 6, 50)
})
