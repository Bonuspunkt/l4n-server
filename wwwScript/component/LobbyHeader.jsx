import React from 'react';
import UserDisplay from './UserDisplay';

if (process.env.BROWSER) require('./LobbyHeader.styl');
// http://cdn.edgecast.steamstatic.com/steam/apps/440/capsule_sm_120.jpg
// http://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg

const LobbyHeader = ({ lobby, providers, users }) => {
    const provider = providers.find(p => p.name === lobby.provider);
    const user = users.find(u => u.id === lobby.userId);

    const hosterEl = user ? (
        <em>
            <UserDisplay user={user} />
        </em>
    ) : (
        provider.name
    );

    return (
        <div className="lobbyHeader">
            <h2>{lobby.game}</h2>
            <h3>{lobby.mode}</h3>
            hosted by {hosterEl}
            <h1>{lobby.name}</h1>
        </div>
    );
};

export default LobbyHeader;
