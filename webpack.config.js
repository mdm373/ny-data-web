const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    watch: false,
    watchOptions: {
        ignored: ['node_modules', 'scripts', '.temp', 'src/local']
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ],
    mode: "production",

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".jsx", ".scss", ".css"]
    },
    output: {
        path: __dirname + '/.temp/pack',
        filename: '[name].js'
    },

    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader
                }, {
                    loader: "css-loader",
                },{
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                    },
                }],
            },
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [{
                    loader: "ts-loader"
                }]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },

};