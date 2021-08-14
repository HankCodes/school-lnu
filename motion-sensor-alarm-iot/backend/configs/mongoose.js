'use strict'
/**
 * MongoDB connection.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const mongoose = require('mongoose')

/**
 * MongoDB connection.
 *
 * @returns {object} - MongoDB database connection.
 */
module.exports.connect = async () => {
  mongoose.connection.on('connected', () => console.log('Mongoose connected'))
  mongoose.connection.on('error', (error) => console.log('Mongoose encountered an error', error))
  mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'))

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose closed connection')
      process.exit(0)
    })
  })

  return mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, ignoreUndefined: true, useUnifiedTopology: true })
}
