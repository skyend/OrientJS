/**
 * Builder,ProjectManager
 * 빌더의 Project 관리자
 *
 *
 *
 */
var ServiceManager = require('./builder.ServiceManager.js');


class ProjectManager {
  constructor(_app) {
    this.app = _app;
    this.useProjectId;

    // 임시
    //this.init();
  }

  init() {
    var projectKey = 'IonTProject';
    this.meta = this.app.session.certifiedRequestJSON("/BuildingProjectData/Projects/" + projectKey + ".json");

    // 서비스 매니저 시작
    this.serviceManager = new ServiceManager(this.app, this.app.session, this.meta.ServiceKey);

  }

  getList(_complete) {
    this.app.gelateriaRequest.loadProjectList(function(_result) {
      _complete(_result);
    });
  }

  create(_name, _complete) {

    this.app.gelateriaRequest.createProject(_name, function(_result) {
      _complete(_result);
    });

  }

  createService(_name, _complete) {
    this.app.gelateriaRequest.createService(this.useProjectId, _name, function(_result) {
      _complete(_result);
    });
  }

  // 현재 사용중인 프로젝트
  use(_projectId) {
    this.useProjectId = _projectId;
  }

  getServiceList(_complete) {
    this.app.gelateriaRequest.loadServiceList(this.useProjectId, function(_result) {
      _complete(_result);
    });
  }


}

module.exports = ProjectManager;