import Async from 'async';
import _ from 'underscore';
import uuid from 'uuid';


export default {
  createProject: function(_user, _fields, _callback) {

    /*
      1. 프로젝트 생성
      2. 마스터 유저 할당
      3. 프로젝트 RootDir 추가
    */
    Async.waterfall([
      (_cb) => {
        // 데이터베이스에 프로젝트 생성
        this.agent.dataStore.driver.createProject({
          name: _fields.name,
          access: _fields.access,
          description: _fields.desc,
        }, (_err, _projectDoc) => {

          if (_err !== null) {
            _cb(ERRORS("PROJECT.CREATE.FAIL_CREATE_PROJECT"), null);
          } else {
            _cb(null, _projectDoc);
          }
        });
      },

      (_projectDoc, _cb) => {
        // 프로젝트의 마스터 유저 관계 생성

        this.agent.dataStore.driver.createProjectUserRelation(_projectDoc.id, _user.id, 'master', (_err, _relDoc) => {

          if (_err !== null) {
            _cb(ERRORS("PROJECT.CREATE.FAIL_CREATE_PROJECT_USER_REL"), null);
          } else {
            _cb(null, _projectDoc, _relDoc);
          }
        });
      },

      (_projectDoc, _relDoc, _cb) => {
        // 프로젝트에 rootDir 추가
        this.agent.dataStore.driver.createVFNode(true, "root", null, [], (_err, _vfnodeDoc) => {
          if (_err !== null) {
            _cb(ERRORS("PROJECT.CREATE.FAIL_CREATE_ROOTDIR"), null);
          } else {
            _cb(null, _projectDoc, _relDoc, _vfnodeDoc);
          }
        });
      },

      (_projectDoc, _relDoc, _vfnodeDoc, _cb) => {
        // rootDir 로 만들어진 Dir를 project root dir 과의 관계 생성

        this.agent.dataStore.driver.createProjectRootDir(_projectDoc.id, _vfnodeDoc.id, (_err, _projectRootDirDoc) => {
          if (_err !== null) {
            _cb(ERRORS("PROJECT.CREATE.FAIL_ROOTDIR_LINK"), null);
          } else {
            _cb(null, _projectDoc, _relDoc, _vfnodeDoc);
          }
        });
      }
    ], (_err, _projectDoc) => {
      if (_err !== null) _callback(_err, null)
      else _callback(null, _projectDoc);
    });
  },

  templateToProject: function(_projectId, _localTemplatePath) {



  }
}