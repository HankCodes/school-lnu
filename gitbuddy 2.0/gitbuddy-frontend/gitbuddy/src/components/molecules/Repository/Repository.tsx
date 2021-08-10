import React from 'react'

interface IProps {
    name: string
}

const Repository: React.FC<IProps> = ({ name }) => {
     return (
         <div className="Organization">
            <h3>{name}</h3>
         </div>
     )
}

export default Repository
