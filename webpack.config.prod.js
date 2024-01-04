const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

//сторонний плагин для компрессии скриптов, например, 
//в gzip формат. 
//Большинство браузеров принимает gzip 
//файли при установлению в headers для ответа переменной Content-Encoding:gzip. 
const CompressionPlugin = require('compression-webpack-plugin'); 

//const {CleanWebpackPlugin} = require('clean-webpack-plugin');


const {merge} = require('webpack-merge');

const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
  //для ошибок
  devtool : 'inline-source-map',
  mode : 'production',
  entry: './src/index.tsx',
  output : {
    //название бандла
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    //new CompressionPlugin(),
  ],
  
})