'use strict'
/**
 * Starting point of the application.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */

require('dotenv').config()
const express = require('express')
const session = require('express-session') // Set up session with redis?
const logger = require('morgan')
const helmet = require('helmet')
const app = express()
const port = process.env.PORT
const mongoose = require('./configs/mongoose')

app.use(helmet())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

mongoose.connect().catch(error => {
  console.error(error)
  process.exit(1)
})

// TODO move to separate file
const sessionOptions = {
    name: 'GitBuddy',
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'lax',
      httpOnly: true
    }
  }
  
app.use(session(sessionOptions))

app.use('/account', require('./routes/accountRouter'))
app.use('/webhook', require('./routes/webhookRouter'))
app.use('/git', require('./routes/gitRouter'))
app.use('/push', require('./routes/webPushRouter'))

app.use((error, req, res, next) => {
    // 404 Not Found.
    console.log('general erorr', error)
    if (error.status === 404) {
        // TODO fix error response
      return res
        .status(404)
        .send({data: 'error'})
    }
  
    // 500 Internal Server Error (in production, all other errors send this response).
    if (req.app.get('env') !== 'development') {
        // TODO fix error response
        return res
        .status(500)
        .send({data: 'error'})
    }
  
    // Development only!
    // Only providing detailed error in development.
    // Render the error page.
    console.error(error)
  })

  
app.listen(port, () => console.log(`Server running at http://localhost:${port}/`))