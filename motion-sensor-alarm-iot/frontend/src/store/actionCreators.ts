import * as actionTypes from './actionTypes'
import { authenticate, checkCurrentSession, logout as apiCallLogout  } from '../helpers/apiCall'


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

export const checkSessionStart = () => {
    return {
        type: actionTypes.CHECK_SESSION_START,
    }
}

export const checkSessionSuccess = () => {
    return {
        type: actionTypes.CHECK_SESSION_SUCCESS
    }
}

export const checkSessionFail = () => {
    return {
        type: actionTypes.CHECK_SESSION_FAIL
    }
}

export const logOut = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

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
    return async (dispatch: any) => {
        try {
            dispatch(authStart())
            
            const resp = await authenticate(credentials)
                
            resp.error ?
                dispatch(authFail(resp.error)) :
                dispatch(authSuccess(resp))
        } catch (error) {
            console.log('error inside auth action creator: ')
            dispatch(authFail(error))
        }
    }
}

export const checkSession = () => {
    return async (dispatch: any) => {
        try {
            dispatch(checkSessionStart())
           
            const resp = await checkCurrentSession()
                
            resp.error ?
                dispatch(checkSessionFail()) :
                dispatch(checkSessionSuccess())
        } catch (error) {
            console.log('error inside auth action creator: ')
            dispatch(checkSessionFail())
        }
    }
}
