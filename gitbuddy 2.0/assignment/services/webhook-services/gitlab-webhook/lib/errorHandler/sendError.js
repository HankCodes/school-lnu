'use strict'
const errorPipeline = require('./lib/errorPipeline')

module.exports = (error, res) => {
    return errorPipeline(error, res)
}