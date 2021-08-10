import React from 'react' 
import './IndexPage.css'

interface IProps {
   Header: React.FC,
   Left: React.FC,
   Right: React.FC
}

const Indexpage: React.FC<IProps> = ({ Header, Left, Right }) => {
   return (
      <main className="IndexPage">
         <header className="IndexPage__header">
           <Header /> 
         </header>
         <div className="IndexPage__content-wrapper">
            <div className="IndexPage__content-wrapper--left">
               <Left />
            </div>
            <div className="IndexPage__content-wrapper--right global-glass">
               <Right />
            </div>
         </div>
      </main>
   ) 
}

export default Indexpage
