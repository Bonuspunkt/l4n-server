const debug = require('debug')('lib:webRTC');

const streamPromise = navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(stream => {
        debug('getUserMedia() ok', stream);
        return stream;
    })
    .catch(error => debug('getUserMedia() error', error));

const offerOptions = { offerToReceiveAudio: 1 };
const servers = null;

class WebRTC {
    constructor(resolve) {
        this.webSocket = resolve('webSocket');
        this.peers = {};
    }

    async initConnection(userId, direction) {
        const stream = await streamPromise;

        const peerConnection = new RTCPeerConnection(servers);
        const audioTracks = stream.getAudioTracks();
        const [audioTrack] = audioTracks;

        peerConnection.addTrack(audioTrack, stream);

        peerConnection.addEventListener('icecandidate', e => {
            debug(`sending ${userId} iceCandidate`);
            this.webSocket.send({ to: userId, candidate: e.candidate });
        });

        peerConnection.addEventListener('iceconnectionstatechange', e => {
            debug(`iceconnectionstatechange`, peerConnection.iceConnectionState);
        });

        const audioEl = document.createElement('audio');
        document.body.appendChild(audioEl);
        peerConnection.addEventListener('track', e => {
            debug('track', e);
            const [stream] = e.streams;

            const canvas = document.createElement('canvas');
            document.body.appendChild(canvas);
            //new (require('./streamvisualizer'))(stream, canvas).start();

            audioEl.srcObject = stream;
        });

        this.peers[userId] = {
            peerConnection,
            direction,
            audioEl,
        };

        return peerConnection;
    }

    async offer(userId) {
        debug(`starting call to ${userId}`);

        const peerConnection = await this.initConnection(userId, 'out');

        peerConnection.createOffer(offerOptions).then(offer => {
            peerConnection.setLocalDescription(offer);

            debug('sending offer');
            this.webSocket.send({ to: userId, offer });
        });
    }

    async answer(userId, offer) {
        debug(`received call from ${userId}`);
        const peerConnection = await this.initConnection(userId, 'in');

        await this.setRemoteDescription(userId, offer);

        peerConnection.createAnswer().then(answer => {
            peerConnection.setLocalDescription(answer);
            debug(`sending answer`);
            this.webSocket.send({ to: userId, answer });
        });

        this.peers[userId] = {
            peerConnection,
            direction: 'in',
        };
    }

    setRemoteDescription(userId, description) {
        const { peerConnection } = this.peers[userId];
        return peerConnection.setRemoteDescription(description);
    }

    addIceCandidate(userId, candidate) {
        const { peerConnection } = this.peers[userId];
        debug(`from ${userId} adding candidate`, candidate);
        return peerConnection.addIceCandidate(candidate);
    }

    close(userId) {
        const { peerConnection } = this.peers[userId];
        peerConnection.close();
    }
}

export default WebRTC;
