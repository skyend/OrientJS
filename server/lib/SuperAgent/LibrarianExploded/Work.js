// DB와 Socket.io 세션을 체크 하여 유저에게 알림

export default {

  updateWork: function(_id, _data, _callback) {

    this.agent.dataStore.driver.updateWork(_id, _data, (_err, _updatedWorkDoc) => {
      if (_err) {
        _callback(ERRORS.WORK.FAILED_UPDATE, null);
      } else {
        _callback(null, _updatedWorkDoc);
      }
    });
  }
}