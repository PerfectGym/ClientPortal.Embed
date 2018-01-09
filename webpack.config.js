
// This is a node tool to resolve paths.
var path = require('path');
// We need this to use the CommonsChunkPlugin.
var webpack = require('webpack');
// The plugin that adds the script tags to our index.html
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var LessLoader = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
        { loader: "css-loader"},
        { loader: "resolve-url-loader" },
        { loader: "sass-loader", options: { sourceMap: true } }
    ]
});

var typescript = require('awesome-typescript-loader');

module.exports = {
    target: 'web',
    entry: {
        index: './index.ts',
        ClientPortal: './ClientPortal.ts'
    },
    output: {
        path: path.resolve('./dist'),
        filename: '[name].js',
        sourceMapFilename: '[name].js.map'
    },
    // Turn on sourcemaps
    devtool: 'source-map',
    resolve: {
        extensions: [
            '.ts',
            '.tsx',
            '.js'
        ],
        plugins: [
            // this plugin must exceptionally be loaded from here
            // otherwise TS paths config will not work
            new typescript.TsConfigPathsPlugin()
        ],
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                exclude: /\.d.ts$/,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                exclude: path.resolve('Index.html')
            },
            {
                test: /\.less$/,
                loader: LessLoader
            },
            { test: /\.scss$/, loader: 'ignore-loader' },
            { test: /\.tt$/, loader: 'ignore-loader' },
            { test: /\.ttinclude$/, loader: 'ignore-loader' },
            { test: /\.d.ts$/, loader: 'ignore-loader' }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            chunksSortMode: 'dependency'
        }),
        new ExtractTextPlugin({
            filename: "[name].css"
        }),
        new typescript.CheckerPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ],
    devServer: {
        contentBase: ".",
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                secure: false
            }
        }
    }
};

// usefull for production
// const nodeEnv = process.env.NODE_ENV || "development";
// const isProd = nodeEnv === "production";

//     new HtmlWebpackPlugin({
//       title: "Typescript Webpack Starter",
//       template: "src/index.html"
//     }),
//     new webpack.optimize.UglifyJsPlugin({
//       compress: { warnings: false },
//       output: { comments: false },
//       sourceMap: true
//     }),