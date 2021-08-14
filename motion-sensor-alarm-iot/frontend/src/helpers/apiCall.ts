
export const authenticate = async (credentials: ICredentials): Promise<any> => {
   try {
      const resp = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      return resp.json()
    } catch (error) {
      console.log('Error in apiCall.authenticate')

      return { error: 'apiCall.authenticate error' }
    } 
}

export const checkCurrentSession = async (): Promise<any> => {
   try {
      const resp = await fetch('/api/user/session')

      return resp.json()
    } catch (error) {
      console.log('Error in apiCall.authenticate')

      return { error: 'apiCall.authenticate error' }
    } 
}

export const signup = async (credentials: ICredentials): Promise<any> => {
   try {
       const resp = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      return resp.json()
    } catch (error) {
      console.log('Error in apiCall.signup')

      return { error: 'apiCall.signup error' }
    } 
}

export const logout = async (): Promise<any> => {
   try {
       const resp = await fetch('/api/user/logout')

      return resp.json()
    } catch (error) {
      console.log('Error in apiCall.logout')

      return { error: 'apiCall.logout error' }
    } 
}

export const claimDevice = async (device: string): Promise<any> => {
   try {
     
      const resp = await fetch('/api/device/claim', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ deviceName: device })
      })

      return resp.json()
    } catch (error) {
      console.log('Error in apiCall.claim')

      return { error: 'apiCall.claim error' }
    } 
}

export const getDevices = async (): Promise<any> => {
   try {
     console.log('inside call to get devices');
     
      const resp = await fetch('/api/user/devices')

      return resp.json()
    } catch (error) {
      console.log('Error in apiCall.getDevice')

      return { error: 'Could not load devices' }
    } 
}

export const getLogs = async (deviceId: string): Promise<any> => {
    try {
      console.log('inside call to get device logs');
     
      const resp = await (await fetch('/api/user/logs/' + deviceId)).json()

      if (resp.error) return resp

      const logs:ILog[] = resp.logs.map((log: ILog) => {
        return {
          createdAt: log.createdAt,
          logMessage: log.logMessage,
          type: log.logMessage 
        }
      })
      

      return logs 
    } catch (error) {
      console.log('Error in apiCall.getDevice')

      return { error: 'Could not load devices' }
    } 
}