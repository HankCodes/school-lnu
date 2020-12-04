'use strict'
/**
 * Websocket.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const wsController = require('../controllers/wsController')

/**
 * Websocket that is set up to listen to requests from client.
 *
 * @param {object} io - The websocket.
 */
const rootSocket = (io) => {
  io.on('connection', socket => {
    console.log('Server websocket: Client connected')
    // sending client responses
    socket.emit('connected', 'Websocket: connected')

    // listening on client requests
    socket.on('getrepos', () => { wsController.getRepos(socket) })
    socket.on('getissues', (data) => { wsController.getIssues(socket, data) })

    // when client disconnects
    socket.on('disconnect', () => console.log('Server websocket: Client disconnected'))
  })
}

/**
 * Expose websocket.
 */
module.exports = rootSocket
