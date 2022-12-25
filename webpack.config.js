const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDev = process.env.NODE_ENV === 'development';

const fileName = (ext) => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

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

const babelOptions = (preset) => {
    const options =
        {
            presets: ['@babel/preset-env'],
            plugins: ["@babel/plugin-proposal-class-properties"],
        }


    if (preset) {
        options.presets.push(preset)
    }

    return options;
}

const jsLoaders = () => {
    const loaders = [{
        loader: "babel-loader",
        options: babelOptions(),
    }]

    return loaders;
}

const plugins = () => {
    const base = [
        new HtmlWebpackPlugin({
            template: "./index.html",
            favicon: path.resolve(__dirname, 'src', 'assets/icons/favicon.ico'),
            minify: {
                collapseWhitespace: !isDev
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: fileName('css')
        }),
        new ESLintPlugin()
        // new CopyPlugin({
        //     patterns: [
        //         {from: path.resolve(__dirname, 'src', 'assets/icons/favicon.ico'), to: path.resolve(__dirname, "dist")},
        //     ]
        // }),
    ]

    if (isDev) {
        base.push(new BundleAnalyzerPlugin())
    }

    return base;
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    devServer: {
        port: 3000,
        hot: isDev,
    },
    devtool: isDev && 'source-map',
    entry: {
        main: ["@babel/polyfill", './index.jsx'],
        analytics: './analytics.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: fileName('js'),
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@models': path.resolve(__dirname, 'src', 'models'),
            '@src': path.resolve(__dirname, 'src')
        }
    },
    optimization: optimization(),
    plugins: plugins(),
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
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /\.m?ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: babelOptions("@babel/preset-typescript")
                }
            },
            {
                test: /\.m?jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: babelOptions("@babel/preset-react")
                }
            }
        ],
    },
}