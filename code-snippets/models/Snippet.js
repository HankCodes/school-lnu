'use strict'
/**
 * Schema for snippet.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const mongoose = require('mongoose')
const moment = require('moment')
moment.locale('sv')
const snippetSchema = new mongoose.Schema({
  createdAt: {
    type: String,
    required: true,
    default: moment().format('ll'),
    maxlength: 100
  },
  lastModified: {
    type: String,
    maxlength: 100
  },
  user_id: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    maxlength: 100
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
    minlength: 1
  },
  description: {
    type: String,
    maxlength: 250,
    required: true,
    trim: true,
    default: 'No description'
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 3000
  },
  tag: {
    type: String,
    required: true,
    default: 'txt',
    enum: ['txt', 'javascript', 'html', 'css', 'php', 'java'],
    maxlength: 100
  },
  favs: {
    type: Number,
    maxlength: 100
  }
})

const snippet = mongoose.model('snippet', snippetSchema)

module.exports = snippet
