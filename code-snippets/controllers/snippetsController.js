'use strict'
/**
 * Snippet controller.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const moment = require('moment')
const Snippet = require('../models/Snippet')
const User = require('../models/User')
const createError = require('http-errors')

const snippetsController = {}

/**
 * Renders the search page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
snippetsController.index = async (req, res, next) => {
  try {
    const viewData = {
      snippets: (await Snippet.find({})).reverse()
    }

    res.render('snippets/index', { viewData })
  } catch (error) {
    next(createError(500))
  }
}

/**
 * Renders the edit page for snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
snippetsController.edit = async (req, res, next) => {
  try {
    const viewData = {
      snippet: await Snippet.findOne({ _id: req.params.id })
    }

    if (viewData.snippet.username !== req.session.user) {
      throw new Error('Action not allowed')
    }

    res.render('snippets/edit', { viewData, layout: 'layouts/profileLayout' })
  } catch (error) {
    next(createError(403, error))
  }
}

/**
 * Save changes to a snippet in the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
snippetsController.saveChanges = async (req, res) => {
  try {
    await Snippet.updateOne({ _id: req.body.id }, {
      name: req.body.snippetName,
      description: req.body.snippetDescription,
      text: req.body.snippet,
      tag: req.body.lang,
      lastModified: moment().format('ll'),
      favs: req.body.favs
    })
    req.session.flash = { type: 'success', message: 'Snippet successfully changed!' }

    res.redirect('/snippets/' + req.body.id)
  } catch {
    req.session.flash = { type: 'warning', message: 'Something went wrong. Server error' }
    res.status(500)
    res.redirect('/snippets/' + req.body.id + '/edit')
  }
}

/**
 * Renders the page for viewing a snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
snippetsController.view = async (req, res, next) => {
  try {
    const viewData = {
      snippet: await Snippet.findOne({ _id: req.params.id }),
      owner: false
    }
    if (viewData.snippet.username === req.session.user) {
      viewData.owner = true
    }
    res.render('snippets/view', { viewData, layout: 'layouts/profileLayout' })
  } catch (error) {
    next(createError(404))
  }
}

/**
 * Renders the page for creating a new snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
snippetsController.new = (req, res, next) => {
  try {
    res.render('snippets/new', { layout: 'layouts/profileLayout' })
  } catch (error) {
    next(createError(500))
  }
}

/**
 * Creates a new snippet and saves it in the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object .
 */
snippetsController.createSnippet = async (req, res) => {
  try {
    const newSnippet = new Snippet({
      user_id: await User.getId(req.session.user),
      username: req.session.user,
      name: req.body.snippetName,
      description: req.body.snippetDescription,
      text: req.body.snippet,
      tag: req.body.lang
    })
    await newSnippet.save()

    req.session.flash = { type: 'success', message: 'Snippet successfully added!' }
    res.redirect('/profile')
  } catch (error) {
    req.session.flash = { type: 'warning', message: 'Something went wrong. ' + error.message }
    res.redirect('/snippets/new')
  }
}

/**
 * Deletes snippet from the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
snippetsController.delete = async (req, res) => {
  try {
    await Snippet.deleteOne({ _id: req.body.id })

    req.session.flash = { type: 'success', message: 'Snippet successfully deleted!' }
    res.redirect('/profile')
  } catch (error) {
    req.session.flash = { type: 'warning', message: 'Something went wrong! Snippet may not have been removed' }
    res.redirect('/profile')
  }
}

/**
 * Lets you query the database for snippet in real time.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
snippetsController.realTimeSearch = async (req, res, next) => {
  try {
    const viewData = await snippetsController._getSearchResult(req.query.q)
    res.status(200)
    res.send(viewData.snippets)
  } catch (error) {
    next(createError(500))
  }
}

/**
 * Lets you query the database for snippet using the search button.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express function to call next middleware.
 */
snippetsController.search = async (req, res, next) => {
  try {
    const viewData = await snippetsController._getSearchResult(req.query.q)

    res.render('snippets/index', { viewData })
  } catch (error) {
    next(createError(500))
  }
}

/**
 * Gets the search result from the database.
 *
 * @param {string} searchQuery - The search query for the database.
 * @returns {Array} - If successfull, all snippets matching the search query, else 500-error.
 */
snippetsController._getSearchResult = async (searchQuery) => {
  try {
    if (searchQuery.length > 150) {
      throw new Error('Search string too long')
    }
    const reg = { $or: [{ text: { $regex: searchQuery, $options: 'i' } }, { name: { $regex: searchQuery, $options: 'i' } }, { username: { $regex: searchQuery, $options: 'i' } }] }
    const viewData = {
      snippets: (await Snippet.find(reg))
        .map(snippet => ({
          createdAt: snippet.createdAt,
          description: snippet.description,
          tag: snippet.tag,
          _id: snippet._id,
          username: snippet.username,
          name: snippet.name,
          text: snippet.text
        }))
    }
    return viewData
  } catch (error) {
    return error
  }
}

/**
 * Expose snippetsController.
 */
module.exports = snippetsController
