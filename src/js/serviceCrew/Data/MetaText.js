class MetaText {
  constructor(_seed, _default) {
    this.variable = _seed; // variable 는 런타임에 언제든지 변경될 수 있는 데이터이다.
    this.seed = _seed; // Seed 는 런타임에 변경되지 않는 데이터이다.
    this.default = _default; // default 는 seed의 데이터 리졸브가 실패하였을 때 대체될 데이터이다.
  }

  // Getters
  get variable() {
    return this._variable;
  }

  get seed() {
    return this._seed;
  }

  get default() {
    return this._default;
  }

  // Read With Type Casting
  get byInteger() {
    return parseInt(this.variable);
  }

  get byFloat() {
    return parseFloat(this.variable);
  }

  get byString() {
    return String(this.variable);
  }

  get byBoolean() {
    if (this.variable === 'true' || this.variable) {
      return true;
    }
    return false;
  }


  // Setters
  set variable(_v) {
    this._variable = _v;
  }

  set seed(_s) {
    this._seed = _s;
  }

  set default(_d) {
    this._default = _d;
  }

  reset() {
    this.variable = this.seed;
  }
}

export default MetaText;