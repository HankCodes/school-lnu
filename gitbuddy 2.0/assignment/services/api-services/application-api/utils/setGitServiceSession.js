'use strict'

const gitlab = ({ username, id, isTokenValid }) => {
    return {
        username,
        id,
        isTokenValid
    }
}
module.exports = (gitService, sessionUser, gitUser) => {
    switch (gitService) {
        case 'gitlab':
            return {
                ...sessionUser,
                gitServices: {
                    ...sessionUser.gitServices,
                    gitlab: gitlab(gitUser)
                }
            }     
    
        default:
            throw new Error('[getGitServiceSessionObject]: Not a valid service ' + gitService)
    }
}