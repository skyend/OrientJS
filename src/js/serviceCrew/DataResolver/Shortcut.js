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

  /*
    DateResolver
      Parameters:
        0. Date String
        1. Format : YYYY - years, MM - Months, DD - Days, hh - Hours, mm - Minuates, ss - Seconds
  */
  static dateFormatter(_dateString, _format) {
    let dateObject = new Date(_dateString);

    return _format.replace(/(YYYY|YY|MM|DD|hh|mm|ss)/g, function(_matched, _chars) {
      switch (_chars) {
        case 'YYYY':
          return dateObject.getFullYear();
        case 'YY':
          return String(dateObject.getFullYear()).substring(2, 4);
        case 'MM':
          return dateObject.getMonth() + 1;
        case 'DD':
          return dateObject.getDate();
        case 'hh':
          return dateObject.getHours();
        case 'mm':
          return dateObject.getMinutes();
        case 'ss':
          return dateObject.getSeconds();
        default:

      }
      return _chars;
    });
  }
}

export default Shortcut;