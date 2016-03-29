var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

import SuperAgent from './lib/SuperAgent.js';

var agent = new SuperAgent(__dirname);
global.agent = agent;

var routes = require('./routes/index');
import route_installer from './routes/installer';

// var projects = require('./routes/project');
// var services = require('./routes/service');
// var pages = require('./routes/page');
// var documents = require('./routes/document');
// var apisources = require('./routes/apisource');
// var apiinterface = require('./routes/apiinterface');
// var users = require('./routes/user');
// var css = require('./routes/css');
// var js = require('./routes/javascript');
// var staticStore = require('./routes/staticStore');
// var component = require('./routes/component');
// var sharedElementNode = require('./routes/sharedElementNode');

// var test = require('./routes/test');
var app = express();


// url = 'mongodb://localhost:27017/gelateria';
//
// var mongoose = require("mongoose");
// mongoose.connect('mongodb://localhost/gelateria');
//
// mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
// mongoose.connection.once('open', function callback() {
//   console.log("mongo db connection OK.");
// });

// upload
var busboy = require('connect-busboy'); //middleware for form/file upload



// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'ejs');

var bodyParser = require('body-parser');

app.use(bodyParser.json({
  limit: '50mb'
}));

app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(busboy());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

/** ##주의## **/
// CORS 를 모든 라우팅에서 허용한다.
// static 자원 또한 예외없음
// 허용하지 않으면 스태틱자원접근시 동작이상이 있을 수 있음.
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(function(req, res, next) {
  let namespace = req.originalUrl.split('/')[1];

  if (/^(service-static)|(static)|(installer)$/.test(namespace)) {
    next();
    return;
  } else if (global.agent.isBuilt) {
    next();
  } else {
    res.redirect('/installer');
  }
});

app.use(cookieParser());

app.use('/service-static', express.static(path.join(__dirname, 'public')));
app.use('/gelateria', express.static(path.join(__dirname, '../client/dist'))); // builder service
app.use('/static', express.static(path.join(__dirname, 'staticStore'))); // static service
app.use('/', routes);
app.use('/installer', route_installer);

// app.use('/test', test);
// app.use('/projects', projects);
// app.use('/services', services);
// app.use('/pages', pages);
// app.use('/documents', documents);
// app.use('/users', users);
// app.use('/css', css);
// app.use('/js', js);
// app.use('/static-store', staticStore);
// app.use('/apisources', apisources);
// app.use('/apiinterfaces', apiinterface);
// app.use('/components', component);
// app.use('/shared-element-node', sharedElementNode);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



app.serverReady = function(_server, _io) {
  console.log("Ready");
};


module.exports = app;