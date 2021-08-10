'use strict'
/**
 * Webhook router.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const express = require('express')
const router = express.Router()

const controller = require('../controllers/gitController')
const hasSessionAndToken = require('../lib/middlewares/hasSessionAndToken')

router
  .get('/:gitService/*', controller.proxyRequest)
  .put('/:gitService/*', hasSessionAndToken, controller.proxyRequest)
  .post('/:gitService/*', hasSessionAndToken, controller.proxyRequest)
  .delete('/:gitService/*', hasSessionAndToken, controller.proxyRequest)

module.exports = router
