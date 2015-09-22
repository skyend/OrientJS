/**
 * Builder,App
 * 빌더의 Main
 *
 *
 *
 * Requires(JS) : builder.StageContext.js, builder.UI.js
 */

var UISupervisor = require('./builder.UISupervisor.js');
var ProjectManager = require('./builder.ProjectManager.js');
var Session = require('./builder.Session.js');

var App = function() {
  window.app = this;
  this.session = new Session();
  this.session.ready();

  // 글로벌 드래그를 사용하기 위해 ui라는 이름으로도 uiSupervisor에 접근할 수 있도록 한다.
  this.ui = this.uiSupervisor = new UISupervisor(window, this.session);


};

App.prototype.initBuilder = function() {
  this.uiSupervisor.builderRender();

  this.projectManager = new ProjectManager(this.session, "IonTProject");
  this.projectManager.init();

  this.uiSupervisor.setProjectManager(this.projectManager);
};

App.prototype.initLogin = function() {
  this.uiSupervisor.loginRender();
};

module.exports = App;