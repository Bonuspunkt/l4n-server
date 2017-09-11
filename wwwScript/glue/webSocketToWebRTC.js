export default function webSocketToWebRTC(resolve) {
    const webSocket = resolve('webSocket');
    const webRTC = resolve('webRTC');

    webSocket.on('offer', ({ from, offer }) =>
        webRTC
            .answer(from, offer)
            .then(() => console.log('send answer'))
            .catch(e => console.error(e)),
    );
    webSocket.on('answer', ({ from, answer }) =>
        webRTC
            .setRemoteDescription(from, answer)
            .then(() => console.log('setDesc'))
            .catch(e => console.error(e)),
    );
    webSocket.on('candidate', ({ from, candidate }) =>
        webRTC
            .addIceCandidate(from, candidate)
            .then(() => console.log('candidate'))
            .catch(e => console.error(e)),
    );
}
