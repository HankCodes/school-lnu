
declare interface ICredentials {
    email: string,
    passphrase: string
}

declare interface IGitConf {
    gitService: string,
    getRepositoriesUrl: (groupId: string) => string,
    getRepositoryUrl: (projectId: string) => string,
    getOrganizationsUrl: () => string,
    getWebhookUrl: (projectId: string, hookId?: string, query?: string) => string,
    getCreateWebhookUrl: (projectId: string, repoUrl: string) => string 
}

declare interface INotification {
    createdAt: string, 
    gitUrl:  string,
    title: string,
    type: string,
}