const DAY_MAP = {
  'ko': ['월', '화', '수', '목', '금', '토', '일'],
  'en': ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', "Sat", 'Sun']
};

const MONTH_MAP = {
  'ko': [],
  'en': []
};

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
        0. Date String or timestamp
        1. Format : YYYY - years, MM - Months, DD - Date, dd - Day ,hh - Hours, mm - Minuates, ss - Seconds
  */
  static dateFormatter(_dateString, _format, _lang) {
    let dateObject = new Date(_dateString);

    return _format.replace(/(YYYY|YY|MM|DD|dd|hh|mm|ss)/g, function(_matched, _chars) {
      switch (_chars) {
        case 'YYYY':
          return dateObject.getFullYear();
        case 'YY':
          return String(dateObject.getFullYear()).substring(2, 4);
        case 'MM':
          return dateObject.getMonth() + 1;
        case 'DD':
          return dateObject.getDate();
        case 'dd':
          return Shortcut.dayConverter(dateObject.getDay(), _lang);
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

  static dayConverter(_dayNumber, _lang) {
    let lang = _lang || 'en';

    switch (_lang) {
      case 'ko':
        break;
      case 'en':
        break;
      default:
        lang = 'en';
    }

    return DAY_MAP[lang][_dayNumber - 1];
  }
}

export default Shortcut;