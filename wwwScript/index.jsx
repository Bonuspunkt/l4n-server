import 'babel-polyfill';
import 'webrtc-adapter';
import './core.styl';

import Store from 'repatch';
import Notifier from './lib/Notifier';
import WebSocket from './lib/webSocket';

import glueWebSocketToStore from './glue/webSocketToStore';
import clientRendering from './glue/clientRendering';
import glueStoreToNotifier from './glue/storeToNotifier';

const init = ({ resolve, register }) => {
    // register
    register('loggedIn', () => () => !!store.getState().user);

    const store = new Store({ url: location.pathname });
    register('store', () => store);

    (function() {
        const debug = require('debug')('store');
        store.subscribe(() => debug('changed', store.getState()));
    })();

    const notifier = new Notifier(resolve);
    register('notifier', () => notifier);

    const webSocket = new WebSocket(resolve);
    register('webSocket', () => webSocket);

    // glue
    glueWebSocketToStore(resolve);
    glueStoreToNotifier(resolve);

    clientRendering(resolve);
};

export default init;
