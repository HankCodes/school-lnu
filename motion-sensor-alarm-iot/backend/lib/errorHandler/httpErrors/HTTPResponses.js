'use strict'

const { HTTPError } = require('./HTTPError')

class HTTP400Error extends HTTPError {
    constructor({ message = '400 Bad request', body = {} }) {
        super({ code: 400, message: message, body: body })
    }
}

class HTTP401Error extends HTTPError {
    constructor({ message = '401 Unauthorized', body = {} }) {
        super({ code: 401, message: message, body: body })
    }
}

class HTTP403Error extends HTTPError {
    constructor({ message = '403 Forbidden', body = {} }) {
        super({ code: 403, message: message, body: body })
    }
}

class HTTP404Error extends HTTPError {
    constructor({ message = '404 Not Found', body = {} }) {
        super({ code: 404, message: message, body: body })
    }
}

class HTTP500Error extends HTTPError {
    constructor({ message = '500 Internal Server Error', body = {} }) {
        super({ code: 500, message: message, body: body })
    }
}

module.exports = {
    HTTP400Error,
    HTTP401Error,
    HTTP403Error,
    HTTP404Error,
    HTTP500Error
}