'use strict'
/**
 * Manages fetch requests to gitlab api.
 *
 * @author Henrik Holstad
 * @version 1.0.0
 */
const fetch = require('node-fetch')
const createError = require('http-errors')

/**
 * Expose module.
 *
 * @param {string} toFetch - A descriptive string of what to fetch. Ex 'repos', 'issues'.
 * @param {object} authType - Containing information on what authorization method to be used.
 * @param {object} data - Adittional data to be used in the url.
 * @returns {object} - Fetch result.
 */
module.exports = (toFetch, authType, data) => {
  switch (toFetch) {
    case 'repos':
      return fetchRepos(authType)

    case 'issues':
      return fetchIssues(authType, data)

    case 'comments':
      return fetchComments(authType, data)

    case 'username':
      return fetchUsername(authType)
  }
}

/**
 * Fetching repos from gitlab.
 *
 * @param {object} authType - Athourization information.
 * @returns {object} - Object containing fetched data.
 */
const fetchRepos = async (authType) => {
  try {
    const heads = _setHeaders(authType)
    const response = await fetch(process.env.WEB_URL + 'projects?min_access_level=30', {
      headers: heads
    })

    const viewData = {
      repos: (await response.json())
        .map(repo => {
          return {
            id: repo.id,
            name: repo.name,
            org: repo.namespace.full_path,
            created_at: repo.created_at,
            default_branch: repo.default_branch,
            web_url: repo.web_url,
            readme_url: repo.readme_url,
            last_activity_at: repo.last_activity_at,
            open_issues_count: repo.open_issues_count,
            namespace: {
              id: repo.namespace.id,
              name: repo.namespace.name,
              full_path: repo.namespace.full_path,
              avatar_url: repo.namespace.avatar_url,
              web_url: repo.namespace.web_url
            },
            _links: {
              self: repo._links.self,
              issues: repo._links.issues,
              merge_requests: repo._links.merge_requests,
              repo_branches: repo._links.repo_branches,
              labels: repo._links.labels,
              events: repo._links.events,
              members: repo._links.memboers
            }
          }
        })
    }

    return viewData
  } catch (error) {
    return createError(500, error)
  }
}

/**
 * Fetches issues from a given repo.
 *
 * @param {object} authType - The type of authorization (oauth or access-token).
 * @param {object} data - Data for fetching right resouces.
 * @returns {object} - An object containing username and name of user.
 */
const fetchIssues = async (authType, data) => {
  try {
    let url = ''
    const heads = _setHeaders(authType)

    if (data.url) {
      url = data.url + '?scope=all'
    } else {
      url = `${process.env.WEB_URL}projects/${data}/issues?scope=all`
    }

    const response = await fetch(url, {
      headers: heads

    })

    const issues = (await response.json())
      .map(issue => {
        return {
          id: issue.id,
          iid: issue.iid,
          description: issue.description,
          state: issue.state,
          project_id: issue.project_id,
          title: issue.title,
          created_at: issue.created_at.slice(0, 10),
          updated_at: issue.updated_at.slice(0, 10),
          closed_at: issue.closed_at,
          closed_by: issue.closed_by,
          author: {
            id: issue.author.id,
            name: issue.author.name,
            username: issue.author.username,
            web_url: issue.author.web_url
          },
          upvotes: issue.upvotes,
          downvotes: issue.downvotes,
          _links: {
            self: issue._links.self
          }
        }
      })
    return issues
  } catch (error) {
    return createError(500, error)
  }
}

/**
 * Fetches comments from a given issue.
 *
 * @param {object} authType - The type of authorization (oauth or access-token).
 * @param {object} data - Data for fetching right resouces.
 * @returns {object} - An object containing username and name of user.
 */
const fetchComments = async (authType, data) => {
  try {
    const heads = _setHeaders(authType)

    const response = await fetch(`${process.env.WEB_URL}projects/${data.repo}/issues/${data.issue}/discussions`, {
      headers: heads
    })

    const discussions = (await response.json())
      .map(discussion => {
        return {
          comment_id: discussion.id,
          notes: discussion.notes.map(notes => {
            return {
              body: notes.body,
              author: notes.author,
              updated_at: notes.updated_at,
              noteable_type: notes.noteable_type
            }
          })
        }
      })

    return discussions.flat(1)
  } catch (error) {
    return createError(500, error)
  }
}

/**
 * Fetches username and name of the logged in user.
 *
 * @param {object} authType - The type of authorization (oauth or access-token).
 * @returns {object} - An object containing username and name of user.
 */
const fetchUsername = async (authType) => {
  try {
    const heads = _setHeaders(authType)

    const userData = await fetch(process.env.WEB_URL + 'user', {
      headers: heads
    })

    const user = await userData.json()

    return {
      name: user.name,
      username: user.username
    }
  } catch (error) {
    return createError(500, error)
  }
}

/**
 * Sets the apropriate headers for the request to gitlab API.
 *
 * @param {object} authType - Express request object.
 * @returns {object} - Apropriate headers.
 */
const _setHeaders = (authType) => {
  let heads = {}
  // check if logged in with Oauth or not and sets apropriate headers
  if (authType.authorized) {
    console.log('fetched with oauth')
    heads = { Authorization: authType.token_type + ' ' + authType.access_token }
  } else {
    console.log('fetched with private token')
    heads = { 'Private-Token': process.env.PRIVATE_TOKEN }
  }
  return heads
}
