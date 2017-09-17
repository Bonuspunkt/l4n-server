const debug = require('debug')('l4n:server:webSocketServer');
const { EventEmitter } = require('events');
const WebSocket = require('ws');

module.exports = resolve => {
    const app = resolve('httpServer');
    const store = resolve('publicStore');

    const connectedUsers = {};
    const emitter = new EventEmitter();

    const add = ({ user, ws }) => {
        const openConnections = (connectedUsers[user.id] = connectedUsers[user.id] || []);
        const mustEmit = !openConnections.length;
        openConnections.push(ws);

        if (mustEmit) {
            emitter.emit('onlineChange', { userId: user.id, online: true });
        }
    };
    const remove = ({ user, ws }) => {
        const openConnections = connectedUsers[user.id];
        openConnections.splice(openConnections.indexOf(ws), 1);
        const mustEmit = !openConnections.length;
        if (mustEmit) {
            emitter.emit('onlineChange', { userId: user.id, online: false });
        }
    };

    require('express-ws')(app);
    app.ws('/', (ws, req) => {
        const { user } = req;
        // only authed user can open websocket connections
        if (!user) {
            return ws.close();
        }

        debug(`${user.name} connected`);

        // send initial state
        const state = {
            ...store.getState(),
            user,
            csrfToken: req.csrfToken(),
        };
        ws.send(JSON.stringify({ state }));

        const intervalId = setInterval(() => {
            debug('ping');
            ws.ping();
        }, 3 * 60e3);

        add({ user, ws });

        ws.on('message', msg => {
            const { to, ...message } = JSON.parse(msg);
            if (to) {
                debug(`forwarding to ${to} message`, Object.keys(message));
                send({ fromUserId: user.id, toUserId: to, message });
            } else {
                debug(message);
            }
        });

        ws.on('close', () => {
            debug(`${user.name} closed`);
            clearInterval(intervalId);
            remove({ user, ws });
        });

        ws.on('error', () => debug(`${user.name} errored`));
    });

    function broadcast(message) {
        const toSend = JSON.stringify(message);

        Object.keys(connectedUsers).forEach(userId => {
            connectedUsers[userId].forEach(ws => {
                if (ws.readyState !== WebSocket.OPEN) {
                    return;
                }
                ws.send(toSend);
            });
        });
    }

    function send({ fromUserId, toUserId, message }) {
        const openConnections = connectedUsers[toUserId];
        if (!openConnections || !openConnections.length) {
            return;
        }

        debug(`from ${fromUserId} to ${toUserId} - connections: ${openConnections.length}`);

        const toSend = JSON.stringify({ from: fromUserId, ...message });

        openConnections.forEach(ws => {
            if (ws.readyState !== WebSocket.OPEN) {
                return;
            }
            ws.send(toSend);
        });
    }

    emitter.broadcast = broadcast;
    emitter.send = send;

    return emitter;
};
