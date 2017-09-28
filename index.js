module.exports = ({ register, resolve }) => {
    const db = require('./lib/db')(resolve);
    register('db', () => db);

    const UserRepo = require('./lib/userRepo');
    const userRepo = new UserRepo(resolve);
    register('userRepo', () => userRepo);

    const LobbyRepo = require('./lib/lobbyRepo');
    const lobbyRepo = new LobbyRepo(resolve);
    register('lobbyRepo', () => lobbyRepo);

    const { Store } = require('repatch');
    const { lanName = 'l4n.at' } = resolve('settings');
    const publicStore = new Store({
        lanName,
        lobbies: [],
        providers: [],
        users: [],
    });
    register('publicStore', () => publicStore);

    require('./glue/lobbyRepoToStore')(resolve);
    require('./glue/userRepoToStore')(resolve);

    const privateStore = new Store({});
    register('privateStore', () => privateStore);

    const app = require('./lib/app')(resolve);
    register('app', () => app);

    const webSocketServer = require('./lib/webSocketServer')(resolve);
    register('webSocketServer', () => webSocketServer);

    require('./glue/storeToWebSocket')(resolve);
    require('./glue/webSocketToStore')(resolve);

    // TODO: refactor, needs to be last route
    const renderView = require('./lib/renderView')(resolve);
    register('renderView', () => renderView);
    app.get('*', renderView());
    // !!!

    const { httpServer: { port = 8080 } } = resolve('settings');
    app.listen(port);
};
