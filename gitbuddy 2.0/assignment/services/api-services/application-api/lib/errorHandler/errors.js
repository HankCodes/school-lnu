'use strict'

const constants = require('../../utils/constants')

module.exports = [
    {
        code: 401,
        error: constants.NO_EMAIL,
        message:  constants.NO_EMAIL,
    },
    {
        code: 401,
        error: constants.NO_PASSPHRASE,
        message:  constants.NO_PASSPHRASE,
    },
    {
        code: 401,
        error: constants.WRONG_FORMAT_EMAIL,
        message:  constants.WRONG_FORMAT_EMAIL,
    },
    {
        code: 401,
        error: constants.WRONG_FORMAT_PASSPHRASE,
        message:  constants.WRONG_FORMAT_PASSPHRASE,
    },
    {
        code: 400,
        error: 'validation failed: passphrase',
        message: 'password wrong format'
    }
]