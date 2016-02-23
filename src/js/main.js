var App = require('./builder.App.js');

window.onload = function() {
  var app = new App();
  window.app = app;

  setInterval(function() {
    console.log("---------------3s--------------");
  }, 3000)


  document.body.setAttribute("style", 'display:block!important')
};