const debug = require('debug')('l4n:server:glue:webSocketToStore');

module.exports = function(resolve) {
    const webSocketServer = resolve('webSocketServer');
    const store = resolve('publicStore');

    webSocketServer.on('onlineChange', ({ userId, online })=> {
        debug(`userId ${ userId } went ${ online ? 'online' :'offline' }`)

        const mapFn = user => user.id !== userId
            ? user
            : { ...user, online };

        store.dispatch(state => ({
            ...state,
            users: state.users.map(mapFn)
        }));
    });
};
