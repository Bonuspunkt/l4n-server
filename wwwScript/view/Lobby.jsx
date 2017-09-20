import React from 'react';

import DefaultLayout from './layout/Default';
import GameHeader from '../component/GameHeader';
import Hoster from '../component/Hoster';
import LobbyAction from '../component/LobbyAction';
import LobbyAdmin from '../component/LobbyAdmin';
import LobbyState from '../component/LobbyState';
import LobbyUsers from '../component/LobbyUsers';
import CommonMark from '../component/CommonMark';

const Lobby = props => {
    const { lobbyId, lobbies, providers } = props;

    const lobby = lobbies.find(l => l.id === lobbyId);
    if (!lobby) {
        return (
            <DefaultLayout {...props} title={`lobby - destroyed`}>
                could not find lobby
            </DefaultLayout>
        );
    }

    const provider = providers.find(p => p.name === lobby.provider);
    const game = provider ? provider.games.find(g => g.id === lobby.game) : { name: lobby.game };

    return (
        <DefaultLayout {...props} title={`lobby - ${lobby.name}`}>
            <center>
                <GameHeader {...game} />
                <div>
                    hosted by <Hoster {...props} lobby={lobby} />
                </div>
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
            <CommonMark text={lobby.publicInfo} />
        </DefaultLayout>
    );
};

export default Lobby;
