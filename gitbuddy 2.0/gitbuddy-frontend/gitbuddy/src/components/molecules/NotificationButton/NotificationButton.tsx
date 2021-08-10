import React from 'react'
import { Link } from 'react-router-dom'
import bellIcon from '../../../images/notification.svg'
import Image from '../../atoms/Image/Image'

const NotificationButton: React.FC = () => {
    return (
        <div>
            <Link to="/notifications">
                <Image src={bellIcon} alt="bell" />
            </Link>
        </div>
    )
}

export default NotificationButton
