import React, { useState } from 'react'
import StandardButton from '../../molecules/forms/buttons/StandardButton/StandardButton'
import Popup from '../../molecules/Popup/Popup'
import LoginForm from '../LoginForm/LoginForm'
import './IndexHeader.css'

const IndexHeader: React.FC = () => {
   const [ showPopup, setShowPopup ] = useState<boolean>(false) 

    return (
        <div className="IndexHeader">
            {
                showPopup && 
                <Popup onClose={() => setShowPopup(false)}>
                    <LoginForm />
                </Popup>
            }
            <StandardButton 
                className="IndexHeader__login" 
                value="Login"
                buttonType="button"
                onClickHandler={() => setShowPopup(true)}
                />
        </div>
    )
}

export default IndexHeader
