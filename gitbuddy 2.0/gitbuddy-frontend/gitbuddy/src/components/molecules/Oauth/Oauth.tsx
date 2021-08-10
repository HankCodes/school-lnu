import React, { useEffect, useState } from 'react';
import OauthButton from '../OauthButton/OauthButton';
import { capFirstLetter } from '../../../helpers/capitalizeFirstletter';
import { oauthFlow } from '../../../helpers/apiCall'
import './Oauth.css'
import ErrorText from '../ErrorText/ErrorText';
import { Redirect } from 'react-router-dom';

interface IProps {
    hasToken: boolean,
    gitService: string,
    icon: string
}

const Oauth:React.FC<IProps> = ({ hasToken, gitService, icon }) => {
    const [ startOauth, setStartOauth ] = useState<boolean>(false)
    const [ oauthError, setOauthError ] = useState<boolean>(false)
    const [ goToService, setGoToService ] = useState<boolean>(false)
    const service = capFirstLetter(gitService) 

    useEffect(() => {
        if (startOauth) {
            setStartOauth(false)
            const getUrl = async () => {
                const data = await oauthFlow(gitService)
                if (data.payload) {
                    window.location.replace(data.payload.url)
                } else {
                    setOauthError(true)
                }
            }

            getUrl()
        }
    }, [ startOauth, gitService, hasToken ]) 

    // TODO add anomation on loading component
    //TODO leave room for error message
    return (
        <div className="Oauth">
            { goToService && hasToken && <Redirect to={"/" + gitService} /> }
            <div className="Oauth__button-wrapper">
                <OauthButton hasToken={hasToken} 
                    onClick={ hasToken ? () => setGoToService(true) : () => setStartOauth(true)} 
                    gitService={gitService} 
                    icon={icon} 
                    iconAlt={`${service} logo`} 
                />
            </div>
            <div className="Oauth__description">
                {  hasToken ?
                    <p>{service} is synced</p> :
                    <p>{service} is not synced yet</p>
                }
                { oauthError && 
                    <ErrorText text={"Could not sync " + service} />
                }
            </div>
        </div>
    )
}

export default Oauth
