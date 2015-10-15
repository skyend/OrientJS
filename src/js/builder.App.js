/**
 * Builder,App
 * 빌더의 Main
 *
 *
 *
 * Requires(JS) : builder.StageContext.js, builder.UI.js
 */

import UISupervisor from './builder.UISupervisor.js';
import ProjectManager from './builder.ProjectManager.js';
import ServiceManager from './builder.ServiceManager.js';
import UserManager from './builder.UserManager.js';
import Session from './builder.Session.js';
import Cookie from 'js-cookie';
import GelateriaRequest from './builder.GelateriaRequest.js';
import ICE from './builder.ICEServer.js';

var App = function() {
  window.app = this;
  window.gelateriaVersion = 0.68;

  this.session = new Session();
  this.session.ready();
  this.gelateriaRequest = new GelateriaRequest();
  this.userManager = new UserManager(this);
  this.projectManager = new ProjectManager(this);
  this.ICEStatic = ICE;
  //this.ice = new ICE(); 

  // 글로벌 드래그를 사용하기 위해 ui라는 이름으로도 uiSupervisor에 접근할 수 있도록 한다.
  this.ui = this.uiSupervisor = new UISupervisor(window, this.session, this);


  this.initEnterance();
};

App.prototype.startServiceBuilding = function(_service_id) {

  // 서비스 매니저 생성
  this.serviceManager = new ServiceManager(this, _service_id);

  // 빌더 시작
  this.initBuilder();
};

App.prototype.finishServiceBuilding = function() {
  this.initEnterance();
};

App.prototype.initBuilder = function() {
  this.uiSupervisor.clearRender();
  this.uiSupervisor.builderRender();

  this.projectManager = new ProjectManager(this, this.session, "IonTProject");
  this.projectManager.init();

  this.uiSupervisor.setProjectManager(this.projectManager);
};

App.prototype.initEnterance = function() {
  this.uiSupervisor.clearRender();
  this.uiSupervisor.enteranceRender();
};

App.prototype.initLogin = function() {
  this.uiSupervisor.clearRender();
  this.uiSupervisor.loginRender();
};

App.prototype.gotCeritification = function(_token, _date) {
  this.session.authorize(_token, _date);
};

App.prototype.removeCeritification = function(_token, _date) {
  this.session.deauthorize();
  console.log('asdasd');
  this.initEnterance();
};

module.exports = App;