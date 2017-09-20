import React from 'react';

// http://cdn.edgecast.steamstatic.com/steam/apps/440/capsule_sm_120.jpg
// http://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg

const GameDisplay = ({ lobby, providers }) => {
    const game = lobby.provider
        ? providers.find(p => p.name === lobby.provider)
        : { name: lobby.game };

    const { steamId, name } = game;

    if (steamId) {
        return (
            <a href={`http://store.steampowered.com/app/${steamId}/`}>
                <img src={`/static/steam/capsule/${steamId}.jpg`} alt={name} />
            </a>
        );
    }
    return name;
};

export default GameDisplay;
