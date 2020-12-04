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

// connect to database
// mongoose.connect().catch(error => {
//   console.error(error)
//   process.exit(1)
// })
// view engine setup
app.engine('hbs', hbs.express4({
  defaultLayout: join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')
app.set('views', join(__dirname, 'views'))

// additional middleware
app.use(helmet())
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", 'fonts.googleapis.com', 'fonts.gstatic.com'],
    styleSrc: ["'self'", 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com'],
    scriptSrc: ["'self'", 'cdnjs.cloudflare.com']
  }
}))
app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(join(__dirname, 'public')))

// setup session middleware.
const sessionOptions = {
  name: 'snippets',
  secret: process.env.COOCKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'lax',
    httpOnly: true
  }
}

app.use(session(sessionOptions))

// middleware to be executed before the routes
app.use((req, res, next) => {
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }

  if (req.session.loggedIn) {
    res.locals.loggedIn = req.session.loggedIn
  }
  return next()
})

// routes
app.use('/', require('./routes/loginRouter'))
app.use('/profile', require('./routes/profileRouter'))
app.use('/news', require('./routes/newsRouter'))
app.use('/snippets', require('./routes/snippetsRouter'))
app.use('*', (req, res, next) => next(createError(404)))

app.use((error, req, res, next) => {
  // 404 Not Found.
  if (error.status === 404) {
    return res
      .status(404)
      .render('errors/404', { layout: 'layouts/errorLayout' })
  }

  // 401 Unauthorized
  if (error.status === 401) {
    return res
      .status(401)
      .render('errors/401', { layout: 'layouts/errorLayout' })
  }

  // 403 Forbidden
  if (error.status === 403) {
    return res
      .status(403)
      .render('errors/403', { layout: 'layouts/errorLayout' })
  }

  // 500 Internal Server Error (in production, all other errors send this response).
  if (req.app.get('env') !== 'development') {
    return res
      .status(500)
      .render('errors/500', { layout: 'layouts/errorLayout' })
  }

  // Development only!
  // Only providing detailed error in development.
  // Render the error page.
  console.error(error)
  res
    .status(error.status || 500)
    .render('errors/500', { layout: 'layouts/errorLayout' })
})

// listening
app.listen(8000, () => console.log('Server running at http://localhost:8000/'))
