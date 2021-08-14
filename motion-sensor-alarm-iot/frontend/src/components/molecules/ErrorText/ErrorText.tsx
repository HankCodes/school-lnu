import React from 'react'

interface IProps {
    text: string
}

const ErrorText: React.FC<IProps> = ({ text }) => {
    return (
        <div className="ErrorText global-font-danger">
            <span className="ErrorText__text">{text}</span>
        </div>
    )
}

export default ErrorText
