import MetaData from './MetaData';

class MetaText extends MetaData {
  constructor(_object) {
    super(_object);
    if (Orient.bn === 'ie' && Orient.bv <= 10) {
      MetaData.call(this, _object);
    }

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
    if (this.variable === 'true' || this.variable === true) {
      return true;
    } else if (this.variable === 'false' || this.variable === false) {
      return false;
    } else {
      throw new Error(`${typeof this.variable} 타입인 '${this.variable}' 을 Boolean 으로 변환 할 수 없습니다.`);
    }
  }

  get byObject() {
    try {
      return JSON.parse(this.variable);
    } catch (_e) {
      throw new Error(`Fail Parse JSON. target : '${this.variable}', Native error message : ${_e.message}`);
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

}

export default MetaText;