'use strict'
const gitServiceFromUrl = require('../../utils/gitServiceFromUrl')
const { HTTP404Error, HTTP401Error } = require('../errorHandler/httpErrors/HTTPResponses')
const validateToken = require('../../utils/validateToken')
const { errorLogger, accessLogger } = require('../../utils/logger')
const sendError = require('../../lib/errorHandler/sendError')
const setGitServiceSession = require('../../utils/setGitServiceSession')

const User = require('../../models/user')

/**
 * Checks if the user has a valid token and session
 * Sends 401 if not
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = async (req, res, next) => {
  try {
    accessLogger('[hasSessionAndToken]: Checks token')
    const token = req.header('Authorization')
    const user = req.session.user
    const authenticated = user && user.authenticated
    const gitService = gitServiceFromUrl(req.url)

    if (!gitService) throw new HTTP404Error({ message: 'gitservice not supported' })
    if (!authenticated) throw new HTTP401Error({ message: 'no session' })
    if (!token) throw new HTTP401Error({ message: 'no token provided' })
    
    if (!user.gitServices[gitService]) {
      const response = await validateToken(gitService, token)

      if (response.error) throw new HTTP401Error({ message: 'token not valid' })
      
      const gitUser = setGitServiceSession(gitService, req.session.user, response.user)
      req.session.user = gitUser
      console.log('get email from git', gitUser)

      // TODO make betetr solution for this, dont hardcode gitlab
      await User.updateOne({ email: gitUser.email }, { gitlabUsername: gitUser.gitServices.gitlab.username })
    }
    
    next()
  } catch (error) {
    errorLogger('[hasSessionAndToken]: Token not valid or other error: ', error )

    sendError(error, res)
  }
}