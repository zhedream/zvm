const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.common.js');

// 生产环境的配置
module.exports = merge(webpackBaseConfig, {
    mode: 'production',
    devtool: 'none',
})