import events from 'events';
import browser from 'detect-browser';
import Classer from '../../util/Classer';
import Identifier from '../../util/Identifier.js';
import ObjectExtends from '../../util/ObjectExtends.js';

const B_NAME = browser.name;
const B_VER = parseInt(browser.version);

var HTTP_REQUEST = 0;

const GET_IE_MULTIPART_IFRAME_ID_STORE = Identifier.chars32SequenceStore(9999999);

// import JqueryForm from 'jquery-form';
// import JqueryTransportXDR from 'jquery-transport-xdr';

/*
IE9 전용 // 싱크로 동작함

//Orient.HTTPRequest.requestSync('get',  "http://52.79.106.100:38080/api/cms/category/singleDepth.json?site_id=joykolon&ctgry_gb=20&ctgry_level=A&up_ctgry_id=", {}, function(_r, _res){ console.log(_r,_res); } );

// 1. Create XDR object:
var xdr = new XDomainRequest();

// 2. Open connection with server using GET method:
xdr.open("get",  "http://52.79.106.100:38080/api/cms/category/singleDepth.json?site_id=joykolon&ctgry_gb=20&ctgry_level=A&up_ctgry_id=");

xdr.onload = function(_a,_b){ console.log('hh',arguments,_a,_b) };

// 3. Send string data to server:
xdr.send();

console.log('aa',xdr);



if(window.XDomainRequest){
  var xdr = new XDomainRequest();

  xdr.open("get", "http://example.com/api/method");

  xdr.onprogress = function () {
    //Progress
  };

  xdr.ontimeout = function () {
    //Timeout
  };

  xdr.onerror = function () {
    //Error Occured
  };

  xdr.onload = function() {
    //success(xdr.responseText);
  }

  setTimeout(function () {
    xdr.send();
  }, 0);
}



*/



class HTTPRequest {
  static Log(_message, _level = "log", _extras = []) {
    if (!window.DEBUG_OCCURS_HTTP_REQUEST_LOG) return;


    let logParams;
    logParams = [_message];
    try {
      switch (_level) {
        case "log":
          if (B_NAME !== 'ie')
            logParams = ['%c' + _message, 'background: #333; color: rgb(199, 232, 232); padding:2px;'];

          console.log.apply(console, ObjectExtends.union2(logParams, _extras));
          break;
        case "info":
          if (B_NAME !== 'ie')
            logParams = ['%c' + _message, 'background: #333; color: rgb(21, 211, 243); padding:2px;'];

          console.info.apply(console, ObjectExtends.union2(logParams, _extras));
          break;
        case "warn":
          if (B_NAME !== 'ie')
            logParams = ['%c' + _message, 'background: #333; color: rgb(243, 156, 21); padding:2px;'];

          console.warn.apply(console, ObjectExtends.union2(logParams, _extras));
          break;
        case "error":
          if (B_NAME !== 'ie')
            logParams = ['%c' + _message, 'background: #333; color: rgb(228, 46, 46); padding:2px;'];

          console.error.apply(console, ObjectExtends.union2(logParams, _extras));
          break;
      }

    } catch (_e) {
      if (_level === 'error') {

        //throw new Error(_message);
      }
    }
  }



