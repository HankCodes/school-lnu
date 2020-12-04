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
moment.locale('sv')

const userSchema = new mongoose.Schema({
  createdAt: {
    type: String,
    required: true,
    default: moment().format('ll'),
    maxlength: 100
  },
  username: {
    type: String,
    required: [true, 'Username must be entered'],
    unique: true
  },
  passphrase: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 100
  },
  name: {
    type: String,
    required: [true, 'Name must be entered'],
    trim: true,
    validate: {
      validator: function (v) {
        return (/^[a-z0-9_-]{3,20}$/ig).test(v)
      },
      message: 'Can only contain letters and must be between 3 - 20 characters'
    }
  },
  surname: {
    type: String,
    required: [true, 'Surname must be entered'],
    trim: true,
    validate: {
      validator: function (v) {
        return (/^[a-z]{3,20}$/ig).test(v)
      },
      message: 'Can only contain letters and must be between 3 - 20 characters'
    }
  }
})

userSchema.pre('save', async function () {
  this.passphrase = await bcrypt.hash(this.passphrase, 8)
})

userSchema.statics.authenticate = async function (username, passphrase) {
  const user = await this.findOne({ username })
  if (!user || !(await bcrypt.compare(passphrase, user.passphrase))) {
    throw new Error('invalid username or password, please try again.')
  }
  return user
}

userSchema.statics.getId = async function (username) {
  const user = await this.findOne({ username })

  if (!user) {
    throw new Error('Unable to find user')
  }

  return user._id
}

userSchema.statics.getName = async function (id) {
  return await this.findOne({ id }) || 'Unknown athour'
}

const user = mongoose.model('user', userSchema)

module.exports = user
