class ActionResult {
  constructor(_data, _nextTask) {
    this.data = _data || null;
    this.nextTask = _nextTask || undefined;
  }

  get data() {
    return this._data;
  }

  get nextTask() {
    return this._nextTask;
  }

  set data(_data) {
    this._data = _data;
  }

  set nextTask(_nextTask) {
    this._nextTask = _nextTask;
  }
}

export default ActionResult;