// var Clean = require('clean-webpack-plugin');
var webpack = require('webpack');

module.exports = {
  entry: './src/main.js',
  output: {
    path: './',
    filename: "built-foundation.js",
    hash: true
  },

  module: {
    loaders: [{
      test: /.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react']
      }
    }]
  },

  // resolve: {
  //   modulesDirectories: ['node_modules'],
  // },

  plugins: [
    new webpack.NoErrorsPlugin(),
  ]
};