import React, { useState, useEffect } from 'react'
import { getDevices } from '../../../helpers/apiCall'
import ErrorText from '../../molecules/ErrorText/ErrorText'
import StandardButton from '../../molecules/forms/buttons/StandardButton/StandardButton'
import Popup from '../../molecules/Popup/Popup'
import ClaimDevice from '../../organisms/ClaimDevice/ClaimDevice'
import Devices from '../../organisms/Devices/Devices'
import LogoutForm from '../../organisms/LogoutForm/LogoutForm'
import './DashboardPage.css'

const DashboardPage: React.FC = () => {
    const [ showClaimDevice, setShowClaimDevice ] = useState<boolean>(false)
    const [ devices, setDevices ] = useState<IDevice[]>([]) 
    const [ error, setError ] = useState<string>('')
    const [ showLogout, setShowLogout ] = useState<boolean>(false)


    const _onNewDevice = (device: IDevice) => {
        const currentDevices = [...devices]
        currentDevices.push(device)
        setDevices(currentDevices) 
    }

    useEffect(() => {
        const fetchDevices = async () => {
            const resp = await getDevices()

            resp.error ?
                setError(resp.error) :
                setDevices(resp.devices ? resp.devices : [])
        }

        fetchDevices()
    }, [])

    return (
        <div className="DashboardPage">
            { 
                showLogout &&
                <Popup onClose={() => setShowLogout(false)} >
                    <LogoutForm />
                </Popup>
            }
            { 
                showClaimDevice &&
                <Popup onClose={() => setShowClaimDevice(false)} >
                    <ClaimDevice onNewDevice={_onNewDevice} />
                </Popup>
            }

            <div className="DashboardPage__logout-wrapper">
                <p onClick={() => setShowLogout(true)} >Log out</p>
            </div>

            <div className="DashboardPage__header">
                <h1>Dashboard</h1>
            </div>


            <div className="DashboardPage__button-wrapper">
                <StandardButton buttonType="button" value="Claim new device" onClickHandler={() => setShowClaimDevice(true)} />
            </div>

            <div className="DashboardPage__devices-wrapper">
                { error && <ErrorText text={error} /> }
                <div className="DashboardPage__device-list">
                    <Devices devices={devices} />
                </div>
            </div>
        </div>
    )
}

export default DashboardPage 
