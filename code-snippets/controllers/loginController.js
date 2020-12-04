'use strict'

/**
 * Controller for logging in, create account and log out.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */

const User = require('../models/User')
const createError = require('http-errors')

const loginController = {}

/**
 * Renders the first page of the application witch is the same as the page for creating an account.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
loginController.index = (req, res, next) => {
  try {
  // if the user is logged in the user is directed to the news-site.
    if (req.session.loggedIn) {
      res.render('news')
    }
    res.render('login/index')
  } catch (error) {
    next(createError(500))
  }
}

/**
 * Renders the log in page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
loginController.login = (req, res, next) => {
  try {
    res.render('login/login')
  } catch (error) {
    next(createError(500))
  }
}

/**
 * Handles the users log in attempt.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
loginController.loginAttempt = async (req, res) => {
  try {
    await User.authenticate(req.body.username, req.body.passphrase)
    req.session.loggedIn = true
    req.session.user = req.body.username
    res.redirect('/profile')
  } catch (error) {
    req.session.flash = { type: 'warning', message: 'Invalid username or password' }
    res.redirect('/login')
  }
}

/**
 * Logs out the user and deletes cookies.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
loginController.logOut = (req, res, next) => {
  try {
    req.session.destroy()
    res.redirect('/news')
  } catch (error) {
    next(createError(500))
  }
}

/**
 * Creates an account for the user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
loginController.createAccount = async (req, res) => {
  try {
    if (req.body.passphrase !== req.body.passphraseCheck) {
      throw new Error('Passphrases did not match')
    } else if (await User.findOne({ username: req.body.username })) {
      throw new Error('Username already exist')
    }

    const newUser = new User({
      username: req.body.username,
      name: req.body.name,
      surname: req.body.surname,
      passphrase: req.body.passphrase
    })

    await newUser.save()
    res.redirect('/login')
  } catch (error) {
    req.session.flash = { type: 'warning', message: error.message }
    res.redirect('/')
  }
}

/**
 * Expose loginController.
 */
module.exports = loginController
