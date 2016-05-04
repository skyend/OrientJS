import events from 'events';

class Worker extends events.EventEmitter {
  constructor(_agent, _userDoc, _socketSession, _workDoc, _workParams, _finishCallback, _errorCallback) {
    super();
    this.work_name = this.constructor.name; // 확장한 클래스의 이름이 입력됨

    this.agent = _agent;
    this.socketSession = _socketSession;
    this.userDoc = _userDoc;
    this.workDoc = _workDoc;

    this.finishCallback = _finishCallback;
    this.errorCallback = _errorCallback;
  }

  start(_callback) {
    this.workDoc.beginning_time = new Date();

    this.workDoc.save((_err) => {

      if (_err !== null) {

        _callback(_err);
      } else {

        _callback(null);

        this.agent.socketStore.tryEmit(this.socketSession, 'work_start', {
          work_name: this.work_name,
          time: this.workDoc.beginning_time
        });
      }
    });
  }

  log(_message, _callback) {
    let current = new Date();
    this.workDoc.log_lines.push(current.toUTCString() + ' - ' + _message);

    // workDocument에 log 추가 기록 및 socket 알림
    this.workDoc.save((_err) => {

      if (_err !== null) {

        _callback(_err);
      } else {

        _callback(null);

        this.agent.socketStore.tryEmit(this.socketSession, 'work_progress', {
          work_name: this.work_name,
          time: current,
          messege: _message
        });
      }
    });
  }

  error(_error, _message, _callback) {
    let current = new Date();
    this.workDoc.log_lines.push(current.toUTCString() + ' - ' + _error);
    // workDocument에 log 추가 기록 및 socket 알림

    this.workDoc.save((_err) => {

      if (_err !== null) {

        _callback(_err);
      } else {

        _callback(null);

        this.agent.socketStore.tryEmit(this.socketSession, 'work_error', {
          work_name: this.work_name,
          time: current,
          message: _message,
          error: _err
        });
      }

      this.errorCallback(_error);
    });
  }

  finish(_callback) {
    // workDocument 에 finish 기록 및 socket 알림
    this.workDoc.finished_time = new Date();

    this.workDoc.save((_err) => {

      if (_err !== null) {

        _callback(_err);
      } else {

        _callback(null);

        this.agent.socketStore.tryEmit(this.socketSession, 'work_finish', {
          work_name: this.work_name,
          time: this.workDoc.beginning_time
        });
      }

      this.finishCallback();
    });
  }

}

export default Worker;