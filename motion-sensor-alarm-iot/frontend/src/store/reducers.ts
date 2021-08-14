import * as actionTypes from './actionTypes'
import { updateObject } from './utils'

const initialState = {
    isAuthenticated: false,
    email: null,
    error: null,
    loading: false, 
}

const authStart = (state: any, action: any) => {
    return updateObject(state, {error: null, loading: true})
}

const authSuccess = (state: any, action: any) => {
    return updateObject(state, {
        isAuthenticated: true, 
        email: action.authData.user.email,
        error: null,
        loading: false
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

const checkSessionStart = (state: any, action: any) => {
    return updateObject(state, {error: null, loading: true})
}

const checkSessionSuccess = (state: any, action: any) => {
    return updateObject(state, {
        isAuthenticated: true, 
        error: null,
        loading: false
    })
}

const checkSessionFail = (state: any, action: any) => {
    return updateObject(state, {
        isAuthenticated: false, 
        email: null,
        firstName: null,
        error: true,
        loading: false
    })
}

const logout = (state: any, action: any) => {
    return updateObject(state, initialState)
}

const authReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state, action)
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action)
        case actionTypes.AUTH_FAIL: return authFail(state, action)
        case actionTypes.AUTH_LOGOUT: return logout(state, action)
        case actionTypes.CHECK_SESSION_START: return checkSessionStart(state, action)
        case actionTypes.CHECK_SESSION_SUCCESS: return checkSessionSuccess(state, action)
        case actionTypes.CHECK_SESSION_FAIL: return checkSessionFail(state, action)
        default: return state
    }
}

export default authReducer
