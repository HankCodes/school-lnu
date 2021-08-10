'use strict'

const fetch = require('node-fetch')
const constants = require('../../utils/constants')
const { 
    setHeaders, 
    setStatusCode,
    fetchGitlab,
    logger
     } = require('../../utils/utils')

const issuesController = {}
const URL = 'https://gitlab.lnu.se/api/v4'



/**
 * Fetches all the issues of a secific project.
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
issuesController.getIssues = async (req, res) => {
    try {
        const { project_id } = req.params
        const token = req.header('Authorization')
        console.log('[Server]: fetching issues from the projet id: ', project_id)
        
        if (!project_id) throw new Error(constants.NO_PROJECT_ID)
        if (!token) throw new Error(constants.NO_TOKEN)

        const resp = await fetchGitlab(`/projects/${project_id}/issues`, {
            headers: setHeaders(token)
        })

        const response = {
            payload: resp,
            error: null
        }

        res.send(JSON.stringify(response))
    } catch (error) {
        logger('[Server]: an error occured in getProjects: ', error)

        const response = {
            error: error.message
        }

        res.status(setStatusCode(error.message))
        res.send(JSON.stringify(response))
    }
}


/**
 * Creates an issue.
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
issuesController.createIssue = async (req, res) => {
    try {
        const { project_id, issue_id } = req.params
        // TODO rend body with request
        const { body } = req.body
        const token = req.header('Authorization')
        console.log('[Server]: fetching issue with id: ', issue_id)
        
        if (!token) throw new Error(constants.NO_TOKEN)
        if (!project_id) throw new Error(constants.NO_PROJECT_ID)
        if (!issue_id) throw new Error(constants.NO_ISSUE_ID)

        const resp = await fetchGitlab(`/issues/${issue_id}`, {
            headers: setHeaders(token),
        })

        const response = {
            payload: await resp,
            error: null
        }
        res.send(JSON.stringify(response))
    } catch (error) {
        logger('[Server]: Error in createIssue: ', error)

        const response = {
            error: error.message
        }

        res.status(setStatusCode(error.message))
        res.send(JSON.stringify(response))
    }
}

/**
 * Fetches a specific issue.
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
issuesController.getIssue = async (req, res) => {
    try {
        const { project_id, issue_id } = req.params
        const token = req.header('Authorization')
        console.log('[Server]: fetching issue with id: ', issue_id)
        
        if (!project_id) throw new Error(constants.NO_PROJECT_ID)
        if (!issue_id) throw new Error(constants.NO_ISSUE_ID)
        if (!token) throw new Error(constants.NO_TOKEN)

        const resp = await fetchGitlab(`/projects/${project_id}/issues/${issue_id}`, {
            headers: setHeaders(token)
        })
    

    const response = {
        payload: await resp,
        error: null
    }
        res.send(JSON.stringify(response))
    } catch (error) {
        logger('[Server]: Error in getIssue', error)

        const response = {
            error: error.message
        }

        res.status(setStatusCode(error.message))
        res.send(JSON.stringify(response))
    }
}

/**
 * Fetches the discussions of an issue.
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
issuesController.getDiscussions = async (req, res) => {
    try {
        const { project_id, issue_id } = req.params
        const token = req.header('Authorization')
        console.log('[Server]: fetching discussion from issue with id: ', issue_id)
        
        if (!token) throw new Error(constants.NO_TOKEN)
        if (!project_id) throw new Error(constants.NO_project_ID)
        if (!issue_id) throw new Error(constants.NO_ISSUE_ID)

        const resp = await fetchGitlab(`/projects/${project_id}/issues/${issue_id}/discussions`, {
            headers: setHeaders(token)
        })
    

    const response = {
        payload: await resp,
        error: null
    }
        res.send(JSON.stringify(response))
    } catch (error) {
        logger('[Server]: Error in getDiscussions', error)

        const response = {
            error: error.message
        }

        res.status(setStatusCode(error.message))
        res.send(JSON.stringify(response))
    }
}

/**
 * Fetches a specific discussion.
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
issuesController.getDiscussion = async (req, res) => {
    try {
        const { project_id, issue_id, discussion_id } = req.params
        const token = req.header('Authorization')
        console.log('[Server]: fetching discussion from issue with id: ', issue_id)
        
        if (!token) throw new Error(constants.NO_TOKEN)
        if (!project_id) throw new Error(constants.NO_project_ID)
        if (!issue_id) throw new Error(constants.NO_ISSUE_ID)
        if (!discussion_id) throw new Error(constants.NO_DISCUSSION_ID)

        const resp = await fetchGitlab(`/projects/${project_id}/issues/${issue_id}/discussions/${discussion_id}`, {
            headers: setHeaders(token)
        })
    

        const response = {
            payload: await resp,
            error: null
        }

        res.send(JSON.stringify(response))
    } catch (error) {
        logger('[Server]: Error in getDiscussion', error)
    
        const response = {
            error: error.message
        }

        res.status(setStatusCode(error.message))
        res.send(JSON.stringify(response))
    }
}

/**
 * Creates a note on a discussion.
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
issuesController.getNote = async (req, res) => {
    try {
        const { project_id, 
                issue_id, 
                discussion_id
             } = req.params
        
        const token = req.header('Authorization')
        console.log('[Server]: Fetching note on discussion  with id: ', discussion_id)
        
        if (!token) throw new Error(constants.NO_TOKEN)
        if (!project_id) throw new Error(constants.NO_project_ID)
        if (!issue_id) throw new Error(constants.NO_ISSUE_ID)
        if (!discussion_id) throw new Error(constants.NO_DISCUSSION_ID)

        // TODO check response body for correct values
        const resp = await fetchGitlab(`/projects/${project_id}/issues/${issue_id}/discussions/${discussion_id}/notes`, {
            headers: setHeaders(token)
        })
    

        const response = {
            payload: resp,
            error: null
        }

        res.send(JSON.stringify(response))
    } catch (error) {
        logger('[Server]: Error in getNote', error)
        
        const response = {
            error: error.message
        }

        res.status(setStatusCode(error.message))
        res.send(JSON.stringify(response))
    }
}

/**
 * Creates a note on a discussion.
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
issuesController.createNote = async (req, res) => {
    try {
        const { project_id, 
                issue_id, 
                discussion_id
             } = req.params
        const { body } = req.body
        
        const token = req.header('Authorization')
        console.log('[Server]: Creating note on discussion  with id: ', discussion_id)
        
        if (!token) throw new Error(constants.NO_TOKEN)
        if (!project_id) throw new Error(constants.NO_project_ID)
        if (!issue_id) throw new Error(constants.NO_ISSUE_ID)
        if (!discussion_id) throw new Error(constants.NO_DISCUSSION_ID)

        // TODO check response body for correct values
        const resp = await fetchGitlab(`/projects/${project_id}/issues/${issue_id}/discussions/${discussion_id}/notes`, {
            method: 'POST',
            headers: setHeaders(token),
            body: JSON.stringify(body)
        })
    

        const response = {
            status: 'success',
            error: null
        }

        res.send(JSON.stringify(response))
    } catch (error) {
        logger('[Server]: Error in createNote', error)
        
        const response = {
            error: error.message
        }

        res.status(setStatusCode(error.message))
        res.send(JSON.stringify(response))
    }
}

/**
 * Edits a note on a discussion.
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
issuesController.changeNote = async (req, res) => {
    try {
        const { project_id, 
                issue_id, 
                discussion_id
             } = req.params
        const { body } = req.body
        
        const token = req.header('Authorization')
        console.log('[Server]: Changing note on discussion  with id: ', discussion_id)
        
        if (!token) throw new Error(constants.NO_TOKEN)
        if (!project_id) throw new Error(constants.NO_project_ID)
        if (!issue_id) throw new Error(constants.NO_ISSUE_ID)
        if (!discussion_id) throw new Error(constants.NO_DISCUSSION_ID)

        // TODO check response body for correct values
        const resp = await fetchGitlab(`/projects/${project_id}/issues/${issue_id}/discussions/${discussion_id}/notes`, {
            method: 'PUT',
            headers: setHeaders(token),
            body: JSON.stringify(body)
        })
        
        const response = {
            status: 'success',
            error: null
        }

        res.send(JSON.stringify(response))
    } catch (error) {
        logger('[Server]: Error in changeNote', error)

        const response = {
            error: error.message
        }

        res.status(setStatusCode(error.message))
        res.send(JSON.stringify(response))
    }
}

/**
 * Edits a note on a discussion.
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
issuesController.removeNote = async (req, res) => {
    try {
        const { project_id, 
                issue_id, 
                discussion_id,
                note_id
             } = req.params
        
        
        const token = req.header('Authorization')
        console.log('[Server]: Changing note on discussion  with id: ', discussion_id)
        
        if (!token) throw new Error(constants.NO_TOKEN)
        if (!project_id) throw new Error(constants.NO_project_ID)
        if (!issue_id) throw new Error(constants.NO_ISSUE_ID)
        if (!discussion_id) throw new Error(constants.NO_DISCUSSION_ID)
        if (!note_id) throw new Error(constants.NO_NOTE_ID)

        await fetchGitlab(`/projects/${project_id}/issues/${issue_id}/discussions/${discussion_id}/notes${note_id}`, {
            method: 'DELETE',
            headers: setHeaders(token),
        })
    

        const response = {
            status: 'success',
            error: null
        }
        res.send(JSON.stringify(response))
    } catch (error) {
        logger('[Server]: Error in removeNote', error)

        const response = {
            error: error.message
        }

        res.status(setStatusCode(error.message))
        res.send(JSON.stringify(response))
    }
}

module.exports = issuesController
