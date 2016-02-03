import ObjectExplorer from '../../util/ObjectExplorer.js';
import JSCookie from 'js-cookie';
import Accounting from 'accounting';
import Shortcut from './Shortcut';

import _ from 'underscore';
/**
  데이터가 존재하는 곳에 데이터 리졸버가 존재한다.
*/

class Resolver {
  constructor() {

    this.dataSpace = {};
  }

  setNS(_ns, _data) {
    this.dataSpace[_ns] = _data;
    // console.log(this.dataSpace);
  }

  getNS(_ns) {
    return this.dataSpace[_ns];
  }

  resolve(_matter, _externalGetterInterface) {
    let transformed = _matter;

    if (typeof _matter !== 'string') {
      transformed = String(_matter);
    }

    return this.__interpret3(transformed, _externalGetterInterface);
  }


  // 내부에 오브젝트 선언 불가 // 안쓰면 되지?ㅋㅋㅋㅋ // 오브젝트 변수는 따로 선언 하면 되지ㅋㅋ // 어차피 쓸 일도 업어ㅋㅋ
  __interpret3(_matter, _externalGetterInterface) {
    // 모든 바인딩은 Resolver에서 이루어 지며 리졸브 블럭내에서 요구하는 데이터는 resolve 실행 자 로 부터 얻을 수 있는 메소드를 제공 받아야 한다.
    let dataSeries = [];
    let matterLen = _matter.length

    let tempStringChunk = '';
    let temp = '';

    let char, prev;

    let nextEscape = false;
    let openfirst = false;
    let openedInterpret = false;
    let firstClosed = false;
    for (let i = 0; i < matterLen; i++) {
      prev = _matter[i - 1];
      char = _matter[i];

      if (char === '\\') {
        if (nextEscape) {
          nextEscape = false;
          tempStringChunk += char;
        } else {
          nextEscape = true;
        }
      } else {
        if (nextEscape) {
          tempStringChunk += char;
          nextEscape = false;
        } else {
          if (char === '{') {
            if (openedInterpret) {

              throw new Error("Interpret 블럭 내에서 오브젝트 시작구문({)은 사용 하실 수 없습니다.");
            } else if (openfirst) {

              openedInterpret = true;
            } else {
              openfirst = true;

              if (tempStringChunk.length > 0) {
                dataSeries.push(tempStringChunk);
                tempStringChunk = '';
              }
            }
          } else if (char === '}') {
            if (firstClosed && openedInterpret) {

              /// interpret Execute
              openfirst = false;
              openedInterpret = false;
              firstClosed = false;

              // interpret 처리
              dataSeries.push(this.__executeSyntax(tempStringChunk, _externalGetterInterface));
              tempStringChunk = '';
            } else {
              firstClosed = true;
            }
          } else {
            if (openfirst) {
              openfirst = false;
            }
            if (firstClosed) {
              throw new Error("Interpret 형식이 맞지 않습니다 바인딩 블럭이 열리고({{) 닫기 위해서는 }가 두번 연속되어야 합니다." + _matter);
            }

            tempStringChunk += char;
          }
        }
      }
    }


    if (tempStringChunk.length > 0) {
      dataSeries.push(tempStringChunk);
    }

    if (dataSeries.length == 1) {
      return dataSeries[0];
    }

    return dataSeries.join('');
  }

  __executeSyntax(_syntax, _externalGetterInterface) {
    let that = this;
    let argsMap = [];
    let vfunction = this.__getVirtualFunctionWithParamMap(_syntax, argsMap);

    argsMap = argsMap.map(function(_argHolder, _i) {
      return that.__getInterpretVar(_argHolder, _externalGetterInterface);
    });

    // 마지막에 Shortcut 객체 삽입.
    argsMap.push(Shortcut);

    try {
      let result = vfunction.apply(null, argsMap);
      return result;
    } catch (_e) {
      _e._blocksource = _syntax;
      _e._argmap = argsMap;
      return _e;
    }
  }

  // interpret 블럭을 함수로 변환하고 _argumentMapRef 에 인자를 순서대로 입력한다.
  __getVirtualFunctionWithParamMap(_syntax, _argumentMapRef) {
    let argumentsMap = _argumentMapRef; // 함수 호출자가 생성하여 입력한 Array
    let alreadyIndex;
    let functionCreateArgs = [];

    // ABC@ABC 는 모두 치환하여 변수로 사용한다.
    let functionBody = _syntax.replace(/[\w\-\_]+\@[\w\-\_]+/g, function(_matched) {

      alreadyIndex = _.findIndex(argumentsMap, function(_argName) {
        return _argName === _matched;
      });

      if (alreadyIndex == -1) {
        alreadyIndex = argumentsMap.push(_matched) - 1;

        // 마지막 인자로 shortcut 를 입력하기 위해 인수 필드리스트에 패딩을 추가한다.
        functionCreateArgs.push('__argPadding_' + alreadyIndex);
      }

      return `arguments[${alreadyIndex}]`;
    });

    functionCreateArgs.push('shortcut'); // shortcut 객체를 인자로 받기 위해 인수필드에 예비한다.

    functionCreateArgs.push("return " + functionBody.replace(/^[\n\s]*/, ''));

    return Function.constructor.apply(this, functionCreateArgs);
  }

