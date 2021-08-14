import React from 'react'
import './DeviceApp.css'

const DeviceApp: React.FC<IDevice> = ({ deviceId, ip, port }) => {
    return(
        <div className="DeviceApp">
            <iframe className="DeviceApp__frame" src={`http://${ip}:${port}/app`} title={`${deviceId} app`} /> 
        </div>
    )
}

export default DeviceApp
