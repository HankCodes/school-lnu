'use strict'
/**
 * Starting point of the Gitlab Oauth2 service.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */

require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const app = express()
const port = process.env.PORT


// additional middleware
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', require('./src/routes/gitlabRouter'))

app.use((error, req, res, next) => {
  // 404 Not Found.
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
