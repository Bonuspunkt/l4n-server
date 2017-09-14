import React from 'react';

import DefaultLayout from './layout/Default';
import GameHeader from '../component/GameHeader';
import LobbyAction from '../component/LobbyAction';
import LobbyAdmin from '../component/LobbyAdmin';
import LobbyPlayers from '../component/LobbyPlayers';
import UserDisplay from '../component/UserDisplay';

const LobbyState = ({ lobby, user }) => {
    switch (lobby.state) {
        case 0:
            return 'waiting';
        case 1:
            return 'ready to launch';
        case 2:
            return 'launching';
        case 3:
            return 'open';
    }
};

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
            <h1>
                {lobby.name} <LobbyAction {...props} lobby={lobby} />
            </h1>
            <LobbyState {...props} lobby={lobby} />
            <LobbyAdmin {...props} lobby={lobby} />
            <LobbyPlayers {...props} lobby={lobby} />
        </DefaultLayout>
    );
};

export default Lobby;

/*
+------------------------------------------------------------------------------+
|                                                                              |
|                                 GAME IMAGE                                   |
|                                                                              |
+------------------------------------------------------------------------------+
|            Lobby [Name]                                                      |
|            State [Waiting / Ready]                                           |
|          Players [XX/YY] (ZZ Max)                                            |
|    LobbySettings [XXXXXXXXXXXXXXXXXXXXXXXX]                                  |
|    LobbySettings [XXXXXXXXXXXXXXXXXXXXXXXX]                                  |
|    LobbySettings [XXXXXXXXXXXXXXXXXXXXXXXX]                                  |
|                                                                              |
|     Players      [XXXXXXXXXXXXXXXXXXXXXXXX]                                  |
|                  [XXXXXXXXXXXXXXXXXXXXXXXX]                                  |
|                  [XXXXXXXXXXXXXXXXXXXXXXXX]                                  |
|                  [XXXXXXXXXXXXXXXXXXXXXXXX]                                  |
|                                                                              |
*/
