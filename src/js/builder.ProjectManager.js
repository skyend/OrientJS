/**
 * Builder,ProjectManager
 * 빌더의 Project 관리자
 *
 *
 *
 */
var ServiceManager = require('./builder.ServiceManager.js');


class ProjectManager {
  constructor(_app, _session, _projectKey) {
    this.app = _app;
    this.projectKey = _projectKey;
    this.session = _session;
  }

  init() {
    this.meta = this.session.certifiedRequestJSON("/BuildingProjectData/Projects/" + this.projectKey + ".json");

    // 서비스 매니저 시작
    this.serviceManager = new ServiceManager(this.app, this.session, this.meta.ServiceKey);
    this.serviceManager.init();
  }

  getListByAuthorityToken(_aToken, _complete) {
    console.log('load project list');
  }

  // 현재 사용중인 프로젝트
  use(_projectId) {

  }
}

module.exports = ProjectManager;