'use strict'
/**
 * Web push router.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const express = require('express')
const router = express.Router()

const controller = require('../controllers/webPushController')
const hasSession = require('../lib/middlewares/hasSession')

router
  .get('/key', hasSession, controller.getKey)
  .post('/register', hasSession, controller.register)
  .post('/unregister', hasSession, controller.unregister)

module.exports = router
