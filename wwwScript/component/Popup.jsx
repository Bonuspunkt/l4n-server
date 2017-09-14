import React from 'react';
import Overlay from './Overlay';

if (process.env.BROWSER) {
    require('./Popup.styl');
}

const Popup = ({ title, children, onClose }) => {
    return (
        <Overlay onClick={onClose}>
            <div className="popup">
                <h3 className="popup-title">{title}</h3>
                <div className="popup-content">{children}</div>
            </div>
        </Overlay>
    );
};

export default Popup;
