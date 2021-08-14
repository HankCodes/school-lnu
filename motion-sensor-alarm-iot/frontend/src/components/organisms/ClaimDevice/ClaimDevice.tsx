import React, { useState, useEffect } from 'react'
import { claimDevice } from '../../../helpers/apiCall'
import ErrorText from '../../molecules/ErrorText/ErrorText'
import StandardButton from '../../molecules/forms/buttons/StandardButton/StandardButton'
import TextField from '../../molecules/forms/inputFields/TextField/TextField'
import StandardForm from '../../molecules/forms/StandardForm/StandardForm'
import './ClaimDevice.css'

interface ISetDevice {
    value: string,
    error: boolean
}

interface IProps {
    onNewDevice: (device: IDevice) => void
}

const ClaimDevice: React.FC<IProps> = ({ onNewDevice }) => {
    const [ isLoading, setIsLoading ] = useState<boolean>(false)
    const [ error, setError ] = useState<string>('')
    const [ claimSuccess, setClaimSucces] = useState<string>('')
    const [ deviceName, setDeviceName ] = useState<ISetDevice>({ value: '', error: false })

    const _onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)
        const resp = await claimDevice(deviceName.value)

        if (resp.error) {
            setError( resp.error.includes('Device already claimed') ? 
                resp.error :
                'Device not found. Make sure the device is connected')

            setClaimSucces('') 
            setIsLoading(false)
        } else {
            onNewDevice({
                deviceId: resp.device.deviceId,
                ip: resp.device.ip,
                port: resp.device.port
            })
            setClaimSucces('Device was successfully claimed') 
            setError('')
            setIsLoading(false)
        }
    }

    return (
        <div className="ClaimDevice">
           {isLoading ? <p>Loading</p> : 
                <StandardForm onSubmit={_onSubmit}>
                    {error && <ErrorText text={error} />}
                    {claimSuccess && <ErrorText text={claimSuccess} />}
                    <TextField 
                        className="LoginForm__field" 
                        onChange={setDeviceName} 
                        label="Device name"
                    />
                    <StandardButton
                        value="Claim"
                        buttonType="submit"
                    /> 
                </StandardForm>
            }
        </div>
    )
}

export default ClaimDevice
