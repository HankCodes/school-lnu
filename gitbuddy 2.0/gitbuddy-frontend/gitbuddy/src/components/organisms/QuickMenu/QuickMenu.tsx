import React, { useState } from 'react'
import './QuickMenu.css'
import gitlabLogo from '../../../images/gitlab-color.png'
import cogIcon from '../../../images/cogwheel.svg';
import Image from '../../atoms/Image/Image'
import Notifications from '../../molecules/NotificationButton/NotificationButton';
import { Link } from 'react-router-dom';

const QuickMenu: React.FC = () => {
    const [ showMenu, setShowMenu ] = useState<boolean>(false)
    // TODO render these conditionally depending on active gitservcie
    const gitIcon = gitlabLogo
    const gitAlt = 'Gitlab icon'

    const boardStyle = showMenu ? 'QuickMenu__board global-glass show-board' : 'QuickMenu__board global-glass hide-board'

    return (
        <div className="QuickMenu" >

            <div className="QuickMenu__logo" onClick={() => {
                setShowMenu(!showMenu)
            }}>
                <Image src={gitIcon} alt={gitAlt} />
            </div>

            <div className={boardStyle}>
                <div className="QuickMenu__board--bell">
                    <Notifications />
                </div>
                <div className="QuickMenu__board--wheel">
                    <Link to="/settings" >
                        <Image src={cogIcon} alt="settings cogwheel" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default QuickMenu
