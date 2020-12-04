'use strict'

/**
 * Controller for managin authorization.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */

const createError = require('http-errors')
const bcrypt = require('bcrypt')
const athourize = {}

/**
 * Checks if the user is logged in.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 * @returns {object} - Returns statuscode 401 if not logged in.
 */
athourize.user = (req, res, next) => {
  if (!req.session.logged_in) {
    return res
      .status(401)
      .render('errors/401')
  }
  next()
}

/**
 * Checks if POST from GitLab webhook is athourized.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
athourize.gitLab = async (req, res, next) => {
  try {
    if (!(await bcrypt.compare(req.headers['x-gitlab-token'], process.env.WEBHOOK_TOKEN))) {
      throw new Error('Webhook POST forbidden')
    }
    next()
  } catch (error) {
    next(createError(403, error))
  }
}

/**
 * Checks if it is gitlab that sends the request to the oauth callback url.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
athourize.gitLabOnCallback = (req, res, next) => {
  try {
    if (req.query.state !== process.env.GITLAB_STATE) {
      throw new Error('Access forbidden')
    }
    next()
  } catch (error) {
    next(createError(403, error))
  }
}

/**
 * Expose athourize.
 */
module.exports = athourize
