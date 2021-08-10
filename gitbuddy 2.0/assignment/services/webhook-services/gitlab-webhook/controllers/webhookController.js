'use strict'

const fetch = require('node-fetch');
const { errorLogger, accessLogger } = require('../utils/logger')
const sendError = require('../lib/errorHandler/sendError');
const { HTTP400Error } = require('../lib/errorHandler/httpErrors/HTTPResponses');

const webhookController = {}

webhookController.getHook =  async (req, res) => {
    try {
        accessLogger('[Gitlab webhook]: GET webhook');
        
        const token = req.header('Authorization')
        const { project_id, hook_id } = req.params
        
        const req_url = `${process.env.GITLAB_URL}/projects/${project_id}/hooks/${hook_id ? hook_id : ''}`
        
        const gitlabResp = 
        await (await fetch(req_url, {
            headers: {
                Authorization: 'bearer ' + token
            }
        })).json()

        console.log('Webhook received from GitLab ', gitlabResp);
        
        res.send(JSON.stringify(gitlabResp))
            
    } catch (error) {
        errorLogger('error ', error);  
        
        sendError(error, res)
    }
}

webhookController.updateHook =  async (req, res) => {
    try {
        accessLogger('[Gitlab webhook]: Update webhook');
        const token = req.header('Authorization')
        const { project_id, hook_id } = req.params

        let queryString = []
        for (const [key, value] of Object.entries(req.query)) {
            queryString.push(key + '=' + value) 
        }
       console.log('query', req.body); 
        console.log('querystring: ', queryString);
        const req_url = `${process.env.GITLAB_URL}/projects/${project_id}/hooks/${hook_id}?url=${process.env.WEBHOOK_CALLBACK}&${queryString.join('&')}`
        
        console.log('url to send l', req_url);
        const gitlabResp = 
        await fetch(req_url, {
            method: 'PUT',
            headers: {
                Authorization: 'bearer ' + token
            }
        })
        
        const body =  await gitlabResp.json()
        console.log('response from gitlab: ', body);
        res.send(JSON.stringify(body))
    } catch (error) {
        errorLogger('error ', error); 
    
        sendError(error, res)
    }
} 

webhookController.createHook =  async (req, res) => {
    try {
        accessLogger('[Gitlab webhook]: create webhook');
        
        const token = req.header('Authorization')
        const { project_id } = req.params

        let queryString = []
        for (const [key, value] of Object.entries(req.query)) {
            queryString.push(key + '=' + value) 
        }
        
        const req_url = `${process.env.GITLAB_URL}/projects/${project_id}/hooks?url=${process.env.WEBHOOK_CALLBACK}&${queryString.join('&')}`
        
        const gitlabResp =  
        await fetch(req_url, {
            method: 'POST',
            headers: {
                Authorization: 'bearer ' + token
            }
        })
        const body =  await gitlabResp.json()

        if (body.error) throw new HTTP400Error({ message: body.error })
        
        res.send(JSON.stringify(body))
    } catch (error) {
        errorLogger('error ', error); 
      
        sendError(error, res)
    }
} 

webhookController.deleteHook =  async (req, res) => {
    try {
        accessLogger('[Gitlab webhook]: delete webhook');
      
        const token = req.header('Authorization')
        const { project_id, hook_id } = req.params

        let queryString = []
        for (const [key, value] of Object.entries(req.query)) {
            queryString.push(key + '=' + value) 
        }
        
        const req_url = `${process.env.GITLAB_URL}/projects/${project_id}/hooks/${hook_id}?url=${process.env.WEBHOOK_CALLBACK}&${queryString.join('&')}`
        
        const gitlabResp = 
        await fetch(req_url, {
            method: 'DELETE',
            headers: {
                Authorization: 'bearer ' + token
            }
        })

        // const resp = await gitlabResp.json() 
        res.send(JSON.stringify({ message: 'webhook deleted' }))
    } catch (error) {
        errorLogger('error ', error); 
        
        sendError(error, res)
    }
} 

webhookController.receiveHook = async (req, res) => {
    try {        
        accessLogger('[Gitlab webhook]: recieving webhook');
        
        res.send('200 OK')

        console.log(req.body)
        const response = await fetch(process.env.WEBHOOK_API + '/event', {
            method: 'post',
            headers: {
            'X-GITBUDDY-TOKEN': process.env.GITBUDDY_TOKEN,
            'Content-type': 'application/json'
            },
            body: JSON.stringify(req.body)
        })
        
        console.log('Response from fetch to webhook-api', await response.json())

    } catch (error) {
        errorLogger('Error in recieving webhook', error);   
        
        sendError(error, res)
    }
}

module.exports = webhookController