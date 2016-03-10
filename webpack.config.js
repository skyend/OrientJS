var Clean = require('clean-webpack-plugin');
var webpack = require('webpack');
//var CopyWebpackPlugin = require('copy-webpack-plugin');

var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: {
    //app: ['./src/app.jsx'],
    venders: ['react'],
    config: [
      "font-awesome-webpack!./config/font-awesome.config.js"
    ],
    // main: ['es5-shim', 'es5-shim/es5-sham', 'es6-shim', 'es6-shim/es6-sham', './src/js/main.js'],
    // 'built-foundation': ['es5-shim', 'es5-shim/es5-sham', 'es6-shim', 'es6-shim/es6-sham', './src/stand-alone-foundation/main.js'] // foundation build

    // main: ['./src/js/main.js'],
    'built-foundation': ['./src/stand-alone-foundation/main.js']
  },

  output: {
    path: './dist',
    filename: "[name].js",
    hash: true
  },

  module: {
    loaders: [{
        test: /\.json$/,
        loader: "json"
      }, {
        test: /\.css$/,
        exclude: /\.useable\.css$/,
        loader: "style!css"
      }, {
        test: /\.useable\.css$/,
        loader: "style/useable!css"
      }, {
        test: /\.less$/,
        exclude: /\.useable\.less$/,
        loader: "style!css!less"
      }, {
        test: /\.useable\.less$/,
        loader: "style/useable!css!less"
      }, {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loaders: ['react-hot', 'babel-loader']
      // },
      // {
      //   test: /\.jsx$/,
      //   loaders: ['jsx-loader?insertPragma=React.DOM&harmony', 'babel-loader']
      //     //loaders: ['react-hot', 'babel-loader']
      // },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff"
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      }, {
        test: /\.(png|jpg)$/,
        loader: "url-loader?mimetype=image/png"
      }
    ]
  },

  // resolve: {
  //   modulesDirectories: ['node_modules'],
  // },

  plugins: [
    new Clean(['dist']),
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true
    }),
    new HtmlWebpackPlugin({
      title: 'Gelateria ICE Gelato Builder',
      inject: 'body',
      chunks: ['config', 'venders', 'main'],
      filename: 'index.html'
    })
    // ,
    // new CopyWebpackPlugin([{
    //   from: './built-foundation*',
    //   to: '../'
    // }])
    /*,
        new HtmlWebpackPlugin({
          title: 'Gelateria Workspace',
          inject: 'body',
          chunks: ['config', 'venders', 'workspace_main'],
          filename: 'workspace.html'
        }),
        new HtmlWebpackPlugin({
          title: 'Pre Publish View',
          inject: 'body',
          chunks: ['config', 'venders', 'workspace_main'],
          filename: 'publish_view.html'
        })*/
  ]
};