'use strict'

/**
 * Schema for Notifications.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  createdAt: {
    type: String,
    required: true,
    default:   new Date(Date.now()).toLocaleString('sv'),
  },
  type: {
    type: String,
  },
  gitUrl: {
    type: String
  },
  title: {
    type: String
  },
  body: {
    type: String
  },
  project: {
    type: String
  },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'subscription' },
})

module.exports = mongoose.model('notification', notificationSchema)
