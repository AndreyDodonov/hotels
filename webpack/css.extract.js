// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// устарело. Заменить на https://github.com/webpack-contrib/mini-css-extract-plugin

module.exports = function () {
    return {
        module: {
            rules: [
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                }
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "style.css"
            })
        ]
    }
};
