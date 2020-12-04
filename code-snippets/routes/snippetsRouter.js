'use strict'
/**
 * Router for snippets.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const express = require('express')
const router = express.Router()

const controller = require('../controllers/snippetsController')
const authorizer = require('../controllers/authorizeController')

router
  .get('/', controller.index)
  .get('/:id/edit', authorizer.isOwner, controller.edit)
  .get('/new', authorizer.isLoggedIn, controller.new)
  .get('/:id', authorizer.isLoggedIn, controller.view)
  .get('/search/rts', controller.realTimeSearch)
  .get('/search/field', controller.search)

router
  .post('/create', authorizer.isLoggedIn, controller.createSnippet)
  .post('/:id/edit', authorizer.isOwner, controller.saveChanges)
  .post('/:id/delete', authorizer.isOwner, controller.delete)

/**
 * Expose router.
 */
module.exports = router
