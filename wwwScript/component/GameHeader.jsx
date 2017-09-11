import React from 'react';

// http://cdn.edgecast.steamstatic.com/steam/apps/440/capsule_sm_120.jpg
// http://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg

const GameHeader = ({ steamId, name }) => {
    if (steamId) {
        return (
            <a href={`http://store.steampowered.com/app/${steamId}/`}>
                <img src={`/static/steam/header/${steamId}.jpg`} alt={name} />
            </a>
        );
    }
    return name;
};

export default GameHeader;
