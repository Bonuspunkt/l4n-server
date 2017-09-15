import React from 'react';

if (process.env.BROWSER) {
    require('./LobbyUsers.styl');
}

import OnlineState from './OnlineState';
import UserDisplay from './UserDisplay';

const LobbyPlayers = ({ lobby, users }) => {
    const lobbyUsers = lobby.users.map(userId => users.find(u => u.id === userId));
    const usersEls = lobbyUsers.map(user => {
        // user == lobby.userId
        // [KICK]

        return (
            <li key={user.id}>
                <OnlineState online={user.online} /> <UserDisplay user={user} />
            </li>
        );
    });

    return (
        <div className="lobbyUsers">
            Players:
            <ul className="lobbyUsers-list">{usersEls}</ul>
        </div>
    );
};

export default LobbyPlayers;
