import joi from 'joi'
import gen from '../utils/genValidator'

export const saveProductJoi = joi.object({
  title: gen('string', true, 6, 50),
  description: gen('string', true, 10, 500),
  price: gen('number', true),
  categories: gen('string', true),
  stock: gen('number', false),
  image: gen('string', true)
})

export const updateProductJoi = joi.object({
  title: gen('string', false, 6, 50),
  description: gen('string', false, 20, 500),
  price: gen('number', false),
  categories: gen('string', false),
  stock: gen('number', false),
  image: gen('string', false)
})
