'use strict'
/**
 * Gitlab Oauth router.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const express = require('express')
const router = express.Router()

const controller = require('../controllers/gitlabController')

router
  .get('/', controller.buildUrl)
  .get('/gitlab/callback', controller.fetchToken)
  .get('/validate', controller.validateToken)

module.exports = router
