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
    const React = require('react');
    const ReactDOMServer = require('react-dom/server');
    app.get('*', (req, res) => {
        const App = resolve('appView');
        const body =
            '<!DOCTYPE html>' +
            ReactDOMServer.renderToStaticMarkup(
                React.createElement(App, {
                    url: req.path,
                    ...publicStore.getState(),
                    user: req.user,
                    csrfToken: req.csrfToken(),
                }),
            );

        res.writeHead(200, { 'content-type': 'text/html' });
        res.end(body);
    });
    // !!!

    const { httpServer: { port = 8080 } } = resolve('settings');
    app.listen(port);
};
