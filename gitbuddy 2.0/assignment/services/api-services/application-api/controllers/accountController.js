'use strict'

const { errorLogger, accessLogger } = require('../utils/logger')
const sendError = require('../lib/errorHandler/sendError')
const fetchAuthApi = require('../utils/fetchAuthApi')
const fetch = require('node-fetch')
const conf = require('../configs/appConf')

const User = require('../models/user')
const Notification = require('../models/Notification')
const { HTTP500Error, HTTP404Error  } = require('../lib/errorHandler/httpErrors/HTTPResponses')

const accountController = {}

accountController.getNotifications = async (req, res) => {
   try {
        accessLogger(`[accountController.getNotifications]: recieving a request for a users notifications`)
        const { email } = req.session.user

        const { readNotifications, unreadNotifications } = await User.findOne({ email: email })

        const read = await Notification.find({ _id: { $in: readNotifications  } })
        const unread = await Notification.find({ _id: { $in: unreadNotifications  } })

        res.send(JSON.stringify({
            status: 'success',
            payload: {
                readNotifications: read.reverse(),
                unreadNotifications: unread.reverse()
            } 
        }))
    } catch (error) {
        errorLogger('Error inside getNortifications:', error)

        sendError(error, res)
    } 
}

accountController.readNotifications = async (req, res) => {
   try {
        accessLogger(`[accountController.readNotifications]: Registering read nnotifications`)
        const { email } = req.session.user

        const user = await User.findOne({ email: email })
        if (!user) throw new HTTP404Error({ message: 'no user found' })
        
        await User.updateOne({ _id: user._id }, { $push: { readNotifications: { $each: user.unreadNotifications } }, unreadNotifications: [] })
        res.send(JSON.stringify({
            status: 'success',
            payload: 'Payload' 
        }))
    } catch (error) {
        errorLogger('Error inside nreadNotifications:', error)

        sendError(error, res)
    } 
}

accountController.verify = async (req, res) => {
   try {
        const { gitService } = req.params
        const token = req.header('Authorization')

        accessLogger(`[accesscontroller.verify]: Calling Auth API to verify token for ${gitService}`)
        
        const url = `${conf.authAPI}/${gitService}/validate?token=${token}`
        const resp = await (await fetch(url, {
            headers: {
                authenticate: token,
                'X-GITBUDDY_TOKEN': process.env.GITBUDDY_SECRET 
            }
        })).json()

        if (resp.error) throw new HTTP500Error({ message: 'Could not verify token' }) 

        res.send(JSON.stringify({
            status: 'success',
            payload: resp 
        }))
    } catch (error) {
        errorLogger('Could not verify token:', error)

        sendError(error, res)
    } 
}

accountController.oauth = async (req, res) => {
    try {
        const { gitService } = req.params
        accessLogger('Proxying Login request to auth API for service: ' + gitService)
        
        const resp = await fetchAuthApi('/' + gitService + '/authenticate')
        
        if (resp.error ) throw new Error('could not complete the request')

        res.send(JSON.stringify({
            message: 'success',
            payload: resp.payload
        }))
    } catch (error) {
        errorLogger('Error in accountController.login', error.stack)   
        
        sendError(error, res)
    }
}

accountController.login = async (req, res) => {
    try {
        const { email: clientEmail, passphrase } = req.body
        accessLogger('accountController.login: Loggin user in ', clientEmail) 

        const { _id, firstName, email } = await User.authenticate(clientEmail, passphrase)

        req.session.user = {
            authenticated: true,
            name: firstName,
            id: _id,
            email: email,
            gitServices: {}
        }

        const clientResponse = {
            message: 'success',
            user: {
                id: _id,
                firstName,
                email,
            }
        }

        res.send(JSON.stringify(clientResponse))
    } catch (error) {
        errorLogger('accountController.login: Error: In loginUser: ', error);
        sendError(error, res)        
    }
}

accountController.create = async (req, res) => {
    try {
        const { 
            firstName,
            email,
            passphrase 
        } = req.body
        
       accessLogger('accountController.create: Creating user...', email)

        const user = await User.create({ 
            firstName: firstName,
            email: email,
            passphrase: passphrase
        })
        
        res.status(201)
        res.send(JSON.stringify({
            message: 'User successfuly created',
            user: {
                id: user._id,
                firstName,
                email,
            }
        }))

    } catch (error) {
        errorLogger('accountController.create: Error occured in createUser:', error);
        sendError(error, res)
    }

}

module.exports = accountController
