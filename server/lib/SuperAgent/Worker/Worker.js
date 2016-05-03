import events from 'events';

class Worker extends events.EventEmitter {
  constructor(_agent, _userDoc, _socketSession, _workDoc, _workParams) {
    super();
    this.work_name = this.constructor.name; // 확장한 클래스의 이름이 입력됨

    this.agent = _agent;
    this.socketSession = _socketSession;
    this.userDoc = _userDoc;
  }

  start() {

  }

  log() {
    // workDocument에 log 추가 기록 및 socket 알림

  }

  finish() {
    // workDocument 에 finish 기록 및 socket 알림

  }

}

export default Worker;