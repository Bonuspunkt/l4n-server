const debug = require('debug')('glue:clientRendering');
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';

const anchor = document.createElement('a');
const blacklist = [new RegExp('^/auth'), new RegExp('^/logout')];
export function parse(url) {
    anchor.href = url;
    const { host, pathname } = anchor;

    if (host !== location.host || blacklist.some(rx => rx.test(pathname))) {
        return;
    }

    return { host, pathname };
}

export default function(resolve) {
    const store = resolve('store');
    const loggedIn = resolve('loggedIn');

    document.addEventListener('click', e => {
        if (!loggedIn()) {
            return;
        }

        let { target } = e;
        while (target && target.tagName !== 'A') {
            target = target.parentNode;
        }
        if (!target) {
            return;
        }

        const parsed = parse(target.href);
        if (!parsed) {
            return;
        }

        history.pushState(null, 'something', parsed.pathname);
        store.dispatch(state => ({ ...state, url: parsed.pathname }));

        e.preventDefault();
    });

    document.addEventListener('submit', e => {
        if (!loggedIn()) {
            return;
        }

        const form = e.target;
        const url = form.action;
        if (!parse(url)) {
            return;
        }

        const formData = new FormData(form);
        const searchParams = new URLSearchParams(formData.entries());

        fetch(url, {
            method: form.method,
            credentials: 'include',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                //'accept': 'application/json'
            },
            body: searchParams,
        })
            .then(res => {
                if (res.redirected) {
                    const parsed = parse(res.url);
                    if (!parsed) {
                        return;
                    }

                    history.pushState(null, 'title', parsed.pathname);
                    store.dispatch(state => ({
                        ...state,
                        url: parsed.pathname,
                    }));
                }
            })
            .catch(ex => debug('fetch failed', ex));

        e.preventDefault();
    });

    window.addEventListener('popstate', () => {
        if (!loggedIn()) {
            return;
        }

        store.dispatch(state => ({ ...state, url: location.pathname }));
    });

    const targetEl = document.getElementById('main');
    store.subscribe(() => {
        ReactDOM.render(<App {...store.getState()} />, targetEl);
    });
}
