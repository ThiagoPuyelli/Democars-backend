import { Router, Request, Response } from 'express'
import sendResponse from '../utils/sendResponse'
const router = Router()

router.get('/', (req: Request, res: Response) => {
  return sendResponse(res, 200, 'Me llamo tato')
})

export default router
