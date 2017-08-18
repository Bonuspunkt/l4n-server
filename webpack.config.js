const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const outputPath = path.resolve(__dirname, 'wwwRoot');

module.exports = {
    entry: path.resolve(__dirname, 'wwwScript/index.jsx'),
    output: {
        path: outputPath,
        filename: 'script.js'
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: [
                    ['react'],
                    ['env'],
                ],
                plugins: [
                    // still stage 3, will hopefully be soon included in env
                    "transform-object-rest-spread"
                ]
            }
        }, {
            test: /\.styl$/,
            use: ExtractTextPlugin.extract({
                fallback: 'universal-style-loader',
                use: [
                    'css-loader',
                    'stylus-loader',
                ],
            }),
        }]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new ExtractTextPlugin('stylesheet.css', { allChunks: true }),
    ],

    devServer: {
        contentBase: path.resolve(__dirname, 'wwwRoot'),
        port: 8081,
        proxy: {
            "/": "http://localhost:8080/",
        }
    },
};
