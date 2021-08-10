import React from 'react';
import BitbucketOauth from '../BitbucketOauth/Bitbucket';
import GithubOauth from '../GithubOauth/GithubOauth';
import GitlabOauth from '../GitlabOauth/GitlabOuath';
import './OauthBoard.css'

interface IProps {
    tokens: {
      hasGithubToken: boolean,
      hasBitbucketToken: boolean,
      hasGitlabToken: boolean,
    }
}

export const OauthBoard:React.FC<IProps> = ({ tokens }) => {
    
    return (
        <div className="OauthBoard global-glass">
            <GitlabOauth hasToken={tokens.hasGitlabToken} />
            <GithubOauth hasToken={tokens.hasGithubToken} />
            <BitbucketOauth hasToken={tokens.hasBitbucketToken} />
        </div>
    )
}


export default OauthBoard