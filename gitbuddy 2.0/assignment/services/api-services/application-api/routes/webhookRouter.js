'use strict'
/**
 * Webhook router.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const express = require('express')
const router = express.Router()

const controller = require('../controllers/webhookController')
const hasSessionAndToken = require('../lib/middlewares/hasSessionAndToken')
const hasAppSecret = require('../lib/middlewares/hasAppSecret')

router
  // request from webhook api
  .post('/:gitService/event', hasAppSecret, controller.recieveEvent)
    // requests from  client
  .get('/:gitService/*', hasSessionAndToken, controller.proxyWebhook)
  .put('/:gitService/*', hasSessionAndToken, controller.proxyWebhook)
  .post('/:gitService/*', hasSessionAndToken, controller.proxyWebhook)
  .delete('/:gitService/*', hasSessionAndToken, controller.proxyWebhook)

module.exports = router
