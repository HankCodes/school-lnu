'use strict'

const {
    errorLogger,
    accessLogger
} = require('../utils/logger')
const sendError = require('../lib/errorHandler/sendError')
const { HTTP404Error } = require('../lib/errorHandler/httpErrors/HTTPResponses')
const User = require('../models/user')
const webPush = require('web-push')

webPush.setVapidDetails(
    process.env.BASE_URL,
    process.env.VAPID_PUBLIC,
    process.env.VAPID_PRIVATE
  )
  
const webPushController = {}

webPushController.getKey = async (req, res) => {
    try {
        accessLogger('Requesting VAPID key')
        res.send(JSON.stringify({ key: process.env.VAPID_PUBLIC }))
    } catch (error) {
        errorLogger('[Server]: GET error in getKey', error);
        
        sendError(error, res)
    }
}

webPushController.register = async (req, res) => {
    try {
        accessLogger('registering a subscription request')
        const { subscription } = req.body
        const { email } = req.session.user

        const user = User.findOne({ email: email }) 
        if( !user ) throw new HTTP404Error({})

        await User.updateOne({ email: email }, { webPushId: JSON.stringify(subscription), $addToSet: { notificationTypes: 'webpush' } })

        res.send(JSON.stringify({ status: 'success' }))
    } catch (error) {
        errorLogger('[Server]: POST error in register push', error);
        
        sendError(error, res)
    }
}

webPushController.update = async (req, res) => {
    try {
        accessLogger('Update a notification')
        
        const { subscriptionTypes } = req.body
        const { email } = req.session.user

        const user = User.findOne({ email: email }) 
        if( !user ) throw new HTTP404Error({})

        await User.updateOne({ email: email }, { webPushId: subscription, $addToSet: { notificationTypes: { $each: subscriptionTypes } } })

        res.send(JSON.stringify({ status: 'success' }))
    } catch (error) {
        errorLogger('[Server]: PUT error in update webPush', error);
        
        sendError(error, res)
    }
}

webPushController.unregister = async (req, res) => {
    try {
        accessLogger('unregistering a subscription request')
        const { email } = req.session.user

        const user = User.findOne({ email: email }) 
        if( !user ) throw new HTTP404Error({})

        await User.updateOne({ email: email }, { webPushId: null, notificationTypes: [] })

        res.send(JSON.stringify({ status: 'success' }))
    } catch (error) {
        errorLogger('[Server]: POST error in unregister push', error);
        
        sendError(error, res)
    }
}

webPushController.sendNotification = async (user, notification) => {
    try {
        accessLogger('Sending notification to user')

        const subscription = JSON.parse(user.webPushId)

        await webPush.sendNotification(subscription, JSON.stringify(notification))
    } catch (error) {
        errorLogger('[Server]: Error in sendNotification', error);
    }
}

module.exports = webPushController
