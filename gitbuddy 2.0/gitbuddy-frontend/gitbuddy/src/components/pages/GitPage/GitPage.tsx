import React from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import Organizations from '../../organisms/Organizations/Organisations'
import Repositories from '../../organisms/Repositories/Repositories'
import RepositoryManager from '../RepositoryManager/RepositoryManager'
import './GitPage.css'

interface IProps {
    gitConf: IGitConf
}

const GitPage: React.FC<IProps> = ({ gitConf }) => {
    let { path } = useRouteMatch();
    
    return <div className="GitPage global-glass">
        <Route exact path={`${path}/`}>
            <Organizations gitConf={gitConf} />
        </Route>

        <Route exact path={`${path}/organizations/:id`}>
            <Repositories gitConf={gitConf} />
        </Route>

        <Route exact path={`${path}/repository/:id`}>
            <RepositoryManager gitConf={gitConf} />
        </Route>
    </div>
}

export default GitPage
