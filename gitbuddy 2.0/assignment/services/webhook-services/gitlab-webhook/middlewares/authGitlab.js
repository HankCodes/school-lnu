'use strict'

const { HTTP403Error } = require('../lib/errorHandler/httpErrors/HTTPResponses')
const { accessLogger, errorLogger } = require("../utils/logger")
const sendError = require('../lib/errorHandler/sendError')

module.exports = (req, res, next) => {
    try {
        accessLogger('Auth gitlab request')
        
        if (req.header('X-GITLAB-TOKEN') !== process.env.GITLAB_TOKEN) throw new HTTP403Error({})
        
        next()
    } catch (error) {
        errorLogger('Error when authenticating gitlab', error)

        sendError(error, res)
    }
}