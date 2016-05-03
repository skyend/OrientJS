export default {
  createWork: function(_user_id, _workClass, _workParams, _callback) {
    let WorkModel = this.getModel('Work');
    let data = {
      workerClass: _workClass,
      user_id: _user_id,
      workParams: _workParams,
      beginning_time: new Date()
    };

    console.log(_workParams);

    WorkModel.create(data, (_err, _workDoc) => {
      if (_err) {
        agent.log.error("Mongodb fail create work detail:" + _err);

        _callback(_err, null);
      } else {
        agent.log.info("Mongodb created work data:%s", JSON.stringify(data));

        _callback(null, _workDoc);
      }
    });
  }
}