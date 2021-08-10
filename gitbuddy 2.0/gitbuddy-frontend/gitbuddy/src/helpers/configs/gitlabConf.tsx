const getProjectUrl = (projectId: string): string => {
    return `/projects/${projectId}` 
}

const getProjectsUrl = (groupId: string): string => {
    return `/groups/${groupId}/projects` 
}


const getGroupsUrl = (): string => {
    return `/groups` 
}

const getWebhookUrl = (projectId: string, hookId?: string, query?: string): string => {
    return `/project/${projectId}/hook` + (hookId ? `/${hookId}` : '' ) + (query ? `?${query}` : '') 
}

const getCreateWebhookUrl = (projectId: string, repoUrl: string): string => {
    return `/project/${projectId}/hook?web-url=${repoUrl}` 
}

const gitlabConf: IGitConf = {
    gitService: 'gitlab',
    getRepositoryUrl: getProjectUrl,
    getRepositoriesUrl: getProjectsUrl,
    getOrganizationsUrl: getGroupsUrl,
    getWebhookUrl: getWebhookUrl,
    getCreateWebhookUrl: getCreateWebhookUrl
}

export default gitlabConf 