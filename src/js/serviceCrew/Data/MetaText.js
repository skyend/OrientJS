class MetaText {
  constructor(_object) {
    this.import(_object);
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

  get stored() {
    return this._stored;
  }



  // Read With Type Casting
  get byInteger() {
    return parseInt(this.variable);
  }

  get byFloat() {
    return parseFloat(this.variable);
  }

  get byNumber() {
    return Number(this.variable);
  }

  // 일반 반환이 string 이므로 무의미함
  get byString() {
    return String(this.variable);
  }

  get byBoolean() {
    if (this.variable === 'true' || this.variable) {
      return true;
    }
    return false;
  }

  get byObject() {
    return JSON.parse(this.variable);
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

  set stored(_stored) {
    this._stored = _stored;
  }

  // Read With Type Casting
  set fromInteger(_v) {
    this._variable = String(_v);
  }

  // Read With Type Casting
  set fromFloat(_v) {
    this._variable = String(_v);
  }

  set fromNumber(_v) {
    this._variable = String(_v);
  }

  // Read With Type Casting
  set fromString(_v) {
    this._variable = _v;
  }

  // Read With Type Casting
  set fromBoolean(_v) {
    if (_v) {
      this._variable = 'true';
    } else {
      this._variable = 'false';
    }
  }

  // Read With Type Casting
  set fromObject(_v) {
    this._variable = JSON.stringify(_v);
  }

  reset() {
    this.variable = this.seed;
  }

  save() {
    this.stored = this.variable;
  }

  load() {
    this.variable = this.stored;
  }

  import (_data) {
    if (typeof _data === 'Object') {
      this.variable = _data.seed; // variable 는 런타임에 언제든지 변경될 수 있는 데이터이다.
      this.seed = _data.seed; // Seed 는 런타임에 변경되지 않는 데이터이다.
      this.default = _data.default; // default 는 seed의 데이터 리졸브가 실패하였을 때 대체될 데이터이다.
    } else {
      this.seed = this.variable = _data;
    }
  }

  export () {
    return {
      seed: this.seed,
      default: this.default
    };
  }
}

export default MetaText;