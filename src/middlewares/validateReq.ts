import { ObjectSchema } from 'joi'
import { Request, Response, NextFunction } from 'express'
import sendResponse from '../utils/sendResponse'

export default (schema: ObjectSchema, check: 'body' | 'params') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req[check])
      next()
    } catch (err) {
      return sendResponse(res, 500, err)
    }
  }
}
