const debug = require('debug')('glue:webSocketToStore');
import { apply_patch } from 'jsonpatch';

export default function webSocketToStore(resolve) {
    const webSocket = resolve('webSocket');
    const store = resolve('store');

    webSocket.on('state', ({ state }) =>
        store.dispatch(() => ({ ...state, url: location.pathname })),
    );

    webSocket.on('patch', ({ patch }) => store.dispatch(state => apply_patch(state, patch)));
    webSocket.on('message', (...args) => debug('undhandled message', ...args));
}
