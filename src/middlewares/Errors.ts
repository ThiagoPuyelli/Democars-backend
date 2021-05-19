import { NextFunction, Request, Response } from 'express'
import sendResponse from '../utils/sendResponse'

function ErrorsMiddleware (err: Error, req: Request, res: Response, next: NextFunction) {
  if (err) {
    sendResponse(res, 500, err.message || 'Server Error.')
  } else {
    next()
  }
}

export default ErrorsMiddleware
