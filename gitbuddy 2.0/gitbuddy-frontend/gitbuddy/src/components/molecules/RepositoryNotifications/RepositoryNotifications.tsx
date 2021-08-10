import React, { useEffect, useState } from 'react'
import { createWebhook, fetchWebhook, updateWebhook } from '../../../helpers/apiCall'
import StandardButton from '../forms/buttons/StandardButton/StandardButton'
import StandardForm from '../forms/StandardForm/StandardForm'
import './RepositoryNotifications.css'

interface Notifications {
    id: string,
    types: {
        issues_events: boolean, 
        push_events: boolean, 
        merge_requests_events: boolean, 
        releases_events: boolean, 
        note_events: boolean, 
        [key: string]: boolean 
    }
}

interface IProps {
    repo: any,
    gitConf: IGitConf
}

const RepositoryNotifications: React.FC<IProps> = ({ repo, gitConf }) => {
    const [ isLoading, setIsLoading ] = useState<boolean>(true)
    const [ webhooks, setWebhooks ] = useState<Notifications[]>([])
    const [ hookToUpdate, setHookToUpdate ] = useState<string>('')
    const [ createHook, setCreateHook ] = useState<boolean>(false)
    const { gitService, getWebhookUrl, getCreateWebhookUrl } = gitConf
    const { id, web_url } = repo
    
    const webhookPropertyMap = (webhookObject: any): Notifications => {
        return {
            id: webhookObject.id,
            types: {
                issues_events: !!webhookObject.issues_events,
                push_events: !!webhookObject.push_events,
                merge_requests_events: !!webhookObject.merge_requests_events,
                releases_events: !!webhookObject.releases_events,
                note_events: !!webhookObject.note_events,
            }
        }
    }
    
    const fromObjectToQueryParams = (webhooks: Notifications[], hookId: string): string => {
        const webhook: Notifications | undefined = webhooks.find((hook: Notifications) => hook.id === hookId)

        return webhook ? Object.entries(webhook.types).map(([key, value]) => key + "=" + value).join('&') : ''
    }

    useEffect(() =>{
        const getCurrentNotififcations = async () => {
            setIsLoading(true)
            const resp =  await fetchWebhook(gitService, getWebhookUrl(id)) 

            const mappedWebhooks: Notifications[] = Array.isArray(resp) ?
                resp.map((webhook: any) => webhookPropertyMap(webhook)) : []

            setWebhooks(mappedWebhooks)
            setIsLoading(false)
        }

        id && getCurrentNotififcations()
        
    }, [id, gitService, getWebhookUrl])

    useEffect(() => {
        if (hookToUpdate) {
            const update = async () => {
                const hookParams = fromObjectToQueryParams(webhooks, hookToUpdate)
                await updateWebhook(gitService, getWebhookUrl(id, hookToUpdate, hookParams))
            }

            setHookToUpdate('')
            update()
        }

        if (createHook && !isLoading) {
            const create = async () => {
                setIsLoading(true)
                const resp = await createWebhook(gitService, getCreateWebhookUrl(id, web_url))
                
                const mappedWebhooks: Notifications[] = Array.isArray(resp) ?
                    resp.map((webhook: any) => webhookPropertyMap(webhook)) : [webhookPropertyMap(resp)]

                setWebhooks(mappedWebhooks)
                setIsLoading(false)
            }

            create()
            setCreateHook(false)
        }
    }, [isLoading, hookToUpdate, id, gitService, getWebhookUrl, webhooks, createHook, getCreateWebhookUrl, web_url])

    const _onChange = (index: number, key: string) => {
        const curerntHooks = [...webhooks]
        const webhook: Notifications = curerntHooks[index]
        webhook.types[key] = !webhook.types[key]

        setWebhooks(curerntHooks)
        setHookToUpdate(webhook.id)
    }

    const Checkboxes = webhooks.map((webhook: Notifications, index: number) => {
        return Object.entries(webhook.types).map(([ eventName, isActive ]) => {
            return (
                <div key={eventName}  className="RepositoryNotifications__checkbox-wrapper" >
                    <p>{eventName.replaceAll('_', ' ')}</p>
                    <div className="checkbox-slider-track" >
                        <input id={eventName} className="RepositoryNotification__checkbox" type="checkbox" checked={isActive} onChange={ () => { _onChange(index, eventName)}}  />
                        <label htmlFor={eventName} className="checkbox-slider-knob"></label>
                    </div>
                </div>
            )
        })
    })

    return (
        <div className="RepositoryNotifications">
            <div className="RepositoryNotifications__checkboxes">
            <h2>Notifications</h2> 
            {
                !isLoading &&
                (
                    Checkboxes.length === 0 ? 
                    <StandardButton  
                    buttonType="button" 
                    value="Enable notifications"  
                    onClickHandler={() => setCreateHook(true)}
                    /> :
                    Checkboxes
                )
            }
            </div>
        </div>
    )
}

export default RepositoryNotifications
