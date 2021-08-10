class HTTP400Error extends Error {
    constructor({ message = '400 Bad request', body = {}, links = {} }) {
        super(message)

        this._statusCode = 400
        this._body = body
    }

    get statusCode() {
        return this._statusCode
    }

    get body() {
        return {
            ...this._body,
        }
    }
}

class HTTP401Error extends Error {
    constructor({ message = '401 Unauthorized', body = {}, links = {} }) {
        super(message)

        this._statusCode = 401
        this._body = body
    }

    get statusCode() {
        return this._statusCode
    }

    get body() {
        return {
            ...this._body,
        }
    }
}

class HTTP403Error extends Error {
    constructor({ message = '403 Forbidden', body = {}, links = {} }) {
        super(message)

        this._statusCode = 403
        this._body = body
    }

    get statusCode() {
        return this._statusCode
    }

    get body() {
        return {
            ...this._body,
        }
    }
}

class HTTP404Error extends Error {
    constructor({ message = '404 Not found', body = {}, links = {} }) {
        super(message)

        this._statusCode = 404
        this._body = body
    }

    get statusCode() {
        return this._statusCode
    }

    get body() {
        return {
            ...this._body,
        }
    }
}

module.exports = {
    HTTP400Error,
    HTTP401Error,
    HTTP403Error,
    HTTP404Error,
}