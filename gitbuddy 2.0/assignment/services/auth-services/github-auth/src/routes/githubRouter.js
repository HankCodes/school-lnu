'use strict'
/**
 * GitHub Oauth router.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const express = require('express')
const router = express.Router()

const controller = require('../controllers/githubController')

router
  .get('/', controller.buildUrl)
  .get('/callback', controller.fetchToken)

module.exports = router
