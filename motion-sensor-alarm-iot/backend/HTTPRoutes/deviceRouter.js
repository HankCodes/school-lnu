'use strict'

const express = require('express')
const router = express.Router()
const ctr = require('../HTTPControllers/deviceController')
const authorize = require('../utils/authorize')

router
    .post('/init', ctr.init)
    .post('/state', ctr.state)
    .post('/triggered', ctr.triggered)
    // TODO Move this enpoint to users route
    .post('/claim', authorize, ctr.claim)
    
module.exports = router
