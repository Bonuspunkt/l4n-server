import React from 'react';

import UserDisplay from '../component/UserDisplay';

const LobbyPlayers = ({ lobby, users }) => {
    const lobbyUsers = lobby.users.map(userId => users.find(u => u.id === userId));
    const usersEls = lobbyUsers.map(user => (
        <li key={user.id}>
            <UserDisplay user={user} displayOnline />
        </li>
    ));

    return (
        <div>
            Players:
            <ul>{usersEls}</ul>
        </div>
    );
};

export default LobbyPlayers;
