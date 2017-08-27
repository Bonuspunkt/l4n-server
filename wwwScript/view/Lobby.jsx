import React from 'react';

import DefaultLayout from './layout/Default';
import GameHeader from '../component/GameHeader';
import UserDisplay from '../component/UserDisplay';

const Lobby = (props) => {
    const { provider, game, lobby } = props;

    const users = lobby.users.map(user => <UserDisplay key={ user.id } user={ user } />);

    return (
        <DefaultLayout { ... props }>
            <center>
                <GameHeader { ...game } />
                <div>hosted by { provider.name }</div>
            </center>
            <h1>{ lobby.name }</h1>
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
