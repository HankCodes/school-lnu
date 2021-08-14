'use strict'

module.exports = [
    {
        code: 400,
        error: 'validation failed: passphrase',
        message: 'password wrong format or missing'
    },
    {
        code: 400,
        error: 'validation failed: email',
        message: 'Email wrong format or missing'
    },
    {
        code: 400,
        error: 'email_1 dup key',
        message: 'Email already taken'
    }
]