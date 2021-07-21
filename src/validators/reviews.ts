import joi from 'joi'
import gen from '../utils/genValidator'

export const saveReview = joi.object({
  review: gen('string', true).max(200),
  rating: gen('number', true, 0, 5)
})
