const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const outputPath = path.resolve(__dirname, 'wwwRoot');

const isDebug = process.argv.includes('-d');

const config = {
    entry: path.resolve(__dirname, 'wwwScript/index.jsx'),
    output: {
        path: outputPath,
        filename: 'script.js',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        'babel-preset-react',
                        'babel-preset-env',
                        // TODO:
                        //'babel-preset-minify'
                    ].map(require.resolve),
                    plugins: [
                        // still stage 3, will hopefully be soon included in env
                        'babel-plugin-transform-object-rest-spread',
                    ].map(require.resolve),
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
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(isDebug ? 'development' : 'production'),
            'process.env.BROWSER': JSON.stringify(true),
        }),
        new ExtractTextPlugin('stylesheet.css', { allChunks: true }),
    ],

    // NOTE: broken with websockets
    devServer: {
        contentBase: path.resolve(__dirname, 'wwwRoot'),
        port: 8081,
        proxy: {
            '/': 'http://localhost:8080/',
        },
    },
};

if (!isDebug) {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = config
