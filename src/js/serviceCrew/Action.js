class Action {
  constructor(_callPoint, _targetActionKey, _params) {
    this.callPoint = _callPoint;
    this.targetActionKey = _targetActionKey;
    this.params = _params; // [];
  }

  get callPoint() {
    return this._callPoint;
  }

  get targetActionKey() {
    return this._targetActionKey;
  }

  get params() {
    return this._params;
  }

  set callPoint(_callPoint) {
    this._callPoint = _callPoint;
  }

  set targetActionKey(_targetActionKey) {
    this._targetActionKey = _targetActionKey;
  }

  set params(_params) {
    this._params = _params;
  }
}

export default Action;