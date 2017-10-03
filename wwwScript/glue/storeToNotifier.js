export default function storeToNotifier(resolve) {
    const store = resolve('store');
    const notifier = resolve('notifier');

    store.addMiddleware(store => next => reducer => {
        const oldState = store.getState();
        const newState = reducer(oldState);

        const { lobbies: oldLobbies = [] } = oldState;
        const { user, lobbies: newLobbies = [] } = newState;

        const lobbyDummy = { users: [] };

        const newLobby = newLobbies.find(lobby => lobby.users.includes(user.id)) || lobbyDummy;
        const oldLobby = oldLobbies.find(lobby => lobby.users.includes(user.id)) || newLobby;

        if (
            newLobby.userId === user.id &&
            newLobby.state === 0 &&
            oldLobby.users.length < oldLobby.minPlayers &&
            newLobby.users.length >= newLobby.minPlayers
        ) {
            notifier.notify({
                title: newLobby.name,
                body: `please launch the ${newLobby.game} server`,
                url: `/lobby/${newLobby.id}`,
            });
        }
        if (
            oldLobby.state !== newLobby.state &&
            newLobby.state === 2 &&
            newLobby.userId !== user.id
        ) {
            notifier.notify({
                title: newLobby.name,
                body: 'join the game',
                url: `/lobby/${newLobby.id}`,
            });
        }

        return next(() => newState);
    });
}
