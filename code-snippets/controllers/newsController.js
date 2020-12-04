'use strict'
/**
 * Controller for news-site.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const createError = require('http-errors')
const newsController = {}

/**
 * Renders news-page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object .
 * @param {Function} next - Express function to call next middleware.
 */
newsController.index = (req, res, next) => {
  try {
    res.render('news/index')
  } catch (error) {
    next(createError(500))
  }
}

/**
 * Expose newsController.
 */
module.exports = newsController
