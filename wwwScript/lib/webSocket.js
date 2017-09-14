const debug = require('debug')('lib:webSocket');
import { EventEmitter } from 'events';

class WebSocketWrapper extends EventEmitter {
    constructor() {
        super();

        this._handleOpen = this._handleOpen.bind(this);
        this._handleClose = this._handleClose.bind(this);
        this._handleError = this._handleError.bind(this);

        this._queue = [];

        const { protocol, host } = window.location;
        this._url = `${protocol.replace(/http/, 'ws')}//${host}/`;

        this._initWebSocket();
    }

    _initWebSocket() {
        const webSocket = (this._websocket = new WebSocket(this._url));
        webSocket.addEventListener('open', this._handleOpen);
        webSocket.addEventListener('close', this._handleClose);
        webSocket.addEventListener('error', this._handleError);
        webSocket.addEventListener('message', message => {
            const data = JSON.parse(message.data);

            Object.keys(data).forEach(key => this.emit(key, data));
        });
    }

    _handleOpen() {
        debug('open');
        if (this._queue.length) {
            debug(`processing queue (${this._queue.length}`);
            this._queue.forEach(message => this._websocket.send(JSON.stringify(message)));
        }
        this._queue = [];
    }

    _handleClose() {
        const timeout = (30e3 * Math.random()) | 0;
        debug(`close - retry in ${timeout}ms`);
        setTimeout(() => this._initWebSocket(), timeout);
    }

    _handleError(error) {
        debug(error);
    }

    send(data) {
        if (this._websocket.readyState !== WebSocket.OPEN) {
            this._queue.push(data);
        } else {
            this._websocket.send(JSON.stringify(data));
        }
    }

    emit(...args) {
        debug(...args);
        super.emit(...args);
    }
}

export default WebSocketWrapper;
