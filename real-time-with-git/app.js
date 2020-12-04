'use strict'
/**
 * Starting point of the application.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */

require('dotenv').config()
const express = require('express')
const hbs = require('express-hbs')
const session = require('express-session')

const logger = require('morgan')
const { join } = require('path')
const createError = require('http-errors')
const helmet = require('helmet')

const mongoose = require('./config/mongoose')

const app = express()
// connect websocket to server
const server = require('http').Server(app)
const io = require('socket.io').listen(server)
const rootSocket = require('./src/rootSocket')

// hbs helper, making it possible to compare two values in hbs if-statement
hbs.registerHelper('if_equal', (a, b, opts) => {
  if (a === b) {
    return opts.fn(this)
  } else {
    return opts.inverse(this)
  }
})

// connect to database
mongoose.connect().catch(error => {
  console.error(error)
  process.exit(1)
})
// view engine setup
app.engine('hbs', hbs.express4({
  defaultLayout: join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')
app.set('views', join(__dirname, 'views'))
app.set('io', io)
app.set('trust proxy', 1)

// additional middleware
app.use(helmet())
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", 'fonts.googleapis.com', 'fonts.gstatic.com', 'https://cdnjs.cloudflare.com'],
    styleSrc: ["'self'", 'fonts.googleapis.com', 'fonts.gstatic.com'],
    scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com']
  }
}))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(join(__dirname, 'public')))

// setup session middleware.
const sessionOptions = {
  name: 'GitBuddy',
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'lax',
    httpOnly: true
    // secure: true
  }
}

app.use(session(sessionOptions))

// middleware to be executed before the routes
app.use((req, res, next) => {
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }

  if (req.session.logged_in) {
    res.locals.logged_in = req.session.logged_in
    res.locals.user = req.session.user
  }
  return next()
})

// routes
app.use('/', require('./routes/homeRouter'))
app.use('/login', require('./routes/loginRouter'))
app.use('/profile', require('./routes/profileRouter'))
app.use('/webhooks', require('./routes/webhookRouter'))
app.use('*', (req, res, next) => next(createError(404)))

app.use((error, req, res, next) => {
  // 404 Not Found.
  if (error.status === 404) {
    return res.render('errors/404')
  }

  // 401 Unauthorized
  if (error.status === 401) {
    return res
      .render('errors/401')
  }

  // 403 Forbidden
  if (error.status === 403) {
    return res.render('errors/403')
  }

  // 500 Internal Server Error (in production, all other errors send this response).
  if (req.app.get('env') !== 'development') {
    return res
      .status(404)
      .render('errors/404')
  }

  // Development only!
  // Only providing detailed error in development.
  // Render the error page.
  console.error(error)
  res.sendStatus(error.status || 500)
})

// listening
server.listen(8000, () => console.log('Server running at http://localhost:8000/'))

// connect websocket
rootSocket(io)
