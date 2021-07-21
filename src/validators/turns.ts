import joi from 'joi'
import gen from '../utils/genValidator'

export const saveTurn = joi.object({
  name: gen('string', true, 1, 50),
  email: gen('string', true).email(),
  reason: gen('string', true),
  date: gen('date', true)
})
