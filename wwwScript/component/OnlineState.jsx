import React from 'react';
import PropTypes from 'prop-types';
if (process.env.BROWSER) {
    require('./OnlineState.styl');
}

const OnlineState = ({ online }) => {
    const className = `onlineState onlineState-${online ? 'on' : 'off'}line`;
    return <span className={className} />;
};

OnlineState.propTypes = {
    online: PropTypes.bool,
};

export default OnlineState;
