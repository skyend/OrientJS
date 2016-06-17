var Clean = require('clean-webpack-plugin');
var webpack = require('webpack');
var babelPolyfill = require("babel-polyfill");
var CopyWebpackPlugin = require('copy-webpack-plugin');

var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  context: __dirname,

  entry: {
    //app: ['./client/src/app.jsx'],
    venders: ['react'],
    config: [
      "font-awesome-webpack!./client/config/font-awesome.config.js"
    ],
    // main: ['es5-shim', 'es5-shim/es5-sham', 'es6-shim', 'es6-shim/es6-sham', './client/src/js/main.js'],
    // 'built-foundation': ['es5-shim', 'es5-shim/es5-sham', 'es6-shim', 'es6-shim/es6-sham', './client/src/stand-alone-foundation/main.js'] // foundation build

    // main: ['./client/src/js/main.js'],
    //'built-foundation': ['./client/src/stand-alone-foundation/main.js'],
    // 'orient': ['babel-polyfill', './client/src/js/Orient/Orient.js'],
    // 'orbit': ['babel-polyfill', './client/src/js/Orient/Orbit.js'],
    // 'orbit.api.cms': ['babel-polyfill', './client/src/js/Orient/Orbit/addons/ICEAPISource'],
    // 'orbit.api.farm': ['babel-polyfill', './client/src/js/Orient/Orbit/addons/APIFarmSource']



    'orient': ['./client/src/js/Orient/Orient.js'],
    'orbit': ['./client/src/js/Orient/Orbit.js'],
    'orbit.api.cms': ['./client/src/js/Orient/Orbit/addons/ICEAPISource'],
    'orbit.api.farm': ['./client/src/js/Orient/Orbit/addons/APIFarmSource'],
    // 'C:\\Users\\user\\kop-work\\svn-station\\JoyKolon_PC\\ion\\ice-wcms\\JoyKolon_PC\\foundation\\orbit.api.farm2': ['./client/src/js/Orient/Orbit/addons/APIFarmSource']
  },

  output: {
    path: './client/dist',
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
    //new Clean(['client/dist']),
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoErrorsPlugin(),

    // new webpack.optimize.UglifyJsPlugin({
    //   minimize: true
    // }),

    new HtmlWebpackPlugin({
      title: 'Gelateria ICE Gelato Builder',
      inject: 'body',
      chunks: ['config', 'venders', 'main'],
      filename: 'index.html'
    }),
    // ,
    // new CopyWebpackPlugin([{
    //   from: {
    //     glob: 'client/dist/*',
    //     dot: true
    //   },
    //
    //   to: 'client/dist/test'
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