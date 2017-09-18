#!/usr/bin/env node
const { writeFileSync } = require('fs');
const { resolve } = require('path');

const { plugins = [] } = require('../settings');
const requires = plugins.map(plugin => `    require('${plugin}/wwwScript/index'),`).join('\n');

const main = `import 'babel-polyfill';
import 'webrtc-adapter';
import './core.styl';

import { Resolver } from 'l4n-common';
const resolver = new Resolver();

[
    require('./index'),
${requires}
].forEach(plugin => {
    plugin(resolver);
});
`;

const mainFile = resolve(__dirname, '../wwwScript/main.jsx');
writeFileSync(mainFile, main);

//------------------------------------------------------------------------------
const requireRoutes = plugins
    .map(plugin => `    ...require('${plugin}/wwwScript/routes-part'),`)
    .join('\n');
const routes = `const routes = [
    ...require('./routes-part'),
${requireRoutes}
];

export default routes;
`;

const routeFile = resolve(__dirname, '../wwwScript/routes.jsx');
writeFileSync(routeFile, routes);
