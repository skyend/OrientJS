class Point {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
  }

  set x(_x) {
    this._x = _x;
  }

  set y(_y) {
    this._y = _y;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }
}

export default Point;