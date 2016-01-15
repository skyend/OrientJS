import ObjectExplorer from '../../util/ObjectExplorer.js';
import JSCookie from 'js-cookie';
import Accounting from 'accounting';
/**
  데이터가 존재하는 곳에 데이터 리졸버가 존재한다.
*/

class Resolver {
  constructor() {

    this.dataSpace = {};
  }

  setNS(_ns, _data) {
    this.dataSpace[_ns] = _data;
    console.log(this.dataSpace);
  }

  getNS(_ns) {
    return this.dataSpace[_ns];
  }

  resolve(_matter) {

    return this.__interpret2(_matter);
  }

  __interpret2(_matter) {
    let solved = _matter;
    let that = this;

    /*
      ${*....} // NS
      ${http-param:....} // HTTP
      ${cookie:.....} // Cookie
    */
    solved = _matter.replace(/\$\{(\*|[\w-]+:)([^\{^\}]*)\}/g, function(_matched, _intentKey, _description) {
      console.log('Resolve ${}', _intentKey, _description);
      if (_intentKey === '*') {
        let nsData = that.resolveWithNS(_description);

        // nsData 가 undefined 일 때는 빈 문자열을 리턴한다.
        if (nsData === undefined) {
          // _description.split(/\/|\:/)[0] -> description을 / 또는 : 로 분리하여 Namespace 를 얻는다.
          console.warn("Gelato Template Language NSData Error. Path '" + _description + "' is undefined. NS[" + _description.split(/\/|\:/)[0] + "]");
          return '';
        }

        return nsData;
      } else if (_intentKey === 'http-param:') {
        let httpData = that.resolveWithHttpParam(_description);

        if (httpData === undefined) {
          console.warn("Gelato Template Language HTTP Param is not inputed. Param ['" + _description + "'] is empty.");
          return '';
        }

        return httpData;
      } else if (_intentKey === 'cookie:') {
        let cookieData = that.resolveWithCookie(_description);

        if (cookieData === undefined) {
          console.warn("Gelato Template Language Cookie type Error. Cookie ['" + _description + "'] is not exists.");
          return '';
        }

        return cookieData;
      }
    });

    /*
      %{....}
    */
    solved = solved.replace(/\%\{([^\{^\}]+)\}/g, function(_matched, _formularString) {
      console.log('FormularString', _formularString);

      try {
        return eval(_formularString);
      } catch (_e) {

        console.warn("Gelato Template Language Formular Error. original: '" + _matter + "', inputed formular: '" + _formularString + "'");
        return _matter + 'in Formular ERROR';
      }
    });

    return solved;
  }

  resolveWithNS(_description) {
    /*
      문법 설명

      값을 그대로 가져와 반환하는 형태 ${*broadcast_series/count}

      가져온 값을 가공하여 반환하는 형태 ${broadcast_series/items:MethodName}
      ${PATH:Method:ARG1:ARG2:...}
      지원 Methods
        * length : ${broadcast_series/items:length}
    */

    // ':' 기준으로 내용을 분리하여 배열로 담아낸다.
    let splited = _description.split(':');

    // splitPathAndMethod[0] Main 데이터 패스
    let result = this.getNSData(splited.shift());
    console.log(result);
    // 메인 데이터패스가 제외된 splited 배열의 길이가 2이며 메인 데이터가 undefined 가 아닐 때 메소드 처리를 거친다.
    // 0번째 요소는 메소드명이며
    // 1번째 이상 요소는 메소드의 인자로 사용된다.
    // ~인자는 NS데이터 패스가 될 수 있다.~
    if (splited.length >= 1 && result !== undefined) {
      let methodName = splited[0];

      switch (methodName) {
        case "length":
          return result.length;
        case "currency":
          return Accounting.formatMoney(result, splited[1] || '', splited[2], splited[3]);
      }
    } else if (result !== undefined) {
      return result;
    }

    return undefined;
  }

  resolveWithHttpParam(_description) {
    let httpParamPairs = window.location.search.replace(/^\?/, '').split('&');
    let httpParams = {};

    // key value
    let kv;
    for (let i = 0; i < httpParamPairs.length; i++) {
      kv = httpParamPairs[i].split('=');
      //console.log(kv, _description);
      if (kv[0] === _description) return kv[1];
    }

    return undefined;
  }

  resolveWithCookie(_description) {
    return JSCookie.get(_description) || undefined;
  }

  /*
    GetNSData
    Parameters
      0. pathWithNS : *ns/path/to/data or ns/path/to/data

    Return
      Took a data[String|Object] from path
  */
  getNSData(_pathWithNS) {

    return ObjectExplorer.getValueByKeyPath(this.dataSpace, _pathWithNS.replace(/^\*/, ''));
  }
}

export default Resolver;