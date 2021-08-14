'use strict'
/**
 * Schema for device. 
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const mongoose = require('mongoose')
const moment = require('moment')
moment.locale('sv')

const deviceSchema = new mongoose.Schema({
  createdAt: {
    type: String,
    required: true,
    default: moment().format('ll'),
  },
  deviceId: { type: String, required: true },
  ip: { type: String },
  port: { type: Number},
  state: { type: Boolean },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
})

const device = mongoose.model('device', deviceSchema)

module.exports = device 
