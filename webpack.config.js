const { resolve } = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const outputPath = resolve(__dirname, 'wwwRoot');

const isDebug = process.argv.includes('-d');

const exclude = module => {
    if (/node_modules[\\/]l4n-/.test(module)) {
        return false;
    }
    return /node_modules/.test(module);
};

module.exports = {
    entry: resolve(__dirname, 'wwwScript/main.jsx'),
    output: {
        path: outputPath,
        filename: 'script.js',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude,
                loader: 'babel-loader',
                query: {
                    presets: ['babel-preset-react', 'babel-preset-env'],
                    plugins: [
                        // still stage 3, will hopefully be soon included in env
                        'babel-plugin-transform-object-rest-spread',
                    ],
                },
            },
            {
                test: /\.styl$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'universal-style-loader',
                    use: ['css-loader', 'stylus-loader'],
                }),
            },
        ],
    },
    resolve: {
        alias: { 'l4n-server': __dirname },
        extensions: ['.js', '.jsx'],
        modules: ['node_modules'],
        symlinks: false,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(isDebug ? 'development' : 'production'),
            'process.env.BROWSER': JSON.stringify(true),
        }),
        new ExtractTextPlugin('stylesheet.css', { allChunks: true }),
    ],
};
