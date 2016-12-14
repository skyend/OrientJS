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
    if (_v === 'false') return false;

    if (_v === 'true' || _v) {
      return true;
    }

    return false;
  }

  static toObject(_v) {
    if (typeof _v === 'string') {
      return JSON.parse(_v);
    }

    throw new Error(`${JSON.stringify(_v)} 를 Object로 변환 할 수 없습니다.`);
  }

  static toArray(_v) {
    if (typeof _v === 'string') {
      try{

        return JSON.parse(_v);
      } catch(_e){
        throw new Error(`${(_v)} 를 Array로 변환 할 수 없습니다.`);
      }
    }

    throw new Error(`${JSON.stringify(_v)} 를 Array로 변환 할 수 없습니다.`);
  }
}

export default TypeCaster;
