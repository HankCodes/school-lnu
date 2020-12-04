'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/profileController')
const authorizer = require('../controllers/authorizeController')

router
  .get('/', authorizer.isLoggedIn, controller.index)

module.exports = router
