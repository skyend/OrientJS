export default {
  createProject: function(_projectData, _callback) {
    let ProjectModel = this.getModel('Project');

    ProjectModel.create(_projectData, function(_err, _projectDoc) {
      if (_err) {
        agent.log.error("Mongodb Fail createProject. Data:%s ,detail:%s", JSON.stringify(_projectData), _err);
        _callback(_err, null);
      } else {
        agent.log.info("MongoDB created project. Document: %s", JSON.stringify(_projectDoc.toJSON()));

        _callback(null, _projectDoc);
      }
    });
  },

  createProjectUserRelation: function(_projectId, _userId, _permission, _callback) {
    let ProjectUserRelModel = this.getModel("UserRelProject");

    ProjectUserRelModel.create({
      project_id: _projectId,
      user_id: _userId,
      permission: _permission
    }, (_err, _relDoc) => {
      if (_err !== null) {
        agent.log.error("MongoDB Fail create project user relation. project id: %s, user id: %s, perm: %s, detail:%s", _projectId, _userId, _permission, _err);

        _callback(_err, null);
      } else {
        agent.log.info('MongoDB created project user relation. project id: %s, user id: %s, perm: %s', _projectId, _userId, _permission);

        _callback(null, _relDoc);
      }
    });
  },

  createVFNode: function(_toDir, _name, _refferenceFileId, _refferences = [], _callback) {
    let VFNodeModel = this.getModel("VFNode");
    let createData = {
      dir: _toDir, // 디렉토리 인가 파일 인가
      name: _name,
      refferenceFile: _refferenceFileId, // 디렉토리가 아닌 경우 File 의 ObjectID
      refferences: _refferences, // 자신에게 속하는 파일 vfnode ID
    };

    VFNodeModel.create(createData, (_err, _vfnodeDoc) => {
      if (_err !== null) {
        agent.log.error("MongoDB Fail create vfnode. Data:%s, detail:%s", JSON.stringify(createData), _err);

        _callback(_err, null);
      } else {
        agent.log.info("MongoDB created vfnode. data:%s", JSON.stringify(createData));

        _callback(null, _vfnodeDoc);
      }
    });
  },

  createProjectRootDir: function(_projectId, _vfnodeId, _callback) {
    let ProjectRootVFNodeModel = this.getModel("ProjectRootVFNode");

    ProjectRootVFNodeModel.create({
      project_id: _projectId,
      vfnode_id: _vfnodeId
    }, (_err, _projectRootVFNodeDoc) => {
      if (_err !== null) {
        agent.log.error("MongoDB Fail create project node dir link. projectId: %s, vfnodeId: %s, detail:%s", _projectId, _vfnodeId, _err);
        _callback(_err, null); // project
      } else {
        agent.log.info("MongoDB created project vfnode.  projectId: %s, vfnodeId: %s", _projectId, _vfnodeId);
        _callback(null, _projectRootVFNodeDoc); // project
      }
    });
  }
}