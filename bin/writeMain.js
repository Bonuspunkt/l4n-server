#!/usr/bin/env node
const { writeFileSync } = require('fs');
const { resolve } = require('path');

const { plugins = [] } = require('../settings');
const requires = plugins.map(plugin => `    require('${plugin}/wwwScript/index'),`).join('\n');

const content = `import 'babel-polyfill';
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

const targetFile = resolve(__dirname, '../wwwScript/main.jsx');
writeFileSync(targetFile, content);
