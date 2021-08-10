import * as actionTypes from './actionTypes'
import { updateObject } from './utils'

const initialState = {
    isAuthenticated: false,
    email: null,
    firstName: null,
    error: null,
    loading: true, 
    hasGitlabToken: false, 
    hasGithubToken: false, 
    hasBitbucketToken: false,
    gitUserProfiles: {
        gitlab: null,
        github: null,
        bitbucket: null
    }
}

const getGituserProfileStart = (state: any, action: any) => {
    return updateObject(state, {
         loading: true,
         error: null
    })
}

const getGituserProfileSuccess = (state: any, action: any) => {
    // TODO make this more generic instead of hardcoding values for gitlab
    return {
        ...state,
         loading: false, 
         hasGitlabToken: true,
         error: null,
         gitUserProfiles: {
            ...state.gitUserProfiles,
             gitlab: action.data.user
         }
    } 
}

const getGituserProfileFail = (state: any, action: string) => {
    // TODO make this more generic instead of hardcoding values for gitlab
    return updateObject(state, {
         loading: false, 
         hasGitlabToken: false,
         error:'Could not load git user profile' 
    })
}

const authStart = (state: any, action: any) => {
    return updateObject(state, {error: null, loading: true})
}

const authSuccess = (state: any, action: any) => {
    return updateObject(state, {
        isAuthenticated: true, 
        email: action.authData.user.email,
        error: null,
        loading: false,
        hasGitlabToken: !!action.authData.token
        
    })
}

const authFail = (state: any, action: any) => {
    return updateObject(state, {
        isAuthenticated: false, 
        email: null,
        firstName: null,
        error: action.error,
        loading: false
    })
}

const logout = (state: any, action: any) => {
    return updateObject(state, initialState)
}

const oauthStart = (state: any, action: any) => {
    return updateObject(state, {
        error: null,
        loading: true 
    })
}

const oauthSuccess = (state: any, action: any) => {
    return updateObject(state, {
        hasGitlabToken: true, 
        error: null,
        loading: false
    })
}

const oauthFail = (state: any, action: any) => {
    return updateObject(state, {
        hasGitlabToken: false, 
        error: action.error,
        loading: false
    })
}

const hasToken = (state: any, action: any) => {
    return updateObject(state, {
        hasGitlabToken: true, 
        error: null
    })
}

const checkSessionSuccess = (state: any, action: any) => {
    return updateObject(state, {
        loading: false,
        isAuthenticated:true,
        error: null,
        hasGitlabToken: action.tokens.hasGitlabToken, 
        hasGithubToken: action.tokens.hasGithubToken, 
        hasBitbucketToken: action.tokens.hasBitbucketToken, 
    })
}

const checkSessionFail = (state: any, action: any) => {
    return updateObject(state, {
        loading: false,
        isAuthenticated: false,
        error: action.error
    })
}

const authReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state, action)
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action)
        case actionTypes.AUTH_FAIL: return authFail(state, action)
        case actionTypes.AUTH_CHECK_SUCCESS: return authSuccess(state, action)
        case actionTypes.AUTH_LOGOUT: return logout(state, action)
        case actionTypes.OAUTH_HAS_TOKEN: return hasToken(state, action)
        case actionTypes.OAUTH_START: return oauthStart(state, action)
        case actionTypes.OAUTH_SUCCESS: return oauthSuccess(state, action)
        case actionTypes.OAUTH_FAIL: return oauthFail(state, action)
        case actionTypes.CHECK_SESSION_SUCCESS: return checkSessionSuccess(state, action)
        case actionTypes.CHECK_SESSION_FAIL: return checkSessionFail(state, action)
        case actionTypes.GET_GIT_USER_SUCCESS: return getGituserProfileSuccess(state, action)
        case actionTypes.GET_GIT_USER_START: return getGituserProfileStart(state, action)
        case actionTypes.GET_GIT_USER_FAIL: return getGituserProfileFail(state, action)
        default: return state
    }
}

export default authReducer
