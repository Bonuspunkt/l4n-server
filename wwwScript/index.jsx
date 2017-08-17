import React from 'react';
import ReactDOM from 'react-dom';

import Store from 'repatch';

import Header from './component/Header';
import MyLobbies from './component/MyLobbies';
import OpenLobbies from './component/OpenLobbies';
import AvailableServers from './component/AvailableServers'
import GameReady from './component/GameReady';

import './core.styl'

const headerEl = document.getElementById('header');
const myLobbiesEl = document.getElementById('myLobbies');
const openLobbiesEl = document.getElementById('openLobbies');
const availableServersEl = document.getElementById('availableServers');
const popupEl = document.getElementById('popup');

const render = (data) => {
    ReactDOM.render(<Header { ...data } />, headerEl);
    ReactDOM.render(<MyLobbies { ...data } />, myLobbiesEl);
    ReactDOM.render(<OpenLobbies { ...data } />, openLobbiesEl);
    ReactDOM.render(<AvailableServers { ...data } />, availableServersEl);

    if (data.gameReady) {
        ReactDOM.render(<GameReady />, popup);
    } else if (data.launchServer) {
        ReactDOM.render(<GameReady />, popup);
    } else {
        ReactDOM.unmountComponentAtNode(popup);
    }
};

const store = new Store();

const unsubscribe = store.subscribe(() => render(store.getState()));

store.dispatch(state => ({
    ...state,
    lanName: 'vulkan44',
    user: 'Bonuspunkt'
}));

// ws