// Packages and middlewares
import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import ErrorsMiddleware from './middlewares/Errors'
import { config } from 'dotenv'
import passport from 'passport'
import session from 'express-session'
import passportFunctions from './auth/passport-local'
import passportJwtFunctions from './auth/passport-jwt'

// Routes
import authRoutes from './routes/auth.routes'
import productRoutes from './routes/product.routes'
import adminRoutes from './routes/admin.routes'
import reviewRoutes from './routes/reviews.routes'
import articlesRoutes from './routes/articles.routes'
import categoryRoutes from './routes/category.routes'
import commentRoutes from './routes/comments.routes'
import cartRoutes from './routes/cart.routes'
import favouriteRoutes from './routes/favourite.routes'
import ordersRoutes from './routes/orders.routes'
import serviceRoutes from './routes/service.routes'
import workRoutes from './routes/work.routes'
import turnRoutes from './routes/turn.routes'
import reasonRoutes from './routes/reason.routes'

class App {
    public app: express.Application
    public port: number|string
    constructor () {
      this.app = express()
      this.port = process.env.PORT || 2000
      this.app.set('port', this.port)

      passportFunctions()
      passportJwtFunctions()
      config()
      this.connectDatabase()
      this.middlewares()
      this.cors()
      this.app.use('/auth/', authRoutes)
      this.app.use('/product/', productRoutes)
      this.app.use('/admin/', adminRoutes)
      this.app.use('/review/', reviewRoutes)
      this.app.use('/article/', articlesRoutes)
      this.app.use('/category/', categoryRoutes)
      this.app.use('/comment/', commentRoutes)
      this.app.use('/cart/', cartRoutes)
      this.app.use('/favourite/', favouriteRoutes)
      this.app.use('/order/', ordersRoutes)
      this.app.use('/service/', serviceRoutes)
      this.app.use('/work/', workRoutes)
      this.app.use('/turn/', turnRoutes)
      this.app.use('/reason/', reasonRoutes)
    }

    private middlewares () {
      this.app.use(morgan('dev'))
      this.app.use(express.urlencoded({ extended: false }))
      this.app.use(express.json())
      this.app.use(ErrorsMiddleware)
      this.app.use(session({
        secret: 'elpepe123',
        resave: false,
        saveUninitialized: false
      }))
      this.app.use(passport.initialize())
      this.app.use(passport.session())
    }

    private cors () {
      this.app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, x-access-token')
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
        res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
        next()
      })
    }

    private connectDatabase () {
      const { MONGODB_URI } = process.env

      mongoose.connect(MONGODB_URI, {
        useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
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
