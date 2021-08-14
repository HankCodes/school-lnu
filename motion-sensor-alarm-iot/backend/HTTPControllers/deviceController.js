'use strict'
const Device = require('../models/Device')
const DeviceLog = require('../models/DeviceLog')
const sendError = require('../lib/errorHandler/sendError')
const { accessLogger, errorLogger } = require('../lib/logger/logger')
const { HTTP400Error, HTTP404Error, HTTP403Error } = require('../lib/errorHandler/httpErrors/HTTPResponses')
const User = require('../models/User')
const deviceController = {}

deviceController.init = async (req, res) => {
    let msg = ''
    try {
        const { id, ip, port } = req.body
        msg += '[deviceController.init] \nIncomming call for device init ' + id

        if (!id) throw new HTTP400Error({ message: 'No device id' })

        let device = await Device.findOne({ deviceId: id })
        if (!device) {
            msg += `
            No device in database, creating...
            Port: ${port}
            Ip: ${ip}`

            device = await Device.create({
                deviceId: id,
                ip: ip,
                port: port
            })

            msg += "\nDevice created"
        } else {
            msg += '\nDevice found in database, updates ip and port...'

            device.update({
                ip: ip,
                port: port
            })
            msg += '\n Done'
        }
    
        accessLogger(msg)
        res.send(JSON.stringify({ status: 'ok' }))
    } catch (error) {
        errorLogger(msg, error)
        
        sendError(error, res)
    }
}

deviceController.claim = async (req, res) => {
    let msg = ''
    try {
        const { deviceName } = req.body
        const { id } = req.session.user
        
        msg += '[deviceController.claim] \nIncomming call for claiming device ' + deviceName 

        let device = await Device.findOne({ deviceId: deviceName })

        if (!device) {
            msg += '\nNo device in database, throwing error...'
            throw new HTTP404Error({ message: 'device not found' })
        }
        
        if (!device.owner) {
            msg += '\nDevice has no owner, User is claiming...'
            await Device.updateOne({_id: device._id}, { owner: id })
            await User.updateOne({ _id: id }, {$push: { devices: device._id }})
            msg += '\nDevice owner claimed'
        } else {
            throw new HTTP400Error({ message: 'Device already claimed' })  
        }  
        
        msg += '\nSending response to client'
        accessLogger(msg)
        res.send(JSON.stringify({ 
            status: 'success', 
            message: 'Device successfully claimed!',
            device: {
                deviceName: device.deviceId,
                ip: device.ip,
                port: device.port
            }
        }))
    } catch (error) {
        msg += '\nError occured'
        errorLogger(msg, error)
        
        sendError(error, res)
    }
}

deviceController.triggered = async (req, res) => {
    let msg = ''
    try {
        const { id } = req.body
        msg += '[deviceController.triggered] \nDevice is triggerd, id: ' + id

        if (!id) throw new HTTP400Error({ message: '\nNo device id' })

        let device = await Device.findOne({ deviceId: id })

        if (!device) {
            msg += 'No device found, throwing error'
            throw new HTTP403Error({ message: 'no device' })
        } else if (!device.owner) {
            msg += '\nDevice does not have owner, not logging activity'
        } else {
            msg += '\nDevice found in database, Updates log'
            DeviceLog.create({
                createdAt: new Date(Date.now()).toLocaleString('sv'), 
                deviceId: device._id,
                logMessage: 'triggered' 
            }) 
        }
        
        msg += '\nSending response back to device'
        accessLogger(msg)
        res.send(JSON.stringify({ status: 'ok' }))
    } catch (error) {
        errorLogger(msg, error)
        
        sendError(error, res)
    }
}

deviceController.state = async (req, res) => {
    let msg = ''
    try {
        const { id, state } = req.body
        msg += '[deviceController.state] \nDevice state is updated, id: ' + id

        const device = await Device.findOne({ deviceId: id })
        if (!device) throw new HTTP400Error({ message: 'device not found' })

        await Device.updateOne({ _id: device._id }, { state: state })
        DeviceLog.create({
            createdAt: new Date(Date.now()).toLocaleString('sv'), 
            deviceId: device._id,
            logMessage: state ? 'activated' : 'deactivated' 
        }) 
        
        msg += '\nDevicelog updated, sending response back to device'
        accessLogger(msg)
        res.send(JSON.stringify({ status: 'ok' }))
    } catch (error) {
        errorLogger(msg, error)
        
        sendError(error, res)
    }
}

module.exports = deviceController