  static request(_method, _url, _data = [], _callback, _enctype = 'application/x-www-form-urlencoded', _async = true, _dontModifiyData = false) {
    let method = _method.toLowerCase();
    let is_multipart_post = false;
    let isSameOrigin = true; // 타 도메인 감지
    let url = _url;
    let enctype = _enctype;





    // multipart post 체크와 메소드 체크
    if (method === 'post') {
      if (_enctype === 'multipart/form-data') {
        is_multipart_post = true;
      }
    } else if (method === 'get') {
      if (_enctype !== 'application/x-www-form-urlencoded') {
        throw new Error(`HTTP Method 는 GET 으로 지정되어 있지만, Enctype 은 'application/x-www-form-urlencoded' 가 아닙니다.`);
      }
      //
    } else {
      throw new Error(`지원하지 않는 HTTP메소드(${_method}) 입니다.`);
    }


    // URL 구성
    // 프로토콜이 생략되어 있는 URL이면 프로토콜과 호스트를 앞에 붙여 절대 URL로 완성한다.
    if (!/^https?:\/\//.test(url)) {
      // 상대경로도 아닐 때
      if (!/^\.\.?\//.test(url)) {
        url = url.replace(/^\/?/, location.protocol + '//' + location.host + '/');
      }
    }

    if (window.ORBIT_DISABLE_AJAX_CACHE)
      _data['cache_escape'] = HTTPRequest.complexify_cacher();

    // 크로스 도메인확인
    // URL이 현재 protocol 과 host 가 일치하는지 확인한다.
    if ((new RegExp('^' + location.protocol + '//' + location.host + '/')).test(url) || /^\.\.?\//.test(url)) {
      isSameOrigin = true;
    } else {
      isSameOrigin = false;

      // IE9 임시 XDR GET Redirect


      if (B_NAME === 'ie' && B_VER <= 9) {
        enctype = 'application/x-www-form-urlencoded';
        method = 'get';
        is_multipart_post = false;
        _data['ie9_escape_cache'] = HTTPRequest.generate_ie9_timestamp();
      }
    }


    // for application/x-www-form-urlencoded ,multipart/form-data
    let rawFieldArray = [],
      cookedFieldArray = [];

    // Data Modify
    if (_dontModifiyData === false) {
      switch (_enctype) {
        case 'application/x-www-form-urlencoded':
        case 'multipart/form-data':
          // Object 로 입력된 필드 목록을 Array 로 변환한다.
          rawFieldArray = HTTPRequest.fieldConvertToArray(_data);
          rawFieldArray = HTTPRequest.availableFieldsFilter(rawFieldArray);
          // 가공되지 않은 필드가 목록에 포함 되어 있을 때 필드로 사용가능한 오브젝트에서 실제 값을 추출하여 변환한다.
          cookedFieldArray = HTTPRequest.convertRawFieldsToRealFieldsData(rawFieldArray);
          break;
      }
    }

    // console.log('a', is_multipart_post);
    let finalData = null;
    let finalURL = url;

    if (is_multipart_post) {

      // // post 이고 multipart/form-data의 경우
      // if (B_NAME === 'ie' && B_VER <= 9) {
      //
      //   /*
      //   ██ ███████  ██  ██████      ███    ███ ██    ██ ██   ████████ ██ ██████   █████  ██████  ████████
      //   ██ ██      ███ ██  ████     ████  ████ ██    ██ ██      ██    ██ ██   ██ ██   ██ ██   ██    ██
      //   ██ █████    ██ ██ ██ ██     ██ ████ ██ ██    ██ ██      ██    ██ ██████  ███████ ██████     ██
      //   ██ ██       ██ ████  ██     ██  ██  ██ ██    ██ ██      ██    ██ ██      ██   ██ ██   ██    ██
      //   ██ ███████  ██  ██████      ██      ██  ██████  ███████ ██    ██ ██      ██   ██ ██   ██    ██
      //   */
      //
      //   return HTTPRequest.requestMultipartPostIE10below(_url, rawFieldArray, _callback, _async);
      // }

      finalData = _dontModifiyData ? _data : HTTPRequest.convertFieldsToFormData(cookedFieldArray);
    } else if (_enctype === 'application/x-www-form-urlencoded') {
      // get / post 모두 데이터포맷은 같다
      // console.log('application/x-www-form-urlencoded');

      let queries, urlencodedQueries;

      // query 생성
      if (_dontModifiyData === false) {
        queries = cookedFieldArray.map(function(_fieldPair) {

          if (/^\{dontencode\}/.test(_fieldPair[1])) {
            return `${_fieldPair[0]}=${ _fieldPair[1].replace(/^\{dontencode\}/, '') }`;
          }

          return `${_fieldPair[0]}=${ encodeURIComponent(_fieldPair[1]) }`;
        });

        urlencodedQueries = queries.join('&');
      } else {
        urlencodedQueries = _data;
      }

      // Method 가 get 이면 query 들을 조합하여 URL에 더한다.
      if (method === 'get') {
        if (url.lastIndexOf('?') !== -1) {
          finalURL = `${url}&${urlencodedQueries}`;
        } else {
          finalURL = `${url}?${urlencodedQueries}`;
        }
      } else {
        finalData = urlencodedQueries;
      }
    }


    let Request;
    if (B_NAME === 'ie' && B_VER <= 9) {
      if (isSameOrigin) {
        Request = XMLHttpRequest;
        // console.log('>> XMLHttpRequest');
      } else {
        Request = XDomainRequest;
        // console.log('>> XDomainRequest');
      }
    } else {
      Request = XMLHttpRequest;
    }
    let request = new Request();


    // Logging
    let methodForLog = method === _method ? method : `${_method}->${method}`;
    let logBody = `${Classer.getFunctionName(Request)}[${method === 'get'? methodForLog : methodForLog + ':' +_enctype}][${_async ? 'async':'sync'}] - URL: ${finalURL}`;


    // OPEN
    request.open(method, finalURL, _async);

    if (request.setRequestHeader) {
      if (_enctype !== 'multipart/form-data') {
        request.setRequestHeader("Content-type", _enctype);
      }
    }

    request.onprogress = function(_e) {
      //console.log('onprogress', _e);
    };

    request.onload = function(_e) {
      //console.log('onload', _e);
      HTTPRequest.DECREASE_SEND_COUNT();
      /* SuperAgent 의 Response 객체와 인터페이스를 동일하게 제공하기 위해 */
      request.statusType = Math.floor(request.status / 100);
      request.statusCode = request.status;
      request.text = request.responseText;

      if (request.getAllResponseHeaders) {
        request.responseHeader = HTTPRequest.parseResponseHeaders(request.getAllResponseHeaders());
      } else {
        request.responseHeader = {
          'Content-Type': request.contentType
        }
      }

      // 컨텐트 타입이 application/json JSON 데이터 적재
      if (/^application\/json/.test(request.responseHeader['Content-Type'])) {

        try {
          request.json = JSON.parse(request.responseText);
        } catch (_e) {
          request.json = null;
          request.jsonParseError = _e;
        }
      }

      HTTPRequest.Log(`Loaded : ${logBody}\n`, "info", [request]);

      _callback(null, request);
    };

    request.onerror = function(_e) {
      HTTPRequest.DECREASE_SEND_COUNT();

      if (request.getAllResponseHeaders) {
        request.responseHeader = HTTPRequest.parseResponseHeaders(request.getAllResponseHeaders());
      } else {
        request.responseHeader = {
          'Content-Type': request.contentType
        }
      }

      // 컨텐트 타입이 application/json JSON 데이터 적재
      if (/^application\/json/i.test(request.responseHeader['Content-Type'])) {
        try {
          request.json = JSON.parse(request.responseText);
        } catch (_e) {
          request.json = null;
          request.jsonParseError = _e;
        }
      }

      // console.log('onerror', _e);
      HTTPRequest.Log(`Error : ${logBody}\n`, "error", [request, _e]);

      //throw new Error(`Request Error by ${Classer.getFunctionName(Request)}\n${finalURL}`);

      _callback(new Error(`Error : ${logBody}`), null);
    };

    request.ontimeout = function(_e) {
      HTTPRequest.DECREASE_SEND_COUNT();

      if (request.getAllResponseHeaders) {
        request.responseHeader = HTTPRequest.parseResponseHeaders(request.getAllResponseHeaders());
      } else {
        request.responseHeader = {
          'Content-type': request.contentType
        }
      }


      HTTPRequest.Log(`Timeout : ${logBody}\n`, "error", [request, _e]);

      _callback(new Error(`Timeout : ${logBody}`), null);
    };

    HTTPRequest.Log(`Send : ${logBody}\n`, "log");

    if (window.HTTPREQ_TRACE_STACK) {
      if (console.trace)
        console.trace(`Send Trace: ${logBody}\n`);
    }

    HTTPRequest.INCREASE_SEND_COUNT();

    // SEND
    if (method === 'get') {
      request.send();
    } else {
      // post, ... others
      request.send(finalData);
    }
  }

