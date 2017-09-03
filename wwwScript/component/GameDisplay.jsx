import React from 'react';
import PropTypes from 'proptypes';

    // http://cdn.edgecast.steamstatic.com/steam/apps/440/capsule_sm_120.jpg
    // http://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg


const GameDisplay = ({ steamId, name }) => {
    if (steamId) {
        return (
            <a href={ `http://store.steampowered.com/app/${ steamId }/` }>
                <img src={ `/static/steam/capsule/${ steamId }.jpg` } alt={ name } />
            </a>
        )
    }
    return name;
};

GameDisplay.propTypes = {
    name: PropTypes.string.isRequired,
    steamId: PropTypes.number
};

export default GameDisplay;
