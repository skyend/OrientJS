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
        _callback(ERRORS('PROJECT.VFNODE.FAIL_CREATE_DIR'), null);
      } else {
        _callback(null, _vfnodeDoc);
      }
    });
  },

  createFile: function(_user_id, _filename, _refferenceFileId, _callback) {
    this.agent.dataStore.driver.createVFNode(_user_id, false, _filename, _refferenceFileId, null, (_err, _vfnodeDoc) => {
      if (_err) {
        _callback(ERRORS('PROJECT.VFNODE.FAIL_CREATE_FILE'), null);
      } else {
        _callback(null, _vfnodeDoc);
      }
    });
  },

  createChildDirVFNode: function(_user_id, _upper_vfnode_id, _dirname, _callback) {
    this.createChildVFNode(_user_id, _upper_vfnode_id, _dirname, true, null, _callback);
  },

  createChildFileVFNode: function(_user_id, _upper_vfnode_id, _filename, _file_id, _callback) {
    this.createChildVFNode(_user_id, _upper_vfnode_id, _filename, false, _file_id, _callback);
  },

  createChildVFNode: function(_user_id, _upper_vfnode_id, _name, _isDir, _refferenceFileId, _callback) {
    // 자식 Directory를 생성한다.
    // 1. 상위디렉토리를 가져옴
    // 2. 자식 디렉토리 생성
    // 3. 상위디렉토리에 생성된 자식 디렉토리 refference추가 후 업데이트
    // 4. Error 여부, 변경된 상위 VFnodeDoc과 생성된 자식 VFNodeDoc 을 콜백으로 전달

    async.waterfall([
      (_cb) => {
        // 1

        this.getVFNodeAsDirById(_upper_vfnode_id, (_err, _vfnodeDoc) => {
          console.log('vfnode dir :->', _err, _vfnodeDoc);
          if (_err) {
            _cb(_err, null);
          } else {
            _cb(null, _vfnodeDoc);
          }
        });
      },
      (_upperVFNodeDoc, _cb) => {
        // directory 체크
        if (_upperVFNodeDoc.dir) {
          _cb(null, _upperVFNodeDoc);
        } else {
          _cb(ERRORS("PROJECT.VFNODE.CREATE.UPPER_VFNODE_IS_NOT_DIRECTORY"), null);
        }
      },
      (_upperVFNodeDoc, _cb) => {
        // 이름 중복 체크
        let foundDuplIndex = _.findIndex(_upperVFNodeDoc.refferences, (_refferenceVFNodeDoc) => {
          return _refferenceVFNodeDoc.name === _name;
        });

        if (foundDuplIndex > -1) {
          _cb(ERRORS("PROJECT.VFNODE.CREATE.ALREADY_EXISTS_CHILDNODE_NAME"), null);
        } else {
          _cb(null, _upperVFNodeDoc);
        }
      },
      (_upperVFNodeDoc, _cb) => {
        // 2


        if (_isDir) {
          this.createDir(_user_id, _name, [], (_err, _vfnodeDoc) => {
            if (_err) {
              _cb(_err);
            } else {
              _cb(null, _upperVFNodeDoc, _vfnodeDoc);
            }
          });
        } else {
          this.createFile(_user_id, _name, _refferenceFileId, (_err, _vfnodeDoc) => {
            if (_err) {
              _cb(_err);
            } else {
              _cb(null, _upperVFNodeDoc, _vfnodeDoc);
            }
          });
        }
      },
      (_upperVFNodeDoc, _childVFNodeDoc, _cb) => {
        // 3

        _upperVFNodeDoc.refferences.push(_childVFNodeDoc.id);


        // this.updateVFNode(_upperVFNodeDoc.id, {
        //   refferences:
        // })








        // 비즈니스맨으로 업데이트 구현해야함
        _upperVFNodeDoc.save((_err, _updatedVFNodeDoc) => {
          if (_err) {
            _cb(_err, null, null);
          } else {
            _cb(null, _updatedVFNodeDoc, _childVFNodeDoc);
          }
        });









      }
    ], (_err, _upperVFNodeDoc, _childVFNodeDoc) => {
      if (_err) {
        _callback(_err, null, null);
      } else {
        _callback(null, _upperVFNodeDoc, _childVFNodeDoc);
      }
    });
  },

  getVFNode: function(_vfnode_id, _withRefsPopulate, _withFilePopulate, _callback) {
    this.agent.dataStore.driver.getVFNode(_vfnode_id, _withRefsPopulate, _withFilePopulate, (_err, _vfnodeDoc) => {
      if (_err) {
        _callback(ERRORS('PROJECT.VFNODE.FAIL_READ'), null);
      } else {
        _callback(null, _vfnodeDoc);
      }
    });
  },

  getVFNodeAsDirById: function(_vfnode_id, _callback) {
    this.getVFNode(_vfnode_id, true, false, _callback);
  },

  getVFNodeAsFileById: function(_vfnode_id, _callback) {
    this.getVFNode(_vfnode_id, false, true, _callback);
  },

  appendVFNodeToDirVFNodeById: function(_upperVFNodeId, _appendVFNodeId, _callback) {
    this.getVFNode(_vfnode_id, false, false, (_err, _vfnodeDoc) => {
      if (_err) {
        _callback(_err);
      } else {
        _callback(null, _vfnodeDoc);
      }
    });
  },

  updateVFNode: function(_vfnode_id, _updateFields, _callback) {
    this.agent.dataStore.driver.updateVFNode(_vfnode_id, _updateFields, (_err, _updatedVFNodeDoc) => {
      if (_err) {
        _callback(ERRORS("PROJECT.VFNODE.FAIL_UPDATE"), null);
      } else {
        _callback(null, _updatedVFNodeDoc);
      }
    });
  },

  /**
   * appendChildVFNode
   *
   */
  appendChildVFNode(_upper_vfnode_id, _child_vfnode_id, _callback) {
    async.waterfall([
      (_cb) => {
        this.getVFNodeAsDirById(_upper_vfnode_id, (_err, _vfnodeDoc) => {
          if (_err) {
            _cb(_err, null);
          } else {
            _cb(null, _vfnodeDoc);
          }
        });
      }
    ], (_upperVFNodeDoc, _cb) => {

    });

  },

  listChildNodes: function(_vfnode_id, _callback) {

  },

  //
  // mkdirByRootVFNode: function(_rootVFNodeId, _dirpathname, _callback) {
  //   // dirpath 를 따라 dir 트리를 root부터 타고 탐색하여 상위가 되는 vfnode를 찾고, 찾을 수 없다면 그의 상위 vfnode를 찾아 중간 줄기를 생성하고 마지막 vfnode를 생성한다.
  //
  //   //탐색
  //
  // },

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