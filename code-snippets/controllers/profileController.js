'use strict'
/**
 * Controller for profile.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const Snippet = require('../models/Snippet')
const createError = require('http-errors')
const profileController = {}

/**
 * Renders profile page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
profileController.index = async (req, res, next) => {
  try {
    const viewData = {
      snippets: (await Snippet.find({ username: req.session.user })).reverse()
    }
    res.render('profile/index', { viewData, layout: 'layouts/profileLayout' })
  } catch (error) {
    next(createError(500))
  }
}

/**
 * Expose profileController.
 */
module.exports = profileController
