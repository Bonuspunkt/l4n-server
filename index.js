#!/usr/bin/env node
const { Resolver } = require('l4n-common');
const { register, resolve } = new Resolver();

const settings = require('./settings');
register('settings', () => settings);

const db = require('./lib/db')(resolve);
register('db', () => db);

const UserRepo = require('./lib/userRepo');
const userRepo = new UserRepo(resolve);
register('userRepo', () => userRepo);

const LobbyRepo = require('./lib/lobbyRepo');
const lobbyRepo = new LobbyRepo(resolve);
register('lobbyRepo', () => lobbyRepo);

const { Store } = require('repatch');
const { lanName = 'l4n.at' } = settings;
const publicStore = new Store({
    lanName,
    lobbies: [],
    providers: [],
    users: [],
});
register('publicStore', () => publicStore);

require('./glue/lobbyRepoToStore')(resolve);
require('./glue/userRepoToStore')(resolve);

const privateStore = new Store({
    providers: [],
});
register('privateStore', () => privateStore);

const app = require('./lib/app')(resolve);
register('app', () => app);

const webSocketServer = require('./lib/webSocketServer')(resolve);
register('webSocketServer', () => webSocketServer);

// TODO: refactor, needs to be last route
app.get('*', (req, res) => {
    res.render('App', {
        url: req.path,
        ...publicStore.getState(),
        user: req.user,
        csrfToken: req.csrfToken(),
    });
});

require('./glue/storeToWebSocket')(resolve);
require('./glue/webSocketToStore')(resolve);

const { httpServer: { port = 8080 } } = settings;
app.listen(port);
