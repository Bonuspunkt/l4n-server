import React from 'react';
if (process.env.BROWSER) {
    require('./Overlay.styl');
}

const abort = e => e.stopPropagation();

const Overlay = ({ children, onClick }) => {
    return (
        <div className="overlay" onClick={onClick}>
            <div onClick={abort}>{children}</div>
        </div>
    );
};

export default Overlay;
