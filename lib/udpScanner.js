const { EventEmitter } = require('events');
const debug = require('debug')('udpScanner');
const dgram = require('dgram');

const broadcastMessage = new Buffer(`Hello, is it me you are looking for?`);
const expectedResponse = new Buffer('yes go to ');


class UdpScanner extends EventEmitter {
    constructor(config) {
        super();

        Object.assign(this, config);

        this.broadcast = this.broadcast.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
    }

    start() {
        this.socket = dgram.createSocket('udp4');

        const { socket, hostPort, scanInterval } = this;
        socket.bind(hostPort);
        socket.on('listening', () => socket.setBroadcast(true));
        socket.on('message', this.handleMessage);

        this.intervalId = setInterval(this.broadcast, scanInterval);
        this.broadcast();
    }

    broadcast() {
        const { broadcastIPs, targetPort, socket } = this;
        broadcastIPs.forEach(ip => {
            debug(`broadcasting to ${ ip }:${ targetPort }`);
            socket.send(broadcastMessage, 0, broadcastMessage.length, targetPort, ip);
        });
    }

    handleMessage(msg, rInfo) {
        const match = expectedResponse.compare(msg,
            0, expectedResponse.length,
            0, expectedResponse.length) === 0;

        if (!match) { return; }

        const url = msg.toString('utf8', expectedResponse.length);

        debug(`server information available at ${ url }`);

        this.emit('found', url);
    }

    stop() {
        socket.close();
        clearInterval(this.intervalId);
    }
}

module.exports = UdpScanner;
