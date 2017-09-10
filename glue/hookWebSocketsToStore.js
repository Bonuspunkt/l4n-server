const debug = require('debug')('l4n:server:glue:hookWebSocketsToStore');

module.exports = (resolve) => {
    const webSocketServer = resolve('webSocketServer');
    const store = resolve('publicStore');

    const connectedUsers = {};

    const updateStore = (userId) => {
        // TODO: setTimeout(x, 5e3)

        store.dispatch(state => ({
            ...state,
            users: state.users.map(user => {
                const openConnections = connectedUsers[userId];
                return user.id !== userId
                    ? user
                    : { ...user, online: openConnections && !!openConnections.length }
            })
        }))
    };

    webSocketServer.on('connect', e => {
        const { user, ws } = e;
        const openConnections = connectedUsers[user.id] = connectedUsers[user.id] || [];
        openConnections.push(ws);

        debug(`${ user.name } connected`);

        ws.on('message', msg => {
            const { to, ...message } = JSON.parse(msg);
            if (to) {
                debug(`forwarding to ${ to } message`, Object.keys(message))
                send({ fromUserId: user.id, toUserId: to, message });
            } else {
                debug(message);
            }
        });

        updateStore(user.id);
    });
    webSocketServer.on('close', e => {
        const { user, ws } = e;
        const openConnections = connectedUsers[user.id];
        openConnections.splice(openConnections.indexOf(ws), 1);
        updateStore(user.id);
    });


    function broadcast(message) {
        Object.keys(connectedUsers).forEach(key => {
            connectedUsers[key].forEach(ws => {
                ws.send(JSON.stringify(message));
            });
        });
    }

    function send({ fromUserId, toUserId, message }) {
        const openConnections = connectedUsers[toUserId];
        if (!openConnections) { return; }

        debug(`send to ${ toUserId } - connections: ${ openConnections.length }`);

        const toSend = JSON.stringify({ from: fromUserId, ...message });
        openConnections.forEach(ws => ws.send(toSend));
    }

    webSocketServer.broadcast = broadcast;
    webSocketServer.send = send;
};
