'use strict'

const { HTTP403Error } = require('../lib/errorHandler/httpErrors/HTTPResponses')
const { accessLogger, errorLogger } = require("../utils/logger")
const sendError = require('../lib/errorHandler/sendError')

module.exports = (req, res, next) => {
    try {
        accessLogger('Auth inernal request')
        
        if (req.header('X-GITBUDDY-TOKEN') !== process.env.GITBUDDY_TOKEN) throw new HTTP403Error({})
        
        next()
    } catch (error) {
        errorLogger('Error in Auth internal request', error)

        sendError(error, res)
    }
}