import DateDistance from '../Builtins/Classes/DateDistance';
import Date2 from '../Builtins/Classes/Date2';
import ArrayHandler from '../../util/ArrayHandler';
import ObjectExplorer from '../../util/ObjectExplorer';

const DAY_MAP = {
  'ko': ['월', '화', '수', '목', '금', '토', '일'],
  'en': ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', "Sat", 'Sun']
};

const MONTH_MAP = {
  'ko': [],
  'en': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
};

// Jan

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

    let dateObject;
    if (typeof _dateString === 'number') {
      dateObject = new Date(_dateString);
    } else if (typeof _dateString === 'string') {
      // "2016-06-24T15:57:13.373+09:00".match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+):([\d\.]+)\+([\d\:]+)/);
      let tryMatch = _dateString.match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+):([\d\.]+)\+([\d\:]+)/);

      // MONTH_MAP.en[parseInt(tryMatch[2])] + " " + tryMatch[3] + " " + tryMatch[1] + " " + tryMatch[4] + ":" + tryMatch[5] + ":" + parseInt(tryMatch[6]) + " GMT+" + tryMatch[6];
      //console.log(':D Match',tryMatch);
      if (tryMatch !== null) {
        // "2016-06-13T16:34:50+0900" to "06-13 16:34:50 UTC+0900 2016"
        dateObject = new Date(tryMatch[2] + '-' + tryMatch[3] + ' ' + tryMatch[4] + ':' + tryMatch[5] + ':' + parseInt(tryMatch[6]) + ' ' + 'UTC+' + tryMatch[7].replace(':', '') + ' ' + tryMatch[1]);
        //console.log(':DA',dateObject, tryMatch[2] + '-' + tryMatch[3] + ' ' + tryMatch[4] + ':' + tryMatch[5] + ':' + parseInt(tryMatch[6]) + ' ' + 'UTC+' + tryMatch[7].replace(':', '') + ' ' + tryMatch[1]);
        // jun 27 2016 00:09:29 GMT+0900
        if (isNaN(dateObject.getTime())) {
          dateObject = new Date(`${MONTH_MAP.en[parseInt(tryMatch[2])]} ${tryMatch[3]} ${tryMatch[1]} ${tryMatch[4]}:${tryMatch[5]}:${parseInt(tryMatch[6])} GMT+${tryMatch[6]}`);
        }
        //console.log(':DB',dateObject,`${MONTH_MAP.en[parseInt(tryMatch[2])]} ${tryMatch[3]} ${tryMatch[1]} ${tryMatch[4]}:${tryMatch[5]}:${parseInt(tryMatch[6])} GMT+${tryMatch[6]}`);
        // to "2016-06-24T15:57:13.373+09:00"
        if (isNaN(dateObject.getTime())) {
          dateObject = new Date(tryMatch[1] + '-' + tryMatch[2] + '-' + tryMatch[3] + 'T' + tryMatch[4] + ':' + tryMatch[5] + ':' + tryMatch[6] + '+' + tryMatch[7]);
        }
        //console.log(':DC',dateObject,tryMatch[1] + '-' + tryMatch[2] + '-' + tryMatch[3] + 'T' + tryMatch[4] + ':' + tryMatch[5] + ':' + tryMatch[6] + '+' + tryMatch[7]);

        if (isNaN(dateObject.getTime())) {
          dateObject = new Date(tryMatch[1] + '-' + tryMatch[2] + '-' + tryMatch[3] + 'T' + tryMatch[4] + ':' + tryMatch[5] + ':' + tryMatch[6] + '+' + tryMatch[7].slice(0,2) + ':' + tryMatch[7].slice(2,4));
        }
//  console.log(':DD',dateObject,tryMatch[1] + '-' + tryMatch[2] + '-' + tryMatch[3] + 'T' + tryMatch[4] + ':' + tryMatch[5] + ':' + tryMatch[6] + '+' + tryMatch[7].slice(0,2) + ':' + tryMatch[7].slice(2,4));
      } else {
        dateObject = new Date(Shortcut.reviseDateString(_dateString));
      }


      // let tryMatch = _dateString.match(/(\d+)-(\d+)-(\d+)T(\d+):(\d+):([\d\.]+)\+([\d\:]+)/);
      //
      // switch (true) {
      //   case true:
      //     // "2016-06-13T16:34:50+0900" to "06-13 16:34:50 UTC+0900 2016"
      //     dateObject = new Date(tryMatch[2] + '-' + tryMatch[3] + ' ' + tryMatch[4] + ':' + tryMatch[5] + ':' + parseInt(tryMatch[6]) + ' ' + 'UTC+' + tryMatch[7].replace(':', '') + ' ' + tryMatch[1]);
      //
      //     if (!isNaN(dateObject.getTime())) {
      //       break;
      //     }
      //   case true:
      //     // jun 27 2016 00:09:29 GMT+0900
      //     dateObject = new Date(`${MONTH_MAP.en[parseInt(tryMatch[2])]} ${tryMatch[3]} ${tryMatch[1]} ${tryMatch[4]}:${tryMatch[5]}:${parseInt(tryMatch[6])} GMT+${tryMatch[6]}`);
      //
      //     if (!isNaN(dateObject.getTime())) {
      //       break;
      //     }
      //   case true:
      //     // to "2016-07-04T15:43:19.421+09:00"
      //
      //   default:
      //     dateObject = new Date(Shortcut.reviseDateString(_dateString));
      // }
    } else {
      throw new Error("인식할 수 없는 Date 입력 타입 입니다.");
    }

    if (isNaN(dateObject.getTime())) {
      throw new Error(`${JSON.stringify(_dateString)} is not a convertable object.`);
    }


    return _format.replace(/(YYYY|YY|MM|DD|dd|hh|mm|ss)/g, function(_matched, _chars) {
      switch (_chars) {
        case 'YYYY':
          return dateObject.getFullYear();
        case 'YY':
          return String(dateObject.getFullYear()).substring(2, 4);
        case 'MM':
          return Shortcut.zeroPadding(dateObject.getMonth() + 1, 2);
        case 'DD':
          return Shortcut.zeroPadding(dateObject.getDate(), 2);
        case 'dd':
          return Shortcut.dayConverter(dateObject.getDay(), _lang);
        case 'hh':
          return Shortcut.zeroPadding(dateObject.getHours(), 2);
        case 'mm':
          return Shortcut.zeroPadding(dateObject.getMinutes(), 2);
        case 'ss':
          return Shortcut.zeroPadding(dateObject.getSeconds(), 2);
        default:
      }

      return _chars;
    });
  }


  static get dateDistance() {
    return DateDistance;
  }

  static get Date() {
    return Date2;
  }

  static dateShift(_from, _to, _format) {

  }

  static reviseDateString(_dateString) {
    return _dateString.replace(/^(\d{4})(\d{2})(\d{2}) (\d{2})(\d{2})(\d{2})$/, function(_matched, _y, _m, _d, _h, _min, _s) {
      return `${_y}/${_m}/${_d} ${_h}:${_min}:${_s}`;
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


  static zeroPadding(_number, _limit) {

    let str = String(_number);
    let length = str.length;
    let addC = _limit - length;

    for (let i = 0; i < addC; i++) {
      str = '0' + str;
    }

    return str;
  }


  static findIndex(_array, _value) {
    return ArrayHandler.findIndex(_array, function(_v) {
      return _v === _value;
    });
  }

  static filter(_value) {

  }

  // 비어있는 Object인지 검사 key 가 0개면 빈 오브젝트임
  static isEmpty(_object) {

    let keys = Object.keys(_object);

    return keys.length === 0;
  }

  isEmptyOrVoid(_object) {
    if (_object) {
      return Shortcut.isEmpty(_object)
    } else {
      return true;
    }
  }

  // 비어있지 않은 오브젝트인지 검사
  static isntEmpty(_object) {
    let length;

    if (_object instanceof Array) {

      length = _object.length;
    } else if (_object instanceof Object) {
      let keys = Object.keys(_object);

      length = keys.length;
    } else {

      return false;
    }

    return length > 0;
  }



  static get(_obj, _path) {
    return ObjectExplorer.getValueByKeyPath(_obj, _path, '.');
  }

  static object2paramstr(_obj) {
    let keys = Object.keys(_obj);

    let paramArr = keys.map((_key) => {
      return _key + "=" + _obj[_key];
    });

    return paramArr.join('&');
  }
}

export default Shortcut;
