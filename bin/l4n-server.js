#!/usr/bin/env node
/* eslint no-console: 0 */
const debug = require('l4n:server:cli');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { Resolver } = require('l4n-common');

const [, , /*executable*/ /*script*/ command = '', arg] = process.argv;

switch (command.toLowerCase()) {
    case 'init':
        return init();

    case 'build':
        return build();

    case 'start':
        return start();

    default:
        return console.log('USAGE');
}

function init() {
    const nodeModulesDir = path.resolve(__dirname, 'node_modules');

    debug(`searching modules in ${nodeModulesDir}`);

    const modules = fs
        .readdirSync(nodeModulesDir)
        .filter(module => /^l4n-server/i.test(module))
        .sort();
    debug(`found modules ${modules.join(', ')}`);

    const outputPath = path.resolve(process.cwd(), 'settings.js');
    debug(`writing file to '${outputPath}'`);

    if (fs.existsSync(outputPath) && arg !== '--force') {
        return console.error('settings.js exists. use --force');
    }

    const output = [
        `// all comments out lines are default values
const { readFileSync } = require('fs');
const { resolve } = require('path');

module.exports = {
    //lanName: 'l4n.at',
    use: [`,
    ];
    output.push(...modules.map(module => `        '${module}',`));
    output.push('        ],');

    // output.push(require(`${module}/settingsPart`)) `?

    output.push(`
};`);
    fs.writeFileSync(outputPath, output.join('\n'));
}

function build() {
    const config = {}; // TODO: generate

    debug('config');
    debug(config);

    webpack(config, (err, stats) => {
        if (err) {
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            return;
        }

        const info = stats.toJson();

        if (stats.hasErrors()) {
            console.error(info.errors);
        }

        if (stats.hasWarnings()) {
            console.warn(info.warnings);
        }
    });
}

function start() {
    const resolver = new Resolver();

    const settingsPath = path.resolve(process.cwd(), 'settings.js');
    debug(`using '${settingsPath}'`);
    const settings = require(settingsPath);
    const { use: plugins = [] } = settings;
    plugins.forEach(plugin => plugin(resolver));
}
