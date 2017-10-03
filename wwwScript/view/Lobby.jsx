import React from 'react';

import DefaultLayout from './layout/Default';
import LobbyHeader from '../component/LobbyHeader';
import LobbyActionBar from '../component/LobbyActionBar';
import LobbyState from '../component/LobbyState';
import LobbyUsers from '../component/LobbyUsers';
import CommonMark from '../component/CommonMark';

const Lobby = props => {
    const { lobbyId, lobbies, user } = props;

    const lobby = lobbies.find(l => l.id === lobbyId);
    if (!lobby) {
        return (
            <DefaultLayout {...props} title={`lobby - destroyed`}>
                could not find lobby, maybe it was destroyed by its owner
            </DefaultLayout>
        );
    }

    const privateInfoEl =
        lobby.users.includes(user.id) && lobby.privateInfo ? (
            <CommonMark text={lobby.privateInfo} />
        ) : null;

    return (
        <DefaultLayout {...props} title={`lobby - ${lobby.name}`}>
            <LobbyHeader {...props} lobby={lobby} />

            <LobbyActionBar {...props} lobby={lobby} />

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
            {privateInfoEl}
            <LobbyUsers {...props} lobby={lobby} />
            <CommonMark text={lobby.publicInfo} />
        </DefaultLayout>
    );
};

export default Lobby;
