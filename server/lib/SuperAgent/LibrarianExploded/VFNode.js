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
  }


};