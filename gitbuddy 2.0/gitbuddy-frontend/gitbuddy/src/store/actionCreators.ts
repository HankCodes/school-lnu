import * as actionTypes from './actionTypes'
import { authenticate, 
    logout as apiCallLogout, 
    oauthFlow, 
    getGitUserProfile as apiCallGetGitUserProfile
    } from '../helpers/apiCall'

export const gitUserStart = () => {
    return {
        type: actionTypes.GET_GIT_USER_START
    }
}

export const gitUserSuccess = (data: any) => {
    return {
        type: actionTypes.GET_GIT_USER_SUCCESS,
        data: data 
    }
}


export const gitUserFail = (gitService: string) => {
    return {
        type: actionTypes.GET_GIT_USER_FAIL,
        data: gitService 
    }
}

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (authData: any) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        authData: authData
    }
}

export const authFail = (error: any) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logOut = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const getGitUserProfile = () => {
    return async (dispatch: any) => {
        try {
            // TODO make this more generic instead of hardcoding gitlab
            dispatch(gitUserStart())
            const gitlabToken = localStorage.getItem('gitlab_token')
            
            if (!gitlabToken) {
                dispatch(gitUserFail('gitlab'))
            } else {
                const resp = await apiCallGetGitUserProfile('gitlab') 

                if (resp.error) throw new Error('fail')

                dispatch(gitUserSuccess(resp.payload))
            }
        } catch (error) {
                console.log('getGituserprofile error', error);
            dispatch(gitUserFail('gitlab'))
        } 
    }
}
// authentication logic
export const logout = () => {
    return async (dispatch: any) => {
        try {
            localStorage.removeItem('gitbuddy')
            await apiCallLogout()

            dispatch(logOut())
        } catch (error) {
           dispatch(logOut())
        } 
    }
}

export const auth = (credentials: ICredentials) => {
    return (dispatch: any) => {
        dispatch(authStart())
        
        authenticate(credentials).then( resp =>  {
            if (resp.message === 'success') {
                localStorage.setItem('gitbuddy', 'active')
                resp.token = localStorage.getItem('gitlab_token') 
                dispatch(authSuccess(resp))
            } else {
                dispatch(authFail(resp.error))
            }
        }).catch(error => {
            console.log('error inside auth action creator: ', error)
            dispatch(authFail(error))
        })
    }
}

// Oauth logic
export const oauthStart = (gitService: string) => {
    return {
        type: actionTypes.OAUTH_START,
        gitService: gitService
    }
}

export const oauthSuccess = (gitService: any) => {
    return {
        type: actionTypes.OAUTH_SUCCESS,
        gitService: gitService
    }
}

export const oauthFail = (error: any) => {
    return {
        type: actionTypes.OAUTH_FAIL,
        error: error
    }
}

export const hasToken = (token: any) => {
    return {
        type: actionTypes.OAUTH_HAS_TOKEN,
        token: token 
    }
}

export const urlHasToken = (token: any) => {
    return (dispatch: any) => {
        localStorage.setItem('gitlab_token', token)
        
        dispatch(hasToken(token))
    }
}

export const oauth = (gitService: string) => {
    return (dispatch: any) => {
        try {
            dispatch(oauthStart(gitService))
            oauthFlow(gitService)
        } catch (error) {
            console.log('error in actionCreatirs.oauth : Could not sync ' + gitService);
            
            dispatch(oauthFail({ error: 'Could not sync ' + gitService }))
        }
    }
}

export const checkSessionSuccess = (tokens: any) => {
    return {
        type: actionTypes.CHECK_SESSION_SUCCESS,
        tokens: tokens
    }
}

export const checkSessionFail = () => {
    return {
        type: actionTypes.CHECK_SESSION_FAIL,
        error: 'cannot get session'
    }
}

export const checkSession = () => {
    return (dispatch: any) => {
        const isLoggedIn = Boolean(localStorage.getItem('gitbuddy'))
        const hasGitlabToken = Boolean(localStorage.getItem('gitlab_token')) 
    
        // TODO Add a more generic solution when other services are implemented
        const tokens = {
                hasGitlabToken: hasGitlabToken,
                hasGithubToken: false,
                hasBitbucketToken: false
        } 

        isLoggedIn ?
            dispatch(checkSessionSuccess(tokens)) :
            dispatch(checkSessionFail())
    } 
}
