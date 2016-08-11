class ObjectExtends {
  static liteExtends(_destObject, _source) {
    let okeys = Object.keys(_source);

    let propKey;
    let prop;
    for (let i = 0; i < okeys.length; i++) {
      propKey = okeys[i];
      prop = _source[propKey];


      if (typeof prop === 'object') {
        if (prop === null || prop === undefined) {
          _destObject[propKey] = prop;
        } else {
          _destObject[propKey] = ObjectExtends.clone(prop);
        }

      } else if (typeof prop === 'function') {
        _destObject[propKey] = prop;
      } else {
        _destObject[propKey] = prop;
      }
    }
  }

  // _interpolator 가 입력되면 clone과 동시에 값을 변경한다.
  static clone(_object, _deep, _interpolator) {
    let keys = Object.keys(_object);
    let clonedObj;
    let value, key;

    if (_object instanceof Array) {
      clonedObj = [];
    } else {
      clonedObj = {};
    }

    for (let i = 0; i < keys.length; i++) {
      key = keys[i];
      value = _object[key];
      switch (typeof value) {
        case 'function': // function 은 참조 복사
        case 'number': // 1232, 12312.1123, Infinity, NaN
        case 'string':
        case 'boolean': // true ,false
        case 'undefined': // undefined
          clonedObj[key] = _interpolator ? _interpolator(value) : value;
          break;
        case 'object':
          if (_deep) {
            if (value === null) {
              clonedObj[key] = null;
            } else {
              clonedObj[key] = ObjectExtends.clone(value, _deep, _interpolator);
            }
          } else {
            clonedObj[key] = _interpolator ? _interpolator(value) : value;
          }
      }
    }

    return clonedObj;
  }

  // Object 를 머지한다. 참조객체에 소스객체를 머지한다. 반환은 없다
  // override 가 true로 입력되면 키가 이미 dest 객체에 존재 하더라도 _source의 값으로 덮어쓴다.
  static mergeByRef(_dest, _source, _override, _asSuper) {
    let keys = Object.keys(_source);
    let key;

    for (let i = 0; i < keys.length; i++) {
      key = keys[i];
      if (_override) {
        _dest[key] = _source[key];
      } else if (!_dest.hasOwnProperty(key)) {
        if (_asSuper) {
          _dest['super_' + key] = _source[key];
        }

        _dest[key] = _source[key];
      }
    }
  }

  static merge(_dest, _source, _override, _asSuper) {
    let assigned = ObjectExtends.clone(_dest);


    ObjectExtends.mergeByRef(assigned, _source, _override, _asSuper);

    return assigned;
  }



  /*
    mergeDeep
    깊은 오브젝트 합치기
    _A 와 _B 에 입력된 두 오브젝트를 합친결과를 반환한다.
    _override : _override 옵션에 참이 들어오면 _A에 존재하는 필드가 _B에도 있을 때 _B의 데이터로 덮어진다.
    두 오브젝트에 필드 명이 같고 필드의 타입이 Object 면 두 오브젝트를 각각 머지 하여 깊은 머지를 구현한다.
    _B의 필드가 오브젝트며 _A의 같은 계층의 필드가 오브젝트가 아닐 경우 머지는 무시된다.
  */
  static mergeDeep(_A, _B, _override) {
    let assigned = ObjectExtends.clone(_A, true);

    let keys = Object.keys(_B);
    let sKey, sValue;
    let eltype;

    for (let i = 0; i < keys.length; i++) {
      sKey = keys[i];
      sValue = _B[sKey];

      if( assigned.hasOwnProperty(sKey) ){
        eltype = typeof sValue;

        switch (eltype) {
          case 'string':
          case 'number':
          case 'boolean':
          case 'undefined':
            if (_override) {
              assigned[sKey] = sValue;
            }
            break;
          case "object":
          if( sValue === null ){
            if (_override) {
              assigned[sKey] = sValue;
            }
          } else {
            if( typeof assigned[sKey] === 'object' && assigned[sKey] ){

              assigned[sKey] = ObjectExtends.mergeDeep(assigned[sKey], sValue);
            } else {
              if( _override ){
                assigned[sKey] = sValue;
              } else {
                console.warn(`Ignored field merge. Not matched field type A[${typeof assigned[sKey]}] B[${eltype}].`);
              }
            }
          }
          break;
          default:
            console.warn(`This type[${eltype}] can\'t merge.`);
        }
      } else {
        assigned[sKey] = sValue;
      }
    }

    return assigned;
  }

  // all argument merge
  // 첫번째 인수와 그 이후의 인수로 들어온 객체를 첫번째 인수로 들어온 배열에 더한다.
  static union() {
    let newArr = arguments[0];

    for (let i = 1; i < arguments.length; i++) {
      newArr = ObjectExtends.union2(newArr, arguments[i]);
    }

    return newArr;
  }

  // 첫번째 인수로 들어온 배열에 두번째 인수로 들어온 배열을 머지한다.
  static union2(_arr1, _arr2) {
    let newArr = ObjectExtends.clone(_arr1);

    for (let i = 0; i < _arr2.length; i++) {
      newArr.push(_arr2[i]);
    }

    return newArr;
  }

  static arrayToArray(_arguments) {
    let argArray = [];

    for (let i = 0; i < _arguments.length; i++) {
      argArray.push(_arguments[i]);
    }

    return argArray;
  }

  static ExtendClass(_subClass, _superClass) {
    if (typeof _subClass !== 'function') throw new Error(`Error : couldn't extend class. _subClass must be function. ${typeof _subClass}`);
    _subClass.prototype = Object.create(_superClass.prototype);
    _subClass.prototype.constructor = _subClass;
  }
}


var ROOT_OBJECT;

try {
  ROOT_OBJECT = window;
} catch (_e) {
  ROOT_OBJECT = global;
}

ROOT_OBJECT.__orient__ObjectExtends = ObjectExtends;
export default ObjectExtends;
