import React from 'react';
import LobbyActionButton from '../component/LobbyActionButton';

const mainAction = props => {
    const { lobbies, lobby, user } = props;

    if (!user) return null;

    const participatingLobby = lobbies.find(l => l.users.includes(user.id));
    if (participatingLobby) {
        if (participatingLobby.id !== lobby.id) return null;

        if (lobby.userId === user.id) {
            return <LobbyActionButton key="destroy" {...props} className="danger" action="destroy" />;
        }
        if (lobby.users.some(userId => userId === user.id)) {
            return <LobbyActionButton key="leave" {...props} action="leave" />;
        }
        return null;
    }
    if (lobby.users.length < lobby.maxPlayers) {
        return <LobbyActionButton key="join" {...props} action="join" />;
    }
    return null;
};
const actions = [];

const lobbyActionRegistry = {
    register(fn) {
        actions.push(fn);
    },
    getMainAction(props) {
        return mainAction(props);
    },
    resolve(props) {
        return [mainAction(props)].concat(actions.map(fn => fn(props)));
    },
};

export default lobbyActionRegistry;
