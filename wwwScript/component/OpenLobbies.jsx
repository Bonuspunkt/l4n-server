import React from 'react';

import GameDisplay from './GameDisplay';
import LobbyAction from './LobbyAction';

const LobbyDisplay = (props) => {
    const { lobby, user } = props;
    const { id, provider, game, name, participating } = lobby;

    let action;

    if (!user) {
        action = null;
    } else if (participating) {
        action = (<LobbyAction { ...props } action="leave" />);
    } else {
        action = (<LobbyAction { ...props } action="join" />);
    }

    return (
        <div>
            { provider }
            <GameDisplay { ...game } />
            <a href={ `/lobby/${ id }` }>{ name }</a>
            { action }
        </div>
    );
};

const OpenLobbies = (props) => {
    const { openLobbies, user } = props;

    const lobbies = openLobbies.map(lobby =>
        <LobbyDisplay key={ lobby.id } { ...props } lobby={ lobby } />
    );

    return (
        <article>
            <h2>Open Lobbies</h2>
            { lobbies }

            <a className="button" href="/lobby/custom">Custom Lobby</a>
        </article>
    );
}


export default OpenLobbies;
