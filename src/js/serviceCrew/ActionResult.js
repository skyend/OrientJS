class ActionResult {
  constructor(_data, _taskChain) {
    this.data = _data || null;
    this.taskChain = _taskChain || undefined;
    this.returns = {};
    this.code = 'next';
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
    this._code = _code;
  }
}

export default ActionResult;