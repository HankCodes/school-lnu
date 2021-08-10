'use strict'
/**
 * Account router.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const express = require('express')
const router = express.Router()
const hasSessionAndToken = require('../lib/middlewares/hasSessionAndToken')
const controller = require('../controllers/accountController')

router
  .get('/:gitService/notifications', hasSessionAndToken, controller.getNotifications)
  .post('/:gitService/notifications', hasSessionAndToken, controller.readNotifications)
  .get('/:gitService/oauth', controller.oauth)
  .get('/:gitService/verify', controller.verify)
  .post('/', controller.create)
  .post('/login', controller.login)

module.exports = router
