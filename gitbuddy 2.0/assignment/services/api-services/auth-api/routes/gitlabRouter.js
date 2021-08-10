'use strict'

const express = require('express')
const router = express.Router()
const gitlab = require('../controllers/gitlabController')

router
    .get('/authenticate', gitlab.auth)
    .get('/validate', gitlab.validate)

module.exports = router
