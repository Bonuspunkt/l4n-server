import Store from 'repatch';
import WebSocket from './lib/webSocket';
import glueWebSocketToStore from './glue/webSocketToStore';
import clientRendering from './glue/clientRendering';

const init = ({ resolve, register }) => {
    register('loggedIn', () => () => !!store.getState().user);

    const store = new Store({ url: location.pathname });
    register('store', () => store);

    (function() {
        const debug = require('debug')('store');
        store.subscribe(() => debug('changed', store.getState()));
    })();

    const webSocket = new WebSocket(resolve);
    register('webSocket', () => webSocket);

    glueWebSocketToStore(resolve);

    clientRendering(resolve);
};

export default init;
