const webpack = require('webpack')
const path = require('path')

module.exports = {
    mode:'production',
    entry: {
        vue:[
            'vue/dist/vue.js',
            'vue-router'
        ]
    },
    output:{
        filename:'[name]_dll.js',
        path:path.resolve(__dirname,'../dist'),
        library:'[name]_dll' // 对外暴露 一个全局变量
    },
    plugins:[
        new webpack.DllPlugin({
            name:'[name]_dll',
            path:path.resolve(__dirname,'../dist/manifest.json') // 一个清单
        })
    ]
}