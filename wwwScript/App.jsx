import React from 'react';
import PropTypes from 'prop-types';
import route from './lib/route';

import routes from '*routes';

import NotMapped from './view/NotMapped';

const mappedRoutes = routes.map(({ pattern, Component }) => ({
    test: route(pattern),
    Component,
}));

const App = props => {
    const { url } = props;

    for (let { test, Component } of mappedRoutes) {
        const urlParams = test(url);
        if (urlParams) {
            return <Component {...props} {...urlParams} />;
        }
    }
    return <NotMapped {...props} />;
};

App.propTypes = {
    url: PropTypes.string.isRequired,
};

export default App;
