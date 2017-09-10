#!/usr/bin/env node
const os = require('os');

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

register('handleScannerFound', require('./glue/handleScannerFound'))

/*
const HttpsClient = require('./lib/httpsClient');
const httpsClient = new HttpsClient(resolve);
register('httpsClient', () => httpsClient);
*/
const TlsClient = require('./lib/tlsClient');


const UdpScanner = require('./lib/udpScanner');
const scanner = new UdpScanner(resolve);
scanner.on('found', resolve('handleScannerFound'));
scanner.start();

const Store = new require('./lib/Store');
const publicStore = new Store('public', {
    lanName: 'vulkan44',
    lobbies: lobbyRepo.allOpen(),
    providers: [],
    users: userRepo.all()
});
register('publicStore', () => publicStore);

require('./glue/lobbyRepoToStore')(resolve);
require('./glue/userRepoToStore')(resolve);

const privateStore = new Store('private', {
    providers: []
});
register('privateStore', () => privateStore);

const httpServer = require('./lib/httpServer')(resolve);
register('httpServer', () => httpServer);

const webSocketServer = require('./lib/webSocketServer')(resolve);
register('webSocketServer', () => webSocketServer);

httpServer.get('*', (req, res) => {
    res.render('App', Object.assign(
        { url: req.path },
        publicStore.getState(),
        { user: req.user, csrfToken: req.csrfToken() })
    );
});

require('./glue/storeToWebSocket')(resolve);
require('./glue/webSocketToStore')(resolve);


httpServer.listen(8080);
