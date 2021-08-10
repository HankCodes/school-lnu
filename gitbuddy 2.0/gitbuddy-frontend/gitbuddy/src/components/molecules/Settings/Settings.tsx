import React from 'react'
import OauthBoard from '../../organisms/OauthBoard/OauthBoard';
import EnableNotifications from '../EnableNotifications/EnableNotifications';
import './Settings.css'

interface IProps {
    tokens: {
      hasGithubToken: boolean,
      hasBitbucketToken: boolean,
      hasGitlabToken: boolean,
    }
}

const Settings: React.FC<IProps> = ({ tokens }) => {
    return (
        <div className="Settings">
            <div className="Settings__notification-types  global-glass">
               <h2>Enable browser notifications</h2> 
                <EnableNotifications />
            </div>
            <div className="Settings__gitservices">
                <OauthBoard tokens={tokens}/>
            </div>
        </div>
    )
}

export default Settings
