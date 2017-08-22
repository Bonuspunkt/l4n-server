const { EventEmitter } = require('events');
const https = require('https');
const { parse } = require('url');
const debug = require('debug')('l4n:server:clientMediator');

class ClientMediator extends EventEmitter {
    constructor(config) {
        super();
        Object.assign(this, config);
    }

    addClient(url) {
        const { rejectUnauthorized, ca, key, cert } = this;

        debug(`GET ${ url }`);
        const options = Object.assign({},
            parse(url),
            { rejectUnauthorized, ca, key, cert }
        );
        const request = https.get(options);
        request.on('error', ex => debug(ex));
        request.on('response', res => {
            if (res.headers['content-type'] !== 'application/json') {
                return res.destroy();
            }

            // NOTE: should have a max response length limit
            const buffers = [];
            res.on('data', chunk => buffers.push(chunk));
            res.on('end', () => {
                const result = Buffer.concat(buffers);
                debug(JSON.parse(result));
            });
        });
    }
}

module.exports = ClientMediator;
