const debug = require('debug')('l4n:notifier');
if (process.env.BROWSER) require('./Notifier.styl');

const { Notification } = window;

class Notifier {
    constructor(resolve) {
        if (!Notification) return;

        if (Notification.permission === 'default') {
            const el = document.createElement('button');
            el.className = 'noficationRequest';
            el.textContent = 'enable notifications';
            el.addEventListener('click', e => this.requirePermission());
            this.noficationRequest = el;

            document.body.appendChild(el);
        }
    }

    requirePermission() {
        if (!Notification) return;

        Notification.requestPermission()
            .then(result => debug(result))
            .catch(err => debug(err))
            .then(() => document.body.removeChild(this.noficationRequest));
    }

    notify({ title, body, url }) {
        if (!Notification) return;

        const notification = new Notification(title, {
            body,
            icon: '/logo.png',
            requireInteraction: true,
        });
        notification.addEventListener('click', () => {
            if (url) location.href = url;
            notification.close();
        });
    }
}

export default Notifier;
