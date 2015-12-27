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
import PreviewScene from './ui.workspace/Context/PageContext/PreviewScene.jsx';
import React from 'react';

window.gelateriaHost = '125.131.88.146:8080';

var App = function() {
  window.app = this;
  window.gelateriaVersion = 1.02;

  this.session = new Session();
  this.gelateriaRequest = new GelateriaRequest(window.gelateriaHost);
  this.userManager = new UserManager(this);
  this.projectManager = new ProjectManager(this);
  this.currentProjectId = undefined;

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
  let self = this;
  let publish = _params['publish']; // navigateType : page || staticResource
  let serviceId = _params['serviceId'];
  let pageId = _params['pageId'];
  let pageAccessPointName = _params['page'];

  let headChildren = document.head.querySelectorAll("style,link,script");
  for (let i = 0; i < headChildren.length; i++) {
    headChildren[i].remove();
  }

  // Main Page
  let serviceManager = new ServiceManager(this, serviceId, function readyFunc(_serviceManager) {
    self.session.setServiceManager(_serviceManager);

    // 빌더 시작
    self.serviceManager = serviceManager;


    if (publish === 'page') {
      self.serviceManager.findPageByAccessPoint(pageAccessPointName, function(_result) {

        if (_result === null) {
          self.serviceManager.findPageByAccessPoint('404', function(_result) {

            if (_result !== null) {
              serviceManager.getPageContextController(_result._id, function(_contextController) {

                let viewer = new Viewer(serviceManager);
                viewer.page = _contextController.subject;
                viewer.window = window;
                viewer.rendering({
                  width: window.clientWidth,
                  height: window.clientHeight
                }, false);
              });
            } else {
              window.document.body.innerHTML = "404 Not Found.";
            }
          });
        } else {
          serviceManager.getPageContextController(_result._id, function(_contextController) {

            let viewer = new Viewer(serviceManager);
            viewer.page = _contextController.subject;
            viewer.window = window;
            viewer.rendering({
              width: window.clientWidth,
              height: window.clientHeight
            }, false);
          });
        }
      });
    } else if (publish === 'staticResource') {
      alert("Static Resource 는 아직 지원하지 않습니다.");
    }
  });

};

App.prototype.startServiceBuilding = function(_service_id) {
  let self = this;
  // 서비스 매니저 생성
  this.serviceManager = new ServiceManager(this, _service_id, function readyFunc(_serviceManager) {
    self.session.setServiceManager(_serviceManager);
    // 빌더 시작
    self.initBuilder();
  });
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