/**
 * A controller for sending information via websocket.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const createError = require('http-errors')
const fetchContent = require('../src/fetchContent')
const wsController = {}

/**
 * Fetches all available repos from GitLab.
 *
 * @param {object} socket - The clients websocket.
 */
wsController.getRepos = async (socket) => {
  try {
    const viewData = await fetchContent('repos')
    socket.emit('returnrepos', { viewData })
  } catch (error) {
    console.log(createError(500, error))
  }
}

/**
 * Fetches issues from the given url and emits an event with the response.
 *
 * @param {object} socket - Clients websocket.
 * @param {object} data - Url sent from the client.
 */
wsController.getIssues = async (socket, data) => {
  try {
    const issues = await fetchContent('issues', data)
    socket.emit('returnissues', { issues })
  } catch (error) {
    console.log(createError(500, error))
  }
}

/**
 * Emits an event with data from the webhook.
 *
 * @param {object} socket - The clients websocket.
 * @param {object} viewData - Data from the webhook.
 */
wsController.emitWebhookData = (socket, viewData) => {
  socket.emit('webhookData', viewData)
}

/**
 * Expose module.
 */
module.exports = wsController
