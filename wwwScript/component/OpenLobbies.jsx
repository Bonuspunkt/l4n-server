import React from 'react';

import lobbyActionRegistry from '../lib/lobbyActionRegistry';
import LobbyState from './LobbyState';

if (process.env.BROWSER) require('./OpenLobbies.styl');

const LobbyUserCount = ({ lobby }) => {
    if (lobby.minPlayers === lobby.maxPlayers) {
        return `${lobby.users.length} / ${lobby.maxPlayers}`;
    }
    return `${lobby.users.length} / ${lobby.minPlayers}-${lobby.maxPlayers}`;
};
const LobbyType = ({ lobby: { userId } }) => {
    if (userId > 0) {
        return 'U';
    }
    return 'S';
};

const LobbyRow = props => {
    const { lobby } = props;
    const { id, game, mode, name } = lobby;

    return (
        <li className="lobbyRow">
            <div className="lobbyRow-type">
                <LobbyType {...props} />
            </div>
            <div className="lobbyRow-game">
                {game}
                <small>{mode}</small>
            </div>
            <div className="lobbyRow-name">
                <a href={`/lobby/${id}`}>{name}</a>
            </div>
            <div className="lobbyRow-players">
                <LobbyUserCount lobby={lobby} />
            </div>
            <div className="lobbyRow-state">
                <LobbyState lobby={lobby} />
            </div>
            <div className="lobbyRow-action">
                {lobbyActionRegistry.getMainAction({ ...props, lobby })}
            </div>
        </li>
    );
};

const OpenNewLobby = ({ lobbies, user }) => {
    if (!user) return null;

    const inLobby = lobbies.some(lobby => lobby.users.includes(user.id));
    if (inLobby) return null;

    return (
        <a className="button" href="/lobby">
            Open Lobby
        </a>
    );
};

const OpenLobbies = props => {
    const { lobbies } = props;

    const lobbyDisplays = lobbies.map(lobby => (
        <LobbyRow key={lobby.id} {...props} lobby={lobby} />
    ));

    return (
        <article>
            <h2>Open Lobbies</h2>
            <ul className="openLobbies">
                <li className="lobbyRow lobbyRowHeader">
                    <div className="lobbyRow-type" />
                    <div className="lobbyRow-game">Game</div>
                    <div className="lobbyRow-name">Lobby</div>
                    <div className="lobbyRow-players">Players</div>
                    <div className="lobbyRow-state">State</div>
                    <div className="lobbyRow-action" />
                </li>
                {lobbyDisplays}
            </ul>
            <OpenNewLobby {...props} />
        </article>
    );
};

export default OpenLobbies;
