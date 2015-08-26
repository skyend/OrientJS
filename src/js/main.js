(function() {
  var App = require('./builder.App.js');
  var cookie = require('js-cookie');
  window.onload = function() {
    var app = new App();
    if(cookie.get('sessionKey') === null || cookie.get('sessionKey') === undefined){
        console.log('Login init');
        app.initLogin();
    }else{
        console.log(cookie.get('sessionKey'));
        app.initBuilder();
    }
    window.app = app;
  };
})();