'use strict'

const {
HTTP400Error,
HTTP401Error,
HTTP403Error,
HTTP404Error,
HTTP500Error
} =require('../httpErrors/HTTPResponses')

module.exports = ({ code, message }) => {
    switch (code) {
        case 400: 
            return new HTTP400Error({ message: message })    
    
        case 401: 
            return new HTTP401Error({ message: message })
 
        case 403: 
            return new HTTP403Error({ message: message })
 
        case 404: 
            return new HTTP404Error({ message: message })
        
        case 500: 
            return new HTTP500Error({ message: message })
   
        default:
            return new HTTP500Error({})
    }
}