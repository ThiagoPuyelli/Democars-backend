import joi from 'joi'
import gen from '../utils/genValidator'

export const payOrder = joi.object({
  email: gen('string', true),
  city: gen('string', true),
  country: gen('string', true),
  zip: gen('string', true),
  phone: gen('string', true),
  address: gen('string', true),
  id: gen('string', true)
})
