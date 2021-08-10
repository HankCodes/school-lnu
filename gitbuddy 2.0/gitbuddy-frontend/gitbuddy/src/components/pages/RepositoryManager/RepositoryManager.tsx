import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchGit } from '../../../helpers/apiCall'
import ErrorText from '../../molecules/ErrorText/ErrorText'
import Navigate from '../../molecules/Navigate/Navigate'
import RepositoryDashboard from '../../molecules/RepositoryDashboard/RepositoryDashboard'
import './RepositoryManager.css'

interface IProps {
    gitConf: IGitConf
}

const RepositoryManager: React.FC<IProps> = ({ gitConf }) => {
    const { gitService, getRepositoryUrl } = gitConf
    const [ repo, setRepo ] = useState<any>({})
    const [ error, setError ] = useState<string>('')
    const { id } = useParams<any>()

    useEffect(() => {
        const getRepo = async () => {
            const resp = await fetchGit(gitService, getRepositoryUrl(id))
            
            if(resp.error) return setError('Could not fetch repositories') 
            
            setRepo(resp.payload)
        }

        getRepo()
    }, [ getRepositoryUrl, gitService, id ])

     return (
        <div className="RepositoryManager">
            {
                error &&
                    <ErrorText text={error} />
            } 
            <div className="RepositoryManager__goback-wrapper">
                <Navigate text="Go back"/>
            </div>
            <div className="RepositoryManager__repository-wrapper">
                {
                   repo ? 
                    <RepositoryDashboard gitConf={gitConf} repo={repo} /> :
                    <p>There is no repository to display</p>
                }
            </div>
        </div>
     )
} 

export default RepositoryManager
