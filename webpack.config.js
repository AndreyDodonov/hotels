const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const fs = require('fs');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const pug = require('./webpack/pug');
const devserver = require('./webpack/devserver');
const sass = require('./webpack/sass');
const css = require('./webpack/css');
const extractCSS = require('./webpack/css.extract');
// const uglifyJS = require('./webpack/js.uglify');
const images = require('./webpack/images');
const fonts = require('./webpack/fonts');

const PATHS = {
    // assets ?
    source: path.join(__dirname, 'source'),
    build: path.join(__dirname, 'build')
};

// для автоматического прохода по pug файлам в pages
const pagesLocation = path.join(__dirname, 'source', 'pages');

const walk = location => {
    let results = [];
    const list = fs.readdirSync(location);
    list.forEach(function (file) {
        file = path.join(location, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
};

const pages = walk(pagesLocation)
    .filter(filename => path.extname(filename).toLocaleLowerCase() === '.pug')
    .map(filename => {
        const name = path.parse(filename).name;
        return {
            template: filename,
            filename: `${name}.html`
        }
    });
// end

const common = merge([
    {   context: __dirname,

        entry: {
            'bundle': PATHS.source + '/bundle/bundle.js',
        },

        output: {
            path: PATHS.build,
            filename: 'js/[name].js',
            publicPath: './'
        },

        plugins: [
            new HtmlWebpackPlugin({
                filename: "index.html",
                template: PATHS.source + "/index.pug"
            }),
            new CleanWebpackPlugin(),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery",
                "window.$": "jquery"
            }),

        ].concat(pages.map(page => new HtmlWebpackPlugin(page))),
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
            // uglifyJS()
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

