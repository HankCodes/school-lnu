'use strict'
/**
 * Homerouter.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const express = require('express')
const router = express.Router()

const controller = require('../controllers/homeController')

router.get('/', controller.index)

/**
 * Expose router.
 */
module.exports = router
