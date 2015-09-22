/**
 * Builder,ProjectManager
 * 빌더의 Project 관리자
 *
 *
 *
 */
var ServiceManager = require('./builder.ServiceManager.js');

var ProjectManager = function(_session, _projectKey) {
  this.projectKey = _projectKey;
  this.session = _session;
};

ProjectManager.prototype.init = function() {
  this.meta = this.session.certifiedRequestJSON("/BuildingProjectData/Projects/" + this.projectKey + ".json");

  // 서비스 매니저 시작
  this.serviceManager = new ServiceManager(this.session, this.meta.ServiceKey);
  this.serviceManager.init();
};

module.exports = ProjectManager;