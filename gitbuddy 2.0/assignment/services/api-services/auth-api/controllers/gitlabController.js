'use strict'

const fetch = require('../utils/fetch')
const {
    accessLogger,
    errorLogger
} = require('../utils/logger')
const conf = require('../utils/conf')
const { HTTP401Error } = require('../utils/HTTPResponses')
const sendError = require('../utils/sendError')

const gitlabController = {}

gitlabController.auth = async (req, res) => {
    try {
        accessLogger('Proxy auth request to GitLab Auth service')
       
        const authResp = await fetch(conf.gitlabAuth, {
            headers: {
                'X-GITBUDDY-TOKEN': process.env.GITBUDDY_SECRET
            } 
        })

        res.send({
            service: 'gitlab',
            payload: authResp.payload
        })
    } catch (error) {
        errorLogger('Error whan Proxying GitLab auth request', error.stack)
        
        const errorCode = 500
        res.status(errorCode)
        res.send({
            error: {
                code: errorCode,
                message: 'Could not complete the request'
            }
        })
    }
}

/**
 * Proxys the request to Gitlab auth service to validate token.
 * Will recieve a user object if token is valid.
 * @param {*} req 
 * @param {*} res 
 */
gitlabController.validate = async (req, res) => {
    try {
        accessLogger('[gitlabController.validate]: Proxy authorize users GitLab token')
        const { token } = req.query
        
        let authServiceResp = await fetch(`${conf.gitlabAuth}/validate?token=${token}`, {
            headers: {
                'X-GITBUDDY-TOKEN': process.env.GITBUDDY_SECRET
            }
        })

        if (authServiceResp.error) throw new Error(authServiceResp.error)
        if (Array.isArray(authServiceResp.user)) throw new Error('Response is an array ' + authServiceResp.user) 

        const apiGatewayResp = {
            service: 'gitlab',
            user: {
                username: authServiceResp.user.username,
                id: authServiceResp.user.id,
                email: authServiceResp.user.email,
                isTokenValid: true
            }
        }

        res.send(JSON.stringify(apiGatewayResp))
    } catch (error) {
        errorLogger('Error when Proxying authorize GitLab token ', error.stack)

        const apiGatewayResp = {
            service: 'gitlab',
            user: {
                isTokenValid: false
            }
        }

        const http401error = new HTTP401Error({ message: 'invalid token', body: apiGatewayResp })
        sendError(http401error, res)
    }
}
module.exports = gitlabController
