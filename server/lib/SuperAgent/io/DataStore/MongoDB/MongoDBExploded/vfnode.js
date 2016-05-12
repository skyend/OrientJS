import async from 'async';

export default {
  createVFNode: function(_firstOwnerUserId, _toDir, _name, _refferenceFileId, _refferences = [], _callback) {
    let VFNodeModel = this.getModel("VFNode");
    let createData = {
      dir: _toDir, // 디렉토리 인가 파일 인가
      name: _name,
      refferenceFile: _refferenceFileId, // 디렉토리가 아닌 경우 File 의 ObjectID
      refferences: _refferences, // 자신에게 속하는 파일 vfnode ID
      owner_user_ids: [_firstOwnerUserId]
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

  getVFNode: function(_vfnode_id, _withRefsPopulate, _withFilePopulate, _callback) {
    let VFNodeModel = this.getModel("VFNode");

    let query = VFNodeModel.findById(_vfnode_id);
    let populateList = [];

    if (_withRefsPopulate) {
      populateList.push('refferences');
    }

    if (_withFilePopulate) {
      populateList.push('refferenceFile');
    }

    query = query.populate.apply(query, populateList);

    query.exec((_err, _result) => {
      if (_err) {
        agent.log.error("MongoDB Fail read vfnode. byid:%s, withRefsPopulate:%s, widthFilePopulate:%s, detail:%s", _vfnode_id, _withRefsPopulate, _withFilePopulate, _err);
        _callback(_err, null);
      } else {
        _callback(null, _result);
      }
    });
  },

  updateVFNode(_vfnode_id, _data, _callback) {
    let VFNodeModel = this.getModel("VFNode");

    VFNodeModel.findByIdAndUpdate(_vfnode_id, _data, (_err, _updatedVFNodeDoc) => {
      if (_err) {
        agent.log.error("Mongodb fail update vfnode. detail:" + _err);

        _callback(_err, null);
      } else {
        agent.log.info("Mongodb updated vfnode#%s. data:%s", _vfnode_id, JSON.stringify(_data));

        _callback(null, _updatedVFNodeDoc);
      }
    });
  },

  getProjectRootVFNodeDoc: function(_project_id, _callback) {
    let VFNodeModel = this.getModel('VFNode');
    let VFNodeProjectRelModel = this.getModel('ProjectRootVFNode');

    async.waterfall([
      (_cb) => {
        VFNodeProjectRelModel.findOne({
          project_id: _project_id
        }, (_err, _relDoc) => {
          if (_err !== null) {
            agent.log.error("MongoDB fail get vfnode project rel by project_id:%s . detail:" + _err, _project_id);

            _cb(_err, null);
          } else {
            agent.log.info("MongoDB get vfnode project rel by project_id:%s.", _project_id);

            _cb(null, _relDoc.vfnode_id);
          }
        });
      }
    ], (_err, _vfnode_id) => {
      VFNodeModel.findById(_vfnode_id, (_err, _vfnodeDoc) => {
        if (_err !== null) {
          agent.log.error("MongoDB fail get vfnode by id:%s. detail:" + _err, _vfnode_id);

          _callback(_err, null);
        } else {
          agent.log.info("MongoDB get vfnode project rel by project_id:%s.", _project_id);

          _callback(null, _vfnodeDoc);
        }
      });
    });
  }
}