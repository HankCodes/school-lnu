import React from 'react';
import githubIcon from '../../../images/github.png'
import Oauth from '../../molecules/Oauth/Oauth';

interface IProps {
    hasToken: boolean
}

const GitlabOauth:React.FC<IProps> = ({ hasToken  }) => {
    return <Oauth icon={githubIcon} gitService="github" hasToken={hasToken} />
}

export default GitlabOauth
