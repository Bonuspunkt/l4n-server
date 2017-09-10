import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';

const anchor = document.createElement('a');
export function parse(url) {
    anchor.href = url;
    return {
        onSite: anchor.host === location.host,
        host: anchor.host,
        pathname: anchor.pathname
    }
}

export default function(resolve) {
    const store = resolve('store');
    const loggedIn = resolve('loggedIn');

    document.addEventListener('click', (e) => {
        if (!loggedIn()) { return; }

        let { target } =  e;
        while (target && target.tagName !== 'A') {
            target = target.parentNode;
        }
        if (!target) { return; }

        const parsed = parse(target.href);
        if (!parsed.onSite) { return; }

        history.pushState(null, 'something', parsed.pathname);
        store.dispatch(state => ({ ...state, url: parsed.pathname }));

        e.preventDefault();
    });

    document.addEventListener('submit', (e) => {
        if (!loggedIn()) { return; }

        const form = e.target;
        const url = form.action;

        const formData = new FormData(form);
        const searchParams = new URLSearchParams(formData.entries());

        fetch(url, {
            method: form.method,
            credentials: 'include',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'accept': 'application/json'
            },
            body: searchParams
        })
        .then(res => {
            if (res.redirected) {
                const parsed = parse(res.url);
                if (!parsed.onSite) { return; }

                history.pushState(null, 'title', parsed.pathname);
                store.dispatch(state => ({ ...state, url: parsed.pathname }));
            }
        })
        .catch(ex => console.error(ex));

        e.preventDefault();
    });

    window.addEventListener('popstate', () => {
        if (!loggedIn()) { return; }

        store.dispatch(state => ({ ...state, url: location.pathname }));
    });

    store.subscribe(() => {
        ReactDOM.render(<App { ...store.getState() } />, document.body);
    });
}
