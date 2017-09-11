const { EventEmitter } = require('events');
const https = require('https');
const { parse } = require('url');
const debug = require('debug')('l4n:server:httpsClient');

class HttpsClient {
    constructor(resolve) {
        const { httpsClient } = resolve('settings');

        const request = (method, url, headers = {}, body) => {
            debug(method, url, headers);

            return new Promise((resolve, reject) => {
                function handleResponse(response) {
                    if (response.headers['content-type'] !== 'application/json') {
                        reject(Error('invalid response content-type'));
                        return res.destroy();
                    }

                    // NOTE: should have a max response length limit
                    const buffers = [];
                    response.on('error', reject);
                    response.on('data', chunk => buffers.push(chunk));
                    response.on('end', () => {
                        const buffer = Buffer.concat(buffers);
                        const body = buffer.length ? JSON.parse(buffer) : null;
                        resolve({
                            statusCode: response.statusCode,
                            headers: response.headers,
                            body,
                        });
                    });
                }

                const request = https.request({
                    method,
                    ...parse(url),
                    ...httpsClient,
                    headers,
                });
                request.on('error', reject);
                request.on('response', handleResponse);
                request.end(body);
            });
        };

        this.get = (...args) => request('GET', ...args);
        this.post = (...args) => request('POST', ...args);
    }
}

module.exports = HttpsClient;
