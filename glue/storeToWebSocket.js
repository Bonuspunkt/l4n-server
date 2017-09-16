const debug = require('debug')('l4n:server:glue:hookStoreToWebSocket');
const { compare } = require('fast-json-patch');

module.exports = function(resolve) {
    const store = resolve('publicStore');
    const webSocketServer = resolve('webSocketServer');

    store.addMiddleware(store => next => reducer => {
        const state = store.getState();
        const nextState = reducer(state);

        const patch = compare(state, nextState);
        if (!patch.length) return;
        debug(patch);
        webSocketServer.broadcast({ patch });

        return next(() => nextState);
    });
};
