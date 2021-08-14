'use strict'

require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('./configs/mongoose')
const session = require('express-session')
// const deviceRoutes = require('./websocketRoutes/deviceRoutes')
const logger = require('morgan')
app.use(logger('dev'))

// set up websocket
const server = require('http').Server(app)
// const io = require('socket.io').listen(server)
const PORT =process.env.PORT || 8000 

// connect to database
mongoose.connect().catch(error => {
  console.error(error)
  process.exit(1)
})
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// TODO change app secret
const sessionOptions = {
  name: 'remedy',
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'lax',
    httpOnly: true
  }
}

app.use(session(sessionOptions))

app.use('/user', require('./HTTPRoutes/userRouter'))
app.use('/device', require('./HTTPRoutes/deviceRouter'))

// const sock = io.on('connection', (socket) => {
//   console.log('connected 2')
//   socket.emit('con', { data: 'hej' })
// })
// // device socket
// const deviceSocket = io.of('/client')

// deviceSocket.on('connection', async socket => {
//   try {
//     console.log('client connected id: ', socket.id)
//     deviceRoutes(socket, io)
    
//   } catch (error) {
//     console.error('[Server]: Error when device connecting to socket: ', error.message)
//   }
// })

  // Start listening
server.listen(PORT, () => {
    console.log('Server running at: ', PORT)
})
