'use strict'
const fetch = require('node-fetch')
const {
    errorLogger,
    accessLogger
} = require('../utils/logger')
const conf = require('../utils/conf')
const formatGitlabEvents = require('../utils/formatGitlabEvents')

const HTTP500Error = { error: 'Something went wrong' }
const HTTP200Response = { status: '200 OK' }
const gitlabController = {}

gitlabController.webhook = async (req, res) => {
    try {
        accessLogger('[Server]: Receiving webhook event from GitLab')

        let webhookPayload = formatGitlabEvents(req.body)
        res.send(JSON.stringify(HTTP200Response))
        
       const gatewayresp = await fetch(conf.apiGateway + '/webhook/gitlab/event', {
           method: 'post',
           headers: {
            'X-GITBUDDY-TOKEN': process.env.GITBUDDY_TOKEN,
            'Content-Type': 'application/json'
           },
           body: JSON.stringify(webhookPayload)
       })

       console.log('response from API Gateway', await gatewayresp.json())
        
    } catch (error) {
        errorLogger('[Server]: Error when receiving webhook from GitLab', error.stack);

        res.status(500)
        res.send(JSON.stringify(HTTP500Error))
    }
}

gitlabController.proxyWebhookRequest = async (req, res) => {
    try {
        const { projectId, hookId } = req.params
        
        accessLogger(req.method + ' webhook.  ID: ' + projectId + ' Hook ID: ' + hookId)
        
        let queryString = []
        for (const [key, value] of Object.entries(req.query)) {
            queryString.push(key + '=' + value) 
        }

        const query = queryString.length > 0 ? '?' + queryString.join('&') : ''
        const url = `${process.env.WEBHOOK_GITLAB}/project/${projectId}/hook/${hookId ? hookId : ''}${query}`
        
        const resp = await (await fetch(url, {
            method: req.method,
            headers: {
                Authorization: req.header('Authorization'),
                'X-GITBUDDY-TOKEN': process.env.GITBUDDY_TOKEN
            }
        })).json()
        console.log('the response fromgl ', resp)
        res.send(JSON.stringify(resp))
    } catch (error) {
        errorLogger('[Server]: Error when proxy request to GitLab service', error.stack);

        res.status(500)
        res.send(JSON.stringify(HTTP500Error))
    }
}

module.exports = gitlabController
