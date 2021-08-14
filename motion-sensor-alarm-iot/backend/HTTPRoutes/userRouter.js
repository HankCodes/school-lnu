'use strict'

const express = require('express')
const router = express.Router()
const ctr = require('../HTTPControllers/userController')
const authorize = require('../utils/authorize')

router
    .post('/', ctr.create)
    .post('/login', ctr.login)
    .get('/logout', ctr.logout)
    .get('/session', ctr.checkSession)
    .get('/devices', authorize, ctr.getDevices )
    .get('/logs/:deviceId', authorize, ctr.getLog )
module.exports = router
