import React from 'react';

import DefaultLayout from './layout/Default';
import LobbyHeader from '../component/LobbyHeader';
import LobbyAction from '../component/LobbyAction';
import LobbyAdmin from '../component/LobbyAdmin';
import LobbyState from '../component/LobbyState';
import LobbyUsers from '../component/LobbyUsers';
import CommonMark from '../component/CommonMark';

const Lobby = props => {
    const { lobbyId, lobbies } = props;

    const lobby = lobbies.find(l => l.id === lobbyId);
    if (!lobby) {
        return (
            <DefaultLayout {...props} title={`lobby - destroyed`}>
                could not find lobby, maybe it was destroyed by its owner
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout {...props} title={`lobby - ${lobby.name}`}>
            <LobbyHeader {...props} lobby={lobby} />

            <div className="">
                <LobbyAction {...props} lobby={lobby} />
                <LobbyAdmin {...props} lobby={lobby} />
            </div>

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
