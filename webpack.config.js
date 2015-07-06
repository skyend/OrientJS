var Clean = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        //app: ['./src/app.jsx'],
        venders: ['jquery', 'jquery-ui', 'react'],
        config: [
            "font-awesome-webpack!./config/font-awesome.config.js"
        ],
        main : [ './src/js/main.js']
    }
    ,
    output: {
        path: './dist',
        filename: "[name]_bundle.js"
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: "style-loader!css-loader?root=../../"},
            {test: /\.less$/, loader: "style!css!less"},
            {
                test: /\.jsx$/,
                loader: 'jsx-loader?insertPragma=React.DOM&harmony'
            },
            // **IMPORTANT** This is needed so that each bootstrap js file required by
            // bootstrap-webpack has access to the jQuery object
            {test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery'},

            // Needed for the css-loader when [bootstrap-webpack](https://github.com/bline/bootstrap-webpack)
            // loads bootstrap's css.
            // the file-loader emits files.
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            },
            {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"}
        ]
    },
    resolve: {
        modulesDirectories: ['node_modules']
    },
    plugins: [
        new Clean(['dist', 'build']),
        new HtmlWebpackPlugin({
            title: 'Service Builder',
            inject: 'body'
        })
    ]

};