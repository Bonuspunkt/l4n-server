const debug = require('debug')('l4n:server:glue:hookupLobbyToStore');

function hookup(resolve) {
    const lobbyRepo = resolve('lobbyRepo');
    const publicStore = resolve('publicStore');

    publicStore.dispatch(state => ({
        ...state,
        lobbies: lobbyRepo.allOpen(),
    }));

    lobbyRepo.on('create', lobby => {
        debug('lobby created', lobby.id, lobby.name);

        publicStore.dispatch(state => ({
            ...state,
            lobbies: state.lobbies.concat([lobby]),
        }));
    });

    lobbyRepo.on('join', ({ lobbyId, userId }) => {
        debug('lobby joined', lobbyId, userId);

        publicStore.dispatch(state => ({
            ...state,
            lobbies: state.lobbies.map(
                lobby =>
                    lobby.id === lobbyId
                        ? { ...lobby, users: lobby.users.concat([userId]) }
                        : lobby,
            ),
        }));
    });

    lobbyRepo.on('leave', ({ lobbyId, userId }) => {
        debug('lobby left', lobbyId, userId);

        publicStore.dispatch(state => {
            const { lobbies } = state;
            const lobby = lobbies.find(l => l.id === lobbyId);
            const users = lobby.users.filter(user => user !== userId);

            return {
                ...state,
                lobbies: lobbies.map(l => (l.id === lobbyId ? { ...lobby, users } : l)),
            };
        });
    });

    lobbyRepo.on('update', ({ id, ...patch }) => {
        debug(`lobby ${id} changes ${JSON.stringify(patch)}`);

        publicStore.dispatch(state => ({
            ...state,
            lobbies: state.lobbies.map(lobby => (lobby.id === id ? { ...lobby, ...patch } : lobby)),
        }));
    });

    lobbyRepo.on('destroy', lobbyId => {
        debug(`lobby ${lobbyId} destroyed`);

        publicStore.dispatch(state => ({
            ...state,
            lobbies: state.lobbies.filter(lobby => lobby.id !== lobbyId),
        }));
    });
}

module.exports = hookup;
