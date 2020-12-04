'use strict'

/**
 * Controller managing the logged in users views.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */

const fetchContent = require('../src/fetchContent')
const fetch = require('node-fetch')
const createError = require('http-errors')

const profileController = {}

/**
 * Renders the profile page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
profileController.index = async (req, res, next) => {
  try {
    const viewData = await fetchContent('repos', req.session)
    res.render('profile/index', { viewData })
  } catch (error) {
    next(createError(500, error))
  }
}

/**
 * Renders the subscription page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
profileController.subscriptions = (req, res, next) => {
  try {
    res.render('profile/subscriptions')
  } catch (error) {
    next(createError(500, error))
  }
}

/**
 * Renders the settings page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
profileController.settings = (req, res, next) => {
  try {
    res.render('profile/settings')
  } catch (error) {
    next(createError(500, error))
  }
}
/**
 * Renders the page for issues.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
profileController.getIssues = async (req, res, next) => {
  try {
    const viewData = await fetchContent('issues', req.session, req.params.id)
    res.render('profile/issues', { viewData })
  } catch (error) {
    next(createError(500, error))
  }
}
/**
 * Renders the page with comments.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
profileController.getComments = async (req, res, next) => {
  try {
    const comments = await fetchContent('comments', req.session, { repo: req.params.id, issue: req.params.iid })
    const issues = await fetchContent('issues', req.session, req.params.id)

    const requestIssue = {}
    for (const issue of await issues) {
      if (parseInt(issue.iid) === parseInt(req.params.iid)) {
        requestIssue.title = issue.title
        requestIssue.description = issue.description
      }
    }
    const viewData = {
      comments: comments,
      issues: issues,
      request_issue: requestIssue,
      project_id: req.params.id,
      issue_id: req.params.iid
    }

    res.render('profile/discussions', { viewData })
  } catch (error) {
    next(createError(500, error))
  }
}

/**
 * Posts a comment.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
profileController.postComment = async (req, res, next) => {
  try {
    // slice away the first character in the ID since a letter was added in order to use it as a DOM-id attribute.
    // the DOM-id attribute must start with a letter.
    req.body.reply = req.body.reply.slice(1, req.body.reply.length)

    const { id, iid } = req.params
    const { comment, reply } = req.body

    let url = ''
    const heads = profileController._setHeaders(req)

    // if it is a reply to a comment, do if-statement if not do else-statement.
    if (reply) {
      url = process.env.WEB_URL + `projects/${id}/issues/${iid}/discussions/${reply}/notes?body=${comment}`
    } else {
      url = process.env.WEB_URL + `projects/${id}/issues/${iid}/discussions?body=${comment}`
    }

    await fetch(url, {
      method: 'post',
      headers: heads
    })

    res.redirect('./comments')
  } catch (error) {
    next(createError(500, error))
  }
}
/**
 * Deletes a comment.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
// not supprted yet
profileController.deleteComment = async (req, res, next) => {
  try {
    // slice away the first character in the ID since a letter was added in order to use it as a DOM-id attribute.
    // the DOM-id attribute must start with a letter.
    req.body.reply = req.body.reply.slice(1, req.body.reply.length)
    const { id, iid } = req.params
    const { comment } = req.body

    let heads = {}
    // profileController._setHeaders(req)

    // check if logged in with Oauth or not and sets apropriate headers
    if (req.session.authorized) {
      heads = { Authorization: req.session.token_type + ' ' + req.session.access_token }
    } else {
      heads = { 'Private-Token': process.env.PRIVATE_TOKEN }
    }

    await fetch(process.env.WEB_URL + `projects/${id}/issues/${iid}/discussions?body=${comment}`, {
      method: 'post',
      headers: heads
    })

    res.redirect('./comments')
  } catch (error) {
    next(createError(500, error))
  }
}

/**
 * Sets the apropriate headers for the request to gitlab API.
 *
 * @param {object} req - Express request object.
 * @returns {object} - Apropriate headers.
 */
profileController._setHeaders = (req) => {
  let headers = {}
  if (req.session.authorized) {
    headers = { Authorization: req.session.token_type + ' ' + req.session.access_token }
  } else {
    headers = { 'Private-Token': process.env.PRIVATE_TOKEN }
  }

  return headers
}

/**
 * Expose homeController.
 */
module.exports = profileController
