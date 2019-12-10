const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.common.js');

const HtmlWebpackPlugin = require('html-webpack-plugin');

// 开发环境的配置
module.exports = merge(webpackBaseConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    plugins:[
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'examples/index.html',
            chunks:['index']
        }),
    ],
    devServer: {
        // open: true, // 自动打开浏览器
        hot: true, // 开启热更新
        compress: true, // gzip
        port: 8080, // 服务端口
        // contentBase: './src' // 服务根目录
    }

})