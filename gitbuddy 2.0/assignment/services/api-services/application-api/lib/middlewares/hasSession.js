
'use strict'
const gitServiceFromUrl = require('../../utils/gitServiceFromUrl')
const { HTTP404Error, HTTP401Error } = require('../errorHandler/httpErrors/HTTPResponses')
const validateToken = require('../../utils/validateToken')
const { errorLogger, accessLogger } = require('../../utils/logger')
const sendError = require('../../lib/errorHandler/sendError')

/*
* Middleware to chech if there is an active session.
* sends 401 if not.
*/
module.exports = async (req, res, next) => {
    try {
        accessLogger('Middleware to check session');
        
        if (!req.session.user) throw new HTTP401Error({ message: 'no session' })
        
        next() 
    } catch (error) {
    errorLogger('[hasSession]: No session')

    sendError(error, res)
    }
}