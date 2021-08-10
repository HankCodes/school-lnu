
module.exports = (body) => {
    
    // TODO These objectr esponses is not neccecary here, tehre is just notifications and they do not need this much info.
    // These obejcts are more suitable in the git-api service
    if (body.object_kind === 'push') {
       return {
            gitService: 'gitlab',
            eventName: body.object_kind,
            payload: {
                user: {
                    id: body.user_id,
                    name: body.user_name,
                    email: body.user_email,
                    avatar: body.user_avatar,
                },
                project: {
                    id: body.project.id,
                    name: body.project.name,
                    description: body.project.description,
                    url: body.project.web_url,
                    avatar: body.project.avatar_url,
                    
                },
                commits: body.commits
                
            }
        }
    } else if (body.object_kind === 'issue') {
        return {
            gitService: 'gitlab',
            eventName: body.object_kind,
            payload: {
                user: {
                    id: body.user.id,
                    name: body.user.name,
                    username: body.user.username,
                    email: body.user.email,
                    avatar: body.user.avatar_url,
                },
                project: {
                    id: body.project.id,
                    name: body.project.name,
                    description: body.project.description,
                    url: body.project.web_url,
                    avatar: body.project.avatar_url,
                    
                },
                issue: {
                    closedAt: body.object_attributes.closed_at,
                    createdAt: body.object_attributes.created_at,
                    title: body.object_attributes.title,
                    description: body.object_attributes.description,
                    dueDate: body.object_attributes.due_date,
                    id: body.object_attributes.id,
                    iid: body.object_attributes.iid,
                    lastEditedAt: body.object_attributes.last_edited_at,
                    lastEditedById: body.object_attributes.last_edited_by_id,
                    url: body.object_attributes.url,
                    state: body.object_attributes.state
                }
            }
        }
    } else if (body.object_kind === 'note') {
        return {
            gitService: 'gitlab',
            eventName: body.object_kind,
            payload: {
                user: {
                    id: body.user.id,
                    name: body.user.name,
                    username: body.user.username,
                    email: body.user.email,
                    avatar: body.user.avatar_url,
                },
                project: {
                    id: body.project.id,
                    name: body.project.name,
                    description: body.project.description,
                    url: body.project.web_url,
                    avatar: body.project.avatar_url,
                    
                },
                issue: {
                    closedAt: body.issue.closed_at,
                    createdAt: body.issue.created_at,
                    title: body.issue.title,
                    description: body.issue.description,
                    dueDate: body.issue.due_date,
                    id: body.issue.id,
                    iid: body.issue.iid,
                    lastEditedAt: body.issue.last_edited_at,
                    lastEditedById: body.issue.last_edited_by_id,
                    url: body.issue.url,
                    state: body.issue.state
                },
                note: {
                    createdAt: body.object_attributes.created_at,
                    description: body.object_attributes.note,
                    noteableType: body.object_attributes.noteable_type
                }
            }
        }
    } 
    return {}
}