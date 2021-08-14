declare interface ICredentials {
    email: string,
    passphrase: string
}

declare interface IDevice {
    deviceId: string,
    ip: string,
    port: string
}

declare interface ILog {
    createdAt: string,
    logMessage: string,
    type: 'activated' | 'deactivated' | 'triggered' 
}
