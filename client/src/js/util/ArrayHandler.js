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
}

export default ArrayHandler;