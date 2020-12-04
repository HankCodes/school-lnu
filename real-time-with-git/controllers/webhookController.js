'use strict'

/**
 * Controller for managing webhook POSTs from GitLab.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */

const createError = require('http-errors')
const wsController = require('./wsController')

const gitController = {}

/**
 * Handles the webhook from gitlab.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
gitController.getWebhookData = async (req, res, next) => {
  try {
    wsController.emitWebhookData(req.app.get('io'), { viewData: req.body })
    res.status(200)
    res.end()
  } catch (error) {
    next(createError(500), error)
  }
}

/**
 * Expose homeController.
 */
module.exports = gitController
