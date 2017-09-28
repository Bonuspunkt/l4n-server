const React = require('react');
const ReactDOMServer = require('react-dom/server');

module.exports = resolve => (additionalProps = {}) => (req, res) => {
    const App = resolve('appView');
    const publicStore = resolve('publicStore');

    const body =
        '<!DOCTYPE html>' +
        ReactDOMServer.renderToStaticMarkup(
            React.createElement(App, {
                url: req.path,
                ...publicStore.getState(),
                user: req.user,
                csrfToken: req.csrfToken(),
                ...additionalProps,
            }),
        );

    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(body);
};
