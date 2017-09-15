import React from 'react';

import DefaultLayout from './layout/Default';
import GameHeader from '../component/GameHeader';
import LobbyAction from '../component/LobbyAction';
import LobbyAdmin from '../component/LobbyAdmin';
import LobbyState from '../component/LobbyState';
import LobbyUsers from '../component/LobbyUsers';
import UserDisplay from '../component/UserDisplay';

const Lobby = props => {
    const { lobbyId, lobbies, providers, users } = props;

    const lobby = lobbies.find(l => l.id === lobbyId);
    if (!lobby) {
        return (
            <DefaultLayout {...props} title={`lobby - destroyed`}>
                could not find lobby
            </DefaultLayout>
        );
    }

    const hostUser = users.find(u => u.id === lobby.userId);
    const provider = providers.find(p => p.name === lobby.provider);
    const game = provider ? provider.games.find(g => g.id === lobby.game) : { name: lobby.game };

    const host = hostUser ? (
        <em>
            <UserDisplay user={hostUser} />
        </em>
    ) : (
        provider.name
    );

    return (
        <DefaultLayout {...props} title={`lobby - ${lobby.name}`}>
            <center>
                <GameHeader {...game} />
                <div>hosted by {host}</div>
            </center>
            <h1>{lobby.name}</h1>

            <LobbyAction {...props} lobby={lobby} />
            <LobbyAdmin {...props} lobby={lobby} />

            <label className="formField">
                <span className="formField-label">Status</span>
                <input className="formField-input" value={LobbyState({ lobby })} readOnly />
            </label>
            <label className="formField">
                <span className="formField-label">Players</span>
                <input
                    className="formField-input"
                    value={`${lobby.users.length} / ${lobby.minPlayers}-${lobby.maxPlayers}`}
                    readOnly
                />
            </label>
            <LobbyUsers {...props} lobby={lobby} />
            <pre>{JSON.stringify(lobby, null, '  ')}</pre>
        </DefaultLayout>
    );
};

export default Lobby;
