/**
 * A controller for loging in and loggingout a user, both with native credentials or with oauth.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const fetch = require('node-fetch')
const createError = require('http-errors')
const User = require('../models/User')
const fetchContent = require('../src/fetchContent')

const loginController = {}

/**
 * Renders the log in page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
loginController.index = (req, res, next) => {
  try {
    res.render('home/login', { layout: 'layouts/indexLayout' })
  } catch (error) {
    next(createError(500, error))
  }
}
/**
 * Handles the users native log in attempt.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
loginController.loginAttempt = async (req, res) => {
  try {
    await User.authenticate(req.body.username, req.body.passphrase)
    req.session.logged_in = true
    req.session.user = { username: req.body.username }
    res.redirect('/profile')
  } catch (error) {
    req.session.flash = { type: 'warning', message: 'Invalid username or password' }
    res.redirect('/login')
  }
}

/**
 * Requests the code from gitlab for access token.
 * First step when authenticating with oauth for gitlab.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
loginController.gitlab = async (req, res, next) => {
  try {
    res.redirect(`https://gitlab.lnu.se/oauth/authorize?client_id=${process.env.APPLICATION_ID}&redirect_uri=${process.env.OAUTH_URI}&response_type=code&state=${process.env.GITLAB_STATE}&scope=read_repository+read_user+write_repository+api`)
  } catch (error) {
    next(createError(500, error))
  }
}

/**
 * Requesting access token from gitlab and sets session-cookie.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
loginController.oauthCallback = async (req, res, next) => {
  try {
    const url = `https://gitlab.lnu.se/oauth/token?client_id=${process.env.APPLICATION_ID}&client_secret=${process.env.APPLICATION_SECRET}&code=${req.query.code}&grant_type=authorization_code&redirect_uri=${process.env.OAUTH_URI}`
    let response = await fetch(url, { method: 'POST' })
    response = await response.json()

    req.session.authorized = true
    req.session.logged_in = true
    req.session.access_token = await response.access_token
    req.session.refresh_token = await response.refresh_token
    req.session.token_type = await response.token_type
    req.session.user = await fetchContent('username', req.session)

    res.redirect('/profile')
  } catch (error) {
    next(createError(500, error))
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
    if (req.body.username.length < 3 || req.body.username.length > 20) {
      throw new Error('Username must only contain letters and be between 3 - 20 characters')
    } else if (req.body.passphrase.length < 10) {
      throw new Error('passphrase must contain more than 10 characters')
    } else if (req.body.passphrase !== req.body.passphraseCheck) {
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
    res.redirect('/login', { layout: 'layouts/indexLayout' })
  } catch (error) {
    req.session.flash = { type: 'warning', message: error.message }
    res.redirect('/')
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
    res.redirect('.')
  } catch (error) {
    next(createError(500, error))
  }
}

/**
 * Expose controller.
 */
module.exports = loginController
