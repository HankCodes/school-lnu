
import React from 'react'
import GitPage from '../GitPage/GitPage'
import gitlabConf from '../../../helpers/configs/gitlabConf'

const GitLabPage: React.FC = () => {
    return <GitPage gitConf={gitlabConf} /> 
}

export default GitLabPage
