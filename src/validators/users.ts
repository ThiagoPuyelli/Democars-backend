import joi from 'joi'
import gen from '../utils/genValidator'

export const registerJoi = joi.object({
  username: gen('string', true, 4, 30),
  name: gen('string', true, 4, 80),
  lastname: gen('string', true, 4, 80),
  email: gen('string', true).email(),
  password: gen('string', true, 6, 50),
  image: gen('string', true)
})

export const nameJoi = joi.object({
  name: gen('string', false, 4, 80),
  lastname: gen('string', false, 4, 80),
  username: gen('string', false, 4, 30),
  image: gen('string', false)
})

export const recoverJoi = joi.object({
  email: gen('string', true).email()
})

export const changePasswordJoi = joi.object({
  email: gen('string', true).email(),
  password: gen('string', true, 6, 50),
  code: gen('string', true).length(7)
})
