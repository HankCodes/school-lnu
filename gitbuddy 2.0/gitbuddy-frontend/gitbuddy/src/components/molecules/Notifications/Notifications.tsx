import React, { useEffect, useState } from 'react'
import { getNotifications, registerReadNotifications } from '../../../helpers/apiCall'
import ErrorText from '../ErrorText/ErrorText'
import Notification from '../Notification/Notification'
import './Notifications.css'

const Notifications: React.FC = () => {
    const [ unread, setUnread ] = useState<INotification[]>([])
    const [ read, setRead ] = useState<INotification[]>([])
    const [ error, setError ] = useState('')

    useEffect(() => {
        const get = async () => {
            const resp: any = await getNotifications('gitlab') 
            console.log('respionse fron notifi', resp);
            
            if (!resp.payload) return setError('Could not get your anotifications right now')
            setUnread(resp.payload.unreadNotifications || [])
            setRead(resp.payload.readNotifications || [])
            setError('')
        }

        get()
        
        return (): any => unread && registerReadNotifications('gitlab')
    }, [])
    
    const readNotifications = read.map((note: INotification) => {
            return (
                <li key={note.createdAt}> 
                    <Notification notification={note} /> 
                </li>
                )
        })

    const unreadNotifications = unread.map((note: INotification) => {
            return (
                <li key={note.createdAt}> 
                    <Notification notification={note} /> 
                </li>
                )
        })

    return (
        <div className="Notifications global-glass">
            <h1>Notifications</h1>
            { error && <ErrorText text={error} /> }
            { unreadNotifications.length !== 0 && (
                <>
                    <h2>New</h2>
                    <ul className="Notifications__unread"> 
                        { unreadNotifications }
                    </ul>
                    <hr />
                </>
            ) }

            { readNotifications && (
                <ul> 
                    { readNotifications }
                </ul>
            ) }
        </div>
    )
}

export default Notifications
