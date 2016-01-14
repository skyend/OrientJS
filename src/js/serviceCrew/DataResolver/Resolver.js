import ObjectExplorer from '../../util/ObjectExplorer.js';
import JSCookie from 'js-cookie';
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
    let splitPathAndMethod = _description.split(':');

    // splitPathAndMethod[0] Main 데이터 패스
    let result = ObjectExplorer.getValueByKeyPath(this.dataSpace, splitPathAndMethod[0]);

    // : 로 나누어진 값이 2와 같거나 보다 많을 때 Method처리를 진행한다.
    // 2번째 값은 메소드명
    // 3번째 이상 값은 인자이며. 인자값이 * 로 시작 할 때 NS Data의 Path 로 인식하여 실제 Data 문자열 로 대체된다.
    //
    if (splitPathAndMethod.length >= 2 && result !== undefined) {
      switch (splitPathAndMethod[1]) {
        case "length":
          return result.length;
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



  // interpret(_text) {
  //   var self = this;
  //
  //   // 바인딩 문자열 단 하나만 있을 때는 replace를 하지 않고
  //   // 객체를 보존하여 반환하도록 한다.
  //   if (/^\$\{.*?\}$/.test(_text)) {
  //     let matched = _text.match(/(\${(.*?)})/);
  //     console.log("ARGS", arguments);
  //     let signString = matched[2];
  //
  //     return this.valueResolve(signString);
  //   } else {
  //     let valuesResolved = _text.replace(/\${(.*?)}(?:(\.[a-z]+))?/g, function(_matched, _signString, _optionString) {
  //       let rsvResult = self.valueResolve(_signString);
  //       console.log("ARGS", arguments);
  //       // ${...}.optionString 과 같은 형식을 사용 하였을 때 유효한 옵션이면 옵션처리 결과를 반환하며
  //       // 유효하지 않은 옵션은 signString의 리졸브 결과와 optionString형식으로 입력된 문자열을 살려서 반환한다.
  //       // 추후에 함수 형식도 지원
  //       switch (_optionString) {
  //         case ".count":
  //           return rsvResult.length;
  //       }
  //       if (_optionString !== undefined)
  //         return rsvResult + (_optionString || '');
  //       else
  //         return rsvResult;
  //     });
  //
  //     return valuesResolved.replace(/(\%\((.*?)\))/g, function(_matched, _matched2, _formularString) {
  //
  //       return self.processingFormularBlock(_formularString);
  //     });
  //   }
  // }
  //
  // valueResolve(_sign) {
  //   let self = this;
  //
  //   if (/^(\*?)([^:^*]*)$/.test(_sign)) {
  //     let matched = _sign.match(/^(\*?)(.*)$/);
  //     let firstMark = matched[1];
  //     let refValue = matched[2];
  //     console.log(firstMark);
  //
  //     if (firstMark === '*') {
  //
  //       let splited = refValue.split(/\//);
  //       let ns = splited.shift();
  //       let detail = splited.length > 0 ? splited.join('/') : undefined;
  //
  //       let param = self.getNS(ns);
  //       if (param === undefined) {
  //         return '`Error: No Param NS: ' + ns + '`';
  //       }
  //       //console.log(detail, param, splited, _refValue);
  //       ///css/contents-retrieve-by-name/custom?serviceId=56755571b88a6c2ffd90e8e9
  //       if (detail !== undefined) {
  //         return ObjectExplorer.getValueByKeyPath(param, detail) || '`Error: No Param ' + detail + ' in ' + ns + '`';
  //       } else {
  //         return param;
  //       }
  //     }
  //
  //     return '`Error: Interpret Error`';
  //   } else if (/^\w+:.*$/.test(_sign)) {
  //     let matches = _sign.match(/^(\w+):(.*)$/);
  //     let kind = matches[1];
  //     let target = matches[2];
  //
  //     if (kind === 'script') {
  //       let url = this.contextController.serviceManager.getScriptURLByName(target);
  //
  //       return url;
  //     } else if (kind === 'style') {
  //       let url = this.contextController.serviceManager.getStyleURLByName(target);
  //
  //       return url;
  //     } else if (kind === 'image') {
  //       let url = this.contextController.serviceManager.getImageURLByName(target);
  //
  //       return url;
  //     } else if (kind === 'static') {
  //       let url = this.contextController.serviceManager.getImageStaticByName(target);
  //
  //       return url;
  //     }
  //   }
  //   return '`Error: Interpret Syntax Error`';
  // }
  //
  //
  //
  // processingFormularBlock(_blockString) {
  //   let formularResult;
  //
  //   try {
  //     formularResult = eval(_blockString);
  //   } catch (_e) {
  //     formularResult = false;
  //   }
  //
  //   return formularResult;
  // }

}

export default Resolver;