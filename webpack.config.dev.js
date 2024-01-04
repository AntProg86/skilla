const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {merge} = require('webpack-merge');

const baseConfig = require('./webpack.config.base');

//const devtool = devMode ? 'inline-source-map' : undefined
//const devtool = devMode ? 'inline-source-map' : undefined

module.exports = merge(baseConfig, {
  //для ошибок
  devtool : 'inline-source-map',
  mode : 'development',
  devServer: {
    //contentBase: './dist',
    port: 3030,
    open: false,
    hot: true, // Включает автоматическую перезагрузку страницы при изменениях
    historyApiFallback: true, //перенаправит ошибки 404 на /index.html.
    //https: true,
  },
  entry: './src/index.tsx',
  output : {
    //название бандла
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  // это параметр конфигурации, который управляет тем, как webpack разрешает модули. 
  // Он позволяет настроить способ поиска и загрузки модулей webpack, 
  // что может быть полезно для повышения производительности, 
  // уменьшения размера пакета или поддержки различных форматов модулей.
  // resolve: {
  //   //Чтобы работали пути ("paths": {"#api/*": ["src/services/*"]}),
  //   //которые указаны в текст tsconfig.json
  //   plugins: [
  //     new TsconfigPathsPlugin({ configFile: path.resolve(process.cwd(), 'tsconfig.json') }),
  //   ],
  //   extensions: ['.tsx', '.ts', '.js']
  // },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, 'src', 'index.html')
    // }),
    // new MiniCssExtractPlugin({
    //   filename: '[name].[contenthash].css'
    // })
  ],
})