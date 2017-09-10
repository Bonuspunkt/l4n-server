import { EventEmitter } from 'events'

class WebSocketWrapper extends EventEmitter {
    constructor() {
        super();

        this._handleOpen = this._handleOpen.bind(this);
        this._handleClose = this._handleClose.bind(this);
        this._handleError = this._handleError.bind(this);

        this._queue = [];

        const { protocol, host } = window.location;
        this._url = `${ protocol.replace(/http/, 'ws') }//${ host }/`;

        this._initWebSocket();
    }

    _initWebSocket() {

        const webSocket = this._websocket = new WebSocket(this._url);
        webSocket.addEventListener('open', this._handleOpen)
        webSocket.addEventListener('close', this._handleClose);
        webSocket.addEventListener('error', this._handleError);
        webSocket.addEventListener('message', message => {
            const data = JSON.parse(message.data);

            if (data.state) {
                console.log('state');
                this.emit('state', data.state);
            } else if (data.offer) {
                this.emit('offer', data);
            } else if (data.answer) {
                this.emit('answer', data);
            } else if (data.candidate !== undefined) {
                this.emit('candidate', data);
            } else if (data.patch) {
                console.log('patch');
                this.emit('patch', data);
            } else {
                this.emit('message', data);
            }
        });
    }

    _handleOpen() {
        console.debug('open');
        if (this._queue.length) {
            console.debug(`processing queue (${ this._queue.length }`);
            this._queue.forEach(message => this._websocket.send(JSON.stringify(message)));
        }
        this._queue = [];
    }

    _handleClose() {
        console.log('close')
    }

    _handleError(error) {
        console.error(error);
    }

    send(data) {
        if (this._websocket.readyState !== WebSocket.OPEN) {
            this._queue.push(data);
        } else {
            this._websocket.send(JSON.stringify(data));
        }
    }
}

export default WebSocketWrapper;
