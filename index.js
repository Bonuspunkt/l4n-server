#!/usr/bin/env node
const { Resolver } = require('l4n-common');
const { register, resolve } = new Resolver();

register('settings', () => require('./settings'));

const db = require('./lib/db')(resolve);
register('db', () => db);

const UserRepo = require('./lib/userRepo');
const userRepo = new UserRepo(resolve);
register('userRepo', () => userRepo);

const LobbyRepo = require('./lib/lobbyRepo');
const lobbyRepo = new LobbyRepo(resolve);
register('lobbyRepo', () => lobbyRepo);

const { Store } = require('repatch');
const publicStore = new Store({
    lanName: 'vulkan44',
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

const httpServer = require('./lib/httpServer')(resolve);
register('httpServer', () => httpServer);

const webSocketServer = require('./lib/webSocketServer')(resolve);
register('webSocketServer', () => webSocketServer);

// TODO: refactor
httpServer.get('*', (req, res) => {
    res.render('App', {
        url: req.path,
        ...publicStore.getState(),
        user: req.user,
        csrfToken: req.csrfToken(),
    });
});

require('./glue/storeToWebSocket')(resolve);
require('./glue/webSocketToStore')(resolve);

httpServer.listen(8080);
