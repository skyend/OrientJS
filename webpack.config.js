module.exports = {
    entry: [
        'jquery', 'jquery-ui', 'react',
        "bootstrap-webpack!./bootstrap.config.js",
        "!style!css!./css/bootstrap/bootstrap.min.css",
        "bootstrap-webpack!./bootstrap.config.js",
        "!style!css!less!./css/builder.less",
        "./js/builder.jsx"


    ],
    output: {
        path: __dirname,
        filename: "js/app.js"
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
            {test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff"},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream"},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=image/svg+xml"}
        ]
    }

};