import "babel-polyfill";

import 'webrtc-adapter';
import Store from 'repatch';

import './core.styl'
import Header from './component/Header';
import { Resolver } from 'l4n-common';
const { register, resolve } = new Resolver();


const store = new Store({ url: location.pathname });
store.subscribe(() => console.log('store changed', store.getState()));

register('store', () => store);
register('loggedIn', () => () => !!store.getState().user);

//
// Setup WebSocket
//
import jDiff from 'json-diff-rfc6902'

import WebSocket from './lib/WebSocket';
const webSocket = new WebSocket(resolve);
webSocket.on('state', state => store.dispatch(() => ({ ...state, url: location.pathname })));
webSocket.on('offer', ({ from, offer }) => webRTC.answer(from, offer).then(() => console.log('send answer')).catch(e => console.error(e)));
webSocket.on('answer', ({ from, answer }) => webRTC.setRemoteDescription(from, answer).then(() => console.log('setDesc')).catch(e => console.error(e)));
webSocket.on('candidate', ({ from, candidate }) => webRTC.addIceCandidate(from, candidate).then(() => console.log('candidate')).catch(e => console.error(e)));
webSocket.on('patch', ({ patch }) => store.dispatch(state => {
    const newState = { ...state }
    jDiff.apply(newState, patch);
    return newState;
}));
webSocket.on('message', (...args) => console.error('undhandled message', ...args));
register('webSocket', () => webSocket);

import clientRendering from './lib/clientRendering';
clientRendering(resolve);

