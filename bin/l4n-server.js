#!/usr/bin/env node
/* eslint no-console: 0 */
const debug = require('debug')('l4n:server:cli');
const fs = require('fs');
const path = require('path');

const cwd = process.cwd();

const templatePattern = /\$\{([^}]+)\}/g;
const [, , /*executable*/ /*script*/ command = '', arg] = process.argv;

switch (command.toLowerCase()) {
    case 'init':
        return init();

    case 'build':
        return build();

    default:
        return printUsage();
}

////////////////////////////////////////////////////////////////////////////////
function init() {
    const nodeModulesDir = path.resolve(cwd, 'node_modules');

    debug(`searching modules in ${nodeModulesDir}`);

    const modules = fs
        .readdirSync(nodeModulesDir)
        .filter(module => /^l4n-server/i.test(module))
        .sort();
    debug(`found modules ${modules.join(', ')}`);

    const outputPath = path.resolve(cwd, 'settings.js');
    debug(`writing file to '${outputPath}'`);

    if (fs.existsSync(outputPath) && arg !== '--force') {
        return console.error('settings.js exists. use --force');
    }

    const template = fs.readFileSync(
        path.resolve(__dirname, 'templates/settings.template'),
        'utf8',
    );
    const settingsContent = template.replace(templatePattern, (_, capture) => {
        switch (capture) {
            case 'modules':
                return modules.map(module => `        '${module}',`).join('\n');

            case 'moduleConfigs':
                return modules
                    .map(module => path.resolve(nodeModulesDir, module, 'settings.template'))
                    .filter(templatePath => fs.existsSync(templatePath))
                    .map(templatePath => fs.readFileSync(templatePath, 'utf8'))
                    .join('\n');

            default:
                throw Error(`'${capture}' can not be resolved`);
        }
    });

    fs.writeFileSync(outputPath, settingsContent);
}

////////////////////////////////////////////////////////////////////////////////
function build() {
    const settingsPath = path.resolve(cwd, 'settings.js');
    debug(`using '${settingsPath}'`);
    const { use = [] } = require(settingsPath);

    // write main.jsx
    const mainTemplatePath = path.resolve(__dirname, 'templates/main.template');
    debug(`reading ${mainTemplatePath}`);
    const mainTemplate = fs.readFileSync(mainTemplatePath, 'utf8');

    const mainContent = mainTemplate.replace(templatePattern, (_, capture) => {
        switch (capture) {
            case 'modules':
                return use.map(module => `    require('${module}/index').default,`).join('\n');

            default:
                throw Error(`'${capture}' can not be resolved`);
        }
    });

    const mainPath = path.resolve(cwd, 'wwwScript/main.jsx');
    debug(`writing main ${mainPath}`);
    fs.writeFileSync(mainPath, mainContent);

    // write routes.jsx
    const routeTemplatePath = path.resolve(__dirname, 'templates/routes.template');
    debug(`reading ${routeTemplatePath}`);
    const routeTemplate = fs.readFileSync(routeTemplatePath, 'utf8');

    const routeContent = routeTemplate.replace(templatePattern, (_, capture) => {
        switch (capture) {
            case 'routes':
                return use.map(module => `    ...require('${module}/routes').default,`).join('\n');

            default:
                throw Error(`'${capture}' can not be resolved`);
        }
    });
    const routePath = path.resolve(cwd, 'wwwScript/routes.jsx');
    debug(`writing routes ${routePath}`);
    fs.writeFileSync(routePath, routeContent);

    // write webpack.config.js
    const webpackTemplatePath = path.resolve(__dirname, 'templates/webpack.template');
    debug(`reading ${webpackTemplatePath}`);
    const webpackTemplate = fs.readFileSync(webpackTemplatePath, 'utf8');

    const webpackContent = webpackTemplate.replace(templatePattern, (_, capture) => {
        switch (capture) {
            case 'aliases':
                return use.map(module => `        '${module}': '${module}/wwwScript',`).join('\n');

            default:
                throw Error(`'${capture}' can not be resolved`);
        }
    });
    const webpackPath = path.resolve(cwd, 'webpack.config.js');
    debug(`writing webpack ${webpackPath}`);
    fs.writeFileSync(webpackPath, webpackContent);

    // write definitions.styl
    const definitionTemplatePath = path.resolve(__dirname, 'templates/definitions.template');
    debug(`reading ${definitionTemplatePath}`);
    const definitionTemplate = fs.readFileSync(definitionTemplatePath);
    const definitionPath = path.resolve(cwd, 'wwwScript/definitions.js');
    debug(`writing definitions ${definitionPath}`);
    fs.writeFileSync(definitionPath, definitionTemplate);

    // write index.js
    const indexTemplatePath = path.resolve(__dirname, 'templates/index.template');
    debug(`reading ${indexTemplatePath}`);
    const indexTemplate = fs.readFileSync(indexTemplatePath);
    const indexPath = path.resolve(cwd, 'index.js');
    debug(`writing index ${indexPath}`);
    fs.writeFileSync(indexPath, indexTemplate);
}

////////////////////////////////////////////////////////////////////////////////
function printUsage() {
    console.log('usage:');
    console.log('');
    console.log('l4n-server init [--force]');
    console.log('    generates a settings.js');
    console.log('    use `--force` to override existing file');
    console.log('');
    console.log('l4n-server build');
    console.log('    builds the webclient');
}
