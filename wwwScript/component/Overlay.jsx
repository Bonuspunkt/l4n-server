import React from 'react';
import './Overlay.styl'

const Overlay = ({ children, onClick }) => {
    return (
        <div className="overlay" onClick={ onClick }>
            { children }
        </div>
    );
};

export default Overlay;
