'use strict'

const fetch = require('./fetch')
const {
   accessLogger,
   errorLogger 
} = require('./logger')
const appendHeaders = require('./appendHeaders')
const conf = require('../configs/appConf')

module.exports = async (gitService, token) => {
   try {
       accessLogger(`[validateToken]: Calling Auth API to verify token for ${gitService}`)
       
       const url = `${conf.authAPI}/${gitService}/validate?token=${token}`
       const user = await fetch(url, {
           headers: {
               ...appendHeaders()
            }
        })
        
        return user
        
    } catch (error) {
        errorLogger('Could not validate token:', error)
        return { error: error.message } 
    } 
}