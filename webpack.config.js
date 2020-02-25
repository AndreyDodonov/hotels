const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const fs = require('fs');

const pug = require('./webpack/pug');
const devserver = require('./webpack/devserver');
const sass = require('./webpack/sass');
const css = require('./webpack/css');
const extractCSS = require('./webpack/css.extract');
const uglifyJS = require('./webpack/js.uglify');
const images = require('./webpack/images');
const fonts = require('./webpack/fonts');

const PATHS = {
    source: path.join(__dirname, 'source'),
    build: path.join(__dirname, 'build'),
    assets: 'assets/'
};

const PAGES_DIR = `${PATHS.source}`;
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'));

const common = merge([
    {
        entry: {
            'bundle': PATHS.source + '/bundle/bundle.js',
        },

        output: {
            path: PATHS.build,
            filename: 'js/[name].js',
            publicPath: '/'
        },

        plugins: [
            // Automatic creation any html pages
            ...PAGES.map(page => new HtmlWebpackPlugin({
                template: `${PAGES_DIR}/${page}`,
                filename: `./${page.replace(/\.pug/, '.html')}`
            })),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery",
                "window.$": "jquery"
            }),
            new webpack.ProvidePlugin({
                GoogleMapsLoader: 'google-maps'
            })
        ]
    },
    pug(),
    images(),
    fonts()
]);

module.exports = function (env) {
    if (env === 'production') {
        return merge([
            common,
            extractCSS(),
            uglifyJS()
        ]);
    }
    if (env === 'development') {
        return merge([
            common,
            devserver(),
            sass(),
            css()
        ])
    }
};
