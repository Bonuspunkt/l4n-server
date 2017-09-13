const { EventEmitter } = require('events');
const debug = require('debug')('l4n:server:udpScanner');
const dgram = require('dgram');

const broadcastMessage = new Buffer(`¿l4n?`);
const urlPattern = new RegExp('^(\\w+)://(.+):(\\d+)$');

class UdpScanner extends EventEmitter {
    constructor(resolve) {
        super();

        const { udpScanner = {} } = resolve('settings');

        Object.assign(this, udpScanner);

        this.broadcast = this.broadcast.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
    }

    start() {
        this.socket = dgram.createSocket('udp4');

        const { socket, hostPort = 20000, scanInterval = 30e3 } = this;
        socket.bind(hostPort);
        socket.on('listening', () => socket.setBroadcast(true));
        socket.on('message', this.handleMessage);
        socket.on('error', error => debug(error));

        this.intervalId = setInterval(this.broadcast, scanInterval);
        this.broadcast();
    }

    broadcast() {
        const { targetPort = 19999, socket } = this;
        const ip = '255.255.255.255';

        debug(`broadcasting to ${ip}:${targetPort}`);
        socket.send(broadcastMessage, 0, broadcastMessage.length, targetPort, ip);
    }

    handleMessage(msg, rInfo) {
        const url = msg.toString('utf8');
        const match = url.match(urlPattern);
        if (!match) {
            return debug(`url did not match mattern - ${url}`);
        }

        debug(`found ${url}`);
        const [, protocol, host, port] = match;

        this.emit('found', { protocol, host, port });
    }

    stop() {
        const { socket, intervalId } = this;
        socket.close();
        clearInterval(intervalId);
    }
}

module.exports = UdpScanner;
