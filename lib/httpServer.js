const http = require('http');
const send = require('send');
const debug = require('debug')('httpServer');
const { parse: parseUrl } = require('url');

const path = require('path');
const wwwRoot = path.resolve(__dirname, '../wwwRoot/');

const server = http.createServer((request, response) => {
    debug(`${ request.method } ${ request.url }` );

    send(request, parseUrl(request.url).pathname, { root: wwwRoot }).pipe(response);
});

module.exports = {
    listen: (port) => {
        server.listen(port, () => debug(`listen @ ${ port }`));
    }
};
