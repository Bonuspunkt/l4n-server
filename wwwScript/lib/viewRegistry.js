function viewRegistry() {
    const registry = {};

    return {
        register(view, Component) {
            const parts = registry[view] || [];
            registry[view] = parts.concat([Component]);
        },
        resolve(view) {
            return registry[view] || [];
        },
    };
}

export default viewRegistry();
