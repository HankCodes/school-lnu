import React from 'react'

// TODO fix group type
interface IProps {
    name: string
}

const Group: React.FC<IProps> = ({ name }) => {

    return (
        <div>
            <h1>{name}</h1>
        </div>
    )
}

export default Group
