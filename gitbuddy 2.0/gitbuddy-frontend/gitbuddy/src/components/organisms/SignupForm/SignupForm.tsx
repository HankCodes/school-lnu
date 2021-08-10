import React, { useState, useEffect } from 'react'
import { signup } from '../../../helpers/apiCall'
import StandardButton from '../../molecules/forms/buttons/StandardButton/StandardButton'
import EmailField from '../../molecules/forms/inputFields/EmailField/EmailField'
import Password from '../../molecules/forms/inputFields/Password/Password'
import StandardForm from '../../molecules/forms/StandardForm/StandardForm'
import './SignupForm.css'

interface IStateInput {
    value: string,
    error: boolean
}

const RegisterUser: React.FC = () => {
    const [ email, setEmail ] = useState<IStateInput>({ value: '', error: true })
    const [ password, setPassword ] = useState<IStateInput>({ value: '', error: true })
    const [ passwordCheck, setPasswordCheck ] = useState<IStateInput>({ value: '', error: true })
    const [ matchError, setMatchError ] = useState<string>('')

    useEffect(() => {
        if ( password.value !== passwordCheck.value) {
            passwordCheck.value.length < 1 ? setMatchError('') : setMatchError('Passwords does not match')
        } else {
            setMatchError('')
        }
    }, [ email, password, passwordCheck])
    
    const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!email.error && !password.error && matchError.length === 0) {
            const formData: ICredentials = {
                email: email.value,
                passphrase: password.value
            }
            
            callToApi(formData) 
        }
    }

    const callToApi = async (signupData: ICredentials) => {
        try {
            signup(signupData)
        } catch (error) {
            console.log('Error when creating user ', error)
        }
    }

    return (
        <div >
            <StandardForm className="SignupForm" onSubmit={onSubmitHandler} > 
                <EmailField className="SignupForm__field" label="Email" validate={true} required={true} placeholder="example@email.com" onChange={setEmail} />
                <Password className="SignupForm__field" label="Enter password" required={true} validate={true} max={100} min={10} onChange={setPassword} />
                <Password className="SignupForm__field" label="Repeat password" required={true} customError={matchError} onChange={setPasswordCheck} />
                <StandardButton className="SignupForm__button" buttonType="submit" value="Register" /> 
            </StandardForm>  
        </div>
    )
}


export default RegisterUser