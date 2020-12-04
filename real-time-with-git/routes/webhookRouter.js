'use strict'
/**
 * Webhook router.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const express = require('express')
const router = express.Router()

const authorize = require('../controllers/authorizeController')
const controller = require('../controllers/webhookController')

router.post('/gitlab', authorize.gitLab, controller.getWebhookData)

/**
 * Expose router.
 */
module.exports = router
