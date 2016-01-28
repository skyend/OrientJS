import App from './builder.App';

window.onload = function() {
  var app = new App();
  window.app = app;

  setInterval(function() {
    console.log("---------------3s--------------");
  }, 3000)
};
