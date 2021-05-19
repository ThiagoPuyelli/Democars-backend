import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import ErrorsMiddleware from './middlewares/Errors'
import { config } from 'dotenv'

import authRoutes from './routes/auth.routes'

class App {
    public app: express.Application
    public port: number|string

    constructor () {
      this.app = express()
      this.port = process.env.PORT || 2000
      this.app.set('port', this.port)

      config()
      this.connectDatabase()
      this.middlewares()
      this.app.use(authRoutes)
    }

    private middlewares () {
      this.app.use(morgan('dev'))
      this.app.use(express.urlencoded({ extended: false }))
      this.app.use(express.json())
      this.app.use(ErrorsMiddleware)
    }

    private connectDatabase () {
      const { MONGODB_URI } = process.env

      mongoose.connect(MONGODB_URI, {
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true
      }, (err: Error) => {
        if (!err) {
          console.log('Database is connected')
        } else {
          console.log('Error to database error:', err)
        }
      })
    }
}

export default App
