import React from 'react'
import RepositoryNotifications from '../RepositoryNotifications/RepositoryNotifications'
import './RepositoryDashboard.css'

interface IProps {
    repo: any,
    gitConf: IGitConf
}

const RepositoryDashboarda: React.FC<IProps> = ({ repo, gitConf }) => {
    const { name, id, http_url_to_repo } = repo
    const { gitService } = gitConf
    return (
        <div className="RepositoryDashboard">
            <div className="RepositoryDashboard__repository">
                <h2>{name}</h2>
                <p>ID: {id}</p>
                <a href={http_url_to_repo} rel="noreferrer" target="_blank" >Visit repo on {gitService}</a>
            </div>

            <div className="RepositoryDashboard__notifications">
                <RepositoryNotifications gitConf={gitConf} repo={repo} />
            </div>
        </div>
    )
}

export default RepositoryDashboarda
