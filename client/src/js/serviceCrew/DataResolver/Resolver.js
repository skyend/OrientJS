import ObjectExplorer from '../../util/ObjectExplorer.js';
import ArrayHandler from '../../util/ArrayHandler.js';
import JSCookie from 'js-cookie';
import Accounting from 'accounting';
import Shortcut from './Shortcut';
import TypeCaster from '../../util/TypeCaster';
// import ElementNode from '../ElementNode/ElementNode';

//import _ from 'underscore';
/**
  데이터가 존재하는 곳에 데이터 리졸버가 존재한다.
*/

class Resolver {
  constructor(_upperResolver) {

    // 상위 NS데이터 참조를 위해 사용 // getNSData()
    this.upperResolver = _upperResolver || null;

    this.dataSpace = {};

    this.resolveFunctionDict = {};
    this.argsMapDict = {};
  }

  setNS(_ns, _data) {
    this.dataSpace[_ns] = _data;
    // console.log(this.dataSpace);
  }

  getNS(_ns) {
    return this.dataSpace[_ns];
  }

  resolve(_matter, _externalGetterInterface, _defaultDataObject, _caller) {
    if (_matter === null || _matter === undefined || _matter === NaN) {
      return _matter;
    }


    return this.__interpret4(typeof _matter !== 'string' ? String(_matter) : _matter, _externalGetterInterface, _defaultDataObject, _caller);
  }

  empty() {
    this.dataSpace = {};
  }

