import joi from 'joi'

export const registerJoi = joi.object({
  name: joi.string().required().max(80).min(4),
  lastname: joi.string().required().max(80).min(4),
  email: joi.string().email().required(),
  password: joi.string().required().max(50).min(6)
})

export const loginJoi = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required()
})
