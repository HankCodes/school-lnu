'use srict'

const fetch = require('node-fetch')

module.exports = async (url, opt = {}) => {
    return (await fetch(url, opt)).json()
}