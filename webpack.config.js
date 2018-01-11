// This is a node tool to resolve paths.
var path = require('path');
// We need this to use the CommonsChunkPlugin.
var webpack = require('webpack');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

var LessLoader = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [{
            loader: "css-loader"
        },
        {
            loader: "resolve-url-loader"
        },
        {
            loader: "less-loader",
            options: {
                sourceMap: true
            }
        }
    ]
});

var typescript = require('awesome-typescript-loader');

module.exports = env => {

    var buildOutput = {
        path: path.resolve('./dist'),
        filename: 'ClientPortal.js',
        sourceMapFilename: 'ClientPortal.js.map',
        library: 'PerfectGym',
    };
    
    var buildConfig = env && env.WEBPACK_BUILD_CONFIG;
    
    if (buildConfig === "umd") {
        var buildOutput = {
            path: path.resolve('./dist'),
            filename: 'ClientPortal.common.js',
            sourceMapFilename: 'ClientPortal.common.js.map',
            library: 'perfectgym-client-portal',
            libraryTarget: 'umd',
            umdNamedDefine: true
        };
    }

    return {
        target: 'web',
        entry: {
            ClientPortal: './src/ClientPortal.ts'
        },
        output: buildOutput,
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
            loaders: [{
                    test: /\.ts$/,
                    exclude: /\.d.ts$/,
                    loader: 'awesome-typescript-loader'
                },
                {
                    test: /\.less$/,
                    loader: LessLoader
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin({
                filename: "ClientPortal.css"
            }),
            new typescript.CheckerPlugin(),
            new UglifyJsPlugin({
                minimize: true,
                compress: { warnings: false },
                output: { comments: false },
            })
        ]
    };
}