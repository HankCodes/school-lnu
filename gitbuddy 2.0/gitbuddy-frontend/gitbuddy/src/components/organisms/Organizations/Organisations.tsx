import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchGit } from '../../../helpers/apiCall'
import ErrorText from '../../molecules/ErrorText/ErrorText'
import Organization from '../../molecules/Organization/Organization'
import './Organizations.css'

interface IProps {
    gitConf: IGitConf
}

const Organizations: React.FC<IProps> = ({ gitConf }) => {
    const [ error, setError ] = useState<Boolean>(false)
    const [ organizationList, setOrganizationList ] = useState<any>([])
    const { gitService, getOrganizationsUrl } = gitConf 

    useEffect(() => {
        const getOrgs = async () => {
            const p = await fetchGit(gitService, getOrganizationsUrl()) 

            if (p.error) {
               setError(true) 
            } else {
                setError(false) 
                setOrganizationList(p.payload)
            } 
        }

        getOrgs()
    }, [gitService, getOrganizationsUrl])

    const renderOrganizations = organizationList.map((org: any) => {
        return (
            <li key={org.id}>
                <Link to={`${gitService}/organizations/${org.id}`}>
                    <Organization organization={org}  />
                </Link>
            </li>
        )
    })
    
    return <div className="Organizations">
        { error && 
            <div className="Organizations__error">
                <ErrorText text="Could not get repositories at the moment" />
            </div> 
        }
        <h1>organization list</h1>
        <ul className="Organizations__list">
            {renderOrganizations}
        </ul>
    </div>
}

export default Organizations
