const path = require("path")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;
const secrets = require("./.secrets.json");

const appConfigEnv = (process.env.APP_CONFIG_ENV || "").toUpperCase();
const appConfig = secrets.APP_CONFIG[appConfigEnv] || secrets.APP_CONFIG.HOSTED
console.log(`packing with config: ${JSON.stringify(appConfig)}`)
module.exports = {
    entry: './src/app/app',
    watch: false,
    watchOptions: {
        ignored: ['node_modules', 'scripts', '.temp', 'src/local']
    },
    plugins: [
        new MiniCssExtractPlugin({filename: "[name].css", chunkFilename: "[id].css"}),
        new DefinePlugin({ appConfig: JSON.stringify(appConfig)})
    ],
    mode: "production",
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".scss", ".css", ".svg"],
        plugins: [new TsconfigPathsPlugin()]
    },
    output: { path: __dirname + '/.temp/pack', filename: '[name].js'},
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: MiniCssExtractPlugin.loader
            }, {
                loader: "css-loader",
            },{
                loader: 'sass-loader', options: { sourceMap: true }
            }],
        },
        {
            test: /\.ts(x?)$/,
            exclude: /node_modules/,
            use: [{loader: "ts-loader"}]
        },
        {
            test: /\.svg$/,
            use: [{
                loader: 'file-loader',
            }]
        },
        {
            enforce: "pre", test: /\.js$/, loader: "source-map-loader"
        }]
    },
};