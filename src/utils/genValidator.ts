import joi from 'joi'

export default (type: string, required: boolean, min?: number, max?: number) => {
  let validator = joi[type]()

  if (required) {
    validator = validator.required()
  }

  if (min) {
    validator = validator.min(min)
  }

  if (max) {
    validator = validator.max(max)
  }

  return validator
}
