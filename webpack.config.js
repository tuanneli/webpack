const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const isDev = process.env.NODE_ENV === 'development';

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: "all"
        },
        runtimeChunk: "single"
    }

    if (!isDev) {
        config.minimizer = [
            new TerserPlugin(),
            new CssMinimizerPlugin()
        ]
    }

    return config;
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    devServer: {
        port: 3000,
        hot: isDev,
    },
    entry: {
        main: './index.js',
        analytics: './analytics.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].[contenthash].js",
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@models': path.resolve(__dirname, 'src', 'models'),
            '@src': path.resolve(__dirname, 'src')
        }
    },
    optimization: optimization(),
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            favicon: path.resolve(__dirname, 'src', 'assets/icons/favicon.ico'),
            minify: {
                collapseWhitespace: !isDev
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css"
        })
        // new CopyPlugin({
        //     patterns: [
        //         {from: path.resolve(__dirname, 'src', 'assets/icons/favicon.ico'), to: path.resolve(__dirname, "dist")},
        //     ]
        // }),
    ],
    module: {
        rules: [
            {
                test: /\.(c|sc|sa)ss$/i,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        // hmr: isDev,
                        // reloadAll: true
                    },
                },
                    "css-loader",
                    "sass-loader"],
            }, {
                test: /\.(ttf|woff|woff2|eot)$/i,
                use: ["file-loader"]
            },
            {
                test: /\.(jpe?g|png|gif|svg|webp)$/i,
                use: [
                    {
                        loader: "image-webpack-loader",
                        options: {
                            mozjpeg: {
                                progressive: true,
                            },
                            // optipng.enabled: false will disable optipng
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            // the webp option will enable WEBP
                            webp: {
                                quality: 75
                            }
                        }
                    }
                ],
                type: 'asset/resource',
            },
        ],
    },
}