  /*
    fieldConvertToArray
      Object 타입의 필드 목록을 Array로 변환한다.
      Array 타입의 필드 목록을 그대로 반환한다.
  */
  static fieldConvertToArray(_fields) {
    let convertedFields;

    if (_fields instanceof Array) {
      convertedFields = _fields;
    } else {
      if (_fields instanceof Object) {
        let keys, key;
        keys = Object.keys(_fields);

        convertedFields = keys.map(function(_key) {
          return [_key, _fields[_key]];
        });
      } else {
        return [];
      }
    }

    return convertedFields;
  }

  static availableFieldsFilter(_fields) {
    return _fields.filter(function(_field) {
      if (_field[1] === undefined || _field[1] === null) {
        return false;
      }
      return true;
    });
  }

  static requestMultipartPostIE10below(_url, _rawFieldArray, _callback, _async) {
    let iframe = document.createElement('iframe');

    iframe.setAttribute('id', 'ie-multipart-post-' + GET_IE_MULTIPART_IFRAME_ID_STORE());

    document.head.appendChild(iframe);

  }

  /*
    convertRawFieldsToRealFieldsData
      필드 목록중 가공되지 않고 가공이 가능한 형태의 필드가 존재할 경우
      필드에서 전송가능한 데이터를 추출하여 필드의 값으로 변경한다.

    가공대상 Raw Object
     * HTMLInputElement
     * HTMLTextAreaElement
     * FileList
     * File
     * Array
     * String
     * Number
     * Boolean

  */
  static convertRawFieldsToRealFieldsData(_rawFieldArray) {
    let cookedFieldArray = [];

    let rawFieldPair;
    let key, value, valueType;
    for (let i = 0; i < _rawFieldArray.length; i++) {

      rawFieldPair = _rawFieldArray[i];
      key = rawFieldPair[0];
      value = rawFieldPair[1];
      valueType = typeof value;


      if (valueType === 'string' || valueType === 'number' || valueType === 'boolean') {

        cookedFieldArray.push([key, value]);
      } else if (window.FileList && value instanceof window.File) {

        cookedFieldArray.push([key, value]);
      } else if (value instanceof HTMLInputElement) {
        // Input Element
        let type = value.getAttribute('type');

        switch (type) {
          case "file":

            // IE9 이하에서 file API를 지원하지 않아, files 필드가 있을 때에만 file을 추출하여 처리 하도록 한다.
            // 그러므로 ie9이하에서는 Multipart전송에서 file 전송이 제외된다.
            if (value.files) {
              for (let j = 0; j < value.files.length; j++) {
                cookedFieldArray.push([key, value.files[j]]);
              }
            }
            break;
          default:
            value = value.value;
            break;
        }
      } else if (value instanceof HTMLTextAreaElement) {
        // Textarea Element
        value = value.value;

        cookedFieldArray.push([key, value]);
      } else if (value instanceof Array || (window.FileList && value instanceof window.FileList)) {
        // Array or FileList

        for (let j = 0; j < value.length; j++) {
          cookedFieldArray.push([key, value[j]]);
        }
      } else if (value instanceof Function) {

        cookedFieldArray.push([key, value.toString()]);
      } else if (value instanceof Object) {
        // Not supported Object

        throw new Error(`${value.constructor ? value.constructor.name : typeof value} is not supported Raw Transfer Field Type. [fieldname:${key}]`);
      } else {
        // Default

        if (value === null || value === undefined) {
          HTTPRequest.Log(`value of ${key} is ${value}.`, 'warn');

          continue;
        }
      }
    }

    return cookedFieldArray;
  }

