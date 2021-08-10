import React from 'react'
import './Organization.css'

interface IProps {
    organization: any
}

const Organization: React.FC<IProps> = ({ organization }) => {
    const name = organization.full_name.substring(0, organization.full_name.indexOf("("))
    const course = organization.full_name.substring(organization.full_name.indexOf('(') + 1, organization.full_name.indexOf(')'))
    
     return (
         <div className="Organization">
            <h3>{name}</h3>
            <p>{course}</p>
         </div>
     )
}

export default Organization
