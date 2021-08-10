/**    
 *  This controller will build the url to gitlabs Oauth
 *  as well as fetch the token once the user is authenticated
 * 
 *  @author Henrik Holstad
 * 
 */

const fetch = require('node-fetch')
const {
    accessLogger,
    errorLogger
} = require('../utils/logger')
const { HTTP401Error } = require('../utils/HTTPResponses')
const sendError = require('../utils/sendError')
const conf = require('../utils/conf')

const gitlabController = {}

/**
 * Builds the url to Gitlab Oauth.
 * This is the first step in the Oauth flow.
 * The url takes the client to Gitlab authentication.
 * 
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 */
gitlabController.buildUrl = (req, res) => {
    try {
        accessLogger('Request for authentication')
        // TODO check the permissions 
        const url = `https://gitlab.lnu.se/oauth/authorize?client_id=${process.env.APPLICATION_ID}&redirect_uri=${process.env.CALLBACK_URL}&response_type=code&state=${process.env.GITLAB_STATE}&scope=api`
        
        res.send(JSON.stringify({
            statusCode: 200,
            service: 'Gitlab Oauth2',
            payload: {
                url: url
            },
            error: null
        }))
        
    } catch (error) {
       errorLogger('Error when building auth url\n ' + error.message, error.stack) 

       res.status(500)
        res.send(JSON.stringify({
            service: 'Gitlab Oauth2',
            payload: null,
            error: 'Could not build auth url'
        }))
    }
}

/**
 * Fetches the tokens from Gitlab Oauth.
 * This is the second step in the Gitlab Oauth flow.
 * The tokens returned from Gitlab is used to authenticate
 * the user on requests to Gitlab. Handle them with care.
 * 
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 */
gitlabController.fetchToken = async (req, res) => {
    try {
        accessLogger('Fething for access token')
        
        const url = `https://gitlab.lnu.se/oauth/token?client_id=${process.env.APPLICATION_ID}&client_secret=${process.env.APPLICATION_SECRET}&code=${req.query.code}&grant_type=authorization_code&redirect_uri=${process.env.CALLBACK_URL}`
        let response = await fetch(url, { method: 'POST' })
        response = await response.json()
        
        if (response.error) throw new Error(response.error)
        console.log(response)
        res.redirect(process.env.REDIRECT_URL + '?token=' + response.access_token)
    } catch (error) {
        errorLogger('Error when fething access token', error)
        
        res.status(500)
        res.send(JSON.stringify({
            service: 'Gitlab Oauth2',
            payload: null,
            error: 'Could not complete auth token request'
        }))
    }
}

/**
 * Validates the token
 * 
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 */
gitlabController.validateToken = async (req, res) => {
    try {
        accessLogger('Validating GitLab access token')
        const { token } = req.query

        const url = `https://gitlab.lnu.se/api/v4/user`
        let response = await fetch(url, { 
            headers: {
                Authorization: 'bearer ' + token 
            }
        })
        response = await response.json()

        if (response.message && response.message.includes('401')) throw new HTTP401Error(response.message)
        

        res.send(JSON.stringify({
            user: Array.isArray(response) ? response[0] : response,
            error: null
        }))
    } catch (error) {
        errorLogger('Error when validating access token', error)
        
        sendError(error, res)
    }
}

module.exports = gitlabController
