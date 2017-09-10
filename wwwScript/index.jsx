import "babel-polyfill";
import 'webrtc-adapter';
import './core.styl'


import { Resolver } from 'l4n-common';
const { register, resolve } = new Resolver();

register('loggedIn', () => () => !!store.getState().user);

import Store from 'repatch';
const store = new Store({ url: location.pathname });
register('store', () => store);

(function() {
    const debug = require('debug')('store');
    store.subscribe(() => debug('changed', store.getState()));
}());

import WebSocket from './lib/WebSocket';
const webSocket = new WebSocket(resolve);
register('webSocket', () => webSocket);

import glueWebSocketToStore from './glue/webSocketToStore';
glueWebSocketToStore(resolve);


import WebRTC from './lib/webRTC';
const webRTC = new WebRTC(resolve);
register('webRTC', () => webRTC);

import glueWebSocketToWebRTC from './glue/webSocketToWebRTC'
glueWebSocketToWebRTC(resolve);


import clientRendering from './glue/clientRendering';
clientRendering(resolve);
