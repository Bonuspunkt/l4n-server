const http = require('http');
const send = require('send');
const debug = require('debug')('httpServer');
const { parse: parseUrl } = require('url');

const path = require('path');
const wwwRoot = path.resolve(__dirname, '../wwwRoot/');

const steamImage = new RegExp('^/static/img/steam/\\d+/\w+$')

const server = http.createServer((request, response) => {
    debug(`${ request.method } ${ request.url }` );

    if (steamImage.test(request.url)) {
        const [,,, steamId, size] = request.url.split('/');
        console.log(steamId, size);
        res.end();
        return;
    }

    send(request, parseUrl(request.url).pathname, { root: wwwRoot }).pipe(response);
});

module.exports = {
    listen: (port) => {
        debug(`listen @ ${ port }`);
        server.listen(port);
    }
};
