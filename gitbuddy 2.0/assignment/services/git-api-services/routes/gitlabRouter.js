'use strict'
/**
 * This router handles the API calls to gitlab.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const express = require('express')
const router = express.Router()

const groupsCtr = require('../controllers/gitlabControllers/groupsController')
const projectsCtr = require('../controllers/gitlabControllers/projectsController')
const issuesCtr = require('../controllers/gitlabControllers/issuesController')

router
    // group related routes
    // should be combined with query ?all_available=true to get all groups
    // https://docs.gitlab.com/ee/api/groups.html
    .get('/general', groupsCtr.getGeneral)
    
    .get('/groups/', groupsCtr.getGroups)
    .get('/groups/:group_id', groupsCtr.getGroup) // may be redunand
    .get('/groups/:group_id/subgroups', groupsCtr.getSubGroups) 

    // project routes
    .get('/projects', projectsCtr.getProjects)
    .get('/groups/:group_id/projects', projectsCtr.getProjectsByGroup)
    .get('/projects/:project_id', projectsCtr.getProject)

    // Issue related routes
    .get('/projects/:project_id/issues', issuesCtr.getIssues)
    .post('/projects/:project_id/issues', issuesCtr.createIssue)
    .get('/projects/:project_id/issues/:issue_id', issuesCtr.getIssue)
    .get('/projects/:project_id/issues/:issue_id/discussions', issuesCtr.getDiscussions)
    .get('/projects/:project_id/issues/:issue_id/discussions/:discussion_id', issuesCtr.getDiscussion)
    .get('/projects/:project_id/issues/:issue_id/discussions/:discussion_id/notes', issuesCtr.getNote)
    .post('/projects/:project_id/issues/:issue_id/discussions/:discussion_id/notes', issuesCtr.createNote)
    .put('/projects/:project_id/issues/:issue_id/discussions/:discussion_id/notes/:note_id', issuesCtr.changeNote)
    .delete('/projects/:project_id/issues/:issue_id/discussions/:discussion_id/notes/:note_id', issuesCtr.removeNote)
    
    // TODO implement these endpoints
    // merge request related routes
    .get('/projects/:project_id/merge_requests', groupsCtr.getUserInfo)
    .get('/merge_requests/:merge_request_id', groupsCtr.getUserInfo)
    .get('/merge_requests/:merge_request_id/discussions', groupsCtr.getUserInfo)
    .post('/merge_requests/:merge_request_id/discussions', groupsCtr.getUserInfo)
    // resolve/unresolve a merge request thread, takes a reqsolved query with a boolean
    .put('/merge_requests/:merge_request_id/discussions/:discussion_id', groupsCtr.getUserInfo)
    .post('/merge_requests/:merge_request_iid/discussions/:discussion_id/notes', groupsCtr.getUserInfo)
    .delete('/merge_requests/:merge_request_iid/discussions/:discussion_id/notes', groupsCtr.getUserInfo)
    // commit related routes

    module.exports = router
