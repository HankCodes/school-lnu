'use strict'
/**
 * Controller for authorizing user.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const createError = require('http-errors')

const Snippets = require('../models/Snippet')
const authorizeController = {}

/**
 * Checks if the user is logged in.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 * @returns {object} - Returns statuscode 401 if not logged in.
 */
authorizeController.isLoggedIn = (req, res, next) => {
  if (!req.session.loggedIn) {
    return res
      .status(401)
      .render('errors/401', { layout: 'layouts/errorLayout' })

    // next(createError(401))
  }
  next()
}

/**
 * Checks if the user is the owner of the snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 * @returns {object} - Returns statuscode 403 if not logged in.
 */
authorizeController.isOwner = async (req, res, next) => {
  try {
    const snippet = await Snippets.findOne({ _id: req.params.id })
    if (snippet.username !== req.session.user) {
      return res
        .status(403)
        .render('errors/403', { layout: 'layouts/errorLayout' })
    }
    next()
  } catch (error) {
    next(createError(500))
  }
}

/**
 * Expose authorizeController.
 */
module.exports = authorizeController
