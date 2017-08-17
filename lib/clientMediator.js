const { EventEmitter } = require('events');
const https = require('https');
const { parse } = require('url');
const debug = require('debug')('clientMediator');

/*
const agent = new https.Agent({
    key:
});
*/

class ClientMediator extends EventEmitter {
    constructor(config) {
        super();
        Object.assign(this, config);
    }

    addClient(url) {
        //if (!this.agent) { this.initAgent(); }

        debug(`GET ${ url }`);
        const options = Object.assign({},
            parse(url),
            { rejectUnauthorized: false }
        );
        const request = https.get(options);
        request.on('error', ex => debug(ex));
        request.on('response', res => {
            if (res.headers['content-type'] !== 'application/json') {
                return res.destroy();
            }

            const buffers = [];
            res.on('data', chunk => buffers.push(chunk));
            res.on('end', () => {
                const result = Buffer.concat(buffers);
                debug(JSON.parse(result));
            });
        });
    }

    initAgent() {
        const { key, cert, ca } = this;
        this.agent = new https.Agent({ rejectUnauthorized: false });
    }

}


module.exports = ClientMediator;
