/**
 * Builder,App
 * 빌더의 Main
 *
 *
 *
 * Requires(JS) : builder.StageContext.js, builder.UI.js
 */

(function() {
  var StageContext = require('./builder.EditorStageContext.js');
  var UI = require('./builder.UI.js');
  var Session = require('./builder.Session.js');

  var App = function() {
    window.app = this;
    this.ui = new UI(window);
    this.session = new Session();
    this.session.ready();
    this.ui = new UI(window, this.session);



    /*
     console.log('ready');
     var contextOne = new StageContext({
     stageLoadedCallback : function(){
     console.log('loaded call')
     }
     });
     contextOne.setIFrameStage(document.getElementById("iframeOne"));

     */
  };

  App.prototype.initBuilder = function() {
    this.ui.builderRender();
  };

  App.prototype.initLogin = function() {
    this.ui.loginRender();
  };

  module.exports = App;
})();