/**
 *  This controller will forward all the webhook related requests from the client to the 
 *  Webhook API service. The Webhook API service will in turn sort out to what servuce the 
 *  request will end up in.
 * 
 *  It will also recieve the webhoos sent from the various gitservices.
 */
const fetch = require('node-fetch')
const conf = require('../configs/appConf')
const {
    errorLogger,
    accessLogger
} = require('../utils/logger')
const sendError = require('../lib/errorHandler/sendError')
const { HTTP500Error, HTTP404Error } = require('../lib/errorHandler/httpErrors/HTTPResponses')
const User = require('../models/user')
const Notification = require('../models/Notification')
const Subscription = require('../models/Subscription')
const mongoose = require('mongoose')
const { sendNotification } = require('../controllers/webPushController')
const url = conf.webhookAPI

const webhookController = {}

/**
 *  Forwards the GET, POST, PUT and DELETE for webhooks to the Webhook API.
 *  If the request is a POST it indicates that it is a new webhook and thus, a new
 *  subscription will be created
 * @param {*} req 
 * @param {*} res 
 */
webhookController.proxyWebhook = async (req, res) => {
    try {
        const { gitService } = req.params
        const { id } = req.session.user
        accessLogger(req.method + ' for webhook data for: ' + req.url)

        if (req.method.toUpperCase() === 'POST') {
            const userId =  mongoose.Types.ObjectId(id)
            const webUrl = req.query['web-url']

            await Subscription.findOneAndUpdate(
                { webUrl: webUrl }, { $addToSet: { subscribers: userId } }, { new: true, upsert: true }
            )
        }

        let resp = ''
        if (gitService === 'gitlab') {
            resp = await sendGitlabRequest(url, req)
        }
        if (resp.error) throw new HTTP500Error({ message: 'Could not forward request' })
        
        res.send(JSON.stringify(resp))
    } catch (error) {
        errorLogger('[Server]: GET error', error)
        
        sendError(error, res)
    }
}

webhookController.recieveEvent = async (req, res) => {
    try {
        const { eventName } = req.body
        const { user, project } = req.body.payload 

        const subscription = await Subscription.findOne({ webUrl: project.url })
        if (!subscription) throw new HTTP404Error({})

        const users = await User.find({ _id: { $in: subscription.subscribers } })
        if (users.length === 0) { 
            await Subscription.deleteOne({ _id: subscription._id })
            throw new HTTP404Error({ message: 'no subscribers' })
        }

        const newNotification = await Notification.create({
            type: eventName,
            title: 'New ' + eventName,  
            body: `${user.username ? user.username : 'A buddy'} just made a new ${eventName}`,
            subscriptionId: subscription._id
        }) 
        
        const userIds = users.map( user => user._id )
        await User.updateMany({ _id: { $in: userIds } }, { $push: { unreadNotifications: newNotification._id } })

        for (let i = 0; i < users.length; i++) {
            if (!users[i].webPushId) continue
            sendNotification(users[i], newNotification)
        }

        res.send(JSON.stringify('ok'))
    } catch (error) {
        errorLogger('[Server]: Error in recieving webhook', error)
        
        sendError(error, res)
    }
}

const sendGitlabRequest = async (url, req) => {
    return (await fetch(url + req.url, {
        method: req.method,
        headers: {
            Authorization: req.header('Authorization'),
            'X-GITBUDDY-TOKEN': process.env.GITBUDDY_TOKEN
        }
    })).json()
}

module.exports = webhookController
