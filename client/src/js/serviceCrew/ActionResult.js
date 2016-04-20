class ActionResult {
  constructor(_data, _taskChain) {
    this.clazz = 'ActionResult';

    this.data = _data || null;
    this.taskChain = _taskChain || undefined;
    this.returns = {
      "continue": true // continue 가 true 로 유지되어 있을 때 이벤트의 다음 처리를 진행한다.
    };

    this.code = 'next';

    // ActionResult의 내용을 세팅 한 action:task 또는 function:task의 name
    this.origin;

    // 상위(이전에 처리되어 반환된) result 객체
    this.upperResult;
  }

  get upperResult() {
    return this._upperResult;
  }

  get origin() {
    return this._origin;
  }

  get data() {
    return this._data;
  }

  get returns() {
    return this._returns;
  }

  get taskChain() {
    return this._taskChain;
  }

  // code 에 따라 태스크의 후처리를 진행
  // success 로 반환될 경우 task 의 chain-success 필드에 입력된 task명으로 다음 태스크를 실행한다.
  // 대부분의 task 는 success로 반환 될 것이며 taskChain 에 입력된 값의 여부에 따라 무시 될 수 있다.
  get code() {
    return this._code;
  }

  set upperResult(_upperResult) {
    this._upperResult = _upperResult;
  }

  set origin(_origin) {
    this._origin = _origin;
  }

  set data(_data) {
    this._data = _data;
  }

  set returns(_returns) {
    this._returns = _returns;
  }

  set taskChain(_taskChain) {
    this._taskChain = _taskChain;
  }

  set code(_code) {
    this._code = String(_code);
  }

  setUpperActionResult(_actionResult) {
    this.upperResult = _actionResult;
  }

  getUpperByTaskName(_taskName) {
    let found = null;

    let curr = this;
    while (curr = curr.upperResult) {
      if (curr.origin === `task@${_taskName}`) {
        found = curr;
        break;
      }
    }

    if (found) {
      return found;
    } else {
      throw new Error("상위의 ActionResult를 찾을 수 없습니다.");
    }
  }
}

export default ActionResult;