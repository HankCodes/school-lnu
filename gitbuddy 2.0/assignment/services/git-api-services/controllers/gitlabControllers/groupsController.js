'use strict'

const fetch = require('node-fetch')
const { setHeaders, setStatusCode } = require('../../utils/utils')
const constants = require('../../utils/constants')
const { logger }= require('../../utils/utils')

const groupController = {}
const URL = 'https://gitlab.lnu.se/api/v4'


groupController.getGeneral = (req, res) => {
    try {
        const glResp = fetch(URL)

        const response = {
            payload: 'payload'
        }

        res.send(JSON.stringify(response))
    } catch (error) {
        res.send(JSON.stringify({ error: 'bad request' }))
    }
}

groupController.getUserInfo = (req, res) => {
    try {
        console.log('get user info')
        
        const response = {
            status: 200,
            payload: {
                user: 'some user from gitlab',
            }
        }

        res.send(JSON.stringify(response))
    } catch (error) {
        const statusCode = 
            error.message.includes('no token provided') ? 
            400 : 500

        const response = {
            statusCode: statusCode,
            error: error.message
        }

        res.status(statusCode)
        res.send(JSON.stringify(response))
    }

}


/**
 * Fetches all the users groups. 
 * A token in the Authorization header is requred
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
groupController.getGroups = async (req, res) => {
    try {
        console.log('[Server]: fetching Groups')

        const token = req.header('Authorization')

        if (!token) throw new Error(constants.NO_TOKEN)

        const resp = await fetch(`${URL}/groups?min_access_level=40`, {
            headers: setHeaders(token)
        })

        if (resp.status !== 200) throw new Error(constants.RESOURCE_NOT_FOUND)

        const response = {
            payload: await resp.json(),
            error: null
        }

        res.send(JSON.stringify(response))
    } catch (error) {
        console.error('[Server]: an error occured in getGroups: ', error)

        const response = {
            error: error.message
        }

        res.status(setStatusCode(error.message))
        res.send(JSON.stringify(response))
    }
}


groupController.getSubGroups = async (req, res) => {
    try {
        const { group_id } = req.params
        const token = req.header('Authorization')
        console.log('[Server]: fetching subgroups with id: ', group_id)
        
        if (!group_id) throw new Error(constants.NO_GROUP_ID)
        if (!token) throw new Error(constants.NO_TOKEN)

        const resp = await fetch(`${URL}/groups/${group_id}/subgroups?min_access_level=50`, {
            headers: {
                Authorization: token
            }
        })
    
        if (resp.status !== 200) throw new Error(constants.RESOURCE_NOT_FOUND)

        const response = {
            payload: await resp.json(),
            error: null
        }

        res.send(JSON.stringify(response))
    } catch (error) {
        logger('[Server]: Error in getSubGroups: ', error)

        const response = {
            error: error.message
        }

        res.status(setStatusCode(error.message))
        res.send(JSON.stringify(response))
    }
}


/**
 * Fetches a specific group. 
 * A token in the Authorization header is requred
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
groupController.getGroup = async (req, res) => {
    try {
        const { group_id } = req.params
        const token = req.header('Authorization')
        console.log('[Server]: fetching Group with id: ', group_id)
        console.log(token);
        if (!group_id) throw new Error(constants.NO_GROUP_ID)
        if (!token) throw new Error(constants.NO_TOKEN)

        const resp = await fetch(`${URL}/groups/${group_id}`, {
            headers: {
                Authorization: token
            }
        })

        if (resp.status !== 200) throw new Error(constants.RESOURCE_NOT_FOUND)
    

        const response = {
            payload: await resp.json(),
            error: null
        }
        
        res.send(JSON.stringify(response))
    } catch (error) {
        logger('[Server]: Error in getSubGroup: ', error)
        const response = {
            error: error.message
        }

        res.status(setStatusCode(error.message))
        res.send(JSON.stringify(response))
    }
}

module.exports = groupController
