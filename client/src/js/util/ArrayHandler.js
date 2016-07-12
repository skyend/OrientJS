class ArrayHandler {
  static findIndex(_array, _criteria) {
    let foundIndex = -1;

    for (let i = 0; i < _array.length; i++) {
      if (_criteria(_array[i])) {
        foundIndex = i;
        break;
      }
    }

    return foundIndex;
  }


  static splitByLength(_arr, _length) {
    let arr = [];
    let temp_arr = null;

    let loopLen = Math.ceil(_arr.length / _length);

    for (let i = 0; i < loopLen; i++) {
      arr.push(_arr.slice(i * _length, i * _length + _length));
    }

    return arr;
  }
}

export default ArrayHandler;