'use strict'

/**
 * Controller for homepage.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */

const createError = require('http-errors')

const homeController = {}

/**
 * Renders the first page of the application.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
homeController.index = async (req, res, next) => {
  try {
  // if the user is logged in the user is directed to the news-site.
    if (req.session.logged_in) {
      res.render('home/news')
    }

    res.render('home/index', { layout: 'layouts/indexLayout' })
  } catch (error) {
    next(createError(500, error))
  }
}

/**
 * Expose homeController.
 */
module.exports = homeController
