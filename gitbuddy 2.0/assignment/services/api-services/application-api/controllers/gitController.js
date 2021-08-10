/**
 *  This controller will forward all the webhook related requests frm the client to the 
 *  Webhook API service. The Webhook API service will in turn sort out to what servuce the 
 *  request will end up in.
 */
const fetch = require('node-fetch')
const conf = require('../configs/appConf')
const {
    errorLogger,
    accessLogger
} = require('../utils/logger')
const sendError = require('../lib/errorHandler/sendError')
const { HTTP500Error } = require('../lib/errorHandler/httpErrors/HTTPResponses')
const appendHeaders = require('../utils/appendHeaders')
const url = conf.gitService

const gitController = {}

/**
 *  Forwards the GET, POST, PUT and DELETE for git request to the git API.
 * @param {*} req 
 * @param {*} res 
 */
gitController.proxyRequest = async (req, res) => {
    try {
        accessLogger(req.method + ' forwarded to: ' + req.url)

        const resp = await (await fetch(url + req.url, {
            method: req.method,
            headers: {
                ...appendHeaders(req)
            }, 
            body: Object.entries(req.body).length > 0 ? req.body : null
        })).json() 

        if (resp.error) throw new HTTP500Error({ message: 'Could not forward request' })
        
        res.send(JSON.stringify(resp))
    } catch (error) {
        errorLogger('[Server]: GET error gitController.Proxyrequest', error);
        
        sendError(error, res)
    }
}

module.exports = gitController
