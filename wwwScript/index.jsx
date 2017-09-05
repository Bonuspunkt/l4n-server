import React from 'react';
import ReactDOM from 'react-dom';

import 'webrtc-adapter';
import Store from 'repatch';

import './core.styl'
import Header from './component/Header';


const isLoggedIn = document.querySelector('form[action="/logout"]');

//
// Setup WebSocket
//
const { protocol, host } = window.location;
const webSocketUrl = `${ protocol.replace(/http/, 'ws') }//${ host }/`;
const webSocket = new WebSocket(webSocketUrl);
webSocket.addEventListener('open', () => console.log('websocket open'));
webSocket.addEventListener('message', message => {
    const data = JSON.parse(message.data);
    console.log(data);
});

