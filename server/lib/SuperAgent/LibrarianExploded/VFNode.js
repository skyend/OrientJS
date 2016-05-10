import async from 'async';
import path from 'path';
import _ from 'underscore';

export default {
  createEmptyDir: function(_user_id, _dirname, _callback) {
    this.createDir(_user_id, _dirname, [], _callback);
  },

  createDir: function(_user_id, _dirname, _refferences, _callback) {
    this.agent.dataStore.driver.createVFNode(_user_id, true, _dirname, null, _refferences, (_err, _vfnodeDoc) => {
      if (_err) {

      } else {

      }
    });
  },

  mkdirByRootVFNode: function(_rootVFNodeId, _dirpathname, _callback) {
    // dirpath 를 따라 dir 트리를 root부터 타고 탐색하여 상위가 되는 vfnode를 찾고, 찾을 수 없다면 그의 상위 vfnode를 찾아 중간 줄기를 생성하고 마지막 vfnode를 생성한다.

    //탐색

  },

  explorerProjectVFNodeDirStemWithSolve: function(_projectId, _dirpathArray, _callback) {
    // 디렉토리 패스를 탐색하며 없는 디렉토리는 생성한다.

    let upperVFNodeDoc = null;


    async.eachSeries(_dirpathArray, (_dirname, _cb) => {

      // 상위 VFNodeDoc 이 잡혀있지 않은경우 상위 NodeDoc을 가져온다.
      if (upperVFNodeDoc === null) {
        this.agent.dataStore.driver.getProjectRootVFNodeDoc(_projectId, (_err, _vfnodeDoc) => {
          if (_err) {
            _cb(ERRORS('PROJECT.VFNODE.ROOT_FIND_FAIL'), null, null);
          } else {
            upperVFNodeDoc = _vfnodeDoc;

            return _vfnodeDoc;
          }
        });
      } else {
        let foundIndex = _.findIndex(upperVFNodeDoc.refferences, (_vfnode_id) => {

        });
      }
    }, (_err, _result) => {
      if (_err) {
        _callback(_err, null);
      } else {
        _callback(null, _result);
      }
    });
  }
};