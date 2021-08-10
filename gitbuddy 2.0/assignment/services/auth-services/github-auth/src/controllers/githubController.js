/**    
 *  This controller will build the url to githubs Oauth
 *  as well as fetch the token once the user is authenticated
 * 
 *  @author Henrik Holstad
 * 
 */

const fetch = require('node-fetch')

const githubController = {}

/**
 * Builds the url to GitHub Oauth.
 * This is the first step in the Oauth flow.
 * The url takes the client to GitHub authentication.
 * 
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 */
githubController.buildUrl = (req, res) => {
    console.log('first auth step');
    // TODO check the permissions 
    // Add state
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.APPLICATION_ID}&redirect_uri=${process.env.CALLBACK_URL}`
    
    res.send(JSON.stringify({
        statusCode: 200,
        service: 'GitHub Oauth2',
        payload: {
            url: url
        },
        error: null
    }))
}

/**
 * Fetches the tokens from GitHub Oauth.
 * This is the second step in the GitHub Oauth flow.
 * The tokens returned from GitHub is used to authenticate
 * the user on requests to GitHub. Handle the tokens with care.
 * 
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 */
githubController.fetchToken = async (req, res) => {
    try {
        const url = `https://github.com/login/oauth/access_token?client_id=${process.env.APPLICATION_ID}&client_secret=${process.env.APPLICATION_SECRET}&code=${req.query.code}&redirect_uri=${process.env.CALLBACK_URL}`
        
        let response = await fetch(url, { 
            method: 'POST', 
            headers: {
                Accept: 'application/json'
            }
        })
        response = await response.json()

        if (response.error) throw new Error(response.error)

        res.send(JSON.stringify({
            statusCode: 200,
            service: 'GitHub Oauth2',
            payload: {
                ...response
            },
            error: null
        }))
    } catch (error) {
        res.send(JSON.stringify({
            statusCode: 500,
            service: 'GitHub Oauth2',
            payload: null,
            error: 'Could not complete auth token request'
        }))
    }
}

module.exports = githubController
