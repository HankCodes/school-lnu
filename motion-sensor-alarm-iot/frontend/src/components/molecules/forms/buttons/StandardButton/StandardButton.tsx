import React from 'react'

interface Props {
    onClickHandler?: (event: React.MouseEvent<HTMLInputElement>) => void,
    value: string,
    buttonType: string,
    className?: string
}

const StandardButton: React.FC<Props> = ({ className, buttonType, onClickHandler, value }) => {
      return ( 
        <>
            <input className={className} type={buttonType} onClick={onClickHandler} value={value}/>
        </>
    )
}

export default StandardButton
