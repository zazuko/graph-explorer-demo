const path = require('path');
var webpack = require("webpack");

const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  plugins: [
    new webpack.ProvidePlugin({
      /*$: 'jquery',
      jQuery: 'jquery',*/
      //superCm: 'context-menu.min.js'
    }), 
    new MomentLocalesPlugin({
      localesToKeep: ['en', 'nl'],
    }), 
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
},
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'explorer.js'
  },
  devServer: {
         contentBase: './dist',
         port: 8088
       },
  module: {
        rules: [
           {
             test: /\.ts$|\.tsx$/, 
             loader: 'ts-loader',
             options: { allowTsInNodeModules: true }
  			}, 
           {
             test: /\.css$/,
             use: [
              'style-loader',
               'css-loader',
             ],
           },
           {
            test: /\.(jpe?g|gif|png|svg)$/i,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 8192,
                },
              },
            ],
          },
         ],
         
       },
};