  /*
    Support :
      en-attr-origin - resolve 되지 않은 값(입력 된 값 그대로)을 반환
      en-attr - resolve 된 값을 반환
      ns  - DynmaicContext 의 namespace 데이터 반환
      en - node Meta : repeat-n , ...
      geo - width, height, x, y, left, top, right, bottom, 등등 지원 (미지원)
      val - 타입으로 반환
      val-plain - String 으로 반환
      task - taskScope 반환
      action - actionScope 반환
      function - functionScope 반환 (미지원)
      class - classScope 반환 (미지원)
      cookie - cookie 필드 값 반환
      http-param - HTTP Parameter 값 반환
      service - Service Config (미지원)
  */
  __getInterpretVar(_varName, _externalGetterInterface) {
    let splited = _varName.split('@');
    let varCategory = splited[0];
    let varName = splited[1];

    switch (varCategory) {
      case 'en-attr-origin':
        return _externalGetterInterface.getAttribute(varName, false);
      case 'en-attr':
        return _externalGetterInterface.getAttribute(varName, true);
      case 'ns':
        return this.getNSData(varName);
      case 'en':
        return _externalGetterInterface.getNodeMeta(varName);
      case 'geo':
        throw new Error("geo category 는 아직 지원하지 않습니다.");
        return this.resolveWithHttpParam(varName);
      case 'val-plain':
        return _externalGetterInterface.getScope(varName, 'value').plainValue;
      case 'val':
        return _externalGetterInterface.getScope(varName, 'value').shapeValue;
      case 'task':
        return _externalGetterInterface.getScope(varName, 'task');
      case 'action':
        return _externalGetterInterface.getScope(varName, 'action');
      case 'function':
        throw new Error("function category 는 아직 지원하지 않습니다.");
        return _externalGetterInterface.getScope(varName, 'function');
      case 'class':
        throw new Error("class category 는 아직 지원하지 않습니다.");
        return _externalGetterInterface.getScope(varName, 'class');
      case 'cookie':
        return this.resolveWithCookie(varName);
      case 'http-param':
        return this.resolveWithHttpParam(varName);
      case 'service':
        throw new Error("service category 는 아직 지원하지 않습니다.");
        return _externalGetterInterface.getServiceConfig(varName); // Todo..
    }
  }



  //
  //
  // resolveWithNS(_description) {
  //   /*
  //     문법 설명
  //
  //     값을 그대로 가져와 반환하는 형태 ${*broadcast_series/count}
  //
  //     가져온 값을 가공하여 반환하는 형태 ${broadcast_series/items:MethodName}
  //     ${PATH:Method:ARG1:ARG2:...}
  //     지원 Methods
  //       * length : ${broadcast_series/items:length}
  //   */
  //
  //   // ':' 기준으로 내용을 분리하여 배열로 담아낸다.
  //   let splited = _description.split(':');
  //
  //   // splitPathAndMethod[0] Main 데이터 패스
  //   let result = this.getNSData(splited.shift());
  //   //console.log(result);
  //   // 메인 데이터패스가 제외된 splited 배열의 길이가 2이며 메인 데이터가 undefined 가 아닐 때 메소드 처리를 거친다.
  //   // 0번째 요소는 메소드명이며
  //   // 1번째 이상 요소는 메소드의 인자로 사용된다.
  //   // ~인자는 NS데이터 패스가 될 수 있다.~
  //   if (splited.length >= 1 && result !== undefined) {
  //     let methodName = splited[0];
  //
  //     switch (methodName) {
  //       case "length":
  //         return result.length;
  //       case "currency":
  //         return Accounting.formatMoney(result, splited[1] || '', splited[2], splited[3]);
  //       case "date":
  //         return dateResolver(result, splited[1]);
  //     }
  //   } else if (result !== undefined) {
  //     return result;
  //   }
  //
  //   return undefined;
  // }

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


/*
  DateResolver
    Parameters:
      0. Date String
      1. Format : YYYY - years, MM - Months, DD - Days, hh - Hours, mm - Minuates, ss - Seconds
*/
function dateResolver(_dateString, _format) {
  let dateObject = new Date(_dateString);

  return _format.replace(/(YYYY|YY|MM|DD|hh|mm|ss)/g, function(_matched, _chars) {
    switch (_chars) {
      case 'YYYY':
        return dateObject.getFullYear();
      case 'YY':
        return String(dateObject.getFullYear()).substring(2, 4);
      case 'MM':
        return dateObject.getMonth();
      case 'DD':
        return dateObject.getDay();
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

window.dateResolver = dateResolver;

export default Resolver;