const Store = new require('repatch').default;


class L4nStore extends Store {
    constructor(name, ...args) {
        super(...args);

        const debug = require('debug')(`l4n:server:store:${name}`);
        const logger = store => next => reducer => {
            const state = store.getState();
            const nextState = reducer(state);
            debug(nextState);
            return next(_ => nextState);
        };

        this.addMiddleware(logger);
    }
}

module.exports = L4nStore;
