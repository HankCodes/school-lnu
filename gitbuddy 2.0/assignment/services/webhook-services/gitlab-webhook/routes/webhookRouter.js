'use strict'

const express = require('express')
const router = express.Router()
const ctr = require('../controllers/webhookController')
const authInternal = require('../middlewares/authInternalRequest')
router
    .get('/project/:project_id/hook/:hook_id?', authInternal, ctr.getHook)
    .put('/project/:project_id/hook/:hook_id', authInternal, ctr.updateHook)
    .post('/project/:project_id/hook', authInternal, ctr.createHook)
    .delete('/project/:project_id/hook/:hook_id', authInternal, ctr.deleteHook)
    .post('/gitlab-webhook', ctr.receiveHook)

module.exports = router