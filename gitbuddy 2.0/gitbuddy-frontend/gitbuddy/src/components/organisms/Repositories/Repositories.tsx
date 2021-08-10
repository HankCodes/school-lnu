import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchGit } from '../../../helpers/apiCall'
import ErrorText from '../../molecules/ErrorText/ErrorText'
import Navigate from '../../molecules/Navigate/Navigate'
import Repository from '../../molecules/Repository/Repository'
import './Repositories.css'

interface IProps {
    gitConf: IGitConf
}

const Repositories: React.FC<IProps> = ({ gitConf }) => {
    const { gitService, getRepositoriesUrl } = gitConf
    const [ repositories, setRepositories ] = useState([])
    const [ orgName, setOrgName ] = useState<string>('')
    const [ error, setError ] = useState<string>('')
    const { id } = useParams<any>()

    useEffect(() => {
        const getrepos = async () => {
            const repos = await fetchGit(gitService, getRepositoriesUrl(id))

            if (repos.error) return setError('Could not get projects') 

            const org = repos.payload[0].name_with_namespace
            const name = org.substring(0, org.indexOf("("))
            setOrgName(name)
            setRepositories(repos.payload)
        }

        getrepos()
    }, [id, gitService, getRepositoriesUrl])

    const reposToRender = repositories.map((repo: any) => {
        return (
            <li key={repo.id}>
                <Link to={`/${gitService}/repository/${repo.id}`}>
                    <Repository name={repo.name} />
                </Link>
            </li>
        )
    })

    return (
        <div className="Repositories">
            <div className="Repositories__goback-wrapper">
                <Navigate to={`/${gitService}`} text="Go back"/>
            </div>
            <h3>{orgName}</h3>
            {
                reposToRender &&
                    <ul className="Repositories__list">
                        {reposToRender}
                    </ul>
            }
            { 
                error && 
                    <ErrorText text={error} /> 
            }
        </div>
    )
}

export default Repositories
