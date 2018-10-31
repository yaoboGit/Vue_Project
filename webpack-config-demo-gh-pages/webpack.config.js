var webpack = require('webpack');
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    // 配置入口
    entry: {
        about: './src/pages/about/about.js',
        contact: './src/pages/contact/contact.js'
    },
    // 配置出口
    output: {
        path: __dirname + "/dist/",
        filename: 'js/[name]-[hash:5].js',
        publicPath: '/',
    },

    module: {
        loaders: [
            //解析.js
            {
                test: '/\.js$/',
                loader: 'babel',
                exclude: path.resolve(__dirname, 'node_modules'),
                include: path.resolve(__dirname, 'src'),
                query: {
                    presets: ['env']
                }
            },
            // css处理
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'

            },
            // less处理
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            // 图片处理
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',

                query: {
                    name: 'assets/[name]-[hash:5].[ext]'
                },
            }, {
                test: /\.(htm|html)$/i,
                use: ['html-withimg-loader']
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin(__dirname + '/assert/css/common.less'),
        //  minify:{
        //     removeComments: true,//删除注释
        //     collapseWhitespace:true//删除空格
        // }
        new HtmlWebpackPlugin({
            filename: __dirname + '/dist/about.html',
            inject: 'head',
            template: 'html-withimg-loader!' + __dirname + "/src/pages/about/about.html",
            chunks: ['about'],
            inlineSource: '.(js|css)$'
        }),
        new HtmlWebpackPlugin({
            inject: 'head',
            filename: __dirname + '/dist/contact.html',
            template: __dirname + "/src/pages/contact/contact.html",
            chunks: ['contact'],
            inlineSource: '.(js|css)$'
        }),
        //设置每一次build之前先删除dist
        new CleanWebpackPlugin(
            ['dist/*', 'dist/*', ], 　 //匹配删除的文件
            {
                root: __dirname,
                　　　　　　　　　　 //根目录
                verbose: true,
                　　　　　　　　　　 //开启在控制台输出信息
                dry: false　　　　　　　　　　 //启用删除文件
            }
        )
    ],
    // 起本地服务，我起的dist目录
    devServer: {
        contentBase: "./assets/",
        historyApiFallback: true,
        inline: true,
        hot: true,
        host: 'localhost',
        port: 82
    }
}