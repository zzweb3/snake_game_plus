
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./bootstrap.js",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "bootstrap.js"
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(css)$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {from: "./index.html", to: "./"},
                {from: "./style.css", to: "./"},
                {from: "./images/icon.png", to: "./" },
                {from: "./images/logo.png", to: "./" },
                // {from: "./images/reward.png", to: "./" },
                {from: "./images/head-up.png", to: "./" },
                {from: "./images/head-right.png", to: "./" },
                {from: "./images/head-down.png", to: "./" },
                {from: "./images/head-left.png", to: "./" },
                {from: "./images/tail-down.png", to: "./" },
                {from: "./images/tail-left.png", to: "./" },
                {from: "./images/tail-up.png", to: "./" },
                {from: "./images/tail-right.png", to: "./" },
            ]
        })
    ]
}
