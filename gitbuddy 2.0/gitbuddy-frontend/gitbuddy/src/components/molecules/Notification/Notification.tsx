import React from 'react'
import './Notification.css'


interface IProps {
    notification: INotification
}

const Notification: React.FC<IProps> = ({ notification }) => {
    const { createdAt, gitUrl, title } = notification

    return (
        <div className="Notification">
            <a href={gitUrl} >
                <h3>{title}</h3>
                <p>{createdAt}</p>
            </a>
        </div>
    )
}

export default Notification
