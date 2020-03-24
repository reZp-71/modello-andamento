const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ImageminPlugin = require("imagemin-webpack");

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname, './dist'),
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
                extractComments: false,
            }),
        ],
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: `./assets/images/[name].[hash:8].[ext]`,
                            esModule: false,
                        }
                    }
                ],
            },
            {
                // HTML LOADER
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader',
                options: {
                    name: `./assets/fonts/[name].[hash:8].[ext]`
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                '**/*',
                path.join(process.cwd(), '/build/**/*')
            ]
        }),
        new HtmlWebpackPlugin({
            template: "src/index.html"
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css'
        }),
        new OptimizeCSSAssetsPlugin({}),
        new ImageminPlugin({
            bail: false, // Ignore errors on corrupted images
            cache: false,
            imageminOptions: {
                plugins: [
                    ["gifsicle", {interlaced: true}],
                    ["jpegtran", {progressive: true}],
                    ["optipng", {optimizationLevel: 5}],
                    [
                        "svgo",
                        {
                            plugins: [
                                {
                                    removeViewBox: false
                                }
                            ]
                        }
                    ]
                ]
            }
        })
    ]
};

