import UserInterface from '../interfaces/UserInterface'
import { FileUpload } from 'express-fileupload'

declare module 'express-serve-static-core' {
  export interface Request {
    user?: UserInterface,
    files?: FileUpload
  }
}
