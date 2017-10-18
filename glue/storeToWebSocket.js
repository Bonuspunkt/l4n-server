const debug = require('debug')('l4n:server:glue:hookStoreToWebSocket');
const { diff } = require('json-diff-rfc6902');

module.exports = resolve => {
    const store = resolve('publicStore');
    const webSocketServer = resolve('webSocketServer');

    store.addMiddleware(store => next => reducer => {
        const state = store.getState();
        const nextState = reducer(state);

        const patch = diff(state, nextState);
        if (!patch.length) return;
        debug(patch);
        webSocketServer.broadcast({ patch });

        return next(() => nextState);
    });
};
