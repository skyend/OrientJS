const GET_NAME_IN_CONSTRUCTOR = /function ([\w\d_$]+)?\(\)/;


class Classer {

  // Uglify 된 라이브러리의 경우 사용 할 수 없다.
  // uglify 시에 객체 명이 근본부터 변경되므로,
  // Javascript 기본 오브젝트에 한해 사용이 가능하다.
  static getClassName(_object) {
    let matches = _object.constructor.toString().match(GET_NAME_IN_CONSTRUCTOR);

    return matches[1];
  }

  static getFunctionName(_function) {
    let matches = _function.toString().match(GET_NAME_IN_CONSTRUCTOR);

    return matches[1];
  }
}

export default Classer;