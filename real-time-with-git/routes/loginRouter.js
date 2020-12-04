'use strict'
/**
 * Login router.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const express = require('express')
const router = express.Router()

const authorize = require('../controllers/authorizeController')
const controller = require('../controllers/loginController')

router
  .get('/', controller.index)
  .get('/gitlab', controller.gitlab)
  .get('/oauthcallback', authorize.gitLabOnCallback, controller.oauthCallback)
  .get('/logout', authorize.user, controller.logOut)

router
  .post('/createAccount', controller.createAccount)
  .post('/attempt', controller.loginAttempt)

/**
 * Expose router.
 */
module.exports = router
