import React, { useState } from 'react'
import Devicemanager from '../../organisms/DeviceManager/DeviceManager'
import Popup from '../Popup/Popup'
import './Device.css'

const Device: React.FC<IDevice> = ({ deviceId, ip, port }) => {
    const [ showDeviceManager, setShowDeviceManager ] = useState<boolean>(false)

    return(
        <>
            { showDeviceManager && 
                <Popup onClose={() => setShowDeviceManager(false)} >
                    <Devicemanager deviceId={deviceId} ip={ip} port={port}/>
                </Popup>
            }

            <div className="Device" onClick={() => setShowDeviceManager(true)}>
                <h4>{deviceId}</h4>
            </div>
        </>
    )
}

export default Device
