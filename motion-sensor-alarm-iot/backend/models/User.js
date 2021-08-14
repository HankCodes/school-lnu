'use strict'
/**
 * Schema for User.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const moment = require('moment')
const constants = require('../utils/constants')
const { HTTP401Error } = require('../lib/errorHandler/httpErrors/HTTPResponses')
moment.locale('sv')

const userSchema = new mongoose.Schema({
  createdAt: {
    type: String,
    required: true,
    default: moment().format('ll'),
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, constants.NO_EMAIL],
    unique: true,
    maxlength: 100,
    validate: {
      validator: function (v) {
        return (constants.REGEXP_EMAIL).test(v)
      },
      message: constants.WRONG_FORMAT_EMAIL
    }
  },
  passphrase: {
    type: String,
    required: [true, constants.NO_PASSPHRASE],
    minlength: 10,
    maxlength: 100
  },
  devices: { type: [ mongoose.Schema.Types.ObjectId ], ref: 'device' }
})

userSchema.pre('save', async function () {
  this.passphrase = await bcrypt.hash(this.passphrase, 8)
})

userSchema.statics.authenticate = async function (email, passphrase) {
  const user = await this.findOne({ email })
  if (!user || !(await bcrypt.compare(passphrase, user.passphrase))) {
    throw new HTTP401Error({ message: constants.WRONG_CREDENTIALS })
  }

  return user
}

const user = mongoose.model('user', userSchema)

module.exports = user
