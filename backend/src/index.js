const express = require('express')
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const authRouter = require('./routes/auth')

const { mongoose } = require('./mongo-connection')
const logger = require('morgan')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const cookieParser = require('cookie-parser')
const passport = require('passport')
const User = require('./models/user')
const sanitize = require('express-mongo-sanitize').sanitize
const { errors } = require('celebrate')

const cors = require('cors')

const app = express()

app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      stringify: false
    }),
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV == 'production' && 'none',
      secure: process.env.NODE_ENV == 'production'
    }
  })
)

app.use(passport.initialize())
app.use(passport.session())

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// view engine setup
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(__dirname + '/public'))
app.use(
  cors({
    origin: true,
    credentials: true
  })
)

app.all('*', (req, res, next) => {
  req.body = sanitize(req.body)
  req.headers = sanitize(req.headers)
  req.params = sanitize(req.params)

  next()
})

app.use('/api/', indexRouter)
app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)

app.use(errors())

app.use((err, req, res, next) => {
  const error = {
    status: err.status || 500,
    message: err.message
  }

  if (req.app.get('env' === 'development')) {
    error.stack = err.stack
  }

  res.status(error.status)

  res.send(error)
})

module.exports = app
