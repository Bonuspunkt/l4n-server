function Spy() {
    const calledArgs = [];

    const spy = function(...args) {
        calledArgs.push(args)
    };
    Object.defineProperties(spy, {
        called: {
            get: () => calledArgs.length ? calledArgs : 0
        }
    });

    return spy;
}

module.exports = Spy;
