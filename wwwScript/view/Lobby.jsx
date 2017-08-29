import React from 'react';

import DefaultLayout from './layout/Default';
import GameHeader from '../component/GameHeader';
import LobbyAction from '../component/LobbyAction';
import UserDisplay from '../component/UserDisplay';

const Lobby = (props) => {
    const { provider, game, lobby, user } = props;

    const users = lobby.users.map(user =>
        <li key={ user.id }><UserDisplay user={ user } /></li>
    );
    const action = lobby.users.length
        ? lobby.users.find(u => u.id === user.id)
            ? <LobbyAction { ...props } action="leave" />
            : <LobbyAction { ...props } action="join" />
        : <small>closed</small>;

    return (
        <DefaultLayout { ... props } title={ `lobby - ${ lobby.name }` }>
            <center>
                <GameHeader { ...game } />
                <div>hosted by { provider ? provider.name : <em>custom</em> }</div>
            </center>
            <h1>
                { lobby.name }
                { ' ' }
                { action }
            </h1>
            Players:
            <ul>{ users }</ul>
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
