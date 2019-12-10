const path = require('path')
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.common.js');

// 生产环境的配置
module.exports = merge(webpackBaseConfig, {
    entry: './src/zvm.ts',
    output: {
        filename: 'zvm-[hash].js',
        path: path.resolve(__dirname,'..', 'dist'),
    },
    mode: 'production',
    devtool: 'none',
})