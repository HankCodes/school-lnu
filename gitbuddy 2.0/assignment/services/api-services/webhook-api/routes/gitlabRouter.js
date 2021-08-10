'use strict'

const express = require('express')
const router = express.Router()
const ctr = require('../controllers/gitlabController')
const auth = require('../middlewares/authRequest')

router
    // Enpoints used by Application API
    .get('/project/:projectId/hook/:hookId?', auth, ctr.proxyWebhookRequest)
    .post('/project/:projectId/hook/:hookId?', auth, ctr.proxyWebhookRequest)
    .put('/project/:projectId/hook/:hookId', auth, ctr.proxyWebhookRequest)
    .delete('/project/:projectId/hook/:hookId', auth, ctr.proxyWebhookRequest)
    // enpoint used by the webhook services 
    .post('/event', auth, ctr.webhook)


module.exports = router
