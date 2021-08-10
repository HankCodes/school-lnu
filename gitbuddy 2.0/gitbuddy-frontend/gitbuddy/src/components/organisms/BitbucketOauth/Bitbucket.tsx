import React from 'react';
import bitbucketIcon from '../../../images/bitbucket.png'
import Oauth from '../../molecules/Oauth/Oauth';

interface IProps {
    hasToken: boolean,
}

const BitbucketOauth:React.FC<IProps> = ({ hasToken }) => {
    return <Oauth icon={bitbucketIcon} gitService="bitbucket" hasToken={hasToken} />
}

export default BitbucketOauth
