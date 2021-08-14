import React, { useState } from 'react'

interface Props {
    label?: string,
    validate?: boolean,
    required?: boolean,
    max?: number,
    min?: number,
    placeholder?: string | undefined,
    onChange: (object: any) => void,
    className?: string
}

/**
 * Render an inputfield for email with validation. Displays error message to the uer if
 * faulty mail format is entered.
 * 
 * @param {object} props - props for the coponent
 * @returns {jsx} - JSX to render 
 */
const EmailField: React.FC<Props> = ({ className, label, validate = false, required = false, max = 1000, min = 0, placeholder, onChange }) => {
    const [isError, setIsError ] = useState<string>("")

    const _onChangeHandler = (value: string): void => {     
        if (validate) {
            _validateInput(value)
        } else {
            setIsError("")
            onChange({ value: value, error: false})
        }
    }

    const _validateInput = (value: string): void => {
        if (!(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/).test(value)) {
            onChange({ value: '', error: true })
            setIsError('Valid email format is "example@email.com or example@ema.il.com')

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
        </div>
    )
}

export default EmailField
