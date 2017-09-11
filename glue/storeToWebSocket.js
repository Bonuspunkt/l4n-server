const debug = require('debug')('l4n:server:glue:hookStoreToWebSocket');
const jDiff = require('json-diff-rfc6902');

module.exports = function(resolve) {
    const store = resolve('publicStore');
    const webSocketServer = resolve('webSocketServer');

    store.addMiddleware(store => next => reducer => {
        const state = store.getState();
        const nextState = reducer(state);

        const patch = jDiff.diff(state, nextState);
        debug(patch);
        webSocketServer.broadcast({ patch });

        return next(() => nextState);
    });
};
