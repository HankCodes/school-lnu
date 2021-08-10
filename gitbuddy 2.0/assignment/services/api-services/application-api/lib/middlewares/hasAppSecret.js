'use strict'

const { HTTP403Error } = require('../errorHandler/httpErrors/HTTPResponses')
const { errorLogger, accessLogger } = require('../../utils/logger')
const sendError = require('../../lib/errorHandler/sendError')

/*
* Middleware to check if the request has app secret
* sends 403 if not.
*/
module.exports = async (req, res, next) => {
    try {
        accessLogger('[hasAppSecret]: Check secret');
        console.log('has secret??', req.headers)
       if (req.header('x-gitbuddy-token') !== process.env.GITBUDDY_TOKEN) 
        throw new HTTP403Error({ message: 'no application secret' })
        
        next() 
    } catch (error) {
        errorLogger('[hasAppSecret]: No app asecret ', error)

        sendError(error, res)
    }
}