'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {

    entry: './src/index.ts',

    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/build/',
        filename: 'game.js'
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        inline: true,
        publicPath: '/build/'
    },

    module: {
        rules: [
            {
                test: /\.(tsx?)|(js)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: [ /\.vert$/, /\.frag$/ ],
                use: 'raw-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },

    plugins: [
        new webpack.DefinePlugin({
            'CANVAS_RENDERER': JSON.stringify(true),
            'WEBGL_RENDERER': JSON.stringify(true)
        }),
        new webpack.NamedModulesPlugin()
    ]
};