import React from 'react';
import Image from '../../atoms/Image/Image'
import './OauthButton.css'

interface IProps {
    icon: string,
    iconAlt: string,
    gitService: string,
    hasToken: boolean,
    onClick: () => void 
}

const OauthButton:React.FC<IProps> = ({ hasToken, onClick, icon, iconAlt }) => {
    const classes = hasToken ? '' : 'global-grayscale' 
    
    return (
        <div className="OauthButton global-glass" onClick={onClick}>
            <button>
                <Image className={classes} src={icon} alt={iconAlt} />
            </button>
        </div>
    )
}

export default OauthButton