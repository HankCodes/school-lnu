import React, { useEffect, useState } from 'react'
import { getWebPushKey, registerWebPush, unregisterWebPush } from '../../../helpers/apiCall';
import ErrorText from '../ErrorText/ErrorText';
import StandardButton from '../forms/buttons/StandardButton/StandardButton';

const EnableNotifications: React.FC = () => {
    const [ sendEnableNotifications, setSendEnableNotifications ] = useState<boolean>(false)
    const [ disableNotifications, setDisableNotifications ] = useState<boolean>(false)
    const [ subscription, setSubscription ] = useState<PushSubscription | null>(null)
    const [ error, setError ] = useState<string>('')
    
    useEffect(() => {
        const hasNotification = async () => {
            try {
                const registration = await navigator.serviceWorker.ready
                const subscription: any = await registration.pushManager.getSubscription()
                console.log('sub: ', JSON.stringify(subscription));
                 
                if (subscription) {
                    error && setError('')
                    return setSubscription(subscription) 
                }
            } catch (error) {
                setError('Could not find your notifications')
            }
        }

        !subscription && hasNotification()
    }, [error, subscription])

    useEffect(() => {
        if (sendEnableNotifications) {
            const enableNotifications = async () => {
                try {
                    const registration = await navigator.serviceWorker.ready
                    const subscription: any = await registration.pushManager.getSubscription()
                    
                    if (subscription) return setSubscription(subscription) 

                    const convertedVapidKey = await getWebPushKey() 
                    if (convertedVapidKey instanceof Uint8Array) {
                        const subscription: PushSubscription = await registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: convertedVapidKey
                        })
                         
                        const resp: any = await registerWebPush(subscription)
                        if (!resp.error) setSubscription(subscription) 
                    }
                } catch (error) {
                   console.log('error', error) 
                } finally {
                    setSendEnableNotifications(false)
                }
            }
                    
            enableNotifications()
        }

        if (disableNotifications) {
            const unsubscribe = async () => {
                try {
                   subscription && await subscription.unsubscribe()

                    const resp: any = await unregisterWebPush()
                    if (!resp.error) setSubscription(null)
                } catch (error) {
                    setError('Could not remove notifications, Please try again')
                } finally {
                    setDisableNotifications(false)
                }
            }
            
            unsubscribe()
        }
    }, [disableNotifications, sendEnableNotifications, subscription])

    
    return (
        <>
            {
                subscription ?
                    <StandardButton 
                        buttonType="button" 
                        value="Turn off notifications" 
                        onClickHandler={() => setDisableNotifications(true)}
                    /> :
                    <StandardButton 
                        buttonType="button" 
                        value="Turn on notifications" 
                        onClickHandler={() => setSendEnableNotifications(true)}
                    /> 
            }
            
            { error && <ErrorText text={error} /> }
        </>
    )
}

export default EnableNotifications
