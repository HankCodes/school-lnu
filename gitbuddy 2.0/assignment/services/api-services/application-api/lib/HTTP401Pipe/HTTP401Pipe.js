'use strict'
const { errorLogger, accessLogger } = require('../../utils/logger')
const validateToken = require('../../utils/validateToken')
const {
    HTTP401Error
} = require('../errorHandler/httpErrors/HTTPResponses')

module.exports = async (req, gitService, token) => {
    let messageFlow = ''
    try {
        messageFlow += '[HTTP401Pipe]: \n Starting pipe for service: ', gitService
        
        const user = validateToken(gitService, token)
        messageFlow += '\n validated token'

        let errorMessage = ''        
        if (!user) {
            req.session.destroy()
            errorMessage = 'token not valid'
            messageFlow += '\n Token not valid'
        } else {
            errorMessage = 'request unauthorized'
            messageFlow += '\n Had valid token'
        }
        
        accessLogger(messageFlow)
        throw new HTTP401Error({ message: errorMessage  })
    } catch (error) {
        errorLogger(messageFlow, error.stack)  
        
        throw new HTTP401Error({})
    }

}