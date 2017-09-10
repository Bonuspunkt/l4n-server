const debug = require('debug')('l4n:server:webSocketServer');
const { EventEmitter } = require('events');

module.exports = (resolve) => {

    const app = resolve('httpServer');
    const store = resolve('publicStore');

    const emitter = new EventEmitter();

    //
    // setup WebSockets
    //
    const wsInstance = require('express-ws')(app);
    const wss = wsInstance.getWss();
    app.ws('/', (ws, req) => {
        const { user } = req;
        if (!user) { return ws.close(); }

        debug(`${ user.name } connected`);

        const state = {
            ...store.getState(),
            user,
            csrfToken: req.csrfToken()
        };
        ws.send(JSON.stringify({ state }));

        emitter.emit('connect', { user, ws });

        ws.on('close', () => {
            debug(`${ user.name } closed`);
            emitter.emit('close', { user, ws })
        });

        ws.on('error', () => {
            debug(`${ user.name } errored`);
        });

    });

    return emitter;
};
