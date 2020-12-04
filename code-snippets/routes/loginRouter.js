'use strict'

const express = require('express')
const router = express.Router()

const authorizer = require('../controllers/authorizeController')

const controller = require('../controllers/loginController')

router.get('/', controller.index)
router
  .get('/login', controller.login)
  .post('/login', controller.loginAttempt)

router.get('/logout', authorizer.isLoggedIn, controller.logOut)
router.post('/createAccount', controller.createAccount)

module.exports = router
