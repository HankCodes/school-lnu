'use strict'

class HTTPError extends Error {
    constructor({ code = 404, message = '404 Not found', body = {} }) {
        super(message)

        this._message = message
        this._statusCode = code
        this._body = body
    }

    get statusCode() {
        return this._statusCode
    }

    get body() {
        return {
            error: this._message,
            ...this._body,
        }
    }
}

module.exports = {
    HTTPError
}