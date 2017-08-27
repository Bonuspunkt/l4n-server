import React from 'react';
import ReactDOM from 'react-dom';

import Store from 'repatch';

import './core.styl'

import Header from './component/Header';

/*
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
    user: { id: 5, name: 'Bonuspunkt' }
}));


document.addEventListener('click', e => {
    let el = e.target;
    while (el && el.tagName !== 'A') { el = el.parentNode; }
    if (!el) { return; }

    e.stopPropagation();
    e.preventDefault();

    const { pathname } = el;

    store.dispatch(state => ({ ...state, url: pathname }));
    history.pushState(pathname, 'l4n', pathname);
});
window.addEventListener('popstate', e => {
    const { pathname } = document.location;
    store.dispatch(state => ({ ...state, url: pathname }))
});
*/
