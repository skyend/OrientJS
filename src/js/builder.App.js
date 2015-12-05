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
import _ from 'underscore';

import Viewer from './serviceCrew/Viewer.js';
import IframeStage from './ui.workspace/partComponents/IframeStage.jsx';
import PreviewScene from './ui.workspace/Context/PageContext/PreviewScene.jsx';
import React from 'react';

var App = function() {
  window.app = this;
  window.gelateriaVersion = 0.76;

  this.session = new Session();
  this.gelateriaRequest = new GelateriaRequest();
  this.userManager = new UserManager(this);
  this.projectManager = new ProjectManager(this);


  /** 임시 퍼블리싱 로직 **/
  let searchParam = window.location.search;
  searchParam = searchParam.replace(/^\?/, '');
  let paramPairs = searchParam.split('&');
  let params = {};
  paramPairs.map(function(_pair) {
    let splitedPair = _pair.split('=');
    params[splitedPair[0]] = splitedPair[1];
  })

  if (params['publish'] !== undefined) {
    this.startPublishPage(params);
    return;
  }
  /** 임시 퍼블리싱 완료 **/

  // 글로벌 드래그를 사용하기 위해 ui라는 이름으로도 uiSupervisor에 접근할 수 있도록 한다.
  this.ui = this.uiSupervisor = new UISupervisor(window, this.session, this);


  this.initEnterance();
};

App.prototype.startPublishPage = function(_params) {
  let projectId = _params['projectId'];
  let serviceId = _params['serviceId'];
  let pageId = _params['pageId'];

  // Main Page
  // http://localhost:8081/?publish=on&serviceId=565e7e1d4d00580a00e5becd&projectId=56193d447acb5b7b633dc8eb&pageId=566116414d00580a00e5bef4

  let serviceManager = new ServiceManager(this, serviceId);
  // serviceManager.getPageList(function(_result) {
  //   console.log(_result);
  //
  //   let pageIdx = _.findIndex(_result.list, {
  //     _id: pageId
  //   });
  //
  //   let page = _result.list[pageIdx];
  //
  //   console.log(page);
  // });

  serviceManager.getPageContextController(pageId, function(_contextController) {
    console.log(_contextController);

    let previewScene = React.render(React.createElement(PreviewScene, {
      width: '100%',
      height: '100%'
    }), window.document.body);

    let viewer = new Viewer(serviceManager);

    previewScene.setViewer(viewer)
      //viewer.window =
    console.log(previewScene, viewer);
  });

  //window.document.body.innerHTML = "<iframe id='publish-zone' width='100%' height='100%' style='border'></iframe>";


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