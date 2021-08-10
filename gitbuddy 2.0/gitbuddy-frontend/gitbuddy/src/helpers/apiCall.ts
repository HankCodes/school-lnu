import setHeaders from './setHeaders'
import constants from './constants'
import { urlBase64ToUint8Array } from './urlBase64Touint8Array'

export const authenticate = async (credentials: ICredentials): Promise<any> => {
   try {
      const resp = await fetch(constants.authenticate, {
        method: 'POST',
        headers: {
            ...setHeaders()
            },
        body: JSON.stringify(credentials)
      })

      return resp.json()
    } catch (error) {
      return { error: 'apiCall.authenticate error' }
    } 
}


export const signup = async (credentials: ICredentials): Promise<any> => {
   try {
       const resp = await fetch('https://gitbuddy.net/api/account', {
        method: 'POST',
        headers: {
              ...setHeaders()
            },
        body: JSON.stringify(credentials)
      })

      return resp.json()
    } catch (error) {
      return { error: 'apiCall.signup error' }
    } 
}

export const logout = async (): Promise<any> => {
   try {
       const resp = await fetch('https://gitbuddy.net/api/account/logout', {
        method: 'POST',
        headers: {
              ...setHeaders()
            },
      })

      return resp.json()
    } catch (error) {
      return { error: 'apiCall.logout error' }
    } 
}

export const oauthFlow = async (gitService: string): Promise<any> => {
   try {
       const resp = await fetch(`https://gitbuddy.net/api/account/${gitService}/oauth`, {
        headers: {
              ...setHeaders()
            }
      })

      return await resp.json()
    } catch (error) {
      return { error: 'apiCall.oauthFlow error' }
    } 
}

export const getGitUserProfile = async (gitService: string): Promise<any> => {
   try {
       const resp = await fetch(`https://gitbuddy.net/api/account/${gitService}/verify`, {
        headers: {
              ...setHeaders(gitService)
            }
      })

      return await resp.json()
    } catch (error) {
      return { error: 'apiCall.oauthFlow error' }
    } 
}



export const fetchGit = async (gitService: string, url: string): Promise<any> => {
   try {
       const resp = await fetch(`https://gitbuddy.net/api/git/${gitService}${url}`, {
        headers: {
              ...setHeaders(gitService)
            }
      })

      return await resp.json()
    } catch (error) {
      return { error: 'apiCall.fecthGit error' }
    } 
}

export const fetchWebhook = async (gitService: string, url: string) =>{
  try {
    const resp = await fetch(`https://gitbuddy.net/api/webhook/${gitService}${url}`, {
      headers: {
            ...setHeaders(gitService)
          }
    })

    return resp.json()
  } catch (error) {
    return { error: 'apiCall.fecthWebhook error' }
  }
}

export const updateWebhook = async (gitService: string, url: string) =>{
  try {
    const resp = await fetch(`https://gitbuddy.net/api/webhook/${gitService}${url}`, {
      method: 'put',
      headers: {
            ...setHeaders(gitService)
          }
    })

    return resp.json()
  } catch (error) {
    return { error: 'apiCall.updateWebhook error' }
  }
}

export const createWebhook = async (gitService: string, url: string) =>{
  try {
    const resp = await fetch(`https://gitbuddy.net/api/webhook/${gitService}${url}`, {
      method: 'post',
      headers: {
            ...setHeaders(gitService)
          }
    })

    return resp.json()
  } catch (error) {
    return { error: 'apiCall.updateWebhook error' }
  }
}

// Webpush
export const getWebPushKey = async (): Promise<Uint8Array | { error: string }> =>{
  try {
    const response = await ( await fetch('api/push/key')).json()
    const vapidPublicKey = await response.key;

    return urlBase64ToUint8Array(vapidPublicKey);
  } catch (error) {
    return { error: 'apiCall.updateWebhook error' }
  }
}

export const registerWebPush = async (subscription: PushSubscription): Promise<{ status: string } | { error: string } > =>{
  try {
    const resp: any = await fetch('api/push/register', {
        method: 'post',
        headers: {
        'content-type': 'application/json'
        },
        body: JSON.stringify({
            subscription: subscription
        })
    })

    if (resp.error) throw new Error('Could not complete the request')

    return { status: 'success' }
  } catch (error) {
    return { error: 'apiCall.registerWebPush error' }
  }
}

export const unregisterWebPush = async (): Promise<{ status: string } | { error: string } > =>{
  try {
    const resp: any = await fetch('api/push/unregister', {
        method: 'post',
        headers: {
        'content-type': 'application/json'
        }
    })

    if (resp.error) throw new Error('Could not complete the request')

    return { status: 'success' }
  } catch (error) {
    return { error: 'apiCall.unregisterWebPush error' }
  }
}

export const getNotifications = async (gitService: string): Promise<{ status: string, payload: any } | { error: string } > =>{
  try {
    const resp: any = await (await fetch(`https://gitbuddy.net/api/account/${gitService}/notifications`, {
      headers: {
            ...setHeaders(gitService)
          }
    })).json()

    if (resp.error) throw new Error('Could not complete the request')

    return resp 
  } catch (error) {
    return { error: 'apiCall.getNotifications error' }
  }
}

export const registerReadNotifications = async (gitService: string): Promise<any> =>{
  try {
    const resp: any = await (await fetch(`https://gitbuddy.net/api/account/${gitService}/notifications`, {
      method: 'post',
      headers: {
            ...setHeaders(gitService)
          }
    })).json()

    if (resp.error) throw new Error('Could not complete the request')

    return resp 
  } catch (error) {
    return { error: 'apiCall.unregisterWebPush error' }
  }
}
