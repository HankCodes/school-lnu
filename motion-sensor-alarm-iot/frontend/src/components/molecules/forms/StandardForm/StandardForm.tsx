import React from 'react'

interface Props {
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => any,
    className?: string
}

const StandardForm: React.FC<Props> = ({ className, onSubmit, children }) => {

    return (
        <form className={className} onSubmit={onSubmit} >
            {children}
        </form>
    )
}

export default StandardForm
