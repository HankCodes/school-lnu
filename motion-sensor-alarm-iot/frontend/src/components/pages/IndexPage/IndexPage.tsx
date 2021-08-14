import React, { useState } from 'react'
import StandardButton from '../../molecules/forms/buttons/StandardButton/StandardButton'
import Popup from '../../molecules/Popup/Popup'
import LoginForm from '../../organisms/LoginForm/LoginForm'
import SignupForm from '../../organisms/SignupForm/SignupForm'
import './IndexPage.css'

const IndexPage: React.FC = () => {
    const [ showLogin, setShowLogin ] = useState<boolean>(false)
    const [ showSignup, setShowSignup ] = useState<boolean>(false)

    return (
        <div className="IndexPage">
            { showLogin && 
                <Popup onClose={() => setShowLogin(false)}>
                    <LoginForm />
                </Popup> 
            }
            
            { showSignup && 
                <Popup onClose={() => setShowSignup(false)}>
                    <SignupForm />
                </Popup> 
            }

            <h1>Signin or signup</h1>
            <StandardButton buttonType="button" value="Sign me in!" onClickHandler={ () => setShowLogin(true) } />
            <StandardButton buttonType="button" value="Sign me up!" onClickHandler={ () => setShowSignup(true) }/>
        </div>
    )
}

export default IndexPage
