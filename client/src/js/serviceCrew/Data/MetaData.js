class MetaData {
  constructor(_object) {
    this.import(_object);
  }

  // Setters
  set variable(_v) {
    this._variable = _v;
  }

  // Getters
  get variable() {
    return this._variable;
  }

  set seed(_s) {
    this._seed = _s;
  }

  get seed() {
    return this._seed;
  }

  set default(_d) {
    this._default = _d;
  }

  get default() {
    return this._default;
  }

  set stored(_stored) {
    this._stored = _stored;
  }

  get stored() {
    return this._stored;
  }

  set name(_n) {
    this._name = _n;
  }

  get name() {
    return this._name;
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
    if (this.variable === 'true') {
      return true;
    } else if (this.variable === 'false') {
      return false;
    } else {
      throw new Error("Boolean 으로 변환 할 수 없습니다.");
    }
  }

  get byObject() {
    try {
      return JSON.parse(this.variable);
    } catch (_e) {
      throw new Error(`Fail Parse JSON. target : '${this.variable}', Native error message:${_e.message}`);
    }
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
    if (_v === true) {
      this._variable = 'true';
    } else if (_v === false) {
      this._variable = 'false';
    } else {
      throw new Error("Boolean 값이 아닌 값을 입력하셨습니다. boolean 값을 입력하세요.");
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
    if (typeof _data === 'object') {
      this.variable = _data.seed; // variable 는 런타임에 언제든지 변경될 수 있는 데이터이다.
      this.seed = _data.seed; // Seed 는 런타임에 변경되지 않는 데이터이다.
      this.default = _data.default; // default 는 seed의 데이터 리졸브가 실패하였을 때 대체될 데이터이다.
      this.name = _data.name;
    } else {
      // object 가 아닌 타입으로 들어온다면 그것을 초기값으로 입력한다.
      this.seed = this.variable = _data;
    }
  }

  export () {
    let exportO = {
      seed: this.seed,
      default: this.default
    };

    if (this.name) {
      exportO.name = this.name;
    }

    return exportO;
  }
}

export default MetaData;