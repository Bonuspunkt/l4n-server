const debug = require('debug')('l4n:server:glue:handleScannerFound');

module.exports = function(resolve) {

    const handleScannerFound = (url) => {

        const httpsClient = resolve('httpsClient');
        const privateStore = resolve('privateStore');
        const publicStore = resolve('publicStore');

        const writeProviderUrlMapping = ({ name }, etag) => (state) => ({
            ...state,
            providers: state.providers
                .filter(p => p.name !== name)
                .concat([{ name, url, etag }])
                .sort((p1, p2) => p1.name > p2.name)
        });

        const mergeProviderInfo = (provider) => (state) => ({
            ...state,
            providers: state.providers
                .filter(p => p.name !== provider.name)
                .concat([provider])
                .sort((p1, p2) => p1.name > p2.name)
        });

        const { etag = '0' } = privateStore.getState().providers.find(p => p.url === url) || {};

        httpsClient.get(url, { 'if-none-match': etag })
            .then(({ statusCode, body: provider, headers }) => {
                if (statusCode === 304) {
                    return debug(`${ url } was not modified`)
                }
                privateStore.dispatch(writeProviderUrlMapping(provider, headers.etag));
                publicStore.dispatch(mergeProviderInfo(provider));
            })
            .catch(ex => debug(ex));
    };

    return handleScannerFound;
};
