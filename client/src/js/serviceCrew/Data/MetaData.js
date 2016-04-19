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
      try {
        this.variable = JSON.parse(_data.seed); // Seed 는 런타임에 변경되지 않는 데이터이다.
      } catch (_e) {
        this.variable = _data.seed;
      }
      this.seed = _data.seed; // variable 는 런타임에 언제든지 변경될 수 있는 데이터이다.
      this.default = _data.default; // default 는 seed의 데이터 리졸브가 실패하였을 때 대체될 데이터이다.
      this.name = _data.name;
    } else {
      throw new Error("MetaData 입력형식 오류");
    }
  }

  export () {
    let exportO = {
      default: this.default
    };

    if (this.name) {
      exportO.name = this.name;
    }

    if (typeof this.seed === 'object') {
      exportO.seed = JSON.stringify(this.seed);
    } else {
      exportO.seed = this.seed;
    }


    return exportO;
  }
}

export default MetaData;