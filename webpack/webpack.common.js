const path = require('path')

module.exports = {
    entry: { zvm: './src/zvm.ts', index: './examples/index.js' },
    output: {
        filename: '[name]-[hash:4].js',
        path: path.resolve(__dirname,'..', 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },

};