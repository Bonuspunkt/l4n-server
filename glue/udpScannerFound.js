const TlsClient = require('../lib/TlsClient');
const debug = require('debug')('l4n:server:glue:udpScannerFound');

module.exports = function(resolve) {
    function getClient(protocol) {
        switch (protocol) {
            case 'tls':
                return TlsClient;
        }
    }

    const publicStore = resolve('publicStore');
    const privateStore = resolve('privateStore');
    publicStore.dispatch(state => ({ ...state, providers: []}));
    privateStore.dispatch(state => ({ ...state, providers: []}));

    const merge = entry => state => ({
        ...state,
        providers: state.providers
            .filter(p => p.key !== entry.key)
            .concat([entry])
            .sort((p1, p2) => p1.name > p2.name),
    });

    const remove = entry => state => ({
        ...state,
        providers: state.providers.filter(p => p.key !== entry.key),
    });

    const udpScanner = resolve('udpScanner');
    udpScanner.on('found', info => {
        const key = `${info.protocol}://${info.host}:${info.port}`;

        const alreadyPresent = privateStore.getState().providers.some(p => p.key === key);
        if (alreadyPresent) return;

        const Client = getClient(info.protocol);
        const client = new Client({ ...info, resolve });
        client.on('close', (...args) => {
            debug('close', ...args);
            privateStore.dispatch(remove({ key }));
            publicStore.dispatch(remove({ key }));
        });
        client.on('error', (...args) => debug('error', ...args));

        client.on('status', provider => {
            privateStore.dispatch(merge({ name: provider.name, key, client }));
            publicStore.dispatch(merge({ ...provider, key }));
        });
        client.on('update', (...args) => debug('update', ...args));
    });
};
