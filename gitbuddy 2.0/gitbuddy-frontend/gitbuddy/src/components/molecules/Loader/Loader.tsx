import React from 'react';
import './Loader.css'

const Loader:React.FC = () => {
    return ( 
        <div className="Loader">
            <h1 className="Loader__content--headline">GitBuddy</h1>
            <div className="Loader__content--dots">
                <div className="Loader__content--dot dot-1" ></div>    
                <div className="Loader__content--dot dot-2" ></div>    
                <div className="Loader__content--dot dot-3" ></div>    
            </div> 
        </div>
    )
}

export default Loader
