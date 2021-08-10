'use strict'

const fetch = require('./fetch')
const conf = require('../configs/appConf')
const appendHeaders = require('./appendHeaders')

module.exports = async (path, opt = {}) => {
    const newHeaders = {
        ...opt.headers,
        ...appendHeaders()
    }
    opt.headers = newHeaders
    
    return fetch(conf.authAPI + path, {
        ...opt
    })
}