import React from 'react'
import { capitalizeFirstLetter } from '../../../helpers/capitalizeFirstLetter'
import './Log.css'

const Log: React.FC<ILog> = ({ createdAt, logMessage, type }) => {
    let styles = 'Log '

    switch (type) {
        case 'activated':
            styles += 'activated' 
            break;
        case 'deactivated':
            styles += 'deactivated' 
            break;
        case 'triggered':
            styles += 'triggered' 
            break;
        default:
            break;
    }

    return (
        <div className={styles}>
            <h4 className="Log__headline">{capitalizeFirstLetter(logMessage)}</h4>
            <p>{createdAt}</p>
        </div>
    )
}

export default Log 
