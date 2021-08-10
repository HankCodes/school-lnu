import React from 'react'
import QuickMenu from '../QuickMenu/QuickMenu'
import './Footer.css'

const Footer: React.FC = () => {

    return (
        <footer className="Footer">
            <div className="Footer__quick-menu-wrapper">
                <QuickMenu />
            </div>
        </footer>
    )
}

export default Footer
