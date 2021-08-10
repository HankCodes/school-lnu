'use strict'
/**
 * Starting point of the application.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */

require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const helmet = require('helmet')
const fetch = require('node-fetch')
const app = express()

app.use(helmet())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', require('./routes/webhookRouter'))

app.use((error, req, res, next) => {
    // 404 Not Found.
    console.log('error')
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

  
app.listen(process.env.PORT, () => console.log(`Server running at http://localhost:${process.env.PORT}/`))