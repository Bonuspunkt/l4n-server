const debug = require('debug')('glue:webSocketToStore');
import jDiff from 'json-diff-rfc6902';

export default function webSocketToStore(resolve) {
    const webSocket = resolve('webSocket');
    const store = resolve('store');

    webSocket.on('state', ({ state }) =>
        store.dispatch(() => ({ ...state, url: location.pathname })),
    );

    webSocket.on('patch', ({ patch }) =>
        store.dispatch(state => {
            const newState = { ...state };
            jDiff.apply(newState, patch);
            return newState;
        }),
    );
    webSocket.on('message', (...args) => debug('undhandled message', ...args));
}
