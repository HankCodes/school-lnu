import React from 'react'
import './Image.css'

interface IProps {
    src: string,
    alt: string,
    className?: string
}

const Image: React.FC<IProps> = ({ className, src, alt }) => {
    const classes = className ? `Image ${className}` : 'Image'

    return <img className={classes} src={src} alt={alt} />
}

export default Image
