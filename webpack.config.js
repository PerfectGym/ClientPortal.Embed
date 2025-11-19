// This is a node tool to resolve paths.
var path = require('path');

const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = function (env) {
    const prod = env && env.mode === 'production';

    return {
        target: 'web',
        mode: prod ? 'production' : 'development',
        entry: {
            ClientPortal: './src/ClientPortal.ts',
        },
        output: {
            path: path.resolve('./dist'),
            filename: prod ? '[name].min.js' : '[name].js',
            sourceMapFilename: prod ? '[name].min.js.map' : '[name].js.map',
            library: {
                name: 'PerfectGym',
                type: 'assign-properties'
              },
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
        },
        devtool: false,
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 'ts-loader',
                },
                {
                    test: /\.less$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'ClientPortal.css',
            }),
        ],
        optimization: {
            minimizer: [
                new TerserJSPlugin({}), 
                new CssMinimizerPlugin({})
            ],
        },
    };
};
