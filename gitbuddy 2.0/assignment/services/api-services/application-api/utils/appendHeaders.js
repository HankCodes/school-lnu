'use strict'

module.exports = (req) => {
    const authorizationHeader = req ? 
       { Authorization: req.header('Authorization') } : {}
       
    return {
        ...authorizationHeader,
        'X-GITBUDDY-TOKEN': process.env.GITBUDDY_TOKEN
    }
}