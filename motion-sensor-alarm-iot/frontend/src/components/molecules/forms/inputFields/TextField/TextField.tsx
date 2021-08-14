import React, { useState } from 'react'

interface Props {
    label?: string,
    validate?: boolean,
    required?: boolean,
    max?: number,
    min?: number,
    placeholder?: string | undefined,
    sanitize?: boolean,
    onChange: (obj: { value: string, error: boolean }) => void, 
    customError?: string,
    className?: string
}
/**
 * Renders a text inputfield. Provides error message if incorrect data is entered to the field.
 * 
 * @param {object} props - Props for the component.
 * @returns {JSX} - JSX to render to the DOM. 
 */
const TextField: React.FC<Props> = ({className, label, validate = false, required = false, max = 1000, min = 0, placeholder, sanitize = false, onChange, customError }) => {
    const [isError, setIsError ] = useState<string>("")

    const _onChangeHandler = (value: string) => {
        if (validate) {
            validateInput(value)
        } else {
            setIsError("")
            onChange({ value: value, error: false})
        }
        
    }

    const validateInput = (value: string) => {
        if (value.length < min ) {
            onChange({ value: '', error: true })
            setIsError(`Must be longer than ${min} character`)
        } else if (value.length > max ) {
            onChange({ value: '', error: true })
            setIsError(`Must be shorter than ${max} character` )
        } else {
            setIsError("")
            onChange({ value: value, error: false})
        }
    }
    return (
        <div className={className}>
            <label>{label}</label>
            <input required={required} type="text" placeholder={placeholder} onChange={ event => { _onChangeHandler(event.currentTarget.value) }} />
            { isError && <p className="global-font-danger"> { isError } </p> }
            { customError && <p className="global-font-danger"> { customError } </p> }
        </div>
    )
}

export default TextField
