'use strict'
const fs = require("fs");
const { promisify } = require("util");
const fetch = require('node-fetch')

const appendFile = promisify(fs.appendFile);

const constants = require("./constants")

/**
 * Sets the appropriate haders for the request.
 * 
 * @param {string} token - The token 
 */
module.exports.setHeaders = (token) => ({
    Authorization: 'Bearer ' + token
})

/**
 * Sets the proper status code from error message
 * 
 * @param {string} errorMessage 
 */
module.exports.setStatusCode = (errorMessage) => {        
    if (errorMessage === constants.NO_GROUP_ID ||
        errorMessage === constants.NO_PROJECT_ID ||
        errorMessage === constants.NO_ISSUE_ID ||
        errorMessage === constants.NO_DISCUSSION_ID ||
        errorMessage === constants.NO_NOTE_ID
        ) return 402

    if (errorMessage === constants.NO_TOKEN) return 403
    if (errorMessage === constants.RESOURCE_NOT_FOUND) return 404

    return 500
    
}


 
const formatErrorMessage = (message, error) => {
    return `========= ${new Date()} =========
    ${message}
    ${error}
    ========= END =========

    `
}

module.exports.logger = async (message, error) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            await appendFile('../log/errorlog.txt', formatErrorMessage(message, error))
        } else {
            
            console.error(formatErrorMessage(message, error))
        }
    } catch (error) {
        console.error('Could not write to error log');
    }
}

/**
 * Fetch content from gitlab's api.
 * 
 * Will throw error if status code of response is not 200 OK
 * 
 * @param {string} endpoint - Gitlab api endpoint to fetch, Begins with forward slash
 * @param {*} options 
 * 
 * @return - JS object
 */
module.exports.fetchGitlab = async (endpoint, options) => {
    const resp = await fetch(constants.GITLAB_API + endpoint, options)

    if (resp.status !== 200) throw new Error(constants.RESOURCE_NOT_FOUND)
    
    return resp.json()
}
