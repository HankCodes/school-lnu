'use strict'

const errors = require('../errors')
const errorFactory = require('./errorFactory')

module.exports = (error, res) => {
    const newError = generateErrorResponse(error) 

    res.status(newError.statusCode)
    res.send(JSON.stringify(newError.body))
}

const generateErrorResponse = (error) => {
    if (hasErrorConstructor(error)) {
        return error 
    }

    const errorFound = errors.find(err => {
        return error.message.includes(err.error) 
    })

    if (errorFound) {
        return errorFactory(errorFound) 
    } else {
        return errorFactory({ code: 500, message: 'Could not complete the request' })
    }   

}

const hasErrorConstructor = (error) => {
    return [
        'HTTP400Error', 
        'HTTP401Error',
        'HTTP403Error',
        'HTTP404Error',
        'HTTP422Error'].includes(error.constructor.name) 
}