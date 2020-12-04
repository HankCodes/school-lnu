'use strict'
/**
 * Profilerouter.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const express = require('express')
const router = express.Router()

const authorize = require('../controllers/authorizeController')
const controller = require('../controllers/profileController')

router
  .get('/', authorize.user, controller.index)
  .get('/:id/issues', authorize.user, controller.getIssues)
  .get('/:id/issues/:iid/comments', authorize.user, controller.getComments)
  .get('/subscriptions', authorize.user, controller.subscriptions)
  .get('/settings', authorize.user, controller.settings)

router.post('/:id/issues/:iid/send', authorize.user, controller.postComment)

/**
 * Expose router.
 */
module.exports = router
