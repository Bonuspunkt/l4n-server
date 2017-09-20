import React from 'react';

if (process.env.BROWSER) {
    require('./LobbyUsers.styl');
}

import CsrfToken from './CsrfToken';
import OnlineState from './OnlineState';
import UserDisplay from './UserDisplay';

const PlayerKick = props => {
    const { lobby, user = {}, lobbyUser } = props;
    if (lobby.userId !== user.id) return null;
    if (lobby.userId === lobbyUser.id) return null;

    const action = `/lobby/${lobby.id}/user/${lobbyUser.id}`;

    return (
        <form className="inline" action={action} method="POST">
            <CsrfToken {...props} />
            <input type="hidden" name="action" value="kick" />
            <button type="submit">KICK</button>
        </form>
    );
};

const LobbyPlayers = props => {
    const { lobby, users } = props;
    const lobbyUsers = lobby.users.map(userId => users.find(u => u.id === userId));
    const usersEls = lobbyUsers.map(lobbyUser => {
        return (
            <li key={lobbyUser.id}>
                <OnlineState online={lobbyUser.online} /> <UserDisplay user={lobbyUser} />{' '}
                <PlayerKick {...props} lobbyUser={lobbyUser} />
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
