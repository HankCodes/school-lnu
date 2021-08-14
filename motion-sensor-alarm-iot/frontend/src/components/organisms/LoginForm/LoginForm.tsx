import React, { useState, useEffect } from 'react'
import * as actions from '../../../store/actionCreators'
import { connect } from 'react-redux'

import StandardForm from '../../molecules/forms/StandardForm/StandardForm'
import TextField from '../../molecules/forms/inputFields/TextField/TextField'
import Password from '../../molecules/forms/inputFields/Password/Password'
import './LoginForm.css'
import StandardButton from '../../molecules/forms/buttons/StandardButton/StandardButton'
import ErrorText from '../../molecules/ErrorText/ErrorText'

interface stateInput {
    value: string,
    error: boolean
}

interface IProps {
    onAuthenticate: (credentials: ICredentials) => void
    isAuthenticated: boolean, 
    error: string, 
    isLoading: boolean
}

/**
 * Renders a login form
 * 
 * @param {object} props - props for the component.
 * @returns JSX 
 */
const LoginForm: React.FC<IProps> = ({ onAuthenticate, isAuthenticated, error, isLoading }) => {
    const [ username, setUsername ] = useState<stateInput>({ value: "", error: false })
    const [ password, setPassword ] = useState<stateInput>({ value: "", error: true })
    const [ submitForm, setSubmitFrom ] = useState<boolean>(false)
    const [ usernameError, setUsernameError ] = useState<string>('')
    const [ passwordError, setPasswordError ] = useState<string>('')

    const onSubmitHandler = (event: React.FormEvent) => {
        event.preventDefault()
        
        username.value.length < 1 ? setUsernameError('Email must be entered') : setUsernameError('')
        password.value.length < 1 ? setPasswordError('Password must be entered') : setPasswordError('')
        password.value.length > 0 && username.value.length > 0 ? setSubmitFrom(true) : setSubmitFrom(false)
    }
    
    useEffect(() => {
        if (submitForm) {   
            const credentials: ICredentials = {
                email: username.value,
                passphrase: password.value
            }
            
            onAuthenticate(credentials) 
        }
     
        setSubmitFrom(false)
    }, [username, password, submitForm, onAuthenticate])

    return (
        <div className="LoginForm">
           {isLoading ? <p>laddar</p> : 
                <StandardForm onSubmit={onSubmitHandler}>
                    {error && <ErrorText text="Could not authenticate" />}
                    <TextField 
                        className="LoginForm__field" 
                        onChange={setUsername} 
                        customError={usernameError}
                        label="Email"
                        />
                    <Password 
                        className="LoginForm__field" 
                        onChange={setPassword} 
                        customError={passwordError}
                        label="Password" 
                        />
                    <StandardButton
                        value="Login"
                        buttonType="submit"
                        className="LoginForm__submit"
                        /> 
                </StandardForm>
            }
        </div>
    )
}

const mapStateToProps = (state: any) => {
    return {
        isAuthenticated: state.user.isAuthenticated,
        error: state.user.error,
        isLoading: state.user.loading
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        onAuthenticate: (credentials: ICredentials) =>  dispatch(actions.auth(credentials)) 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)