  // IE10+
  static convertFieldsToFormData(_fields) {
    if (_fields instanceof FormData) {
      HTTPRequest.Log("FormData 를 FormData로 변환하려 합니다. 이 변환시도는 무시되며 그대로 FormData를 사용합니다.", 'warn');
      return _fields;
    }

    let newFormData = new FormData();

    if (_fields instanceof Array) {
      let field;

      for (let i = 0; i < _fields.length; i++) {
        field = _fields[i];

        newFormData.append(field[0], field[1]);
      }
    } else {
      let fieldKeys = Object.keys(_fields);
      let fieldKey;

      for (let i = 0; i < fieldKeys.length; i++) {
        fieldKey = fieldKeys[i];
        newFormData.append(fieldKeys[i], _fields[fieldKey]);
      }
    }

    return newFormData;
  }

  static requestSync(_method, _url, _data = {}, _callback, _enctype = 'application/x-www-form-urlencoded', _dontModifiyData) {
    HTTPRequest.request(_method, _url, _data, _callback, _enctype, false, _dontModifiyData);
  }

  static parseResponseHeaders(_responseHeaderText) {
    let headLines = _responseHeaderText.split('\n');
    let headObject = {};

    let pair, headLine, key, value;
    for (let i = 0; i < headLines.length; i++) {
      headLine = headLines[i];

      pair = headLine.split(':');
      key = pair[0];
      value = pair[1];
      if (key)
        headObject[key] = (value || '').trim();
    }



    return headObject;
  }

  static INCREASE_SEND_COUNT() {
    HTTP_REQUEST++;

    // console.log(HTTP_REQUEST);
  }

  static DECREASE_SEND_COUNT() {
    HTTP_REQUEST--;

    // console.log(HTTP_REQUEST);

    if (HTTP_REQUEST === 0) {
      // HTTPRequest.emit('end');
    }
  }

  static generate_ie9_timestamp() {
    return Date.now() + Math.random();
  }

  static complexify_cacher() {
    return Date.now() + '' + Math.random();
  }
}
//
// ObjectExtends.liteExtends(HTTPRequest, events.EventEmitter.prototype);
//
//
// HTTPRequest.on('end', function() {
//   alert("END");
// });

export default HTTPRequest;