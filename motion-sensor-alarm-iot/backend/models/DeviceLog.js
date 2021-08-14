'use strict'
/**
 * Schema for device log. 
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const mongoose = require('mongoose')

const deviceLogSchema = new mongoose.Schema({
  createdAt: {
    type: String,
    required: true,
    default: new Date(Date.now()).toLocaleString('sv'),
  },
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'device' },
  logMessage: { type: String },
})

const deviceLog = mongoose.model('deviceLog', deviceLogSchema)

module.exports = deviceLog 
