#!/usr/bin/env node
const os = require('os');

const Resolver = require('./lib/resolver');
const { register, resolve } = new Resolver();

register('settings', () => require('./settings'));

const db = require('./lib/db')(resolve);
register('db', () => db);

const userRepo = require('./lib/userRepo')(resolve);
register('userRepo', () => userRepo);

const lobbyRepo = require('./lib/lobbyRepo')(resolve);
register('lobbyRepo', () => lobbyRepo);

register('handleScannerFound', require('./glue/handleScannerFound'))

const HttpsClient = require('./lib/httpsClient');
const httpsClient = new HttpsClient(resolve);
register('httpsClient', () => httpsClient);

const UdpScanner = require('./lib/udpScanner');
const scanner = new UdpScanner(resolve);
scanner.on('found', resolve('handleScannerFound'));
scanner.start();

const Store = new require('./lib/Store');
const publicStore = new Store('public', {
    lanName: 'vulkan44',
    lobbies: [],
    providers: [],
});
register('publicStore', () => publicStore);

const privateStore = new Store('private', {
    providers: []
});
register('privateStore', () => privateStore);

const httpServer = require('./lib/httpServer')(resolve);
httpServer.listen(8080);
