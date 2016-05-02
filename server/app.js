var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// 고정
import SuperAgent from './lib/SuperAgent.js';
let agent = new SuperAgent(__dirname);
global.agent = agent;

import routes from './routes/index';
import route_admin from './routes/admin';
import route_admin_project from './routes/admin/project';
import route_installer from './routes/installer';
import route_api_user from './routes/api/user';
import route_api_project from './routes/api/project';
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

app.use('/admin', route_admin);
app.use('/admin/project', route_admin_project);

app.use('/installer', route_installer);

// API Routing
app.use('/api/user', route_api_user);
app.use('/api/project', route_api_project);

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
  _io.on('connection', function(socket) {
    console.log(">>>>>>>>>>>>>>>>>>> connected");
    console.log(socket.handshake.headers.cookie);

    socket.emit('news', {
      hello: 'world'
    });

    socket.on('my other event', function(data) {
      console.log(data);
    });

    socket.on('close', function(data) {
      console.log(">>>>>>>>>>>>>>>>>> closed;")
    });
  });
};


module.exports = app;