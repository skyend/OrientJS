var App = require('./builder.App.js');
var cookie = require('js-cookie');

window.onload = function() {
  var app = new App();
  if (cookie.get('session_token') === null || cookie.get('session_token') === undefined) {
    console.log('Login init');
    app.initLogin();
  } else {
    app.initBuilder();
  }
  window.app = app;
};