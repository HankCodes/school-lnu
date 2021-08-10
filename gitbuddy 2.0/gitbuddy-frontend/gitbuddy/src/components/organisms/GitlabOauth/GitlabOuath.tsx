import React from 'react';
import gitLabIcon from '../../../images/gitlab-color.png'
import Oauth from '../../molecules/Oauth/Oauth';

interface IProps {
    hasToken: boolean,
}

const GitlabOauth:React.FC<IProps> = ({ hasToken }) => {
    return <Oauth icon={gitLabIcon} gitService="gitlab" hasToken={hasToken} />
}

export default GitlabOauth
