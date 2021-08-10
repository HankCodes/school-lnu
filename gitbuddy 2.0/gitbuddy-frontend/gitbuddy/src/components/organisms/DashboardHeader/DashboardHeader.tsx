import React, { useState } from 'react';
import StandardButton from '../../molecules/forms/buttons/StandardButton/StandardButton';
import Popup from '../../molecules/Popup/Popup';
import LogoutForm from '../LogoutForm/LogoutForm';
import './DashboardHeader.css'

export const DashboardHeader:React.FC = () => {
    const [ showPopup, setShowPopup ] = useState<boolean>(false);

    return (
        <header className="DashboardHeader">
            <StandardButton className="DashboardHeader__button"  buttonType="button" value="Log out" onClickHandler={() => setShowPopup(!showPopup)} />
            { showPopup && 
                <Popup  onClose={() => setShowPopup(false)}>
                    <LogoutForm />
                </Popup> }
        </header>
    ) 
}

export default DashboardHeader
