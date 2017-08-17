import React from 'react';
import ReactDOM from 'react-dom';

import Store from 'repatch';

import Header from './component/Header';
import Router from './component/Router';

import './core.styl'


const headerEl = document.getElementById('header');
const mainEl = document.getElementById('main')
const popupEl = document.getElementById('popup');

const render = (data) => {

    ReactDOM.render(<Header { ...data } />, headerEl);
    ReactDOM.render(<Router { ...data } />, mainEl);

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
    url: '/',
    lanName: 'vulkan44',
    user: 'Bonuspunkt'
}));


document.addEventListener('click', e => {
    let el = e.target;

    if (el.tagName !== 'A') { return; }
    e.stopPropagation();
    e.preventDefault();

    const { pathname } = el;

    store.dispatch(state => ({ ...state, url: pathname }));
    history.pushState(pathname, 'l4n', pathname);
});
