const debug = require('debug')('l4n:server:resolver');

class Resolver {
    constructor() {
        const registry = {};

        this.register = (name, factory) => {
            if (typeof factory !== 'function') { throw Error('factory is not a function'); }
            if (registry[name]) { debug(`'${name}' is already registered`); }
            registry[name] = factory;
        };

        this.resolve = (name) => {
            if (!registry[name]) { debug(`'${name}' is not registered`); }
            return registry[name](this.resolve);
        };
    }
}

module.exports = Resolver;
