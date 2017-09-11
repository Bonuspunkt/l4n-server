import React from 'react';

import DefaultLayout from './layout/Default';
import GameHeader from '../component/GameHeader';
import LobbyAction from '../component/LobbyAction';
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

    const lobbyUsers = lobby.users.map(userId => users.find(u => u.id === userId));
    const provider = providers.find(p => p.name === lobby.provider);
    const game = provider ? provider.games.find(g => g.id === lobby.game) : { name: lobby.game };

    const usersEls = lobbyUsers.map(user => (
        <li key={user.id}>
            <UserDisplay user={user} displayOnline />
        </li>
    ));

    return (
        <DefaultLayout {...props} title={`lobby - ${lobby.name}`}>
            <center>
                <GameHeader {...game} />
                <div>hosted by {provider ? provider.name : <em>custom</em>}</div>
            </center>
            <h1>
                {lobby.name} <LobbyAction {...props} lobby={lobby} />
            </h1>
            Players:
            <ul>{usersEls}</ul>
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
