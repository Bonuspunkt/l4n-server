const debug = require('debug')('glue:webSocketToWebRTC');

export default function webSocketToWebRTC(resolve) {
    const webSocket = resolve('webSocket');
    const webRTC = resolve('webRTC');

    webSocket.on('offer', ({ from, offer }) =>
        webRTC
            .answer(from, offer)
            .then(() => debug('send answer'))
            .catch(e => debug(e)),
    );
    webSocket.on('answer', ({ from, answer }) =>
        webRTC
            .setRemoteDescription(from, answer)
            .then(() => debug('setDesc'))
            .catch(e => debug(e)),
    );
    webSocket.on('candidate', ({ from, candidate }) =>
        webRTC
            .addIceCandidate(from, candidate)
            .then(() => debug('candidate'))
            .catch(e => debug(e)),
    );
}
