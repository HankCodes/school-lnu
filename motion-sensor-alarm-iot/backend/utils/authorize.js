'use strict'
const sendError = require('../lib/errorHandler/sendError')
const { accessLogger, errorLogger } = require('../lib/logger/logger')
const { HTTP403Error } = require('../lib/errorHandler/httpErrors/HTTPResponses')

module.exports = (req, res, next) => {
    let msg = ''
    try {
        msg += '[authorize]: Checking session'

            console.log(req.session);
        if (!req.session.user) throw new HTTP403Error({})

        msg += '\nHas session, calling next()'
        accessLogger(msg)

        next()
    } catch (error) {
       msg += 'No session' 
       errorLogger(msg)

       sendError(error, res)
    }
}