#!/usr/bin/env node
const os = require('os');

const ClientMediator = require('./lib/clientMediator');
const mediator = new ClientMediator({
    key: null,
    cert: null,
    ca: null,
});

const interfaces = os.networkInterfaces();
const broadcastIPs = Object.keys(interfaces)
    .map(key => interfaces[key])
    .reduce((prev, curr) => prev.concat(curr))
    .filter(interface => interface.family === 'IPv4' && !interface.internal)
    .map(interface => interface.address.replace(/\.\d+$/, '.255'));

const UdpScanner = require('./lib/udpScanner');
const scanner = new UdpScanner({
    broadcastIPs,
    hostPort: 20000,
    targetPort: 19999,
    scanInterval: 3e4
});
scanner.on('found', url => mediator.addClient(url))
scanner.start();

const httpServer = require('./lib/httpServer');
httpServer.listen(8080);
