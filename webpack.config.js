var Clean = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: {
    //app: ['./src/app.jsx'],
    venders: ['react'],
    config: [
      "font-awesome-webpack!./config/font-awesome.config.js"
    ],
    main: ['./src/js/main.js']
      //main: ['./src/js/ui/editor/test_main.jsx']
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
        loader: "style-loader!css-loader?root=../../"
      }, {
        test: /\.less$/,
        loader: "style!css!less"
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel-loader']
      }, {
        test: /\.jsx$/,
        //loaders: ['jsx-loader?insertPragma=React.DOM&harmony', 'react-hot', 'babel-loader']
        loaders: ['react-hot', 'babel-loader']
      },


      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff"
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      }, {
        test: /\.png$/,
        loader: "url-loader?mimetype=image/png"
      }
    ]
  },
  resolve: {
    modulesDirectories: ['node_modules'],
  },
  plugins: [
    new Clean(['dist', 'build']),
    new HtmlWebpackPlugin({
      title: 'Service Builder',
      inject: 'body',
      chunks: ['config', 'venders', 'main']
    })
  ]
};