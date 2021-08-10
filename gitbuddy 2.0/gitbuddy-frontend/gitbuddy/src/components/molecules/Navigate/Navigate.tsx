import React from 'react'
import { useHistory } from 'react-router'
import StandardButton from '../forms/buttons/StandardButton/StandardButton'

interface IProps {
    to?: string,
    text: string
}

const GoBack: React.FC<IProps> = ({ to, text }) => {
    const history = useHistory()
    
    return (
        <StandardButton buttonType="button" value={text} onClickHandler={() => { to ? history.push(to) : history.goBack() }} />
    )
}

export default GoBack
