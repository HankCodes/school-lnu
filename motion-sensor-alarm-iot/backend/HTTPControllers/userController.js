'use strict'
const User = require('../models/User')
const Device = require('../models/Device')
const DeviceLog = require('../models/DeviceLog')
const sendError = require('../lib/errorHandler/sendError')
const { accessLogger, errorLogger } = require('../lib/logger/logger')
const { HTTP403Error } = require('../lib/errorHandler/httpErrors/HTTPResponses')
const userController = {}

userController.checkSession = (req, res) => {
    let msg = 'userController.cehckSession: Checking session'    
    
    if (!req.session.user) throw new HTTP403Error({})
   
    msg += '\nUser has session'
    accessLogger(msg)    
    res.json({ status: 'success' })
}
    
userController.login = async (req, res) => {
    let msg = ''
    try {
        const { email, passphrase } = req.body
        msg += '[userController.login] \nIncomming call to authenticate user ' + email 

        const { _id } = await User.authenticate(email, passphrase)        
        msg += '\n User Authenticated'
    
        req.session.user = {
            authenticated: true,
            id: _id,
            email: email
        }

        accessLogger(msg)
        res.send(JSON.stringify({ status: 'success', user: email }))
    } catch (error) {
        msg += '\nError occured\n'
        errorLogger(msg, error)

        sendError(error, res)
    }
}

userController.logout = async (req, res) => {
    let msg = ''
    try {
        msg += '[userController.logout] \nIncomming call to logout user ' 

        req.session.destroy()
        
        msg += '\nUSer sessiond estroyed'
        accessLogger(msg)
        res.send(JSON.stringify({ status: 'success' }))
    } catch (error) {
        msg += '\nError occured\n'
        errorLogger(msg, error)

        sendError(error, res)
    }
}


userController.create = async (req, res) => {
    let msg = ''
    try {
        const { email, passphrase } = req.body
        msg += '[userController.create] \nIncomming call to create user ' + email 

        const user = await User.create({ email: email, passphrase: passphrase })        
        msg += '\n User created'

        accessLogger(msg)
        res.send(JSON.stringify({ status: 'success', user: user.email }))
    } catch (error) {
        msg += '\nError occured\n'
        errorLogger(msg, error)

        sendError(error, res)
    }
}

userController.getDevices = async (req, res) => {
    let msg = ''
    try {
        const { id, email } = req.session.user
        msg += '[deviceController.getDevices] \n:request for devices by: ' + email

        const devices = await Device.find({ owner: id })
        
        msg += '\nFound users devices. Sending response back to user'
        accessLogger(msg)
        res.send(JSON.stringify({ 
            status: 'success',
            devices: devices
        }))
    } catch (error) {
        errorLogger(msg, error)
        
        sendError(error, res)
    }
}

userController.getLog = async (req, res) => {
    let msg = 'userController.getLog'    
    try {
        const { id } = req.session.user 
        const { deviceId } = req.params 

        const device = await Device.findOne({ deviceId: deviceId })
        if (device.owner.toString() !== id) {
            msg += '\nUser not owner of device, throwing error'
            throw new HTTP403Error({ message: 'device not yours' })
        }

        const logs = await DeviceLog.find({ deviceId: device._id })

        msg += '\nSending logs to user'
        accessLogger(msg)    
        res.send(JSON.stringify({ 
            status: 'success',
            logs: logs.reverse()
        }))
    } catch (error) {
        errorLogger(msg, error)
        
        sendError(error, res)
    } 
}

module.exports = userController
