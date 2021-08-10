const conf = require('../configs/appConf')

/**
 * Parses an url to find the gitservice provided.
 * Will return the first match of the applications valid git services. 
 * @param {string} url - url to parse
 * 
 */
module.exports = (url) => {
    return url.split('/').filter(entry => conf.supportedServices.includes(entry))[0]
}