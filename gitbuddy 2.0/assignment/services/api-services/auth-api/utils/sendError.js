'use strict'

module.exports = (error, res) => {
    const message = [
        'HTTP400Error', 
        'HTTP401Error',
        'HTTP403Error',
        'HTTP404Error',
        'HTTP422Error'].includes(error.constructor.name) ?
        error.message :
        'could not complete the request'

    res.status(error.statusCode ? error.statusCode : 500)
    res.send(JSON.stringify({
        error: message,
        ...error.body,
    }))
}