import React, { useState } from 'react'
import DeviceApp from '../../molecules/DeviceApp/DeviceApp'
import StandardButton from '../../molecules/forms/buttons/StandardButton/StandardButton'
import Logs from '../DeviceLogs/DeviceLogs'
import './DeviceManager.css'

const DeviceManager: React.FC<IDevice> = ({ deviceId, ip, port }) => {
    const [ showLog, setShowLog ] = useState<boolean>(false)

    return (
        <div className="DeviceManager">
            <div className="DeviceManager__buttons">
                <StandardButton buttonType="button" value="Alarm" onClickHandler={ () => setShowLog(false)} />
                <StandardButton buttonType="button" value="Activities" onClickHandler={ () => setShowLog(true)}/>
            </div>
            {
                showLog ?  
                    <Logs deviceId={deviceId} /> : 
                    <DeviceApp deviceId={deviceId} ip={ip} port={port} /> 
            }
        </div>
    )
}

export default DeviceManager 
