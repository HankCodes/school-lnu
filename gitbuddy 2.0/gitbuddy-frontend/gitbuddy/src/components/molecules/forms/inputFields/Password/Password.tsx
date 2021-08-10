import React, { useState, useEffect, useRef } from 'react'

interface Props {
    label?: string,
    validate?: boolean,
    required?: boolean,
    max?: number,
    min?: number,
    placeholder?: string | undefined,
    sanitize?: boolean,
    onChange: (object: any) => void,
    customError?: string,
    className?: string
}

/**
 * Renders a text inputfield. Provides error message if incorrect data is entered to the field.
 * 
 * @param {object} props - Props for the component.
 * @returns {JSX} - JSX to render to the DOM. 
 */
const Password: React.FC<Props> = ({ className, label, validate = false, required = false, max = 1000, min = 0, placeholder, sanitize = false, onChange, customError }) => {
    const [isError, setIsError ] = useState<string>('')
    const [ password, setPassword ] = useState<string>('')
    const firstRender = useRef(true)

    const _validatePassword = (pwd: string): boolean => {
        let isSafe: boolean = false
        if (pwd.length < min ) {
            setIsError(`Must be longer than ${min} character`)
            isSafe = false
        } else if (pwd.length > max ) {
            setIsError(`Must be shorter than ${max} character` )
            isSafe = false
        } else {
            setIsError("")
            isSafe = true 
        }

        return isSafe
    }

    useEffect(() => {
        // TODO refactor, must be a better solution
        // Check if its the first render, if so, then return.
        if (firstRender.current) {
            firstRender.current = false
            return
        }

        if (validate) {
            onChange({value: password, error: _validatePassword(password) ? null : true})
        } else {
            onChange({value: password, error: null})
        }
        
    }, [password, validate])



    return (
        <div className={className}>
            <label>{label}</label>
            <input  required={required} type="password" onChange={ event => { setPassword(event.target.value) }} />
            { isError && <p className="global-font-danger"> { isError } </p> }
            { customError && <p className="global-font-danger"> { customError } </p> }
        </div>
    )
}

export default Password
