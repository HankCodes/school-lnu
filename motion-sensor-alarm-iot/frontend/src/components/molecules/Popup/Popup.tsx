import React from 'react'
import './Popup.css'

interface IProps {
    onClose: () => void
}

const Popup: React.FC<IProps> = ({ onClose, children }) => {
    return (
        <div className="Popup">
            <div className="Popup__window">
               <div className="Popup__window--top-bar">
                    <p 
                        className="Popup__window--top-bar--close"
                        onClick={onClose}
                        >
                            Close
                    </p>   
                </div> 
                <div className="Popup__window--content">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Popup
