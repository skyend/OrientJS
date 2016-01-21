class ActionResult {
  constructor(_data, _nextPoint) {
    this.data = _data || null;
    this.nextPoint = _nextPoint || null;
  }

  get data() {
    return this._data;
  }

  get nextPoint() {
    return this._nextPoint;
  }

  set data(_data) {
    this._data = _data;
  }

  set nextPoint(_nextPoint) {
    this._nextPoint = _nextPoint;
  }
}

export default ActionResult;