'use strict'

const fetch = require('node-fetch')
const { setHeaders, setStatusCode } = require('../../utils/utils')
const constants = require('../../utils/constants')

const projectController = {}
const URL = 'https://gitlab.lnu.se/api/v4'



/**
 * Fetches all the projects of a secific group. 
 * A token in the Authorization header is requred
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
projectController.getProjectsByGroup = async (req, res) => {
    try {
        const { group_id } = req.params
        const token = req.header('Authorization')
        console.log('[Server]: fetching projects from the group id: ', group_id)
        
        if (!group_id) throw new Error(constants.NO_GROUP_ID)
        if (!token) throw new Error(constants.NO_TOKEN)

        const resp = await fetch(`${URL}/groups/${group_id}/projects`, {
            headers: setHeaders(token)
        })

        const response = {
            payload: await resp.json(),
            error: null
        }

        res.send(JSON.stringify(response))
    } catch (error) {
        console.error('[Server]: an error occured in getProjects: ', error)

        const response = {
            error: error.message
        }

        res.status(setStatusCode(error.message))
        res.send(JSON.stringify(response))
    }
}


/**
 * Fetches a specific project. 
 * A token in the Authorization header is requred
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
projectController.getProject = async (req, res) => {
    try {
        const { project_id } = req.params
        const token = req.header('Authorization')
        console.log('[Server]: fetching project with id: ', project_id)
        
        if (!project_id) throw new Error(constants.NO_PROJECT_ID)
        if (!token) throw new Error(constants.NO_TOKEN)

        const resp = await fetch(`${URL}/projects/${project_id}`, {
            headers: setHeaders(token)
        })
    
        if (resp.status !== 200) throw new Error(constants.RESOURCE_NOT_FOUND)


        const response = {
            payload: await resp.json(),
            error: null
        }
        res.send(JSON.stringify(response))
    } catch (error) {
        const response = {
            error: error.message
        }

        res.status(setStatusCode(error.message))
        res.send(JSON.stringify(response))
    }
}

/**
 * Fetches a users projects. 
 * A token in the Authorization header is requred
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
projectController.getProjects = async (req, res) => {
    try {
        const token = req.header('Authorization')
        console.log('[Server]: fetching projects')
        
        if (!token) throw new Error(constants.NO_TOKEN)

        const resp = await fetch(`${URL}/projects`, {
            headers: setHeaders(token)
        })
    
        if (resp.status !== 200) throw new Error(constants.RESOURCE_NOT_FOUND)


        const response = {
            payload: await resp.json(),
            error: null
        }
        res.send(JSON.stringify(response))
    } catch (error) {
        console.log('error inside git fetch', error);
        const response = {
            error: error.message
        }

        res.status(setStatusCode(error.message))
        res.send(JSON.stringify(response))
    }
}

module.exports = projectController