  // 내부에 오브젝트 선언 불가 // 안쓰면 되지?ㅋㅋㅋㅋ // 오브젝트 변수는 따로 선언 하면 되지ㅋㅋ // 어차피 쓸 일도 없어ㅋㅋ
  __interpret3(_matter, _externalGetterInterface, _defaultDataObject, _caller) {
    // 모든 바인딩은 Resolver에서 이루어 지며 리졸브 블럭내에서 요구하는 데이터는 resolve 실행 자 로 부터 얻을 수 있는 메소드를 제공 받아야 한다.
    let dataSeries = [];
    let matterLen = _matter.length;

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
              dataSeries.push(this.__executeSyntax(tempStringChunk, _externalGetterInterface, _defaultDataObject, _caller));
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


  __interpret4(_matter, _externalGetterInterface, _defaultDataObject, _caller) {
    let length = _matter.length;
    let slices = [];

    let found;
    let end = -1,
      start = -1,
      cursor = 0;

    let slice;
    while (found = this.__findBindBlock(_matter.slice(cursor))) {

      if (found === -1) {
        if (slices.length > 0) {
          slice = _matter.slice(end);
          if (slice) slices.push(slice.replace('\{\{', '{{').replace('\}\}', '}}'));
        }
        break;
      } else {
        start = cursor + found[0];
        end = cursor + found[1];

        // 감지된 영역의 앞부분 문자열 조각
        slice = _matter.slice(cursor, start);
        if (slice) slices.push(slice.replace('\{\{', '{{').replace('\}\}', '}}'));

        // 감지된 바인딩블럭
        slice = _matter.slice(start + 2, end - 2);
        slices.push(this.__executeSyntax(slice, _externalGetterInterface, _defaultDataObject, _caller));

        // 커서 이동
        cursor = end;
      }
    }

    if (slices.length === 0) {
      return _matter;
    } else {
      if (slices.length === 1) {
        return slices[0];
      } else {
        return slices.join('');
      }
    }
  }

  __findBindBlock(_string, _start, _end) {

    let start = -1,
      end = -1;
    start = _string.indexOf("{{");

    if (start > -1) {
      end = _string.indexOf("}}");
      if (end > -1) {
        if (end < start) {
          throw new Error("바인딩 블럭의 닫힘[}}]이 열림[{{]보다 앞에 있습니다.");
        } else {
          return [start, end + 2];
        }
      } else {
        throw new Error("바인딩 블럭이 닫히지 않았습니다.");
      }
    } else {
      return -1;
    }
  }

  __executeSyntax(_syntax, _externalGetterInterface, _defaultDataObject, _caller) {

    let that = this;
    // let argsMap = [];
    // let vfunction = this.__getVirtualFunctionWithParamMap(_syntax, argsMap);
    let argsMap;
    let vfunction;

    if (this.resolveFunctionDict[_syntax]) {
      vfunction = this.resolveFunctionDict[_syntax];
      argsMap = this.argsMapDict[_syntax];
    } else {
      argsMap = []; // __getVirtualFunctionWithParamMap 메서드에 참조가 전달된다.
      vfunction = this.resolveFunctionDict[_syntax] = this.__getVirtualFunctionWithParamMap(_syntax, argsMap);
      this.argsMapDict[_syntax] = argsMap;
    }

    argsMap = argsMap.map(function mappingArgument(_argHolder, _i) {
      //console.log(_syntax);
      return that.__getInterpretVar(_argHolder, _externalGetterInterface, _defaultDataObject, _caller);
    });

    // 마지막에 Shortcut 객체 삽입.
    argsMap.push(Shortcut);
    argsMap.push(_externalGetterInterface.executeI18n ? _externalGetterInterface.executeI18n : function executeI18n_NotFound() {
      return 'Error: Couldn\'n I18N Text. Required the Environment.';
      //throw new Error(`text 사용 불가능. ${_syntax}`);
    });


    try {
      let result = vfunction.apply(_caller, argsMap);

      return result;
    } catch (_e) {
      let nativeErrorMessage = _e.message;

      // ORIENT_SHOW_BIND_ERROR 가 켜져있으면 에러를 throw 한다. 후에 컨셉 수정하기
      if (window.ORIENT_OCCURS_BIND_ERROR) {

        _e.message = `${nativeErrorMessage} [Matter sentence {{${_syntax}}}]`;
        _e.interpretArguments = argsMap;

        throw _e;
      }

      return _e;
    }
  }

  // interpret 블럭을 함수로 변환하고 _argumentMapRef 에 인자를 순서대로 입력한다.
  __getVirtualFunctionWithParamMap(_syntax, _argumentMapRef) {
    let argumentsMap = _argumentMapRef; // 함수 호출자가 생성하여 입력한 Array
    let alreadyIndex;
    let functionCreateArgs = [];
    let functionResult;

    // ABC@ABC 는 모두 치환하여 변수로 사용한다.
    let functionBody = _syntax.replace(/[\w\-\_]*\@[\w\-\_\#]+(:\w+)?/g, function bindValueReplacer(_matched) {

      alreadyIndex = ArrayHandler.findIndex(argumentsMap, function checkAlready(_argName) {
        return _argName === _matched;
      });

      if (alreadyIndex == -1) {
        alreadyIndex = argumentsMap.push(_matched) - 1;

        // 마지막 인자로 shortcut과 그밖의 기본 제공 인자 를 입력하기 위해 인수 필드리스트에 패딩을 추가한다.
        functionCreateArgs.push('__argPadding_' + alreadyIndex);
      }

      return `arguments[${alreadyIndex}]`;
    });

    functionCreateArgs.push('shortcut'); // shortcut 객체를 인자로 받기 위해 인수필드에 예비한다.
    functionCreateArgs.push('i18nTEXT'); // text 메서드(i18n 처리)를 인자로 받기 위해 인수필드에 예비한다.



    // auto 리턴 플래그가 포함 된 경우 식 블럭을 괄호로 감싸 줄바꿈이 포람된 경우에도 유효한 반환을 하도록 한다.
    let isAutoReturn = false;
    // rr: returnReplacer
    functionBody = functionBody.replace(/^(:)|(&#58;)/, function rr(_full, _matched) {
      isAutoReturn = true;
      return "return ( ";
    });

    if (isAutoReturn) {
      functionBody = functionBody + ");";
    }



    functionCreateArgs.push(functionBody.replace(/^[\n\s]*/, ''));

    try {
      functionResult = Function.constructor.apply(this, functionCreateArgs);

    } catch (_e) {
      _e.message += `\n Origin Source : {{${_syntax}}}`;
      throw _e;
    }

    return functionResult;
    //return Function.constructor.apply(this, functionCreateArgs);
  }

  /*
    Support :
      id             : Element Node 를 검색
      en-attr-origin : resolve 되지 않은 값(입력 된 값 그대로)을 반환
      en-attr        : resolve 된 값을 반환
      ns             : DynmaicContext 의 namespace 데이터 반환
      en             : node Meta : repeat-n , ...
      geometry       : width, height, x, y, left, top, right, bottom, 등등 지원 (미지원)
      val            : 타입으로 반환
      val-plain      : String 으로 반환
      task           : taskScope 반환
      action         : actionScope 반환
      function       : functionScope 반환 (미지원)
      class          : classScope 반환 (미지원)
      cookie         : cookie 필드 값 반환
      http-param     : HTTP Parameter 값 반환
      location       : 현재 페이지의 위치에 관한 정보
      geo            : 현재 접속자의 지구상 위치에 관한 정보
      device         : 접속자의 platform과 browser에 관한 정보
      service        : Service Config (미지원)
      prop           : Property - ElementNode의 Property 를 사용함
      ~past-action-result  : 이전 액션의 실행 결과 - en:task 의 argument 필드에서만 사용 가능~ feature@prev-result 로 전근방식 변경
      ~event: 발생한 이벤트 객체 - en:task argument 필드에서만 사용가능~
      ''(공백 카테고리) : _defaultDataObject로 입력된 오브젝트를 키로 접근 하여 데이터를 얻는다. // I18N 에서 사용한다.
  */
  __getInterpretVar(_varName, _externalGetterInterface, _defaultDataObject, _caller) {
    let splited = _varName.split('@'); // CATEGORY@NAME:CASTING TYPE
    let varCategory = splited[0];
    let splitForTypeCast = (splited[1] || '').split(':');
    let varName = splitForTypeCast[0];
    let type = splitForTypeCast[1];
    //console.log(varCategory, varName);

    let data;
    switch (varCategory) {
      // case 'id': // 사용안함
      //   data = _externalGetterInterface.getElementNodeById(varName);
      //   if (!(data && data[ElementNode.SIGN_BY_ELEMENTNODE] === ElementNode.SIGN_BY_ELEMENTNODE)) {
      //     throw new Error(`Not found ElementNode in Environment. \nID: ${varName}`);
      //   }
      //   break;
      case 'en-attr-origin':
        data = _externalGetterInterface.getAttribute(varName, false);
        break;
      case 'en-attr':
        data = _externalGetterInterface.getAttribute(varName, true);
        break;
      case 'ns': // getNSData 메서드는 자신에게 없으면 상위 resolver의 NS데이터를 탐색한다.
        data = this.getNSData(varName);
        break;
      case 'en':
        data = _externalGetterInterface.getNodeMeta(varName);
        break;
        // case 'geometry': // 위치와 크기정보를 반환
        //   throw new Error("geometry category 는 아직 지원하지 않습니다.");
        //   data = this.resolveWithHttpParam(varName);
        //   break;
      case 'val-plain':

        try {
          data = _externalGetterInterface.getScope(varName, 'value').plainValue;
        } catch (_e) {
          throw new Error(`${varName} 변수 노드(<en:value>) 가 선언되지 않았습니다. <en:value name='${varName}' ...></en:value>를 선언 해 주세요.`);
        }
        break;
      case 'val':
        let valueScope = _externalGetterInterface.getScope(varName, 'value');

        if (valueScope) {

          try {
            data = valueScope.get();
          } catch (_e) {
            throw _e;
          }
        } else {
          throw new Error(`${varName} 변수 노드(<en:value>) 가 선언되지 않았습니다. <en:value name='${varName}' ...></en:value>를 선언 해 주세요.`);
        }
        break;
      case 'task':
        data = _externalGetterInterface.getScope(varName, 'task');
        break;
      case 'action':
        data = _externalGetterInterface.getScope(varName, 'action');
        break;
      case 'func': // function 과 동일함
      case 'function':
        //throw new Error("function category 는 아직 지원하지 않습니다.");
        let functionScope = _externalGetterInterface.getScope(varName, 'function');
        if (functionScope) {
          if (typeof functionScope.executableFunction === 'function') {
            data = functionScope.executableFunction.bind(_caller);
          } else {
            throw new Error(`유효하지 않은 Function 입니다. function scope 선언에서는 함수를 반환하여야 합니다.`);
          }
        } else {
          throw new Error(`${varName} Function을 찾을 수 없습니다.`);
        }
        break;
        // case 'class':
        //   throw new Error("class category 는 아직 지원하지 않습니다.");
        //   data = _externalGetterInterface.getScope(varName, 'class');
        //   break;
      case 'cookie':
        data = this.resolveWithCookie(varName);
        break;

      case 'http-param':
        data = this.resolveWithHttpParam(varName);
        break;

      case 'location':
        data = this.resolveWithLocation(varName);
        break;

      case 'local-data':
        data = window.localStorage.getItem(varName);
        break;
      case 'local-object':
        data = window.localStorage.getItem(varName);

        try {
          data = JSON.parse(data);
        } catch (_e) {
          throw new Error(`localStorage 의 '${varName}' item을 JSON Object로 변환 할 수 없습니다.`);
        }
        break;

      case 'session-data':
        data = window.sessionStorage.getItem(varName);
        break;
      case 'session-object':
        data = window.sessionStorage.getItem(varName);

        try {
          data = JSON.parse(data);
        } catch (_e) {
          throw new Error(`sessionStorage 의 '${varName}' item을 JSON Object로 변환 할 수 없습니다.`);
        }
        break;

        // case 'device':
        //   throw new Error("device category 는 아직 지원하지 않습니다.");
        //   data = this.resolveWithDevice(varName);
        //   break;
        // case 'geo':
        //   throw new Error("geo-location category 는 아직 지원하지 않습니다.");
        //   data = this.resolveWithHttpParam(varName);
        //   break;

      case 'prop':
        data = _externalGetterInterface.getProperty(varName);
        break;
      case 'feature':
        data = _externalGetterInterface.getFeature(varName);
        break;
      case 'config':
        if (_externalGetterInterface.getENVConfig) {
          data = _externalGetterInterface.getENVConfig(varName);
        } else {
          console.error("config category를 사용할 수 없습니다.");
        }
        break;
      default:
        if (varCategory === '') {
          //console.log(_varName);
          data = _defaultDataObject[varName]; // varName be must Number
        } else {
          throw new Error("지원하지 않는 카테고리 명입니다. " + _varName);
        }
    }


    if (splitForTypeCast[1]) {
      return this.__typeCast(data, splitForTypeCast[1]);
    } else {
      return data;
    }
  }

  __typeCast(_value, _type) {
    switch (_type) {
      case 'string':
        return TypeCaster.toString(_value);
      case 'int':
        return TypeCaster.toInteger(_value);
      case 'float':
        return TypeCaster.toFloat(_value);
      case 'number':
        return TypeCaster.toNumber(_value);
      case 'boolean':
        return TypeCaster.toBoolean(_value);
      case 'object':
        return TypeCaster.toObject(_value);
      case 'array':
        return TypeCaster.toArray(_value);
    }
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

  resolveWithLocation(_desc) {
    switch (_desc) {
      case "hash":
        return window.location.hash;
      case "hashbang":
        if (/^\#\!/.test(window.location.hash)) {
          return window.location.hash.replace(/\#\!/, '');
        } else {
          return null;
        }
      default:
        throw new Error(`지원하지 않는 카테고리의 제공자입니다. location@${_desc}`);
    }
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
    let data = ObjectExplorer.getValueByKeyPath(this.dataSpace, _pathWithNS.replace(/^\*/, ''));

    if (!data) {
      if (this.upperResolver !== null) data = this.upperResolver.getNSData(_pathWithNS);
    }

    return data || {};
  }
}

export default Resolver;