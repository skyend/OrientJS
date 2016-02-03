class TypeCaster {

  // Read With Type Casting
  static toInteger(_v) {
    return parseInt(_v);
  }

  static toFloat(_v) {
    return parseFloat(_v);
  }

  static toNumber(_v) {
    return Number(_v);
  }

  static toString(_v) {
    let type = typeof _v;
    if (type === 'string') {
      return _v;
    }

    if (type === 'object') {
      return JSON.stringify(_v);
    }

    return String(_v);
  }

  static toBoolean(_v) {
    if (_v === 'true' || _v) {
      return true;
    }
    return false;
  }

  static toObject(_v) {
    if (typeof _v === 'string') {
      return JSON.parse(_v);
    }

    throw new Error("String 이 아닌 타입은 Object로 변환 할 수 없습니다.");
  }
}

export default TypeCaster;