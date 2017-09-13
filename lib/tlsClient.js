const { EventEmitter } = require('events');
const tls = require('tls');
const debug = require('debug')('l4n:server:tlsClient');
const { MessageParser } = require('l4n-common');

class TlsClient extends EventEmitter {
    constructor({ resolve, host, port }) {
        super();

        const { tlsClient } = resolve('settings');
        this.socket = tls.connect({
            ...tlsClient,
            host,
            port,
        });

        const parser = new MessageParser();
        parser.on('status', status => this.emit('status', status));
        parser.on('update', update => this.emit('update', update));
        parser.on('ping', () => this.write('pong'));

        this.socket.on('secureConnect', () => this.status());
        this.socket.on('close', (...args) => {
            clearTimeout(this.timeoutId);
            this.emit('close', ...args);
        });
        this.socket.on('error', (...args) => this.emit('error', ...args));
        this.socket.pipe(parser);
    }

    write(command, argument) {
        debug(`${command} ${argument ? argument : ''}`);
        clearTimeout(this.timeoutId);

        if (!argument) {
            this.socket.write(`${command}\n`);
        } else {
            this.socket.write(`${command} ${JSON.stringify(argument)}\n`);
        }

        this.timeoutId = setTimeout(() => this.ping(), 60e3);
    }

    status() {
        this.write('status');
    }
    spawn(options) {
        this.write('spawn', options);
    }
    ping() {
        this.write('ping');
    }
}

module.exports = TlsClient;
