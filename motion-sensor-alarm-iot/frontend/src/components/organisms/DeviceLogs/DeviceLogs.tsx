import React, { useEffect, useState } from 'react'
import { getLogs } from '../../../helpers/apiCall'
import ErrorText from '../../molecules/ErrorText/ErrorText'
import Log from '../../molecules/Log/Log'
import './DeviceLogs.css'

interface IProps {
    deviceId: string
}

const Logs: React.FC<IProps> = ({ deviceId }) => {
    const [ logs, setLogs ] = useState<ILog[]>([])
    const [ error, setError ] = useState<string>('')
    const [ isLoading, setIsLoading ] = useState<boolean>(false)

    useEffect(() => {
        const getAllLogs = async () => {
            setIsLoading(true)

            const resp: any = await getLogs(deviceId) 
            
            if (resp.error) return setError('Could not load logs')
            
            setLogs(resp)
            setError('')
            setIsLoading(false)
        }

        getAllLogs()
    }, [deviceId])

    const logsToRender = logs.map((log: ILog) => {
        return (
            <li key={Math.random()} className="DeviceLogs__list-item">
                <Log createdAt={log.createdAt} logMessage={log.logMessage} type={log.type} />
            </li>
        )
    })
    return (
        <div className="DeviceLogs">
            {
                error && <ErrorText text={error} />
            }
            {
                isLoading ?
                    <p>loading</p> :
                    <ul>
                        { logsToRender.length > 0 ?
                            logsToRender :
                            <li>Empty activity list</li>}
                    </ul>
            }

        </div>
    )
}

export default Logs 
