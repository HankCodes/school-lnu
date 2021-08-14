import React from 'react'
import Device from '../../molecules/Device/Device'
import './Devices.css'

interface IProps {
    devices: IDevice[]
}

const Devices: React.FC<IProps> = ({ devices }) => {
    const devicesToRender = devices.map((device: IDevice, index: number) => {
        return (
            <li key={device.deviceId + index}>
                <Device deviceId={device.deviceId} ip={device.ip} port={device.port}  />
            </li>
        )
    })
    
    return(
        <div className="Devices">
            <h2>Devices</h2>
            {
                devicesToRender.length !== 0 ? 
                    <ul>{devicesToRender}</ul>:
                    <p>No devices</p>    
            }

        </div>
    )
}

export default Devices
