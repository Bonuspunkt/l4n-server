import React from 'react';
import Overlay from './Overlay'

import './Popup.styl'

const Popup = ({ title, children, onClose }) => {
    return (
        <Overlay onClick={ onClose }>
            <div className="popup">
                <h3 className="popup-title">{ title }</h3>
                <div className="popup-content">
                    { children }
                </div>
                <div className="popup-footer">
                    <button type="button" onClick={ onClose }>close</button>
                </div>
            </div>
        </Overlay>
    );
};

export default Popup;
