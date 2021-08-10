'use strict'

/**
 * Schema for Subscriptions.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const mongoose = require('mongoose')

const subscriptionSchema = new mongoose.Schema({
  createdAt: {
    type: String,
    required: true,
    default:   new Date(Date.now()).toLocaleString('sv'),
  },
  webUrl: {
    type: String,
    required: true,
    unique: true
  },
  subscribers: { type: [mongoose.Schema.Types.ObjectId], ref: 'user' },
})

module.exports = mongoose.model('subscription', subscriptionSchema)
