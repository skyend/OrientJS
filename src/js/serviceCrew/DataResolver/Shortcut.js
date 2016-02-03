class Shortcut {

  // 삼항연산 메서드
  // _boolean 에 참 또는 거짓이 입력 되었을 때 참인 값 또는 거짓 값을 반환함
  static if_then(_boolean, _true, _false) {
    if (_boolean) {
      return _true;
    } else {
      return _false;
    }
  }
}

export default Shortcut;