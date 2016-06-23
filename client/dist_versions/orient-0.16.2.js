/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/*!********************!*\
  !*** multi orient ***!
  \********************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! ./client/src/js/Orient/Orient.js */52);


/***/ },

/***/ 21:
/*!*************************************************!*\
  !*** ./client/src/js/Orient/common/polyfill.js ***!
  \*************************************************/
/***/ function(module, exports) {

	"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	if (!window.console) {
	
	  window.console = {};
	  window.console.log = window.console.warn = window.console.error = window.console.groupCollapsed = window.console.groupEnd = window.console.info = function () {};
	} else {
	
	  window.console.log = window.console.log || function () {};
	  window.console.groupCollapsed = window.console.groupCollapsed || window.console.log;
	  window.console.groupEnd = window.console.groupEnd || function () {};
	}
	
	if (window.console && typeof window.console.time == "undefined") {
	  console.time = function (name, reset) {
	    if (!name) {
	      return;
	    }
	    var time = new Date().getTime();
	    if (!console.timeCounters) {
	      console.timeCounters = {};
	    }
	    var key = "KEY" + name.toString();
	    if (!reset && console.timeCounters[key]) {
	      return;
	    }
	    console.timeCounters[key] = time;
	  };
	
	  console.timeEnd = function (name) {
	    var time = new Date().getTime();
	    if (!console.timeCounters) {
	      return;
	    }
	    var key = "KEY" + name.toString();
	    var timeCounter = console.timeCounters[key];
	    var diff;
	    if (timeCounter) {
	      diff = time - timeCounter;
	      var label = name + ": " + diff + "ms";
	      console.info(label);
	      delete console.timeCounters[key];
	    }
	    return diff;
	  };
	}
	
	if (Function.prototype.bind && window.console && _typeof(console.log) == "object") {
	  ["log", "info", "warn", "error", "assert", "dir", "clear", "profile", "profileEnd"].forEach(function (method) {
	    console[method] = this.bind(console[method], console);
	  }, Function.prototype.call);
	}

/***/ },

/***/ 22:
/*!****************************************************!*\
  !*** ./client/src/js/Orient/common/HTTPRequest.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _events = __webpack_require__(/*! events */ 23);
	
	var _events2 = _interopRequireDefault(_events);
	
	var _detectBrowser = __webpack_require__(/*! detect-browser */ 24);
	
	var _detectBrowser2 = _interopRequireDefault(_detectBrowser);
	
	var _Classer = __webpack_require__(/*! ../../util/Classer */ 25);
	
	var _Classer2 = _interopRequireDefault(_Classer);
	
	var _Identifier = __webpack_require__(/*! ../../util/Identifier.js */ 26);
	
	var _Identifier2 = _interopRequireDefault(_Identifier);
	
	var _ObjectExtends = __webpack_require__(/*! ../../util/ObjectExtends.js */ 27);
	
	var _ObjectExtends2 = _interopRequireDefault(_ObjectExtends);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var B_NAME = _detectBrowser2['default'].name;
	var B_VER = parseInt(_detectBrowser2['default'].version);
	
	var HTTP_REQUEST = 0;
	
	var GET_IE_MULTIPART_IFRAME_ID_STORE = _Identifier2['default'].chars32SequenceStore(9999999);
	
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
	
	var HTTPRequest = function () {
	  function HTTPRequest() {
	    _classCallCheck(this, HTTPRequest);
	  }
	
	  _createClass(HTTPRequest, null, [{
	    key: 'Log',
	    value: function Log(_message) {
	      var _level = arguments.length <= 1 || arguments[1] === undefined ? "log" : arguments[1];
	
	      var _extras = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
	
	      if (!window.DEBUG_OCCURS_HTTP_REQUEST_LOG) return;
	
	      var logParams = void 0;
	      logParams = [_message];
	      try {
	        switch (_level) {
	          case "log":
	            if (B_NAME !== 'ie') logParams = ['%c' + _message, 'background: #333; color: rgb(199, 232, 232); padding:2px;'];
	
	            console.log.apply(console, _ObjectExtends2['default'].union2(logParams, _extras));
	            break;
	          case "info":
	            if (B_NAME !== 'ie') logParams = ['%c' + _message, 'background: #333; color: rgb(21, 211, 243); padding:2px;'];
	
	            console.info.apply(console, _ObjectExtends2['default'].union2(logParams, _extras));
	            break;
	          case "warn":
	            if (B_NAME !== 'ie') logParams = ['%c' + _message, 'background: #333; color: rgb(243, 156, 21); padding:2px;'];
	
	            console.warn.apply(console, _ObjectExtends2['default'].union2(logParams, _extras));
	            break;
	          case "error":
	            if (B_NAME !== 'ie') logParams = ['%c' + _message, 'background: #333; color: rgb(228, 46, 46); padding:2px;'];
	
	            console.error.apply(console, _ObjectExtends2['default'].union2(logParams, _extras));
	            break;
	        }
	      } catch (_e) {
	        if (_level === 'error') {
	
	          //throw new Error(_message);
	        }
	      }
	    }
	  }, {
	    key: 'request',
	    value: function request(_method, _url) {
	      var _data = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
	
	      var _callback = arguments[3];
	
	      var _enctype = arguments.length <= 4 || arguments[4] === undefined ? 'application/x-www-form-urlencoded' : arguments[4];
	
	      var _async = arguments.length <= 5 || arguments[5] === undefined ? true : arguments[5];
	
	      var _dontModifiyData = arguments.length <= 6 || arguments[6] === undefined ? false : arguments[6];
	
	      var method = _method.toLowerCase();
	      var is_multipart_post = false;
	      var isSameOrigin = true; // 타 도메인 감지
	      var url = _url;
	
	      // multipart post 체크와 메소드 체크
	      if (method === 'post') {
	        if (_enctype === 'multipart/form-data') {
	          is_multipart_post = true;
	        }
	      } else if (method === 'get') {
	        if (_enctype !== 'application/x-www-form-urlencoded') {
	          throw new Error('HTTP Method 는 GET 으로 지정되어 있지만, Enctype 은 \'application/x-www-form-urlencoded\' 가 아닙니다.');
	        }
	        //
	      } else {
	          throw new Error('지원하지 않는 HTTP메소드(' + _method + ') 입니다.');
	        }
	
	      // URL 구성
	      // 프로토콜이 생략되어 있는 URL이면 프로토콜과 호스트를 앞에 붙여 절대 URL로 완성한다.
	      if (!/^https?:\/\//.test(url)) {
	        // 상대경로도 아닐 때
	        if (!/^\.\.?\//.test(url)) {
	          url = url.replace(/^\/?/, location.protocol + '//' + location.host + '/');
	        }
	      }
	
	      // 크로스 도메인확인
	      // URL이 현재 protocol 과 host 가 일치하는지 확인한다.
	      if (new RegExp('^' + location.protocol + '//' + location.host + '/').test(url) || /^\.\.?\//.test(url)) {
	        isSameOrigin = true;
	      } else {
	        isSameOrigin = false;
	      }
	
	      // for application/x-www-form-urlencoded ,multipart/form-data
	      var rawFieldArray = [],
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
	      var finalData = null;
	      var finalURL = url;
	
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
	
	        var queries = void 0,
	            urlencodedQueries = void 0;
	
	        // query 생성
	        if (_dontModifiyData === false) {
	          queries = cookedFieldArray.map(function (_fieldPair) {
	
	            return _fieldPair[0] + '=' + encodeURIComponent(_fieldPair[1]);
	          });
	
	          urlencodedQueries = queries.join('&');
	        } else {
	          urlencodedQueries = _data;
	        }
	
	        // Method 가 get 이면 query 들을 조합하여 URL에 더한다.
	        if (method === 'get') {
	          if (url.lastIndexOf('?') !== -1) {
	            finalURL = url + '&' + urlencodedQueries;
	          } else {
	            finalURL = url + '?' + urlencodedQueries;
	          }
	        } else {
	          finalData = urlencodedQueries;
	        }
	      }
	
	      var Request = void 0;
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
	      var request = new Request();
	
	      // OPEN
	      request.open(_method, finalURL, _async);
	
	      if (request.setRequestHeader) {
	        if (_enctype !== 'multipart/form-data') {
	          request.setRequestHeader("Content-type", _enctype);
	        }
	      }
	
	      request.onprogress = function (_e) {
	        //console.log('onprogress', _e);
	      };
	
	      request.onload = function (_e) {
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
	          };
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
	
	        HTTPRequest.Log('Loaded : ' + _Classer2['default'].getFunctionName(Request) + '[' + method + '][' + (_async ? 'async' : 'sync') + '] - URL: ' + finalURL + '\n', "info", [request]);
	
	        _callback(null, request);
	      };
	
	      request.onerror = function (_e) {
	        HTTPRequest.DECREASE_SEND_COUNT();
	
	        if (request.getAllResponseHeaders) {
	          request.responseHeader = HTTPRequest.parseResponseHeaders(request.getAllResponseHeaders());
	        } else {
	          request.responseHeader = {
	            'Content-Type': request.contentType
	          };
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
	        var message = 'Error : ' + _Classer2['default'].getFunctionName(Request) + '[' + method + '][' + (_async ? 'async' : 'sync') + '] - URL: ' + finalURL;
	        HTTPRequest.Log(message + '\n', "error", [request, _e]);
	
	        //throw new Error(`Request Error by ${Classer.getFunctionName(Request)}\n${finalURL}`);
	
	        _callback(new Error(message), null);
	      };
	
	      request.ontimeout = function (_e) {
	        HTTPRequest.DECREASE_SEND_COUNT();
	
	        if (request.getAllResponseHeaders) {
	          request.responseHeader = HTTPRequest.parseResponseHeaders(request.getAllResponseHeaders());
	        } else {
	          request.responseHeader = {
	            'Content-type': request.contentType
	          };
	        }
	
	        // console.log('onerror', _e);
	        var message = 'Timeout : ' + _Classer2['default'].getFunctionName(Request) + '[' + method + '][' + (_async ? 'async' : 'sync') + '] - URL: ' + finalURL;
	
	        HTTPRequest.Log(message + '\n', "error", [request, _e]);
	
	        _callback(new Error(message), null);
	      };
	
	      HTTPRequest.Log('Send : ' + _Classer2['default'].getFunctionName(Request) + '[' + method + '][' + (_async ? 'async' : 'sync') + '] - URL: ' + finalURL + '\n', "log");
	
	      if (window.HTTPREQ_TRACE_STACK) {
	        if (console.trace) console.trace('Send Trace: ' + _Classer2['default'].getFunctionName(Request) + '[' + method + '][' + (_async ? 'async' : 'sync') + '] - URL: ' + finalURL + '\n');
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
	
	  }, {
	    key: 'fieldConvertToArray',
	    value: function fieldConvertToArray(_fields) {
	      var convertedFields = void 0;
	
	      if (_fields instanceof Array) {
	        convertedFields = _fields;
	      } else {
	        if (_fields instanceof Object) {
	          var keys = void 0,
	              key = void 0;
	          keys = Object.keys(_fields);
	
	          convertedFields = keys.map(function (_key) {
	            return [_key, _fields[_key]];
	          });
	        } else {
	          return [];
	        }
	      }
	
	      return convertedFields;
	    }
	  }, {
	    key: 'availableFieldsFilter',
	    value: function availableFieldsFilter(_fields) {
	      return _fields.filter(function (_field) {
	        if (_field[1] === undefined || _field[1] === null) {
	          return false;
	        }
	        return true;
	      });
	    }
	  }, {
	    key: 'requestMultipartPostIE10below',
	    value: function requestMultipartPostIE10below(_url, _rawFieldArray, _callback, _async) {
	      var iframe = document.createElement('iframe');
	
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
	
	  }, {
	    key: 'convertRawFieldsToRealFieldsData',
	    value: function convertRawFieldsToRealFieldsData(_rawFieldArray) {
	      var cookedFieldArray = [];
	
	      var rawFieldPair = void 0;
	      var key = void 0,
	          value = void 0,
	          valueType = void 0;
	      for (var i = 0; i < _rawFieldArray.length; i++) {
	
	        rawFieldPair = _rawFieldArray[i];
	        key = rawFieldPair[0];
	        value = rawFieldPair[1];
	        valueType = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	
	        if (valueType === 'string' || valueType === 'number' || valueType === 'boolean') {
	
	          cookedFieldArray.push([key, value]);
	        } else if (window.FileList && value instanceof window.File) {
	
	          cookedFieldArray.push([key, value]);
	        } else if (value instanceof HTMLInputElement) {
	          // Input Element
	          var type = value.getAttribute('type');
	
	          switch (type) {
	            case "file":
	
	              // IE9 이하에서 file API를 지원하지 않아, files 필드가 있을 때에만 file을 추출하여 처리 하도록 한다.
	              // 그러므로 ie9이하에서는 Multipart전송에서 file 전송이 제외된다.
	              if (value.files) {
	                for (var j = 0; j < value.files.length; j++) {
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
	        } else if (value instanceof Array || window.FileList && value instanceof window.FileList) {
	          // Array or FileList
	
	          for (var _j = 0; _j < value.length; _j++) {
	            cookedFieldArray.push([key, value[_j]]);
	          }
	        } else if (value instanceof Function) {
	
	          cookedFieldArray.push([key, value.toString()]);
	        } else if (value instanceof Object) {
	          // Not supported Object
	
	          throw new Error((value.constructor ? value.constructor.name : typeof value === 'undefined' ? 'undefined' : _typeof(value)) + ' is not supported Raw Transfer Field Type. [fieldname:' + key + ']');
	        } else {
	          // Default
	
	          if (value === null || value === undefined) {
	            HTTPRequest.Log('value of ' + key + ' is ' + value + '.', 'warn');
	
	            continue;
	          }
	        }
	      }
	
	      return cookedFieldArray;
	    }
	
	    // IE10+
	
	  }, {
	    key: 'convertFieldsToFormData',
	    value: function convertFieldsToFormData(_fields) {
	      if (_fields instanceof FormData) {
	        HTTPRequest.Log("FormData 를 FormData로 변환하려 합니다. 이 변환시도는 무시되며 그대로 FormData를 사용합니다.", 'warn');
	        return _fields;
	      }
	
	      var newFormData = new FormData();
	
	      if (_fields instanceof Array) {
	        var field = void 0;
	
	        for (var i = 0; i < _fields.length; i++) {
	          field = _fields[i];
	
	          newFormData.append(field[0], field[1]);
	        }
	      } else {
	        var fieldKeys = Object.keys(_fields);
	        var fieldKey = void 0;
	
	        for (var _i = 0; _i < fieldKeys.length; _i++) {
	          fieldKey = fieldKeys[_i];
	          newFormData.append(fieldKeys[_i], _fields[fieldKey]);
	        }
	      }
	
	      return newFormData;
	    }
	  }, {
	    key: 'requestSync',
	    value: function requestSync(_method, _url) {
	      var _data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	      var _callback = arguments[3];
	
	      var _enctype = arguments.length <= 4 || arguments[4] === undefined ? 'application/x-www-form-urlencoded' : arguments[4];
	
	      var _dontModifiyData = arguments[5];
	
	      HTTPRequest.request(_method, _url, _data, _callback, _enctype, false, _dontModifiyData);
	    }
	  }, {
	    key: 'parseResponseHeaders',
	    value: function parseResponseHeaders(_responseHeaderText) {
	      var headLines = _responseHeaderText.split('\n');
	      var headObject = {};
	
	      var pair = void 0,
	          headLine = void 0,
	          key = void 0,
	          value = void 0;
	      for (var i = 0; i < headLines.length; i++) {
	        headLine = headLines[i];
	
	        pair = headLine.split(':');
	        key = pair[0];
	        value = pair[1];
	        if (key) headObject[key] = (value || '').trim();
	      }
	
	      return headObject;
	    }
	  }, {
	    key: 'INCREASE_SEND_COUNT',
	    value: function INCREASE_SEND_COUNT() {
	      HTTP_REQUEST++;
	
	      // console.log(HTTP_REQUEST);
	    }
	  }, {
	    key: 'DECREASE_SEND_COUNT',
	    value: function DECREASE_SEND_COUNT() {
	      HTTP_REQUEST--;
	
	      // console.log(HTTP_REQUEST);
	
	      if (HTTP_REQUEST === 0) {
	        // HTTPRequest.emit('end');
	      }
	    }
	  }]);
	
	  return HTTPRequest;
	}();
	//
	// ObjectExtends.liteExtends(HTTPRequest, events.EventEmitter.prototype);
	//
	//
	// HTTPRequest.on('end', function() {
	//   alert("END");
	// });
	
	exports['default'] = HTTPRequest;

/***/ },

/***/ 23:
/*!************************************************!*\
  !*** ./~/node-libs-browser/~/events/events.js ***!
  \************************************************/
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;
	
	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;
	
	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;
	
	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;
	
	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};
	
	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;
	
	  if (!this._events)
	    this._events = {};
	
	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }
	
	  handler = this._events[type];
	
	  if (isUndefined(handler))
	    return false;
	
	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }
	
	  return true;
	};
	
	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events)
	    this._events = {};
	
	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);
	
	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];
	
	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }
	
	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;
	
	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  var fired = false;
	
	  function g() {
	    this.removeListener(type, g);
	
	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }
	
	  g.listener = listener;
	  this.on(type, g);
	
	  return this;
	};
	
	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events || !this._events[type])
	    return this;
	
	  list = this._events[type];
	  length = list.length;
	  position = -1;
	
	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }
	
	    if (position < 0)
	      return this;
	
	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }
	
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;
	
	  if (!this._events)
	    return this;
	
	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }
	
	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }
	
	  listeners = this._events[type];
	
	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];
	
	  return this;
	};
	
	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};
	
	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];
	
	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};
	
	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	
	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },

/***/ 24:
/*!*************************************!*\
  !*** ./~/detect-browser/browser.js ***!
  \*************************************/
/***/ function(module, exports) {

	var browsers = [
	  [ 'edge', /Edge\/([0-9\._]+)/ ],
	  [ 'chrome', /Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/ ],
	  [ 'firefox', /Firefox\/([0-9\.]+)(?:\s|$)/ ],
	  [ 'opera', /Opera\/([0-9\.]+)(?:\s|$)/ ],
	  [ 'ie', /Trident\/7\.0.*rv\:([0-9\.]+)\).*Gecko$/ ],
	  [ 'ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/ ],
	  [ 'ie', /MSIE\s(7\.0)/ ],
	  [ 'bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/ ],
	  [ 'android', /Android\s([0-9\.]+)/ ],
	  [ 'ios', /iPad\;\sCPU\sOS\s([0-9\._]+)/ ],
	  [ 'ios',  /iPhone\;\sCPU\siPhone\sOS\s([0-9\._]+)/ ],
	  [ 'safari', /Safari\/([0-9\._]+)/ ]
	];
	
	var i = 0, mapped =[];
	for (i = 0; i < browsers.length; i++) {
	  browsers[i] = createMatch(browsers[i]);
	  if (isMatch(browsers[i])) {
	    mapped.push(browsers[i]);
	  }
	}
	
	var match = mapped[0];
	var parts = match && match[3].split(/[._]/).slice(0,3);
	
	while (parts && parts.length < 3) {
	  parts.push('0');
	}
	
	// set the name and version
	exports.name = match && match[0];
	exports.version = parts && parts.join('.');
	
	function createMatch(pair) {
	  return pair.concat(pair[1].exec(navigator.userAgent));
	}
	
	function isMatch(pair) {
	  return !!pair[2];
	}


/***/ },

/***/ 25:
/*!***************************************!*\
  !*** ./client/src/js/util/Classer.js ***!
  \***************************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var GET_NAME_IN_CONSTRUCTOR = /function ([\w\d_$]+)?\(\)/;
	
	var Classer = function () {
	  function Classer() {
	    _classCallCheck(this, Classer);
	  }
	
	  _createClass(Classer, null, [{
	    key: "getClassName",
	
	
	    // Uglify 된 라이브러리의 경우 사용 할 수 없다.
	    // uglify 시에 객체 명이 근본부터 변경되므로,
	    // Javascript 기본 오브젝트에 한해 사용이 가능하다.
	    value: function getClassName(_object) {
	      var matches = _object.constructor.toString().match(GET_NAME_IN_CONSTRUCTOR);
	
	      return matches[1];
	    }
	  }, {
	    key: "getFunctionName",
	    value: function getFunctionName(_function) {
	      var matches = _function.toString().match(GET_NAME_IN_CONSTRUCTOR);
	
	      return matches[1];
	    }
	  }]);
	
	  return Classer;
	}();
	
	exports["default"] = Classer;

/***/ },

/***/ 26:
/*!******************************************!*\
  !*** ./client/src/js/util/Identifier.js ***!
  \******************************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var CHARS64 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890+="; // 64자
	var CHARS32 = "ABCDEFGHIJKLMNOPQRSTUVWYZ12345+="; // 32자
	
	var Identifier = {
	  genUUID: function genUUID() {
	    var d = new Date().getTime();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	      var r = (d + Math.random() * 16) % 16 | 0;
	      d = Math.floor(d / 16);
	      return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
	    });
	    return uuid;
	  },
	
	  numberTo64Hash: function numberTo64Hash(_number) {
	    var bin = _number.toString(2);
	
	    var builtString = "";
	    var chunkCount = Math.ceil(bin.length / 6); // 6비트는 0~63의 수를 표현
	
	    var start = void 0;
	    for (var i = 0; i < chunkCount; i++) {
	      start = i * 6;
	
	      builtString += CHARS64[parseInt(bin.slice(start, start + 6), 2)];
	    }
	
	    return builtString;
	  },
	
	  numberTo32Hash: function numberTo32Hash(_number) {
	    var bin = _number.toString(2);
	
	    var builtString = "";
	    var chunkCount = Math.ceil(bin.length / 5); // 6비트는 0~31의 수를 표현
	
	    var start = void 0;
	    for (var i = 0; i < chunkCount; i++) {
	      start = i * 5;
	
	      builtString += CHARS32[parseInt(bin.slice(start, start + 5), 2)];
	    }
	
	    return builtString;
	  },
	
	  chars64SequenceStore: function chars64SequenceStore(_maxRewind) {
	    var seq = 0;
	
	    return function () {
	      if (_maxRewind) {
	        if (seq > _maxRewind) {
	          seq = 0;
	        }
	      }
	
	      return Identifier.numberTo64Hash(seq++);
	    };
	  },
	
	  chars32SequenceStore: function chars32SequenceStore(_maxRewind) {
	    var seq = 0;
	
	    return function () {
	      if (_maxRewind) {
	        if (seq > _maxRewind) {
	          seq = 0;
	        }
	      }
	
	      return Identifier.numberTo32Hash(seq++);
	    };
	  }
	};
	
	exports["default"] = Identifier;

/***/ },

/***/ 27:
/*!*********************************************!*\
  !*** ./client/src/js/util/ObjectExtends.js ***!
  \*********************************************/
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ObjectExtends = function () {
	  function ObjectExtends() {
	    _classCallCheck(this, ObjectExtends);
	  }
	
	  _createClass(ObjectExtends, null, [{
	    key: 'liteExtends',
	    value: function liteExtends(_destObject, _source) {
	      var okeys = Object.keys(_source);
	
	      var propKey = void 0;
	      var prop = void 0;
	      for (var i = 0; i < okeys.length; i++) {
	        propKey = okeys[i];
	        prop = _source[propKey];
	
	        if ((typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) === 'object') {
	          if (prop === null || prop === undefined) {
	            _destObject[propKey] = prop;
	          } else {
	            _destObject[propKey] = ObjectExtends.clone(prop);
	          }
	        } else if (typeof prop === 'function') {
	          _destObject[propKey] = prop;
	        } else {
	          _destObject[propKey] = prop;
	        }
	      }
	    }
	
	    // _interpolator 가 입력되면 clone과 동시에 값을 변경한다.
	
	  }, {
	    key: 'clone',
	    value: function clone(_object, _deep, _interpolator) {
	      var keys = Object.keys(_object);
	      var clonedObj = void 0;
	      var value = void 0,
	          key = void 0;
	
	      if (_object instanceof Array) {
	        clonedObj = [];
	      } else {
	        clonedObj = {};
	      }
	
	      for (var i = 0; i < keys.length; i++) {
	        key = keys[i];
	        value = _object[key];
	        switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
	          case 'function': // function 은 참조 복사
	          case 'number': // 1232, 12312.1123, Infinity, NaN
	          case 'string':
	          case 'boolean': // true ,false
	          case 'undefined':
	            // undefined
	            clonedObj[key] = _interpolator ? _interpolator(value) : value;
	            break;
	          case 'object':
	            if (_deep) {
	              if (value === null) {
	                clonedObj[key] = null;
	              } else {
	                clonedObj[key] = ObjectExtends.clone(value, _deep, _interpolator);
	              }
	            } else {
	              clonedObj[key] = _interpolator ? _interpolator(value) : value;
	            }
	        }
	      }
	
	      return clonedObj;
	    }
	
	    // Object 를 머지한다. 참조객체에 소스객체를 머지한다. 반환은 없다
	    // override 가 true로 입력되면 키가 이미 dest 객체에 존재 하더라도 _source의 값으로 덮어쓴다.
	
	  }, {
	    key: 'mergeByRef',
	    value: function mergeByRef(_dest, _source, _override, _asSuper) {
	      var keys = Object.keys(_source);
	      var key = void 0;
	
	      for (var i = 0; i < keys.length; i++) {
	        key = keys[i];
	        if (_override) {
	          _dest[key] = _source[key];
	        } else if (!_dest.hasOwnProperty(key)) {
	          if (_asSuper) {
	            _dest['super_' + key] = _source[key];
	          }
	
	          _dest[key] = _source[key];
	        }
	      }
	    }
	  }, {
	    key: 'merge',
	    value: function merge(_dest, _source, _override, _asSuper) {
	      var assigned = ObjectExtends.clone(_dest);
	
	      ObjectExtends.mergeByRef(assigned, _source, _override, _asSuper);
	
	      return assigned;
	    }
	
	    // all argument merge
	    // 첫번째 인수와 그 이후의 인수로 들어온 객체를 첫번째 인수로 들어온 배열에 더한다.
	
	  }, {
	    key: 'union',
	    value: function union() {
	      var newArr = arguments[0];
	
	      for (var i = 1; i < arguments.length; i++) {
	        newArr = ObjectExtends.union2(newArr, arguments[i]);
	      }
	
	      return newArr;
	    }
	
	    // 첫번째 인수로 들어온 배열에 두번째 인수로 들어온 배열을 머지한다.
	
	  }, {
	    key: 'union2',
	    value: function union2(_arr1, _arr2) {
	      var newArr = ObjectExtends.clone(_arr1);
	
	      for (var i = 0; i < _arr2.length; i++) {
	        newArr.push(_arr2[i]);
	      }
	
	      return newArr;
	    }
	  }, {
	    key: 'arrayToArray',
	    value: function arrayToArray(_arguments) {
	      var argArray = [];
	
	      for (var i = 0; i < _arguments.length; i++) {
	        argArray.push(_arguments[i]);
	      }
	
	      return argArray;
	    }
	  }, {
	    key: 'ExtendClass',
	    value: function ExtendClass(_subClass, _superClass) {
	      if (typeof _subClass !== 'function') throw new Error('Error : couldn\'t extend class. _subClass must be function. ' + (typeof _subClass === 'undefined' ? 'undefined' : _typeof(_subClass)));
	      _subClass.prototype = Object.create(_superClass.prototype);
	      _subClass.prototype.constructor = _subClass;
	    }
	  }]);
	
	  return ObjectExtends;
	}();
	
	var ROOT_OBJECT;
	
	try {
	  ROOT_OBJECT = window;
	} catch (_e) {
	  ROOT_OBJECT = global;
	}
	
	ROOT_OBJECT.__orient__ObjectExtends = ObjectExtends;
	exports['default'] = ObjectExtends;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },

/***/ 28:
/*!***************************************************!*\
  !*** ./client/src/js/Orient/common/APIRequest.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _HTTPRequest = __webpack_require__(/*! ./HTTPRequest */ 22);
	
	var _HTTPRequest2 = _interopRequireDefault(_HTTPRequest);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var REGEXP_APISOURCE_MEAN = /^\[([\w\d-_]+)\](.+)$/;
	
	var APIRequest = function () {
	  function APIRequest(_env) {
	    _classCallCheck(this, APIRequest);
	
	    this.env = _env;
	  }
	
	  _createClass(APIRequest, [{
	    key: 'request',
	    value: function request(_apiSourceDesc, _requestId, _paramObject, _callback, _enctype, _methodOverride) {
	
	      APIRequest.RequestAPI(this.env, this.env.interpret(_apiSourceDesc), this.env.interpret(_requestId), _paramObject, _callback, _enctype, _methodOverride);
	    }
	  }, {
	    key: 'requestSync',
	    value: function requestSync(_apiSourceDesc, _requestId, _paramObject, _callback, _enctype, _methodOverride) {
	      APIRequest.RequestAPISync(this.env, this.env.interpret(_apiSourceDesc), this.env.interpret(_requestId), _paramObject, _callback, _enctype, _methodOverride);
	    }
	  }], [{
	    key: 'RequestAPISync',
	    value: function RequestAPISync(_env, _apiSourceDesc, _requestId, _paramObject, _callback, _enctype, _methodOverride) {
	      // apiSource 의 class 확인
	      // http 와 https class 는 직접 요청 처리 그 외 class는 env 를 통해 실행.
	      // http 와 https 는 //로 시작하거나 /로 시작해야 함
	      var sourceMatches = _apiSourceDesc.match(REGEXP_APISOURCE_MEAN);
	      if (sourceMatches === null) throw new Error('잘못된 APISource(' + _apiSourceDesc + ') 지정 입니다.');
	
	      var sourceType = sourceMatches[1],
	          sourceTarget = sourceMatches[2];
	
	      if (/^https?$/.test(sourceType)) {
	        _HTTPRequest2['default'].requestSync(_methodOverride || 'get', sourceTarget, _paramObject, function (_err, _res, _statusCode) {
	
	          if (_err !== null) {
	            if (_res) {
	              return _callback(_err, _res.json || _res.text, _res);
	            } else {
	              return _callback(_err, null);
	            }
	          }
	
	          _callback(null, _res.json || _res.text, _res);
	        }, _enctype);
	      } else {
	        // apisource JSON을 로드한다.
	        // env 의 APISOurce Factory에 접근한다.
	        // JSON을 APISource로 빌드한다.
	        if (!_requestId) throw new Error('APISource(' + _apiSourceDesc + ')에 대응하는 RequestID를 찾을 수 없습니다. 구성을 확인 해 주세요.');
	        if (!_env) throw new Error('Error: Couldn\'n APISource Request. Required the Environment.');
	
	        _env.apiSourceFactory.getInstanceWithRemoteSync(sourceType, sourceTarget, function (_apiSource) {
	
	          _apiSource.executeRequestSync(_requestId, _paramObject, {}, function (_err, _retrievedObject, _response) {
	            if (_err !== null) {
	              if (_retrievedObject) {
	                return _callback(_err, _retrievedObject, _res);
	              } else {
	                return _callback(_err, null);
	              }
	            }
	
	            _callback(null, _retrievedObject, _response);
	          }, _enctype);
	        });
	      }
	    }
	  }, {
	    key: 'RequestAPI',
	    value: function RequestAPI(_env, _apiSourceDesc, _requestId, _paramObject, _callback, _enctype, _methodOverride) {
	
	      // apiSource 의 class 확인
	      // http 와 https class 는 직접 요청 처리 그 외 class는 env 를 통해 실행.
	      // http 와 https 는 //로 시작하거나 /로 시작해야 함
	      var sourceMatches = _apiSourceDesc.match(REGEXP_APISOURCE_MEAN);
	      if (sourceMatches === null) throw new Error('잘못된 APISource(' + _apiSourceDesc + ') 지정 입니다.');
	
	      var sourceType = sourceMatches[1],
	          sourceTarget = sourceMatches[2];
	
	      if (/^https?$/.test(sourceType)) {
	        _HTTPRequest2['default'].request(_methodOverride || 'get', sourceTarget, _paramObject, function (_err, _res, _statusCode) {
	
	          if (_err !== null) {
	            if (_res) {
	              return _callback(_err, _res.json || _res.text, _res);
	            } else {
	              return _callback(_err, null);
	            }
	          }
	          _callback(null, _res.json || _res.text, _res);
	        }, _enctype);
	      } else {
	        // apisource JSON을 로드한다.
	        // env 의 APISOurce Factory에 접근한다.
	        // JSON을 APISource로 빌드한다.
	        if (!_requestId) throw new Error('APISource(' + _apiSourceDesc + ')에 대응하는 RequestID를 찾을 수 없습니다. 구성을 확인 해 주세요.');
	        if (!_env) throw new Error('Error: Couldn\'n APISource Request. Required the Environment.');
	
	        _env.apiSourceFactory.getInstanceWithRemote(sourceType, sourceTarget, function (_apiSource) {
	
	          _apiSource.executeRequest(_requestId, _paramObject, {}, function (_err, _retrievedObject, _response) {
	            if (_err !== null) {
	              if (_retrievedObject) {
	                return _callback(_err, _retrievedObject, _res);
	              } else {
	                return _callback(_err, null);
	              }
	            }
	
	            _callback(null, _retrievedObject, _response);
	          }, _enctype);
	        });
	      }
	    }
	  }]);
	
	  return APIRequest;
	}();
	
	exports['default'] = APIRequest;

/***/ },

/***/ 32:
/*!**********************************************!*\
  !*** ./client/src/js/util/ObjectExplorer.js ***!
  \**********************************************/
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	/**
	 * getValueByKeyPath
	 * @param _object
	 * @param _keyPath
	 * @returns {*}
	 */
	function getValueByKeyPath(_object, _keyPath, _spliter) {
	  var spliter = _spliter || '/';
	
	  var splitPath = _keyPath.split(_spliter);
	
	  var currValue = _object;
	
	  for (var i = 0; i < splitPath.length; i++) {
	    if (currValue === undefined || currValue === null) return undefined;
	    currValue = currValue[splitPath[i]];
	  }
	
	  return currValue;
	}
	
	/**
	 * String Replacement 문자열을 사전오브젝트를 이용하여 치환한다.
	 * @param _string 문자열 내에 "{{key/path/key'}}"와 같은 문자를 찾으면 dicObject 에서 찾아 교체한다. object 트리를 타서 접근 해야 할 경우 / 로 경로를 지정한다.
	 * key 는 알파벳, 숫자, 하이픈(-), 언더스코어(_), 공백문자로(" ") 이루어 질 수 있다.
	 * @param _dicObject
	 * @param _replacePointBracketString 문자열내에 교체할 지점을 찾을 때 기준이 되는 인수 기본적으로 "{{/}}" 을 사용한다
	 */
	function stringReplacement(_string, _dicObject, _replacePointBracketString) {
	  var replacePointBracketString = _replacePointBracketString || "{{/}}";
	  var replacePointBrackets = replacePointBracketString.split('/');
	  var replacePointForeBracket = replacePointBrackets[0];
	  var replacePointBackBracket = replacePointBrackets[1];
	
	  var pointFindRegExp = new RegExp("" + replacePointForeBracket + "([\\w\\d-_\/\s]+)" + replacePointBackBracket + "");
	
	  // string 이 단 하나의 치환포인트만을 가질 경우 sring 형식으로 삽입 하지 않고 그 데이터를 그대로 반환한다.
	  var onlyOnePointFindRegExp = new RegExp("^" + replacePointForeBracket + "([\\w\\d-_\/\s]+)" + replacePointBackBracket + "$");
	  var oneReturn = false;
	  if (onlyOnePointFindRegExp.test(_string)) {
	    oneReturn = true;
	  }
	
	  var resultString = _string;
	
	  var matched = resultString.match(pointFindRegExp);
	  while (matched !== null) {
	    var replaceKey = matched[1];
	    console.log('####', _string, _dicObject, _replacePointBracketString);
	    // replace
	    var replaceValue = getValueByKeyPath(_dicObject, replaceKey);
	    resultString = resultString.replace(replacePointForeBracket + replaceKey + replacePointBackBracket, replaceValue);
	
	    // 단하나의 교체대상만을 가질 경우 교체할 데이터를 그대로 반환한다.
	    if (oneReturn) {
	      return replaceValue;
	    }
	
	    matched = resultString.match(pointFindRegExp);
	  }
	
	  return resultString;
	}
	
	function objectExplore(_object, _explorer, _key) {
	  var oType = typeof _object === 'undefined' ? 'undefined' : _typeof(_object);
	
	  if (oType === 'undefined') {
	    return;
	  } else if (oType === 'number') {
	    _explorer(_key, _object);
	  } else if (oType === 'boolean') {
	    _explorer(_key, _object);
	  } else if (oType === 'string') {
	    _explorer(_key, _object);
	  } else if (oType === 'object') {
	    if (_object === null) {
	      return;
	    } else if (_object.length !== undefined && typeof _object.length === 'number') {
	      var item = void 0;
	      for (var i = 0; i < _object.length; i++) {
	        item = _object[i];
	
	        objectExplore(item, _explorer, (_key || '') + '/' + i);
	      }
	    } else {
	      var keys = Object.keys(_object);
	      var key = void 0;
	      for (var _i = 0; _i < keys.length; _i++) {
	        key = keys[_i];
	
	        objectExplore(_object[key], _explorer, _key + '/' + key);
	      }
	    }
	  }
	}
	
	var ROOT_OBJECT;
	
	try {
	  ROOT_OBJECT = window;
	} catch (_e) {
	  ROOT_OBJECT = global;
	}
	
	ROOT_OBJECT.__orient__ObjectExplorer = {
	  stringReplacement: stringReplacement,
	  getValueByKeyPath: getValueByKeyPath,
	  explore: objectExplore
	};
	
	module.exports = ROOT_OBJECT.__orient__ObjectExplorer;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },

/***/ 33:
/*!************************************************************!*\
  !*** ./client/src/js/serviceCrew/DataResolver/Resolver.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _ObjectExplorer = __webpack_require__(/*! ../../util/ObjectExplorer.js */ 32);
	
	var _ObjectExplorer2 = _interopRequireDefault(_ObjectExplorer);
	
	var _ArrayHandler = __webpack_require__(/*! ../../util/ArrayHandler.js */ 34);
	
	var _ArrayHandler2 = _interopRequireDefault(_ArrayHandler);
	
	var _jsCookie = __webpack_require__(/*! js-cookie */ 35);
	
	var _jsCookie2 = _interopRequireDefault(_jsCookie);
	
	var _accounting = __webpack_require__(/*! accounting */ 36);
	
	var _accounting2 = _interopRequireDefault(_accounting);
	
	var _Shortcut = __webpack_require__(/*! ./Shortcut */ 37);
	
	var _Shortcut2 = _interopRequireDefault(_Shortcut);
	
	var _TypeCaster = __webpack_require__(/*! ../../util/TypeCaster */ 40);
	
	var _TypeCaster2 = _interopRequireDefault(_TypeCaster);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// import ElementNode from '../ElementNode/ElementNode';
	
	//import _ from 'underscore';
	/**
	  데이터가 존재하는 곳에 데이터 리졸버가 존재한다.
	*/
	
	var Resolver = function () {
	  function Resolver(_upperResolver) {
	    _classCallCheck(this, Resolver);
	
	    // 상위 NS데이터 참조를 위해 사용 // getNSData()
	    this.upperResolver = _upperResolver || null;
	
	    this.dataSpace = {};
	
	    this.resolveFunctionDict = {};
	    this.argsMapDict = {};
	  }
	
	  _createClass(Resolver, [{
	    key: 'setNS',
	    value: function setNS(_ns, _data) {
	      this.dataSpace[_ns] = _data;
	      // console.log(this.dataSpace);
	    }
	  }, {
	    key: 'getNS',
	    value: function getNS(_ns) {
	      return this.dataSpace[_ns];
	    }
	  }, {
	    key: 'resolve',
	    value: function resolve(_matter, _externalGetterInterface, _defaultDataObject, _caller) {
	      if (_matter === null || _matter === undefined || _matter === NaN) {
	        return _matter;
	      }
	
	      return this.__interpret4(typeof _matter !== 'string' ? String(_matter) : _matter, _externalGetterInterface, _defaultDataObject, _caller);
	    }
	  }, {
	    key: 'empty',
	    value: function empty() {
	      this.dataSpace = {};
	    }
	
	    // 내부에 오브젝트 선언 불가 // 안쓰면 되지?ㅋㅋㅋㅋ // 오브젝트 변수는 따로 선언 하면 되지ㅋㅋ // 어차피 쓸 일도 없어ㅋㅋ
	
	  }, {
	    key: '__interpret3',
	    value: function __interpret3(_matter, _externalGetterInterface, _defaultDataObject, _caller) {
	      // 모든 바인딩은 Resolver에서 이루어 지며 리졸브 블럭내에서 요구하는 데이터는 resolve 실행 자 로 부터 얻을 수 있는 메소드를 제공 받아야 한다.
	      var dataSeries = [];
	      var matterLen = _matter.length;
	
	      var tempStringChunk = '';
	      var temp = '';
	
	      var char = void 0,
	          prev = void 0;
	
	      var nextEscape = false;
	      var openfirst = false;
	      var openedInterpret = false;
	      var firstClosed = false;
	      for (var i = 0; i < matterLen; i++) {
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
	  }, {
	    key: '__interpret4',
	    value: function __interpret4(_matter, _externalGetterInterface, _defaultDataObject, _caller) {
	      var length = _matter.length;
	      var slices = [];
	
	      var found = void 0;
	      var end = -1,
	          start = -1,
	          cursor = 0;
	
	      var slice = void 0;
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
	  }, {
	    key: '__findBindBlock',
	    value: function __findBindBlock(_string, _start, _end) {
	
	      var start = -1,
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
	  }, {
	    key: '__executeSyntax',
	    value: function __executeSyntax(_syntax, _externalGetterInterface, _defaultDataObject, _caller) {
	
	      var that = this;
	      // let argsMap = [];
	      // let vfunction = this.__getVirtualFunctionWithParamMap(_syntax, argsMap);
	      var argsMap = void 0;
	      var vfunction = void 0;
	
	      if (this.resolveFunctionDict[_syntax]) {
	        vfunction = this.resolveFunctionDict[_syntax];
	        argsMap = this.argsMapDict[_syntax];
	      } else {
	        argsMap = []; // __getVirtualFunctionWithParamMap 메서드에 참조가 전달된다.
	        vfunction = this.resolveFunctionDict[_syntax] = this.__getVirtualFunctionWithParamMap(_syntax, argsMap);
	        this.argsMapDict[_syntax] = argsMap;
	      }
	
	      argsMap = argsMap.map(function (_argHolder, _i) {
	        //console.log(_syntax);
	        return that.__getInterpretVar(_argHolder, _externalGetterInterface, _defaultDataObject, _caller);
	      });
	
	      // 마지막에 Shortcut 객체 삽입.
	      argsMap.push(_Shortcut2['default']);
	      argsMap.push(_externalGetterInterface.executeI18n ? _externalGetterInterface.executeI18n : function executeI18n_NotFound() {
	        return 'Error: Couldn\'n I18N Text. Required the Environment.';
	        //throw new Error(`text 사용 불가능. ${_syntax}`);
	      });
	
	      try {
	        var result = vfunction.apply(_caller, argsMap);
	
	        return result;
	      } catch (_e) {
	        var nativeErrorMessage = _e.message;
	
	        // ORIENT_SHOW_BIND_ERROR 가 켜져있으면 에러를 throw 한다. 후에 컨셉 수정하기
	        if (window.ORIENT_OCCURS_BIND_ERROR) {
	
	          _e.message = nativeErrorMessage + ' [Matter sentence {{' + _syntax + '}}]';
	          _e.interpretArguments = argsMap;
	
	          throw _e;
	        }
	
	        return _e;
	      }
	    }
	
	    // interpret 블럭을 함수로 변환하고 _argumentMapRef 에 인자를 순서대로 입력한다.
	
	  }, {
	    key: '__getVirtualFunctionWithParamMap',
	    value: function __getVirtualFunctionWithParamMap(_syntax, _argumentMapRef) {
	      var argumentsMap = _argumentMapRef; // 함수 호출자가 생성하여 입력한 Array
	      var alreadyIndex = void 0;
	      var functionCreateArgs = [];
	      var functionResult = void 0;
	
	      // ABC@ABC 는 모두 치환하여 변수로 사용한다.
	      var functionBody = _syntax.replace(/[\w\-\_]*\@[\w\-\_\#]+(:\w+)?/g, function (_matched) {
	
	        alreadyIndex = _ArrayHandler2['default'].findIndex(argumentsMap, function (_argName) {
	          return _argName === _matched;
	        });
	
	        if (alreadyIndex == -1) {
	          alreadyIndex = argumentsMap.push(_matched) - 1;
	
	          // 마지막 인자로 shortcut과 그밖의 기본 제공 인자 를 입력하기 위해 인수 필드리스트에 패딩을 추가한다.
	          functionCreateArgs.push('__argPadding_' + alreadyIndex);
	        }
	
	        return 'arguments[' + alreadyIndex + ']';
	      });
	
	      functionCreateArgs.push('shortcut'); // shortcut 객체를 인자로 받기 위해 인수필드에 예비한다.
	      functionCreateArgs.push('i18nTEXT'); // text 메서드(i18n 처리)를 인자로 받기 위해 인수필드에 예비한다.
	
	      // auto 리턴 플래그가 포함 된 경우 식 블럭을 괄호로 감싸 줄바꿈이 포람된 경우에도 유효한 반환을 하도록 한다.
	      var isAutoReturn = false;
	      functionBody = functionBody.replace(/^((<<)|(&lt;&lt;)|(:)|(&#58;))/, function (_full, _matched) {
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
	        _e.message += '\n Origin Source : {{' + _syntax + '}}';
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
	
	  }, {
	    key: '__getInterpretVar',
	    value: function __getInterpretVar(_varName, _externalGetterInterface, _defaultDataObject, _caller) {
	      var splited = _varName.split('@'); // CATEGORY@NAME:CASTING TYPE
	      var varCategory = splited[0];
	      var splitForTypeCast = (splited[1] || '').split(':');
	      var varName = splitForTypeCast[0];
	      var type = splitForTypeCast[1];
	      //console.log(varCategory, varName);
	
	      var data = void 0;
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
	        case 'ns':
	          // getNSData 메서드는 자신에게 없으면 상위 resolver의 NS데이터를 탐색한다.
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
	            throw new Error(varName + ' 변수 노드(<en:value>) 가 선언되지 않았습니다. <en:value name=\'' + varName + '\' ...></en:value>를 선언 해 주세요.');
	          }
	          break;
	        case 'val':
	          var valueScope = _externalGetterInterface.getScope(varName, 'value');
	
	          if (valueScope) {
	
	            try {
	              data = valueScope.shapeValue;
	            } catch (_e) {
	              throw _e;
	            }
	          } else {
	            throw new Error(varName + ' 변수 노드(<en:value>) 가 선언되지 않았습니다. <en:value name=\'' + varName + '\' ...></en:value>를 선언 해 주세요.');
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
	          var functionScope = _externalGetterInterface.getScope(varName, 'function');
	          if (functionScope) {
	            if (typeof functionScope.executableFunction === 'function') {
	              data = functionScope.executableFunction.bind(_caller);
	            } else {
	              throw new Error('유효하지 않은 Function 입니다. function scope 선언에서는 함수를 반환하여야 합니다.');
	            }
	          } else {
	            throw new Error(varName + ' Function을 찾을 수 없습니다.');
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
	            throw new Error('localStorage 의 \'' + varName + '\' item을 JSON Object로 변환 할 수 없습니다.');
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
	            throw new Error('sessionStorage 의 \'' + varName + '\' item을 JSON Object로 변환 할 수 없습니다.');
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
	  }, {
	    key: '__typeCast',
	    value: function __typeCast(_value, _type) {
	      switch (_type) {
	        case 'string':
	          return _TypeCaster2['default'].toString(_value);
	        case 'int':
	          return _TypeCaster2['default'].toInteger(_value);
	        case 'float':
	          return _TypeCaster2['default'].toFloat(_value);
	        case 'number':
	          return _TypeCaster2['default'].toNumber(_value);
	        case 'boolean':
	          return _TypeCaster2['default'].toBoolean(_value);
	        case 'object':
	          return _TypeCaster2['default'].toObject(_value);
	        case 'array':
	          return _TypeCaster2['default'].toArray(_value);
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
	
	  }, {
	    key: 'resolveWithHttpParam',
	    value: function resolveWithHttpParam(_description) {
	      var httpParamPairs = window.location.search.replace(/^\?/, '').split('&');
	      var httpParams = {};
	
	      // key value
	      var kv = void 0;
	      for (var i = 0; i < httpParamPairs.length; i++) {
	        kv = httpParamPairs[i].split('=');
	        //console.log(kv, _description);
	        if (kv[0] === _description) return kv[1];
	      }
	
	      return undefined;
	    }
	  }, {
	    key: 'resolveWithLocation',
	    value: function resolveWithLocation(_desc) {
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
	          throw new Error('지원하지 않는 카테고리의 제공자입니다. location@' + _desc);
	      }
	    }
	  }, {
	    key: 'resolveWithCookie',
	    value: function resolveWithCookie(_description) {
	      return _jsCookie2['default'].get(_description) || undefined;
	    }
	
	    /*
	      GetNSData
	      Parameters
	        0. pathWithNS : *ns/path/to/data or ns/path/to/data
	        Return
	        Took a data[String|Object] from path
	    */
	
	  }, {
	    key: 'getNSData',
	    value: function getNSData(_pathWithNS) {
	      var data = _ObjectExplorer2['default'].getValueByKeyPath(this.dataSpace, _pathWithNS.replace(/^\*/, ''));
	
	      if (!data) {
	        if (this.upperResolver !== null) data = this.upperResolver.getNSData(_pathWithNS);
	      }
	
	      return data || {};
	    }
	  }]);
	
	  return Resolver;
	}();
	
	exports['default'] = Resolver;

/***/ },

/***/ 34:
/*!********************************************!*\
  !*** ./client/src/js/util/ArrayHandler.js ***!
  \********************************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ArrayHandler = function () {
	  function ArrayHandler() {
	    _classCallCheck(this, ArrayHandler);
	  }
	
	  _createClass(ArrayHandler, null, [{
	    key: "findIndex",
	    value: function findIndex(_array, _criteria) {
	      var foundIndex = -1;
	
	      for (var i = 0; i < _array.length; i++) {
	        if (_criteria(_array[i])) {
	          foundIndex = i;
	          break;
	        }
	      }
	
	      return foundIndex;
	    }
	  }]);
	
	  return ArrayHandler;
	}();
	
	exports["default"] = ArrayHandler;

/***/ },

/***/ 35:
/*!**************************************!*\
  !*** ./~/js-cookie/src/js.cookie.js ***!
  \**************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * JavaScript Cookie v2.1.0
	 * https://github.com/js-cookie/js-cookie
	 *
	 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
	 * Released under the MIT license
	 */
	(function (factory) {
		if (true) {
			!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof exports === 'object') {
			module.exports = factory();
		} else {
			var _OldCookies = window.Cookies;
			var api = window.Cookies = factory();
			api.noConflict = function () {
				window.Cookies = _OldCookies;
				return api;
			};
		}
	}(function () {
		function extend () {
			var i = 0;
			var result = {};
			for (; i < arguments.length; i++) {
				var attributes = arguments[ i ];
				for (var key in attributes) {
					result[key] = attributes[key];
				}
			}
			return result;
		}
	
		function init (converter) {
			function api (key, value, attributes) {
				var result;
	
				// Write
	
				if (arguments.length > 1) {
					attributes = extend({
						path: '/'
					}, api.defaults, attributes);
	
					if (typeof attributes.expires === 'number') {
						var expires = new Date();
						expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
						attributes.expires = expires;
					}
	
					try {
						result = JSON.stringify(value);
						if (/^[\{\[]/.test(result)) {
							value = result;
						}
					} catch (e) {}
	
					if (!converter.write) {
						value = encodeURIComponent(String(value))
							.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
					} else {
						value = converter.write(value, key);
					}
	
					key = encodeURIComponent(String(key));
					key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
					key = key.replace(/[\(\)]/g, escape);
	
					return (document.cookie = [
						key, '=', value,
						attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE
						attributes.path    && '; path=' + attributes.path,
						attributes.domain  && '; domain=' + attributes.domain,
						attributes.secure ? '; secure' : ''
					].join(''));
				}
	
				// Read
	
				if (!key) {
					result = {};
				}
	
				// To prevent the for loop in the first place assign an empty array
				// in case there are no cookies at all. Also prevents odd result when
				// calling "get()"
				var cookies = document.cookie ? document.cookie.split('; ') : [];
				var rdecode = /(%[0-9A-Z]{2})+/g;
				var i = 0;
	
				for (; i < cookies.length; i++) {
					var parts = cookies[i].split('=');
					var name = parts[0].replace(rdecode, decodeURIComponent);
					var cookie = parts.slice(1).join('=');
	
					if (cookie.charAt(0) === '"') {
						cookie = cookie.slice(1, -1);
					}
	
					try {
						cookie = converter.read ?
							converter.read(cookie, name) : converter(cookie, name) ||
							cookie.replace(rdecode, decodeURIComponent);
	
						if (this.json) {
							try {
								cookie = JSON.parse(cookie);
							} catch (e) {}
						}
	
						if (key === name) {
							result = cookie;
							break;
						}
	
						if (!key) {
							result[name] = cookie;
						}
					} catch (e) {}
				}
	
				return result;
			}
	
			api.get = api.set = api;
			api.getJSON = function () {
				return api.apply({
					json: true
				}, [].slice.call(arguments));
			};
			api.defaults = {};
	
			api.remove = function (key, attributes) {
				api(key, '', extend(attributes, {
					expires: -1
				}));
			};
	
			api.withConverter = init;
	
			return api;
		}
	
		return init(function () {});
	}));


/***/ },

/***/ 36:
/*!************************************!*\
  !*** ./~/accounting/accounting.js ***!
  \************************************/
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * accounting.js v0.4.1
	 * Copyright 2014 Open Exchange Rates
	 *
	 * Freely distributable under the MIT license.
	 * Portions of accounting.js are inspired or borrowed from underscore.js
	 *
	 * Full details and documentation:
	 * http://openexchangerates.github.io/accounting.js/
	 */
	
	(function(root, undefined) {
	
		/* --- Setup --- */
	
		// Create the local library object, to be exported or referenced globally later
		var lib = {};
	
		// Current version
		lib.version = '0.4.1';
	
	
		/* --- Exposed settings --- */
	
		// The library's settings configuration object. Contains default parameters for
		// currency and number formatting
		lib.settings = {
			currency: {
				symbol : "$",		// default currency symbol is '$'
				format : "%s%v",	// controls output: %s = symbol, %v = value (can be object, see docs)
				decimal : ".",		// decimal point separator
				thousand : ",",		// thousands separator
				precision : 2,		// decimal places
				grouping : 3		// digit grouping (not implemented yet)
			},
			number: {
				precision : 0,		// default precision on numbers is 0
				grouping : 3,		// digit grouping (not implemented yet)
				thousand : ",",
				decimal : "."
			}
		};
	
	
		/* --- Internal Helper Methods --- */
	
		// Store reference to possibly-available ECMAScript 5 methods for later
		var nativeMap = Array.prototype.map,
			nativeIsArray = Array.isArray,
			toString = Object.prototype.toString;
	
		/**
		 * Tests whether supplied parameter is a string
		 * from underscore.js
		 */
		function isString(obj) {
			return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
		}
	
		/**
		 * Tests whether supplied parameter is a string
		 * from underscore.js, delegates to ECMA5's native Array.isArray
		 */
		function isArray(obj) {
			return nativeIsArray ? nativeIsArray(obj) : toString.call(obj) === '[object Array]';
		}
	
		/**
		 * Tests whether supplied parameter is a true object
		 */
		function isObject(obj) {
			return obj && toString.call(obj) === '[object Object]';
		}
	
		/**
		 * Extends an object with a defaults object, similar to underscore's _.defaults
		 *
		 * Used for abstracting parameter handling from API methods
		 */
		function defaults(object, defs) {
			var key;
			object = object || {};
			defs = defs || {};
			// Iterate over object non-prototype properties:
			for (key in defs) {
				if (defs.hasOwnProperty(key)) {
					// Replace values with defaults only if undefined (allow empty/zero values):
					if (object[key] == null) object[key] = defs[key];
				}
			}
			return object;
		}
	
		/**
		 * Implementation of `Array.map()` for iteration loops
		 *
		 * Returns a new Array as a result of calling `iterator` on each array value.
		 * Defers to native Array.map if available
		 */
		function map(obj, iterator, context) {
			var results = [], i, j;
	
			if (!obj) return results;
	
			// Use native .map method if it exists:
			if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
	
			// Fallback for native .map:
			for (i = 0, j = obj.length; i < j; i++ ) {
				results[i] = iterator.call(context, obj[i], i, obj);
			}
			return results;
		}
	
		/**
		 * Check and normalise the value of precision (must be positive integer)
		 */
		function checkPrecision(val, base) {
			val = Math.round(Math.abs(val));
			return isNaN(val)? base : val;
		}
	
	
		/**
		 * Parses a format string or object and returns format obj for use in rendering
		 *
		 * `format` is either a string with the default (positive) format, or object
		 * containing `pos` (required), `neg` and `zero` values (or a function returning
		 * either a string or object)
		 *
		 * Either string or format.pos must contain "%v" (value) to be valid
		 */
		function checkCurrencyFormat(format) {
			var defaults = lib.settings.currency.format;
	
			// Allow function as format parameter (should return string or object):
			if ( typeof format === "function" ) format = format();
	
			// Format can be a string, in which case `value` ("%v") must be present:
			if ( isString( format ) && format.match("%v") ) {
	
				// Create and return positive, negative and zero formats:
				return {
					pos : format,
					neg : format.replace("-", "").replace("%v", "-%v"),
					zero : format
				};
	
			// If no format, or object is missing valid positive value, use defaults:
			} else if ( !format || !format.pos || !format.pos.match("%v") ) {
	
				// If defaults is a string, casts it to an object for faster checking next time:
				return ( !isString( defaults ) ) ? defaults : lib.settings.currency.format = {
					pos : defaults,
					neg : defaults.replace("%v", "-%v"),
					zero : defaults
				};
	
			}
			// Otherwise, assume format was fine:
			return format;
		}
	
	
		/* --- API Methods --- */
	
		/**
		 * Takes a string/array of strings, removes all formatting/cruft and returns the raw float value
		 * Alias: `accounting.parse(string)`
		 *
		 * Decimal must be included in the regular expression to match floats (defaults to
		 * accounting.settings.number.decimal), so if the number uses a non-standard decimal 
		 * separator, provide it as the second argument.
		 *
		 * Also matches bracketed negatives (eg. "$ (1.99)" => -1.99)
		 *
		 * Doesn't throw any errors (`NaN`s become 0) but this may change in future
		 */
		var unformat = lib.unformat = lib.parse = function(value, decimal) {
			// Recursively unformat arrays:
			if (isArray(value)) {
				return map(value, function(val) {
					return unformat(val, decimal);
				});
			}
	
			// Fails silently (need decent errors):
			value = value || 0;
	
			// Return the value as-is if it's already a number:
			if (typeof value === "number") return value;
	
			// Default decimal point comes from settings, but could be set to eg. "," in opts:
			decimal = decimal || lib.settings.number.decimal;
	
			 // Build regex to strip out everything except digits, decimal point and minus sign:
			var regex = new RegExp("[^0-9-" + decimal + "]", ["g"]),
				unformatted = parseFloat(
					("" + value)
					.replace(/\((.*)\)/, "-$1") // replace bracketed values with negatives
					.replace(regex, '')         // strip out any cruft
					.replace(decimal, '.')      // make sure decimal point is standard
				);
	
			// This will fail silently which may cause trouble, let's wait and see:
			return !isNaN(unformatted) ? unformatted : 0;
		};
	
	
		/**
		 * Implementation of toFixed() that treats floats more like decimals
		 *
		 * Fixes binary rounding issues (eg. (0.615).toFixed(2) === "0.61") that present
		 * problems for accounting- and finance-related software.
		 */
		var toFixed = lib.toFixed = function(value, precision) {
			precision = checkPrecision(precision, lib.settings.number.precision);
			var power = Math.pow(10, precision);
	
			// Multiply up by precision, round accurately, then divide and use native toFixed():
			return (Math.round(lib.unformat(value) * power) / power).toFixed(precision);
		};
	
	
		/**
		 * Format a number, with comma-separated thousands and custom precision/decimal places
		 * Alias: `accounting.format()`
		 *
		 * Localise by overriding the precision and thousand / decimal separators
		 * 2nd parameter `precision` can be an object matching `settings.number`
		 */
		var formatNumber = lib.formatNumber = lib.format = function(number, precision, thousand, decimal) {
			// Resursively format arrays:
			if (isArray(number)) {
				return map(number, function(val) {
					return formatNumber(val, precision, thousand, decimal);
				});
			}
	
			// Clean up number:
			number = unformat(number);
	
			// Build options object from second param (if object) or all params, extending defaults:
			var opts = defaults(
					(isObject(precision) ? precision : {
						precision : precision,
						thousand : thousand,
						decimal : decimal
					}),
					lib.settings.number
				),
	
				// Clean up precision
				usePrecision = checkPrecision(opts.precision),
	
				// Do some calc:
				negative = number < 0 ? "-" : "",
				base = parseInt(toFixed(Math.abs(number || 0), usePrecision), 10) + "",
				mod = base.length > 3 ? base.length % 3 : 0;
	
			// Format the number:
			return negative + (mod ? base.substr(0, mod) + opts.thousand : "") + base.substr(mod).replace(/(\d{3})(?=\d)/g, "$1" + opts.thousand) + (usePrecision ? opts.decimal + toFixed(Math.abs(number), usePrecision).split('.')[1] : "");
		};
	
	
		/**
		 * Format a number into currency
		 *
		 * Usage: accounting.formatMoney(number, symbol, precision, thousandsSep, decimalSep, format)
		 * defaults: (0, "$", 2, ",", ".", "%s%v")
		 *
		 * Localise by overriding the symbol, precision, thousand / decimal separators and format
		 * Second param can be an object matching `settings.currency` which is the easiest way.
		 *
		 * To do: tidy up the parameters
		 */
		var formatMoney = lib.formatMoney = function(number, symbol, precision, thousand, decimal, format) {
			// Resursively format arrays:
			if (isArray(number)) {
				return map(number, function(val){
					return formatMoney(val, symbol, precision, thousand, decimal, format);
				});
			}
	
			// Clean up number:
			number = unformat(number);
	
			// Build options object from second param (if object) or all params, extending defaults:
			var opts = defaults(
					(isObject(symbol) ? symbol : {
						symbol : symbol,
						precision : precision,
						thousand : thousand,
						decimal : decimal,
						format : format
					}),
					lib.settings.currency
				),
	
				// Check format (returns object with pos, neg and zero):
				formats = checkCurrencyFormat(opts.format),
	
				// Choose which format to use for this value:
				useFormat = number > 0 ? formats.pos : number < 0 ? formats.neg : formats.zero;
	
			// Return with currency symbol added:
			return useFormat.replace('%s', opts.symbol).replace('%v', formatNumber(Math.abs(number), checkPrecision(opts.precision), opts.thousand, opts.decimal));
		};
	
	
		/**
		 * Format a list of numbers into an accounting column, padding with whitespace
		 * to line up currency symbols, thousand separators and decimals places
		 *
		 * List should be an array of numbers
		 * Second parameter can be an object containing keys that match the params
		 *
		 * Returns array of accouting-formatted number strings of same length
		 *
		 * NB: `white-space:pre` CSS rule is required on the list container to prevent
		 * browsers from collapsing the whitespace in the output strings.
		 */
		lib.formatColumn = function(list, symbol, precision, thousand, decimal, format) {
			if (!list) return [];
	
			// Build options object from second param (if object) or all params, extending defaults:
			var opts = defaults(
					(isObject(symbol) ? symbol : {
						symbol : symbol,
						precision : precision,
						thousand : thousand,
						decimal : decimal,
						format : format
					}),
					lib.settings.currency
				),
	
				// Check format (returns object with pos, neg and zero), only need pos for now:
				formats = checkCurrencyFormat(opts.format),
	
				// Whether to pad at start of string or after currency symbol:
				padAfterSymbol = formats.pos.indexOf("%s") < formats.pos.indexOf("%v") ? true : false,
	
				// Store value for the length of the longest string in the column:
				maxLength = 0,
	
				// Format the list according to options, store the length of the longest string:
				formatted = map(list, function(val, i) {
					if (isArray(val)) {
						// Recursively format columns if list is a multi-dimensional array:
						return lib.formatColumn(val, opts);
					} else {
						// Clean up the value
						val = unformat(val);
	
						// Choose which format to use for this value (pos, neg or zero):
						var useFormat = val > 0 ? formats.pos : val < 0 ? formats.neg : formats.zero,
	
							// Format this value, push into formatted list and save the length:
							fVal = useFormat.replace('%s', opts.symbol).replace('%v', formatNumber(Math.abs(val), checkPrecision(opts.precision), opts.thousand, opts.decimal));
	
						if (fVal.length > maxLength) maxLength = fVal.length;
						return fVal;
					}
				});
	
			// Pad each number in the list and send back the column of numbers:
			return map(formatted, function(val, i) {
				// Only if this is a string (not a nested array, which would have already been padded):
				if (isString(val) && val.length < maxLength) {
					// Depending on symbol position, pad after symbol or at index 0:
					return padAfterSymbol ? val.replace(opts.symbol, opts.symbol+(new Array(maxLength - val.length + 1).join(" "))) : (new Array(maxLength - val.length + 1).join(" ")) + val;
				}
				return val;
			});
		};
	
	
		/* --- Module Definition --- */
	
		// Export accounting for CommonJS. If being loaded as an AMD module, define it as such.
		// Otherwise, just add `accounting` to the global object
		if (true) {
			if (typeof module !== 'undefined' && module.exports) {
				exports = module.exports = lib;
			}
			exports.accounting = lib;
		} else if (typeof define === 'function' && define.amd) {
			// Return the library as an AMD module:
			define([], function() {
				return lib;
			});
		} else {
			// Use accounting.noConflict to restore `accounting` back to its original value.
			// Returns a reference to the library's `accounting` object;
			// e.g. `var numbers = accounting.noConflict();`
			lib.noConflict = (function(oldAccounting) {
				return function() {
					// Reset the value of the root's `accounting` variable:
					root.accounting = oldAccounting;
					// Delete the noConflict method:
					lib.noConflict = undefined;
					// Return reference to the library to re-assign it:
					return lib;
				};
			})(root.accounting);
	
			// Declare `fx` on the root (global/window) object:
			root['accounting'] = lib;
		}
	
		// Root will be `window` in browser or `global` on the server:
	}(this));


/***/ },

/***/ 37:
/*!************************************************************!*\
  !*** ./client/src/js/serviceCrew/DataResolver/Shortcut.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _DateDistance = __webpack_require__(/*! ../Builtins/Classes/DateDistance */ 38);
	
	var _DateDistance2 = _interopRequireDefault(_DateDistance);
	
	var _Date = __webpack_require__(/*! ../Builtins/Classes/Date2 */ 39);
	
	var _Date2 = _interopRequireDefault(_Date);
	
	var _ArrayHandler = __webpack_require__(/*! ../../util/ArrayHandler */ 34);
	
	var _ArrayHandler2 = _interopRequireDefault(_ArrayHandler);
	
	var _ObjectExplorer = __webpack_require__(/*! ../../util/ObjectExplorer */ 32);
	
	var _ObjectExplorer2 = _interopRequireDefault(_ObjectExplorer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var DAY_MAP = {
	  'ko': ['월', '화', '수', '목', '금', '토', '일'],
	  'en': ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', "Sat", 'Sun']
	};
	
	var MONTH_MAP = {
	  'ko': [],
	  'en': []
	};
	
	var Shortcut = function () {
	  function Shortcut() {
	    _classCallCheck(this, Shortcut);
	  }
	
	  _createClass(Shortcut, [{
	    key: 'isEmptyOrVoid',
	    value: function isEmptyOrVoid(_object) {
	      if (_object) {
	        return Shortcut.isEmpty(_object);
	      } else {
	        return true;
	      }
	    }
	
	    // 비어있지 않은 오브젝트인지 검사
	
	  }], [{
	    key: 'if_then',
	
	
	    // 삼항연산 메서드
	    // _boolean 에 참 또는 거짓이 입력 되었을 때 참인 값 또는 거짓 값을 반환함
	    value: function if_then(_boolean, _true, _false) {
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
	
	  }, {
	    key: 'dateFormatter',
	    value: function dateFormatter(_dateString, _format, _lang) {
	
	      var dateObject = void 0;
	      if (typeof _dateString === 'number') {
	        dateObject = new Date(_dateString);
	      } else if (typeof _dateString === 'string') {
	        dateObject = new Date(Shortcut.reviseDateString(_dateString));
	      } else {
	        throw new Error("인식할 수 없는 Date 입력 타입 입니다.");
	      }
	
	      return _format.replace(/(YYYY|YY|MM|DD|dd|hh|mm|ss)/g, function (_matched, _chars) {
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
	  }, {
	    key: 'dateShift',
	    value: function dateShift(_from, _to, _format) {}
	  }, {
	    key: 'reviseDateString',
	    value: function reviseDateString(_dateString) {
	      return _dateString.replace(/^(\d{4})(\d{2})(\d{2}) (\d{2})(\d{2})(\d{2})$/, function (_matched, _y, _m, _d, _h, _min, _s) {
	        return _y + '/' + _m + '/' + _d + ' ' + _h + ':' + _min + ':' + _s;
	      });
	    }
	  }, {
	    key: 'dayConverter',
	    value: function dayConverter(_dayNumber, _lang) {
	      var lang = _lang || 'en';
	
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
	  }, {
	    key: 'zeroPadding',
	    value: function zeroPadding(_number, _limit) {
	      var str = String(_number);
	      var length = str.length;
	      var addC = _limit - length;
	
	      for (var i = 0; i < addC; i++) {
	        str = '0' + str;
	      }
	
	      return str;
	    }
	  }, {
	    key: 'findIndex',
	    value: function findIndex(_array, _value) {
	      return _ArrayHandler2['default'].findIndex(_array, function (_v) {
	        return _v === _value;
	      });
	    }
	  }, {
	    key: 'filter',
	    value: function filter(_value) {}
	
	    // 비어있는 Object인지 검사 key 가 0개면 빈 오브젝트임
	
	  }, {
	    key: 'isEmpty',
	    value: function isEmpty(_object) {
	
	      var keys = Object.keys(_object);
	
	      return keys.length === 0;
	    }
	  }, {
	    key: 'isntEmpty',
	    value: function isntEmpty(_object) {
	      var length = void 0;
	
	      if (_object instanceof Array) {
	
	        length = _object.length;
	      } else if (_object instanceof Object) {
	        var keys = Object.keys(_object);
	
	        length = keys.length;
	      } else {
	
	        return false;
	      }
	
	      return length > 0;
	    }
	  }, {
	    key: 'get',
	    value: function get(_obj, _path) {
	      return _ObjectExplorer2['default'].getValueByKeyPath(_obj, _path, '.');
	    }
	  }, {
	    key: 'object2paramstr',
	    value: function object2paramstr(_obj) {
	      var keys = Object.keys(_obj);
	
	      var paramArr = keys.map(function (_key) {
	        return _key + "=" + _obj[_key];
	      });
	
	      return paramArr.join('&');
	    }
	  }, {
	    key: 'dateDistance',
	    get: function get() {
	      return _DateDistance2['default'];
	    }
	  }, {
	    key: 'Date',
	    get: function get() {
	      return _Date2['default'];
	    }
	  }]);
	
	  return Shortcut;
	}();
	
	exports['default'] = Shortcut;

/***/ },

/***/ 38:
/*!********************************************************************!*\
  !*** ./client/src/js/serviceCrew/Builtins/Classes/DateDistance.js ***!
  \********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Shortcut = __webpack_require__(/*! ../../DataResolver/Shortcut */ 37);
	
	var _Shortcut2 = _interopRequireDefault(_Shortcut);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var DateDistance = function () {
	
	  // 받을 수 있는 포맷
	  // timestamp(number, string) , DateObject, Date string
	
	  function DateDistance(_from, _to) {
	    _classCallCheck(this, DateDistance);
	
	    this.fromStamp = DateDistance.toTimestamp(_from);
	    this.toStamp = DateDistance.toTimestamp(_to);
	
	    this.deviation = this.toStamp - this.fromStamp;
	
	    this.seconds = this.deviation / 1000;
	    this.mins = this.seconds / 60;
	    this.hours = this.mins / 60;
	    this.dates = this.hours / 24;
	    this.months = this.dates / 30;
	    this.years = this.months / 365;
	  }
	
	  _createClass(DateDistance, [{
	    key: 'byHours',
	    value: function byHours(_abs) {
	      return _abs ? Math.abs(this.hours) : this.hours;
	    }
	  }, {
	    key: 'byDates',
	    value: function byDates(_abs) {
	      return _abs ? Math.abs(this.dates) : this.dates;
	    }
	  }, {
	    key: 'byMonths',
	    value: function byMonths(_abs) {
	      return _abs ? Math.abs(this.months) : this.months;
	    }
	  }, {
	    key: 'byYears',
	    value: function byYears(_abs) {
	      return _abs ? Math.abs(this.years) : this.years;
	    }
	  }], [{
	    key: 'toTimestamp',
	    value: function toTimestamp(_dateMean) {
	      if (typeof _dateMean === 'string') {
	        if (/^\d+$/.test(_dateMean)) {
	          return parseInt(_dateMean);
	        } else {
	          return new Date(_Shortcut2['default'].reviseDateString(_dateMean)).getTime();
	        }
	      } else if (typeof _dateMean === 'number') {
	        return _dateMean;
	      } else if ((typeof _dateMean === 'undefined' ? 'undefined' : _typeof(_dateMean)) === 'object') {
	        if (_dateMean !== null && _dateMean !== undefined) return _dateMean.getTime();
	      }
	    }
	  }]);
	
	  return DateDistance;
	}();
	
	exports['default'] = DateDistance;

/***/ },

/***/ 39:
/*!*************************************************************!*\
  !*** ./client/src/js/serviceCrew/Builtins/Classes/Date2.js ***!
  \*************************************************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Date2 = function () {
	  function Date2(_date) {
	    _classCallCheck(this, Date2);
	
	    if (_date !== undefined) this.date = new Date(_date);else this.date = new Date();
	  }
	
	  _createClass(Date2, [{
	    key: "getDateAtDayNextWeek",
	    value: function getDateAtDayNextWeek(_dayNumber) {
	      var todayNumber = this.date.getDay();
	      var remainUntilNextSun = 7 - todayNumber;
	      var remainDayNextWeak = remainUntilNextSun + _dayNumber;
	
	      return new Date(this.date.getTime() + 1000 * 60 * 60 * 24 * remainDayNextWeak);
	    }
	  }]);
	
	  return Date2;
	}();
	
	exports["default"] = Date2;

/***/ },

/***/ 40:
/*!******************************************!*\
  !*** ./client/src/js/util/TypeCaster.js ***!
  \******************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var TypeCaster = function () {
	  function TypeCaster() {
	    _classCallCheck(this, TypeCaster);
	  }
	
	  _createClass(TypeCaster, null, [{
	    key: 'toInteger',
	
	
	    // Read With Type Casting
	    value: function toInteger(_v) {
	      return parseInt(_v);
	    }
	  }, {
	    key: 'toFloat',
	    value: function toFloat(_v) {
	      return parseFloat(_v);
	    }
	  }, {
	    key: 'toNumber',
	    value: function toNumber(_v) {
	      return Number(_v);
	    }
	  }, {
	    key: 'toString',
	    value: function toString(_v) {
	      var type = typeof _v === 'undefined' ? 'undefined' : _typeof(_v);
	      if (type === 'string') {
	        return _v;
	      }
	
	      if (type === 'object') {
	        return JSON.stringify(_v);
	      }
	
	      return String(_v);
	    }
	  }, {
	    key: 'toBoolean',
	    value: function toBoolean(_v) {
	      if (_v === 'false') return false;
	
	      if (_v === 'true' || _v) {
	        return true;
	      }
	
	      return false;
	    }
	  }, {
	    key: 'toObject',
	    value: function toObject(_v) {
	      if (typeof _v === 'string') {
	        return JSON.parse(_v);
	      }
	
	      throw new Error("String 이 아닌 타입은 Object로 변환 할 수 없습니다.");
	    }
	  }, {
	    key: 'toArray',
	    value: function toArray(_v) {
	      if (typeof _v === 'string') {
	        return JSON.parse(_v);
	      }
	
	      throw new Error("String 이 아닌 타입은 Array로 변환 할 수 없습니다.");
	    }
	  }]);
	
	  return TypeCaster;
	}();
	
	exports['default'] = TypeCaster;

/***/ },

/***/ 42:
/*!**********************************************!*\
  !*** ./client/src/js/util/BrowserStorage.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _TypeCaster = __webpack_require__(/*! ./TypeCaster */ 40);
	
	var _TypeCaster2 = _interopRequireDefault(_TypeCaster);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ITEM_DTYPE_PREFIX = 'o_type_';
	var DATA_PREFIX = 'o_data_';
	
	var BrowserStorage = function () {
	  function BrowserStorage() {
	    _classCallCheck(this, BrowserStorage);
	  }
	
	  _createClass(BrowserStorage, null, [{
	    key: 'setLocal',
	    value: function setLocal(_key, _data) {
	      BrowserStorage.setItem(_key, _data, 'local');
	    }
	  }, {
	    key: 'getLocal',
	    value: function getLocal(_key) {
	      return BrowserStorage.getItem(_key, 'local');
	    }
	  }, {
	    key: 'removeLocal',
	    value: function removeLocal(_key) {
	      BrowserStorage.removeItem(_key, 'local');
	    }
	  }, {
	    key: 'setSession',
	    value: function setSession(_key, _data) {
	      BrowserStorage.setItem(_key, _data, 'session');
	    }
	  }, {
	    key: 'getSession',
	    value: function getSession(_key) {
	      return BrowserStorage.getItem(_key, 'session');
	    }
	  }, {
	    key: 'removeSession',
	    value: function removeSession(_key) {
	      BrowserStorage.removeItem(_key, 'session');
	    }
	  }, {
	    key: 'setItem',
	    value: function setItem(_key, _data, _storage) {
	      var storage = BrowserStorage.storage(_storage);
	      // let dataType = typeof _data;
	      var key = _key;
	      var stringData = JSON.stringify(_data);
	
	      try {
	        storage.setItem(key, stringData);
	      } catch (_e) {
	        storage.removeItem(key);
	        throw _e;
	      }
	    }
	  }, {
	    key: 'getItem',
	    value: function getItem(_key, _storage) {
	      var storage = BrowserStorage.storage(_storage);
	      var key = _key;
	      var stringItem = storage.getItem(key);
	
	      if (stringItem) {
	        return JSON.parse(stringItem);
	      } else {
	        return null;
	      }
	    }
	  }, {
	    key: 'removeItem',
	    value: function removeItem(_key, _storage) {
	      var storage = BrowserStorage.storage(_storage);
	      var key = _key;
	      storage.removeItem(_key);
	    }
	  }, {
	    key: 'storage',
	    value: function storage(_storageType) {
	      if (_storageType === 'session') {
	        return sessionStorage;
	      } else if (_storageType === 'local') {
	        return localStorage;
	      }
	    }
	  }, {
	    key: 'getTypeOfItem',
	    value: function getTypeOfItem(_itemKey, _storageType) {
	      var storage = BrowserStorage.storage(_storage);
	
	      return storage.getItem(ITEM_DTYPE_PREFIX + '_' + _itemKey);
	    }
	  }, {
	    key: 'setTypeOfItem',
	    value: function setTypeOfItem(_itemKey, _type, _source) {
	      var storage = BrowserStorage.storage(_storage);
	
	      storage.set(ITEM_DTYPE_PREFIX + '_' + _itemKey, _type);
	    }
	  }]);
	
	  return BrowserStorage;
	}();
	
	window.BrowserStorage = BrowserStorage;
	exports['default'] = BrowserStorage;

/***/ },

/***/ 47:
/*!******************************!*\
  !*** ./~/async/lib/async.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global, setImmediate, process) {/*!
	 * async
	 * https://github.com/caolan/async
	 *
	 * Copyright 2010-2014 Caolan McMahon
	 * Released under the MIT license
	 */
	(function () {
	
	    var async = {};
	    function noop() {}
	    function identity(v) {
	        return v;
	    }
	    function toBool(v) {
	        return !!v;
	    }
	    function notId(v) {
	        return !v;
	    }
	
	    // global on the server, window in the browser
	    var previous_async;
	
	    // Establish the root object, `window` (`self`) in the browser, `global`
	    // on the server, or `this` in some virtual machines. We use `self`
	    // instead of `window` for `WebWorker` support.
	    var root = typeof self === 'object' && self.self === self && self ||
	            typeof global === 'object' && global.global === global && global ||
	            this;
	
	    if (root != null) {
	        previous_async = root.async;
	    }
	
	    async.noConflict = function () {
	        root.async = previous_async;
	        return async;
	    };
	
	    function only_once(fn) {
	        return function() {
	            if (fn === null) throw new Error("Callback was already called.");
	            fn.apply(this, arguments);
	            fn = null;
	        };
	    }
	
	    function _once(fn) {
	        return function() {
	            if (fn === null) return;
	            fn.apply(this, arguments);
	            fn = null;
	        };
	    }
	
	    //// cross-browser compatiblity functions ////
	
	    var _toString = Object.prototype.toString;
	
	    var _isArray = Array.isArray || function (obj) {
	        return _toString.call(obj) === '[object Array]';
	    };
	
	    // Ported from underscore.js isObject
	    var _isObject = function(obj) {
	        var type = typeof obj;
	        return type === 'function' || type === 'object' && !!obj;
	    };
	
	    function _isArrayLike(arr) {
	        return _isArray(arr) || (
	            // has a positive integer length property
	            typeof arr.length === "number" &&
	            arr.length >= 0 &&
	            arr.length % 1 === 0
	        );
	    }
	
	    function _arrayEach(arr, iterator) {
	        var index = -1,
	            length = arr.length;
	
	        while (++index < length) {
	            iterator(arr[index], index, arr);
	        }
	    }
	
	    function _map(arr, iterator) {
	        var index = -1,
	            length = arr.length,
	            result = Array(length);
	
	        while (++index < length) {
	            result[index] = iterator(arr[index], index, arr);
	        }
	        return result;
	    }
	
	    function _range(count) {
	        return _map(Array(count), function (v, i) { return i; });
	    }
	
	    function _reduce(arr, iterator, memo) {
	        _arrayEach(arr, function (x, i, a) {
	            memo = iterator(memo, x, i, a);
	        });
	        return memo;
	    }
	
	    function _forEachOf(object, iterator) {
	        _arrayEach(_keys(object), function (key) {
	            iterator(object[key], key);
	        });
	    }
	
	    function _indexOf(arr, item) {
	        for (var i = 0; i < arr.length; i++) {
	            if (arr[i] === item) return i;
	        }
	        return -1;
	    }
	
	    var _keys = Object.keys || function (obj) {
	        var keys = [];
	        for (var k in obj) {
	            if (obj.hasOwnProperty(k)) {
	                keys.push(k);
	            }
	        }
	        return keys;
	    };
	
	    function _keyIterator(coll) {
	        var i = -1;
	        var len;
	        var keys;
	        if (_isArrayLike(coll)) {
	            len = coll.length;
	            return function next() {
	                i++;
	                return i < len ? i : null;
	            };
	        } else {
	            keys = _keys(coll);
	            len = keys.length;
	            return function next() {
	                i++;
	                return i < len ? keys[i] : null;
	            };
	        }
	    }
	
	    // Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
	    // This accumulates the arguments passed into an array, after a given index.
	    // From underscore.js (https://github.com/jashkenas/underscore/pull/2140).
	    function _restParam(func, startIndex) {
	        startIndex = startIndex == null ? func.length - 1 : +startIndex;
	        return function() {
	            var length = Math.max(arguments.length - startIndex, 0);
	            var rest = Array(length);
	            for (var index = 0; index < length; index++) {
	                rest[index] = arguments[index + startIndex];
	            }
	            switch (startIndex) {
	                case 0: return func.call(this, rest);
	                case 1: return func.call(this, arguments[0], rest);
	            }
	            // Currently unused but handle cases outside of the switch statement:
	            // var args = Array(startIndex + 1);
	            // for (index = 0; index < startIndex; index++) {
	            //     args[index] = arguments[index];
	            // }
	            // args[startIndex] = rest;
	            // return func.apply(this, args);
	        };
	    }
	
	    function _withoutIndex(iterator) {
	        return function (value, index, callback) {
	            return iterator(value, callback);
	        };
	    }
	
	    //// exported async module functions ////
	
	    //// nextTick implementation with browser-compatible fallback ////
	
	    // capture the global reference to guard against fakeTimer mocks
	    var _setImmediate = typeof setImmediate === 'function' && setImmediate;
	
	    var _delay = _setImmediate ? function(fn) {
	        // not a direct alias for IE10 compatibility
	        _setImmediate(fn);
	    } : function(fn) {
	        setTimeout(fn, 0);
	    };
	
	    if (typeof process === 'object' && typeof process.nextTick === 'function') {
	        async.nextTick = process.nextTick;
	    } else {
	        async.nextTick = _delay;
	    }
	    async.setImmediate = _setImmediate ? _delay : async.nextTick;
	
	
	    async.forEach =
	    async.each = function (arr, iterator, callback) {
	        return async.eachOf(arr, _withoutIndex(iterator), callback);
	    };
	
	    async.forEachSeries =
	    async.eachSeries = function (arr, iterator, callback) {
	        return async.eachOfSeries(arr, _withoutIndex(iterator), callback);
	    };
	
	
	    async.forEachLimit =
	    async.eachLimit = function (arr, limit, iterator, callback) {
	        return _eachOfLimit(limit)(arr, _withoutIndex(iterator), callback);
	    };
	
	    async.forEachOf =
	    async.eachOf = function (object, iterator, callback) {
	        callback = _once(callback || noop);
	        object = object || [];
	
	        var iter = _keyIterator(object);
	        var key, completed = 0;
	
	        while ((key = iter()) != null) {
	            completed += 1;
	            iterator(object[key], key, only_once(done));
	        }
	
	        if (completed === 0) callback(null);
	
	        function done(err) {
	            completed--;
	            if (err) {
	                callback(err);
	            }
	            // Check key is null in case iterator isn't exhausted
	            // and done resolved synchronously.
	            else if (key === null && completed <= 0) {
	                callback(null);
	            }
	        }
	    };
	
	    async.forEachOfSeries =
	    async.eachOfSeries = function (obj, iterator, callback) {
	        callback = _once(callback || noop);
	        obj = obj || [];
	        var nextKey = _keyIterator(obj);
	        var key = nextKey();
	        function iterate() {
	            var sync = true;
	            if (key === null) {
	                return callback(null);
	            }
	            iterator(obj[key], key, only_once(function (err) {
	                if (err) {
	                    callback(err);
	                }
	                else {
	                    key = nextKey();
	                    if (key === null) {
	                        return callback(null);
	                    } else {
	                        if (sync) {
	                            async.setImmediate(iterate);
	                        } else {
	                            iterate();
	                        }
	                    }
	                }
	            }));
	            sync = false;
	        }
	        iterate();
	    };
	
	
	
	    async.forEachOfLimit =
	    async.eachOfLimit = function (obj, limit, iterator, callback) {
	        _eachOfLimit(limit)(obj, iterator, callback);
	    };
	
	    function _eachOfLimit(limit) {
	
	        return function (obj, iterator, callback) {
	            callback = _once(callback || noop);
	            obj = obj || [];
	            var nextKey = _keyIterator(obj);
	            if (limit <= 0) {
	                return callback(null);
	            }
	            var done = false;
	            var running = 0;
	            var errored = false;
	
	            (function replenish () {
	                if (done && running <= 0) {
	                    return callback(null);
	                }
	
	                while (running < limit && !errored) {
	                    var key = nextKey();
	                    if (key === null) {
	                        done = true;
	                        if (running <= 0) {
	                            callback(null);
	                        }
	                        return;
	                    }
	                    running += 1;
	                    iterator(obj[key], key, only_once(function (err) {
	                        running -= 1;
	                        if (err) {
	                            callback(err);
	                            errored = true;
	                        }
	                        else {
	                            replenish();
	                        }
	                    }));
	                }
	            })();
	        };
	    }
	
	
	    function doParallel(fn) {
	        return function (obj, iterator, callback) {
	            return fn(async.eachOf, obj, iterator, callback);
	        };
	    }
	    function doParallelLimit(fn) {
	        return function (obj, limit, iterator, callback) {
	            return fn(_eachOfLimit(limit), obj, iterator, callback);
	        };
	    }
	    function doSeries(fn) {
	        return function (obj, iterator, callback) {
	            return fn(async.eachOfSeries, obj, iterator, callback);
	        };
	    }
	
	    function _asyncMap(eachfn, arr, iterator, callback) {
	        callback = _once(callback || noop);
	        arr = arr || [];
	        var results = _isArrayLike(arr) ? [] : {};
	        eachfn(arr, function (value, index, callback) {
	            iterator(value, function (err, v) {
	                results[index] = v;
	                callback(err);
	            });
	        }, function (err) {
	            callback(err, results);
	        });
	    }
	
	    async.map = doParallel(_asyncMap);
	    async.mapSeries = doSeries(_asyncMap);
	    async.mapLimit = doParallelLimit(_asyncMap);
	
	    // reduce only has a series version, as doing reduce in parallel won't
	    // work in many situations.
	    async.inject =
	    async.foldl =
	    async.reduce = function (arr, memo, iterator, callback) {
	        async.eachOfSeries(arr, function (x, i, callback) {
	            iterator(memo, x, function (err, v) {
	                memo = v;
	                callback(err);
	            });
	        }, function (err) {
	            callback(err, memo);
	        });
	    };
	
	    async.foldr =
	    async.reduceRight = function (arr, memo, iterator, callback) {
	        var reversed = _map(arr, identity).reverse();
	        async.reduce(reversed, memo, iterator, callback);
	    };
	
	    async.transform = function (arr, memo, iterator, callback) {
	        if (arguments.length === 3) {
	            callback = iterator;
	            iterator = memo;
	            memo = _isArray(arr) ? [] : {};
	        }
	
	        async.eachOf(arr, function(v, k, cb) {
	            iterator(memo, v, k, cb);
	        }, function(err) {
	            callback(err, memo);
	        });
	    };
	
	    function _filter(eachfn, arr, iterator, callback) {
	        var results = [];
	        eachfn(arr, function (x, index, callback) {
	            iterator(x, function (v) {
	                if (v) {
	                    results.push({index: index, value: x});
	                }
	                callback();
	            });
	        }, function () {
	            callback(_map(results.sort(function (a, b) {
	                return a.index - b.index;
	            }), function (x) {
	                return x.value;
	            }));
	        });
	    }
	
	    async.select =
	    async.filter = doParallel(_filter);
	
	    async.selectLimit =
	    async.filterLimit = doParallelLimit(_filter);
	
	    async.selectSeries =
	    async.filterSeries = doSeries(_filter);
	
	    function _reject(eachfn, arr, iterator, callback) {
	        _filter(eachfn, arr, function(value, cb) {
	            iterator(value, function(v) {
	                cb(!v);
	            });
	        }, callback);
	    }
	    async.reject = doParallel(_reject);
	    async.rejectLimit = doParallelLimit(_reject);
	    async.rejectSeries = doSeries(_reject);
	
	    function _createTester(eachfn, check, getResult) {
	        return function(arr, limit, iterator, cb) {
	            function done() {
	                if (cb) cb(getResult(false, void 0));
	            }
	            function iteratee(x, _, callback) {
	                if (!cb) return callback();
	                iterator(x, function (v) {
	                    if (cb && check(v)) {
	                        cb(getResult(true, x));
	                        cb = iterator = false;
	                    }
	                    callback();
	                });
	            }
	            if (arguments.length > 3) {
	                eachfn(arr, limit, iteratee, done);
	            } else {
	                cb = iterator;
	                iterator = limit;
	                eachfn(arr, iteratee, done);
	            }
	        };
	    }
	
	    async.any =
	    async.some = _createTester(async.eachOf, toBool, identity);
	
	    async.someLimit = _createTester(async.eachOfLimit, toBool, identity);
	
	    async.all =
	    async.every = _createTester(async.eachOf, notId, notId);
	
	    async.everyLimit = _createTester(async.eachOfLimit, notId, notId);
	
	    function _findGetResult(v, x) {
	        return x;
	    }
	    async.detect = _createTester(async.eachOf, identity, _findGetResult);
	    async.detectSeries = _createTester(async.eachOfSeries, identity, _findGetResult);
	    async.detectLimit = _createTester(async.eachOfLimit, identity, _findGetResult);
	
	    async.sortBy = function (arr, iterator, callback) {
	        async.map(arr, function (x, callback) {
	            iterator(x, function (err, criteria) {
	                if (err) {
	                    callback(err);
	                }
	                else {
	                    callback(null, {value: x, criteria: criteria});
	                }
	            });
	        }, function (err, results) {
	            if (err) {
	                return callback(err);
	            }
	            else {
	                callback(null, _map(results.sort(comparator), function (x) {
	                    return x.value;
	                }));
	            }
	
	        });
	
	        function comparator(left, right) {
	            var a = left.criteria, b = right.criteria;
	            return a < b ? -1 : a > b ? 1 : 0;
	        }
	    };
	
	    async.auto = function (tasks, concurrency, callback) {
	        if (typeof arguments[1] === 'function') {
	            // concurrency is optional, shift the args.
	            callback = concurrency;
	            concurrency = null;
	        }
	        callback = _once(callback || noop);
	        var keys = _keys(tasks);
	        var remainingTasks = keys.length;
	        if (!remainingTasks) {
	            return callback(null);
	        }
	        if (!concurrency) {
	            concurrency = remainingTasks;
	        }
	
	        var results = {};
	        var runningTasks = 0;
	
	        var hasError = false;
	
	        var listeners = [];
	        function addListener(fn) {
	            listeners.unshift(fn);
	        }
	        function removeListener(fn) {
	            var idx = _indexOf(listeners, fn);
	            if (idx >= 0) listeners.splice(idx, 1);
	        }
	        function taskComplete() {
	            remainingTasks--;
	            _arrayEach(listeners.slice(0), function (fn) {
	                fn();
	            });
	        }
	
	        addListener(function () {
	            if (!remainingTasks) {
	                callback(null, results);
	            }
	        });
	
	        _arrayEach(keys, function (k) {
	            if (hasError) return;
	            var task = _isArray(tasks[k]) ? tasks[k]: [tasks[k]];
	            var taskCallback = _restParam(function(err, args) {
	                runningTasks--;
	                if (args.length <= 1) {
	                    args = args[0];
	                }
	                if (err) {
	                    var safeResults = {};
	                    _forEachOf(results, function(val, rkey) {
	                        safeResults[rkey] = val;
	                    });
	                    safeResults[k] = args;
	                    hasError = true;
	
	                    callback(err, safeResults);
	                }
	                else {
	                    results[k] = args;
	                    async.setImmediate(taskComplete);
	                }
	            });
	            var requires = task.slice(0, task.length - 1);
	            // prevent dead-locks
	            var len = requires.length;
	            var dep;
	            while (len--) {
	                if (!(dep = tasks[requires[len]])) {
	                    throw new Error('Has nonexistent dependency in ' + requires.join(', '));
	                }
	                if (_isArray(dep) && _indexOf(dep, k) >= 0) {
	                    throw new Error('Has cyclic dependencies');
	                }
	            }
	            function ready() {
	                return runningTasks < concurrency && _reduce(requires, function (a, x) {
	                    return (a && results.hasOwnProperty(x));
	                }, true) && !results.hasOwnProperty(k);
	            }
	            if (ready()) {
	                runningTasks++;
	                task[task.length - 1](taskCallback, results);
	            }
	            else {
	                addListener(listener);
	            }
	            function listener() {
	                if (ready()) {
	                    runningTasks++;
	                    removeListener(listener);
	                    task[task.length - 1](taskCallback, results);
	                }
	            }
	        });
	    };
	
	
	
	    async.retry = function(times, task, callback) {
	        var DEFAULT_TIMES = 5;
	        var DEFAULT_INTERVAL = 0;
	
	        var attempts = [];
	
	        var opts = {
	            times: DEFAULT_TIMES,
	            interval: DEFAULT_INTERVAL
	        };
	
	        function parseTimes(acc, t){
	            if(typeof t === 'number'){
	                acc.times = parseInt(t, 10) || DEFAULT_TIMES;
	            } else if(typeof t === 'object'){
	                acc.times = parseInt(t.times, 10) || DEFAULT_TIMES;
	                acc.interval = parseInt(t.interval, 10) || DEFAULT_INTERVAL;
	            } else {
	                throw new Error('Unsupported argument type for \'times\': ' + typeof t);
	            }
	        }
	
	        var length = arguments.length;
	        if (length < 1 || length > 3) {
	            throw new Error('Invalid arguments - must be either (task), (task, callback), (times, task) or (times, task, callback)');
	        } else if (length <= 2 && typeof times === 'function') {
	            callback = task;
	            task = times;
	        }
	        if (typeof times !== 'function') {
	            parseTimes(opts, times);
	        }
	        opts.callback = callback;
	        opts.task = task;
	
	        function wrappedTask(wrappedCallback, wrappedResults) {
	            function retryAttempt(task, finalAttempt) {
	                return function(seriesCallback) {
	                    task(function(err, result){
	                        seriesCallback(!err || finalAttempt, {err: err, result: result});
	                    }, wrappedResults);
	                };
	            }
	
	            function retryInterval(interval){
	                return function(seriesCallback){
	                    setTimeout(function(){
	                        seriesCallback(null);
	                    }, interval);
	                };
	            }
	
	            while (opts.times) {
	
	                var finalAttempt = !(opts.times-=1);
	                attempts.push(retryAttempt(opts.task, finalAttempt));
	                if(!finalAttempt && opts.interval > 0){
	                    attempts.push(retryInterval(opts.interval));
	                }
	            }
	
	            async.series(attempts, function(done, data){
	                data = data[data.length - 1];
	                (wrappedCallback || opts.callback)(data.err, data.result);
	            });
	        }
	
	        // If a callback is passed, run this as a controll flow
	        return opts.callback ? wrappedTask() : wrappedTask;
	    };
	
	    async.waterfall = function (tasks, callback) {
	        callback = _once(callback || noop);
	        if (!_isArray(tasks)) {
	            var err = new Error('First argument to waterfall must be an array of functions');
	            return callback(err);
	        }
	        if (!tasks.length) {
	            return callback();
	        }
	        function wrapIterator(iterator) {
	            return _restParam(function (err, args) {
	                if (err) {
	                    callback.apply(null, [err].concat(args));
	                }
	                else {
	                    var next = iterator.next();
	                    if (next) {
	                        args.push(wrapIterator(next));
	                    }
	                    else {
	                        args.push(callback);
	                    }
	                    ensureAsync(iterator).apply(null, args);
	                }
	            });
	        }
	        wrapIterator(async.iterator(tasks))();
	    };
	
	    function _parallel(eachfn, tasks, callback) {
	        callback = callback || noop;
	        var results = _isArrayLike(tasks) ? [] : {};
	
	        eachfn(tasks, function (task, key, callback) {
	            task(_restParam(function (err, args) {
	                if (args.length <= 1) {
	                    args = args[0];
	                }
	                results[key] = args;
	                callback(err);
	            }));
	        }, function (err) {
	            callback(err, results);
	        });
	    }
	
	    async.parallel = function (tasks, callback) {
	        _parallel(async.eachOf, tasks, callback);
	    };
	
	    async.parallelLimit = function(tasks, limit, callback) {
	        _parallel(_eachOfLimit(limit), tasks, callback);
	    };
	
	    async.series = function(tasks, callback) {
	        _parallel(async.eachOfSeries, tasks, callback);
	    };
	
	    async.iterator = function (tasks) {
	        function makeCallback(index) {
	            function fn() {
	                if (tasks.length) {
	                    tasks[index].apply(null, arguments);
	                }
	                return fn.next();
	            }
	            fn.next = function () {
	                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
	            };
	            return fn;
	        }
	        return makeCallback(0);
	    };
	
	    async.apply = _restParam(function (fn, args) {
	        return _restParam(function (callArgs) {
	            return fn.apply(
	                null, args.concat(callArgs)
	            );
	        });
	    });
	
	    function _concat(eachfn, arr, fn, callback) {
	        var result = [];
	        eachfn(arr, function (x, index, cb) {
	            fn(x, function (err, y) {
	                result = result.concat(y || []);
	                cb(err);
	            });
	        }, function (err) {
	            callback(err, result);
	        });
	    }
	    async.concat = doParallel(_concat);
	    async.concatSeries = doSeries(_concat);
	
	    async.whilst = function (test, iterator, callback) {
	        callback = callback || noop;
	        if (test()) {
	            var next = _restParam(function(err, args) {
	                if (err) {
	                    callback(err);
	                } else if (test.apply(this, args)) {
	                    iterator(next);
	                } else {
	                    callback.apply(null, [null].concat(args));
	                }
	            });
	            iterator(next);
	        } else {
	            callback(null);
	        }
	    };
	
	    async.doWhilst = function (iterator, test, callback) {
	        var calls = 0;
	        return async.whilst(function() {
	            return ++calls <= 1 || test.apply(this, arguments);
	        }, iterator, callback);
	    };
	
	    async.until = function (test, iterator, callback) {
	        return async.whilst(function() {
	            return !test.apply(this, arguments);
	        }, iterator, callback);
	    };
	
	    async.doUntil = function (iterator, test, callback) {
	        return async.doWhilst(iterator, function() {
	            return !test.apply(this, arguments);
	        }, callback);
	    };
	
	    async.during = function (test, iterator, callback) {
	        callback = callback || noop;
	
	        var next = _restParam(function(err, args) {
	            if (err) {
	                callback(err);
	            } else {
	                args.push(check);
	                test.apply(this, args);
	            }
	        });
	
	        var check = function(err, truth) {
	            if (err) {
	                callback(err);
	            } else if (truth) {
	                iterator(next);
	            } else {
	                callback(null);
	            }
	        };
	
	        test(check);
	    };
	
	    async.doDuring = function (iterator, test, callback) {
	        var calls = 0;
	        async.during(function(next) {
	            if (calls++ < 1) {
	                next(null, true);
	            } else {
	                test.apply(this, arguments);
	            }
	        }, iterator, callback);
	    };
	
	    function _queue(worker, concurrency, payload) {
	        if (concurrency == null) {
	            concurrency = 1;
	        }
	        else if(concurrency === 0) {
	            throw new Error('Concurrency must not be zero');
	        }
	        function _insert(q, data, pos, callback) {
	            if (callback != null && typeof callback !== "function") {
	                throw new Error("task callback must be a function");
	            }
	            q.started = true;
	            if (!_isArray(data)) {
	                data = [data];
	            }
	            if(data.length === 0 && q.idle()) {
	                // call drain immediately if there are no tasks
	                return async.setImmediate(function() {
	                    q.drain();
	                });
	            }
	            _arrayEach(data, function(task) {
	                var item = {
	                    data: task,
	                    callback: callback || noop
	                };
	
	                if (pos) {
	                    q.tasks.unshift(item);
	                } else {
	                    q.tasks.push(item);
	                }
	
	                if (q.tasks.length === q.concurrency) {
	                    q.saturated();
	                }
	            });
	            async.setImmediate(q.process);
	        }
	        function _next(q, tasks) {
	            return function(){
	                workers -= 1;
	
	                var removed = false;
	                var args = arguments;
	                _arrayEach(tasks, function (task) {
	                    _arrayEach(workersList, function (worker, index) {
	                        if (worker === task && !removed) {
	                            workersList.splice(index, 1);
	                            removed = true;
	                        }
	                    });
	
	                    task.callback.apply(task, args);
	                });
	                if (q.tasks.length + workers === 0) {
	                    q.drain();
	                }
	                q.process();
	            };
	        }
	
	        var workers = 0;
	        var workersList = [];
	        var q = {
	            tasks: [],
	            concurrency: concurrency,
	            payload: payload,
	            saturated: noop,
	            empty: noop,
	            drain: noop,
	            started: false,
	            paused: false,
	            push: function (data, callback) {
	                _insert(q, data, false, callback);
	            },
	            kill: function () {
	                q.drain = noop;
	                q.tasks = [];
	            },
	            unshift: function (data, callback) {
	                _insert(q, data, true, callback);
	            },
	            process: function () {
	                while(!q.paused && workers < q.concurrency && q.tasks.length){
	
	                    var tasks = q.payload ?
	                        q.tasks.splice(0, q.payload) :
	                        q.tasks.splice(0, q.tasks.length);
	
	                    var data = _map(tasks, function (task) {
	                        return task.data;
	                    });
	
	                    if (q.tasks.length === 0) {
	                        q.empty();
	                    }
	                    workers += 1;
	                    workersList.push(tasks[0]);
	                    var cb = only_once(_next(q, tasks));
	                    worker(data, cb);
	                }
	            },
	            length: function () {
	                return q.tasks.length;
	            },
	            running: function () {
	                return workers;
	            },
	            workersList: function () {
	                return workersList;
	            },
	            idle: function() {
	                return q.tasks.length + workers === 0;
	            },
	            pause: function () {
	                q.paused = true;
	            },
	            resume: function () {
	                if (q.paused === false) { return; }
	                q.paused = false;
	                var resumeCount = Math.min(q.concurrency, q.tasks.length);
	                // Need to call q.process once per concurrent
	                // worker to preserve full concurrency after pause
	                for (var w = 1; w <= resumeCount; w++) {
	                    async.setImmediate(q.process);
	                }
	            }
	        };
	        return q;
	    }
	
	    async.queue = function (worker, concurrency) {
	        var q = _queue(function (items, cb) {
	            worker(items[0], cb);
	        }, concurrency, 1);
	
	        return q;
	    };
	
	    async.priorityQueue = function (worker, concurrency) {
	
	        function _compareTasks(a, b){
	            return a.priority - b.priority;
	        }
	
	        function _binarySearch(sequence, item, compare) {
	            var beg = -1,
	                end = sequence.length - 1;
	            while (beg < end) {
	                var mid = beg + ((end - beg + 1) >>> 1);
	                if (compare(item, sequence[mid]) >= 0) {
	                    beg = mid;
	                } else {
	                    end = mid - 1;
	                }
	            }
	            return beg;
	        }
	
	        function _insert(q, data, priority, callback) {
	            if (callback != null && typeof callback !== "function") {
	                throw new Error("task callback must be a function");
	            }
	            q.started = true;
	            if (!_isArray(data)) {
	                data = [data];
	            }
	            if(data.length === 0) {
	                // call drain immediately if there are no tasks
	                return async.setImmediate(function() {
	                    q.drain();
	                });
	            }
	            _arrayEach(data, function(task) {
	                var item = {
	                    data: task,
	                    priority: priority,
	                    callback: typeof callback === 'function' ? callback : noop
	                };
	
	                q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);
	
	                if (q.tasks.length === q.concurrency) {
	                    q.saturated();
	                }
	                async.setImmediate(q.process);
	            });
	        }
	
	        // Start with a normal queue
	        var q = async.queue(worker, concurrency);
	
	        // Override push to accept second parameter representing priority
	        q.push = function (data, priority, callback) {
	            _insert(q, data, priority, callback);
	        };
	
	        // Remove unshift function
	        delete q.unshift;
	
	        return q;
	    };
	
	    async.cargo = function (worker, payload) {
	        return _queue(worker, 1, payload);
	    };
	
	    function _console_fn(name) {
	        return _restParam(function (fn, args) {
	            fn.apply(null, args.concat([_restParam(function (err, args) {
	                if (typeof console === 'object') {
	                    if (err) {
	                        if (console.error) {
	                            console.error(err);
	                        }
	                    }
	                    else if (console[name]) {
	                        _arrayEach(args, function (x) {
	                            console[name](x);
	                        });
	                    }
	                }
	            })]));
	        });
	    }
	    async.log = _console_fn('log');
	    async.dir = _console_fn('dir');
	    /*async.info = _console_fn('info');
	    async.warn = _console_fn('warn');
	    async.error = _console_fn('error');*/
	
	    async.memoize = function (fn, hasher) {
	        var memo = {};
	        var queues = {};
	        var has = Object.prototype.hasOwnProperty;
	        hasher = hasher || identity;
	        var memoized = _restParam(function memoized(args) {
	            var callback = args.pop();
	            var key = hasher.apply(null, args);
	            if (has.call(memo, key)) {   
	                async.setImmediate(function () {
	                    callback.apply(null, memo[key]);
	                });
	            }
	            else if (has.call(queues, key)) {
	                queues[key].push(callback);
	            }
	            else {
	                queues[key] = [callback];
	                fn.apply(null, args.concat([_restParam(function (args) {
	                    memo[key] = args;
	                    var q = queues[key];
	                    delete queues[key];
	                    for (var i = 0, l = q.length; i < l; i++) {
	                        q[i].apply(null, args);
	                    }
	                })]));
	            }
	        });
	        memoized.memo = memo;
	        memoized.unmemoized = fn;
	        return memoized;
	    };
	
	    async.unmemoize = function (fn) {
	        return function () {
	            return (fn.unmemoized || fn).apply(null, arguments);
	        };
	    };
	
	    function _times(mapper) {
	        return function (count, iterator, callback) {
	            mapper(_range(count), iterator, callback);
	        };
	    }
	
	    async.times = _times(async.map);
	    async.timesSeries = _times(async.mapSeries);
	    async.timesLimit = function (count, limit, iterator, callback) {
	        return async.mapLimit(_range(count), limit, iterator, callback);
	    };
	
	    async.seq = function (/* functions... */) {
	        var fns = arguments;
	        return _restParam(function (args) {
	            var that = this;
	
	            var callback = args[args.length - 1];
	            if (typeof callback == 'function') {
	                args.pop();
	            } else {
	                callback = noop;
	            }
	
	            async.reduce(fns, args, function (newargs, fn, cb) {
	                fn.apply(that, newargs.concat([_restParam(function (err, nextargs) {
	                    cb(err, nextargs);
	                })]));
	            },
	            function (err, results) {
	                callback.apply(that, [err].concat(results));
	            });
	        });
	    };
	
	    async.compose = function (/* functions... */) {
	        return async.seq.apply(null, Array.prototype.reverse.call(arguments));
	    };
	
	
	    function _applyEach(eachfn) {
	        return _restParam(function(fns, args) {
	            var go = _restParam(function(args) {
	                var that = this;
	                var callback = args.pop();
	                return eachfn(fns, function (fn, _, cb) {
	                    fn.apply(that, args.concat([cb]));
	                },
	                callback);
	            });
	            if (args.length) {
	                return go.apply(this, args);
	            }
	            else {
	                return go;
	            }
	        });
	    }
	
	    async.applyEach = _applyEach(async.eachOf);
	    async.applyEachSeries = _applyEach(async.eachOfSeries);
	
	
	    async.forever = function (fn, callback) {
	        var done = only_once(callback || noop);
	        var task = ensureAsync(fn);
	        function next(err) {
	            if (err) {
	                return done(err);
	            }
	            task(next);
	        }
	        next();
	    };
	
	    function ensureAsync(fn) {
	        return _restParam(function (args) {
	            var callback = args.pop();
	            args.push(function () {
	                var innerArgs = arguments;
	                if (sync) {
	                    async.setImmediate(function () {
	                        callback.apply(null, innerArgs);
	                    });
	                } else {
	                    callback.apply(null, innerArgs);
	                }
	            });
	            var sync = true;
	            fn.apply(this, args);
	            sync = false;
	        });
	    }
	
	    async.ensureAsync = ensureAsync;
	
	    async.constant = _restParam(function(values) {
	        var args = [null].concat(values);
	        return function (callback) {
	            return callback.apply(this, args);
	        };
	    });
	
	    async.wrapSync =
	    async.asyncify = function asyncify(func) {
	        return _restParam(function (args) {
	            var callback = args.pop();
	            var result;
	            try {
	                result = func.apply(this, args);
	            } catch (e) {
	                return callback(e);
	            }
	            // if result is Promise object
	            if (_isObject(result) && typeof result.then === "function") {
	                result.then(function(value) {
	                    callback(null, value);
	                })["catch"](function(err) {
	                    callback(err.message ? err : new Error(err));
	                });
	            } else {
	                callback(null, result);
	            }
	        });
	    };
	
	    // Node.js
	    if (typeof module === 'object' && module.exports) {
	        module.exports = async;
	    }
	    // AMD / RequireJS
	    else if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return async;
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    }
	    // included directly via <script> tag
	    else {
	        root.async = async;
	    }
	
	}());
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(/*! ./~/node-libs-browser/~/timers-browserify/main.js */ 48).setImmediate, __webpack_require__(/*! ./~/node-libs-browser/~/process/browser.js */ 49)))

/***/ },

/***/ 48:
/*!*********************************************************!*\
  !*** ./~/node-libs-browser/~/timers-browserify/main.js ***!
  \*********************************************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(/*! process/browser.js */ 49).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;
	
	// DOM APIs, for completeness
	
	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };
	
	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};
	
	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};
	
	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};
	
	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);
	
	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};
	
	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);
	
	  immediateIds[id] = true;
	
	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });
	
	  return id;
	};
	
	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./~/node-libs-browser/~/timers-browserify/main.js */ 48).setImmediate, __webpack_require__(/*! ./~/node-libs-browser/~/timers-browserify/main.js */ 48).clearImmediate))

/***/ },

/***/ 49:
/*!**************************************************!*\
  !*** ./~/node-libs-browser/~/process/browser.js ***!
  \**************************************************/
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },

/***/ 52:
/*!****************************************!*\
  !*** ./client/src/js/Orient/Orient.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	__webpack_require__(/*! ./common/polyfill */ 21);
	
	var _Cookie = __webpack_require__(/*! ./common/Cookie */ 53);
	
	var _Cookie2 = _interopRequireDefault(_Cookie);
	
	var _Factory = __webpack_require__(/*! ../serviceCrew/ElementNode/Factory */ 54);
	
	var _Factory2 = _interopRequireDefault(_Factory);
	
	var _HTTPRequest = __webpack_require__(/*! ./common/HTTPRequest */ 22);
	
	var _HTTPRequest2 = _interopRequireDefault(_HTTPRequest);
	
	var _APIRequest = __webpack_require__(/*! ./common/APIRequest */ 28);
	
	var _APIRequest2 = _interopRequireDefault(_APIRequest);
	
	var _Console = __webpack_require__(/*! ./common/Console */ 82);
	
	var _Console2 = _interopRequireDefault(_Console);
	
	var _ElementNode = __webpack_require__(/*! ../serviceCrew/ElementNode/ElementNode */ 57);
	
	var _ElementNode2 = _interopRequireDefault(_ElementNode);
	
	var _HTMLElementNode = __webpack_require__(/*! ../serviceCrew/ElementNode/HTMLElementNode */ 55);
	
	var _HTMLElementNode2 = _interopRequireDefault(_HTMLElementNode);
	
	var _RefElementNode = __webpack_require__(/*! ../serviceCrew/ElementNode/RefElementNode */ 80);
	
	var _RefElementNode2 = _interopRequireDefault(_RefElementNode);
	
	var _SVGElementNode = __webpack_require__(/*! ../serviceCrew/ElementNode/SVGElementNode */ 78);
	
	var _SVGElementNode2 = _interopRequireDefault(_SVGElementNode);
	
	var _StringElementNode = __webpack_require__(/*! ../serviceCrew/ElementNode/StringElementNode */ 79);
	
	var _StringElementNode2 = _interopRequireDefault(_StringElementNode);
	
	var _TagBaseElementNode = __webpack_require__(/*! ../serviceCrew/ElementNode/TagBaseElementNode */ 56);
	
	var _TagBaseElementNode2 = _interopRequireDefault(_TagBaseElementNode);
	
	var _ObjectExtends = __webpack_require__(/*! ../util/ObjectExtends */ 27);
	
	var _ObjectExtends2 = _interopRequireDefault(_ObjectExtends);
	
	var _ArrayHandler = __webpack_require__(/*! ../util/ArrayHandler */ 34);
	
	var _ArrayHandler2 = _interopRequireDefault(_ArrayHandler);
	
	var _Identifier = __webpack_require__(/*! ../util/Identifier */ 26);
	
	var _Identifier2 = _interopRequireDefault(_Identifier);
	
	var _ObjectExplorer = __webpack_require__(/*! ../util/ObjectExplorer */ 32);
	
	var _ObjectExplorer2 = _interopRequireDefault(_ObjectExplorer);
	
	var _BrowserStorage = __webpack_require__(/*! ../util/BrowserStorage */ 42);
	
	var _BrowserStorage2 = _interopRequireDefault(_BrowserStorage);
	
	var _GeneralLocation = __webpack_require__(/*! ../util/GeneralLocation */ 239);
	
	var _GeneralLocation2 = _interopRequireDefault(_GeneralLocation);
	
	var _ActionStore = __webpack_require__(/*! ../serviceCrew/Actions/ActionStore */ 72);
	
	var _ActionStore2 = _interopRequireDefault(_ActionStore);
	
	var _FunctionStore = __webpack_require__(/*! ../serviceCrew/Functions/FunctionStore */ 73);
	
	var _FunctionStore2 = _interopRequireDefault(_FunctionStore);
	
	var _Shortcut = __webpack_require__(/*! ../serviceCrew/DataResolver/Shortcut */ 37);
	
	var _Shortcut2 = _interopRequireDefault(_Shortcut);
	
	var _detectBrowser = __webpack_require__(/*! detect-browser */ 24);
	
	var _detectBrowser2 = _interopRequireDefault(_detectBrowser);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var BROWSER_NAME = _detectBrowser2['default'].name;
	var BROWSER_VER = parseInt(_detectBrowser2['default'].version);
	
	var CLEAR_BIND_ERROR = false;
	
	var VERSION = '0.16.2';
	
	/*
	  Version : x.y.z
	  x: 판
	  y: 중형 (짝수가 안정버전)
	  z: 세부업데이트
	
	  Version history
	  - 0.15.0 ( 2016-06-21 )
	    * 랜더링 로직 수정 component events 완벽 지원
	    * 랜더링 내부 API변경
	    * 명시적 component unmount
	
	  - 0.15.4 (2016-06-22T01:50)
	    * ElementNode 의 parent 에서 upperContainer 의 개념을 분리해냄 ( 자신의 상위 DOM을 가진 요소를 upperContainer 로 지정 실제 attachDOMChild 와 dettachDOMChild는 upperContainer 로 지정된 Node에서 담당한다.)
	    * RefElementNode 하위의 Master로 붙는 ElementNode 는 parent 필드로 RefElementNode를 가지지 않고 upperContainer만을 가진다. ( 상위 Scope 접근을 제한하기 위해 )
	    * BrowserStorage 에서 item 세팅에서 에러 발생 시 item 을 remove
	    * Fragment BrowserStorage 캐시 시에 ID를 제외하고 Fragment JSON을 저장하던 것을 ID를 포함하도록 수정 (기존의 고정된 ID도 제거되어 발생하던 에러 처리 )
	
	  - 0.16.0 (2016-06-22T16:30)
	    * URL Location 핸들러(Hashbang 프로토콜) 추가
	    * Value Scope Node 에 Hashbang 매핑 추가
	
	  - 0.16.1 (2016-06-23T20:30)
	    * Runtime Event 등록/삭제 인터페이스 추가
	    * eventDescription 으로 멀티라인 인터프리트 블럭 사용 가능하도록 변경
	
	  - 0.16.2 (2016-06-23T21:20)
	    * VirtualRendering
	*/
	
	window.$$ = function (_message, _data) {
	  console.log(_message, ' - ', _data);
	  window.test = _data;
	};
	
	var Neutron = function () {
	  function Neutron() {
	    _classCallCheck(this, Neutron);
	  }
	
	  _createClass(Neutron, null, [{
	    key: 'buildElement',
	    value: function buildElement(_elementNodeObject) {}
	  }, {
	    key: 'buildComponentByElement',
	
	
	    //
	    /*
	      buildComponentByElement(_domElement, [_props, [_env]])
	        HTML DOMElement를 바로 빌드하여 컴포넌트를 생성한다.
	      Parameters:
	        _domElement : DOMElement
	        _props : property
	        _env : Environment
	      Return
	        Built ElementNode{}
	    */
	    value: function buildComponentByElement(_domElement) {
	      var _props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	      var _env = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
	
	      var masterType = _Factory2['default'].checkElementNodeType(_domElement);
	
	      // build
	      // 랜더링 전에 Env 세팅
	      var masterElementNode = _Factory2['default'].takeElementNode(undefined, _props, masterType, _env, true);
	
	      masterElementNode.buildByElement(_domElement);
	
	      return masterElementNode;
	    }
	  }, {
	    key: 'buildComponentByElementSafeOrigin',
	    value: function buildComponentByElementSafeOrigin(_domElement) {
	      var _props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	      var _env = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
	
	      var masterType = _Factory2['default'].checkElementNodeType(_domElement);
	
	      // build
	      // 랜더링 전에 Env 세팅
	      var masterElementNode = _Factory2['default'].takeElementNode(undefined, _props, masterType, _env, true);
	      masterElementNode.buildByElement(_domElement, true);
	
	      return masterElementNode;
	    }
	  }, {
	    key: 'buildComponentBySheet',
	    value: function buildComponentBySheet(_sheetType, _sheet) {
	      var _props = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	
	      var _env = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
	
	      if (_sheetType === 'html') {
	        return _Factory2['default'].convertToMasterElementNodesByHTMLSheet(_sheet, _props, _env);
	      } else if (_sheetType === 'json') {
	        return _Factory2['default'].convertToMasterElementNodesByJSONSheet(JSON.parse(_sheet), _props, _env);
	      } else if (_sheetType === 'js') {
	        // return ElementNodeFactory.extractByJSModule(_sheet, _props, _env);
	      }
	    }
	  }, {
	    key: 'renderVirtual',
	    value: function renderVirtual(_elementNode) {
	      var componentContainer = document.createElement('div');
	
	      _elementNode.upperContainer = {
	        attachDOMChild: function attachDOMChild(_idx, _mountChildDOM, _mountChild) {
	          componentContainer.appendChild(_mountChildDOM);
	        },
	
	        dettachDOMChild: function dettachDOMChild(_dom) {
	          componentContainer.removeChild(_dom);
	        }
	      };
	
	      _elementNode.render({
	        resolve: true
	      });
	
	      return componentContainer;
	    }
	  }, {
	    key: 'mount',
	    value: function mount(_elementNode, _targetDOMElement) {
	      _elementNode.attachForwardDOM(_targetDOMElement);
	    }
	  }, {
	    key: 'mountByReplace',
	    value: function mountByReplace(_elementNode, _targetDOMElement) {
	      var parentDOMElement = _targetDOMElement.parentNode;
	      //parentDOMElement.replaceChild()
	      _elementNode.attachForwardDOMByReplace(parentDOMElement, _targetDOMElement);
	    }
	
	    // render = renderVirtual + mount
	
	  }, {
	    key: 'render',
	    value: function render(_elementNode, _targetDOMElement) {
	      var _this = this;
	
	      _elementNode.tryEventScope('component-will-mount', {}, null, function (_result) {
	
	        _this.renderVirtual(_elementNode);
	        _this.mount(_elementNode, _targetDOMElement);
	
	        _elementNode.tryEventScope('component-did-mount', {}, null, function (_result) {});
	      });
	    }
	
	    // replaceRender = renderVirtual + mountByReplace
	
	  }, {
	    key: 'replaceRender',
	    value: function replaceRender(_elementNode, _targetDOMElement) {
	      var _this2 = this;
	
	      _elementNode.tryEventScope('component-will-mount', {}, null, function (_result) {
	
	        _this2.renderVirtual(_elementNode);
	        _this2.mountByReplace(_elementNode, _targetDOMElement);
	
	        _elementNode.tryEventScope('component-did-mount', {}, null, function (_result) {});
	      });
	    }
	  }, {
	    key: 'getNodeByDOM',
	    value: function getNodeByDOM(_domElement) {
	      if (!_domElement) throw new Error('Could not get ElementNode. ' + _domElement + ' is not DOMNode.');
	      if (_domElement.isElementNode) return _domElement;
	
	      return _domElement.___en || null;
	    }
	  }, {
	    key: 'registerAction',
	    value: function registerAction(_name, _paramKeys, _anonymousActionFunction) {
	      var actionStore = _ActionStore2['default'].instance();
	
	      actionStore.registerAction(_name, _paramKeys, _anonymousActionFunction);
	    }
	  }, {
	    key: 'registerFunction',
	    value: function registerFunction(_name, _function) {
	      var functionStore = _FunctionStore2['default'].instance();
	
	      functionStore.registerFunction(_name, _function);
	    }
	  }, {
	    key: 'retrieveFunction',
	    value: function retrieveFunction(_name) {
	      var functionStore = _FunctionStore2['default'].instance();
	
	      var functionO = functionStore.getFunction(_name);
	
	      return functionO.executableFunction;
	    }
	  }, {
	    key: 'DirectAccess',
	
	
	    // ElementNode 를 찾는다.
	    value: function DirectAccess(_forfatherElement, _enID) {}
	
	    // ElementNode 를 찾는다.
	
	  }, {
	    key: 'DirectAccessEN',
	    value: function DirectAccessEN(_forfatherElementNode, _enID) {}
	  }, {
	    key: 'ClearBindError',
	
	
	    // BindError 를 숨긴다.
	    value: function ClearBindError() {
	      window.CLEAR_BIND_ERROR = true;
	    }
	
	    // BindError를 표시한다.
	
	  }, {
	    key: 'OccursBindError',
	    value: function OccursBindError() {
	      window.CLEAR_BIND_ERROR = false;
	    }
	  }, {
	    key: 'HTTPRequest',
	    get: function get() {
	      return _HTTPRequest2['default'];
	    }
	  }, {
	    key: 'actionStore',
	    get: function get() {
	      return _ActionStore2['default'].instance();
	    }
	  }, {
	    key: 'functionStore',
	    get: function get() {
	      return _FunctionStore2['default'].instance();
	    }
	  }, {
	    key: 'APIRequest',
	    get: function get() {
	      return _APIRequest2['default'];
	    }
	  }, {
	    key: 'Cookie',
	    get: function get() {
	      return _Cookie2['default'];
	    }
	  }, {
	    key: 'Shortcut',
	    get: function get() {
	      return _Shortcut2['default'];
	    }
	  }, {
	    key: 'Console',
	    get: function get() {
	      return _Console2['default'].instance();
	    }
	  }, {
	    key: 'B',
	    get: function get() {
	      return _detectBrowser2['default'];
	    }
	  }, {
	    key: 'bn',
	    get: function get() {
	      return BROWSER_NAME;
	    }
	  }, {
	    key: 'bv',
	    get: function get() {
	      return BROWSER_VER;
	    }
	
	    // fix
	
	  }, {
	    key: 'ObjectExtends',
	    get: function get() {
	      return _ObjectExtends2['default'];
	    }
	
	    // fix
	
	  }, {
	    key: 'ObjectExplorer',
	    get: function get() {
	      return _ObjectExplorer2['default'];
	    }
	
	    // fix
	
	  }, {
	    key: 'Identifier',
	    get: function get() {
	      return _Identifier2['default'];
	    }
	
	    // fix
	
	  }, {
	    key: 'ArrayHandler',
	    get: function get() {
	      return _ArrayHandler2['default'];
	    }
	  }, {
	    key: 'BrowserStorage',
	    get: function get() {
	      return _BrowserStorage2['default'];
	    }
	  }, {
	    key: 'Location',
	    get: function get() {
	      return _GeneralLocation2['default'];
	    }
	
	    /*
	      ███████ ██   ██ ████████ ███████ ███    ██ ██████   █████  ██████  ██      ███████      ██████ ██       █████  ███████ ███████     ███████ ██   ██ ██████   ██████  ██████  ████████
	      ██       ██ ██     ██    ██      ████   ██ ██   ██ ██   ██ ██   ██ ██      ██          ██      ██      ██   ██ ██      ██          ██       ██ ██  ██   ██ ██    ██ ██   ██    ██
	      █████     ███      ██    █████   ██ ██  ██ ██   ██ ███████ ██████  ██      █████       ██      ██      ███████ ███████ ███████     █████     ███   ██████  ██    ██ ██████     ██
	      ██       ██ ██     ██    ██      ██  ██ ██ ██   ██ ██   ██ ██   ██ ██      ██          ██      ██      ██   ██      ██      ██     ██       ██ ██  ██      ██    ██ ██   ██    ██
	      ███████ ██   ██    ██    ███████ ██   ████ ██████  ██   ██ ██████  ███████ ███████      ██████ ███████ ██   ██ ███████ ███████     ███████ ██   ██ ██       ██████  ██   ██    ██
	    */
	
	  }, {
	    key: 'ElementNode',
	    get: function get() {
	      return _ElementNode2['default'];
	    }
	  }, {
	    key: 'HTMLElementNode',
	    get: function get() {
	      return _HTMLElementNode2['default'];
	    }
	  }, {
	    key: 'RefElementNode',
	    get: function get() {
	      return _RefElementNode2['default'];
	    }
	  }, {
	    key: 'TagBaseElementNode',
	    get: function get() {
	      return _TagBaseElementNode2['default'];
	    }
	  }, {
	    key: 'StringElementNode',
	    get: function get() {
	      return _StringElementNode2['default'];
	    }
	  }, {
	    key: 'ElementNodeFactory',
	    get: function get() {
	      return Factory;
	    }
	  }]);
	
	  return Neutron;
	}();
	
	Neutron.version = VERSION;
	
	exports['default'] = window.Orient = Neutron;

/***/ },

/***/ 53:
/*!***********************************************!*\
  !*** ./client/src/js/Orient/common/Cookie.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _jsCookie = __webpack_require__(/*! js-cookie */ 35);
	
	var _jsCookie2 = _interopRequireDefault(_jsCookie);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	exports['default'] = _jsCookie2['default'];

/***/ },

/***/ 54:
/*!**********************************************************!*\
  !*** ./client/src/js/serviceCrew/ElementNode/Factory.js ***!
  \**********************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	// import GridElementNode from './GridElementNode.js';
	// import ReactElementNode from './ReactElementNode.js';
	
	
	var _HTMLElementNode = __webpack_require__(/*! ./HTMLElementNode.js */ 55);
	
	var _HTMLElementNode2 = _interopRequireDefault(_HTMLElementNode);
	
	var _SVGElementNode = __webpack_require__(/*! ./SVGElementNode.js */ 78);
	
	var _SVGElementNode2 = _interopRequireDefault(_SVGElementNode);
	
	var _StringElementNode = __webpack_require__(/*! ./StringElementNode.js */ 79);
	
	var _StringElementNode2 = _interopRequireDefault(_StringElementNode);
	
	var _RefElementNode = __webpack_require__(/*! ./RefElementNode.js */ 80);
	
	var _RefElementNode2 = _interopRequireDefault(_RefElementNode);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	"use strict";
	
	var Factory = function () {
	  function Factory() {
	    _classCallCheck(this, Factory);
	  }
	
	  _createClass(Factory, null, [{
	    key: 'takeElementNode',
	    value: function takeElementNode(_elementNodeDataObject, _preInjectProps, _type, _environment, _isMaster) {
	      var elementNode;
	      var elementNodeCLASS = void 0;
	      var elementNodeDataObject = _elementNodeDataObject || {};
	      var type = elementNodeDataObject.type || _type;
	      //console.log(_elementNodeDataObject, _type, _environment);
	      //console.log(_elementNodeDataObject);
	      if (type === 'html') elementNodeCLASS = _HTMLElementNode2['default'];else if (type === 'svg') elementNodeCLASS = _SVGElementNode2['default'];else if (type === 'string') elementNodeCLASS = _StringElementNode2['default'];
	      //else if (type === 'empty') elementNodeCLASS = EmptyElementNode;
	      else if (type === 'ref') elementNodeCLASS = _RefElementNode2['default'];
	
	        // else if (type === 'react') elementNodeCLASS = ReactElementNode;
	        //else if (type === 'grid') elementNodeCLASS = GridElementNode;
	        else if (type === undefined || type === null) elementNodeCLASS = _HTMLElementNode2['default'];else {
	            // 감지된 plugin에서 새로 정의된 ElementNode가 있는지 확인한다.
	            throw new Error('unkown elementNode type ' + type);
	          }
	
	      elementNode = new elementNodeCLASS(_environment, elementNodeDataObject, _preInjectProps, _isMaster);
	
	      return elementNode;
	    }
	  }, {
	    key: 'checkElementNodeType',
	    value: function checkElementNodeType(_domElement) {
	      var tagNodeName = _domElement.nodeName;
	
	      if (tagNodeName === '#text') {
	        return 'string';
	      } else if (tagNodeName === '#comment') {
	        return 'comment';
	      } else {
	        var typeAttribute = _domElement.getAttribute('en-type');
	
	        // type 이 지정되지 않았다면 유추하여 type을 알아내야 한다.
	        if (typeAttribute === null) {
	
	          // namespaceURI가 입력되어 있다면 SVG태그의 가능성이 있다.
	          if (_domElement.namespaceURI) {
	
	            // namespaceURI 가 SVG의 XML_NS와 같으면 svg 타입으로 반환한다.
	            if (_domElement.namespaceURI === _SVGElementNode2['default'].XML_NS) return 'svg';
	          }
	
	          return 'html';
	        } else if (/^html|string|ref|svg$/.test(typeAttribute)) {
	          return typeAttribute;
	        } else if (typeAttribute === undefined || typeAttribute === null) {
	          return 'html';
	        } else {
	          // plugin으로 지원하는 ElementNode가 있는지 확인한다.
	          if (null) {
	            // 감지된 plugin에서 지원하지 않을경우
	            throw new Error(typeAttribute + ' 지원하지 않는 ElementNode 타입입니다.');
	          }
	        }
	      }
	    }
	
	    // HTML 텍스트를 ElementNode 컴포넌트로 변환한다.
	
	  }, {
	    key: 'convertToMasterElementNodesByHTMLSheet',
	    value: function convertToMasterElementNodesByHTMLSheet(_htmlText, _props, _env) {
	
	      // console.time('Fill html container');
	      var realizeContainer = document.createElement('div');
	      realizeContainer.innerHTML = _htmlText;
	      // console.timeEnd('Fill html container');
	
	      var masterElementNodes = [];
	      var type = void 0;
	      var masterElementNode = void 0;
	      var elementNodeBuildResult = void 0;
	      for (var i = 0; i < realizeContainer.childNodes.length; i++) {
	        type = Factory.checkElementNodeType(realizeContainer.childNodes[i]);
	        if (type === 'comment') continue;
	
	        masterElementNode = Factory.takeElementNode(undefined, _props, type, _env, true);
	        // console.time('Build from html container');
	        elementNodeBuildResult = masterElementNode.buildByElement(realizeContainer.childNodes[i]);
	        // console.timeEnd('Build from html container');
	        if (elementNodeBuildResult === null) continue;
	
	        masterElementNodes.push(masterElementNode);
	      }
	
	      return masterElementNodes;
	    }
	  }, {
	    key: 'convertToMasterElementNodesByJSONSheet',
	    value: function convertToMasterElementNodesByJSONSheet(_jsonObject, _props, _env) {
	      var masterElementNodes = void 0;
	
	      console.time('Build by json');
	      if (_jsonObject instanceof Array) {
	        masterElementNodes = _jsonObject.map(function (_elementNodeO) {
	          return Factory.takeElementNode(_elementNodeO, _props, _elementNodeO.type, _env, true);
	        });
	      } else {
	        masterElementNodes = [Factory.takeElementNode(_jsonObject, _props, _jsonObject.type, _env, true)];
	      }
	      console.timeEnd('Build by json');
	
	      return masterElementNodes;
	    }
	
	    /*
	      ███████ ██   ██ ████████ ███████ ███    ██ ██████   █████  ██████  ██      ███████      ██████ ██       █████  ███████ ███████     ███████ ██   ██ ██████   ██████  ██████  ████████
	      ██       ██ ██     ██    ██      ████   ██ ██   ██ ██   ██ ██   ██ ██      ██          ██      ██      ██   ██ ██      ██          ██       ██ ██  ██   ██ ██    ██ ██   ██    ██
	      █████     ███      ██    █████   ██ ██  ██ ██   ██ ███████ ██████  ██      █████       ██      ██      ███████ ███████ ███████     █████     ███   ██████  ██    ██ ██████     ██
	      ██       ██ ██     ██    ██      ██  ██ ██ ██   ██ ██   ██ ██   ██ ██      ██          ██      ██      ██   ██      ██      ██     ██       ██ ██  ██      ██    ██ ██   ██    ██
	      ███████ ██   ██    ██    ███████ ██   ████ ██████  ██   ██ ██████  ███████ ███████      ██████ ███████ ██   ██ ███████ ███████     ███████ ██   ██ ██       ██████  ██   ██    ██
	    */
	
	  }, {
	    key: 'ElementNode',
	    get: function get() {
	      return ElementNode;
	    }
	  }, {
	    key: 'HTMLElementNode',
	    get: function get() {
	      return _HTMLElementNode2['default'];
	    }
	  }, {
	    key: 'RefElementNode',
	    get: function get() {
	      return _RefElementNode2['default'];
	    }
	  }, {
	    key: 'TagBaseElementNode',
	    get: function get() {
	      return TagBaseElementNode;
	    }
	  }, {
	    key: 'StringElementNode',
	    get: function get() {
	      return _StringElementNode2['default'];
	    }
	  }]);
	
	  return Factory;
	}();
	
	exports['default'] = Factory;

/***/ },

/***/ 55:
/*!******************************************************************!*\
  !*** ./client/src/js/serviceCrew/ElementNode/HTMLElementNode.js ***!
  \******************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _TagBaseElementNode2 = __webpack_require__(/*! ./TagBaseElementNode.js */ 56);
	
	var _TagBaseElementNode3 = _interopRequireDefault(_TagBaseElementNode2);
	
	var _Factory = __webpack_require__(/*! ./Factory.js */ 54);
	
	var _Factory2 = _interopRequireDefault(_Factory);
	
	var _Point = __webpack_require__(/*! ../../util/Point */ 77);
	
	var _Point2 = _interopRequireDefault(_Point);
	
	var _ObjectExtends = __webpack_require__(/*! ../../util/ObjectExtends */ 27);
	
	var _ObjectExtends2 = _interopRequireDefault(_ObjectExtends);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }
	// import React from 'react';
	// import Sizzle from 'sizzle';
	
	
	"use strict";
	
	var REGEXP_REAL_EN_ID_SPLITTER = /@\d+$/;
	
	var FINAL_TYPE_CONTEXT = 'html';
	
	var HTMLElementNode = function (_TagBaseElementNode) {
	  _inherits(HTMLElementNode, _TagBaseElementNode);
	
	  function HTMLElementNode(_environment, _elementNodeDataObject, _preInjectProps, _isMaster) {
	    _classCallCheck(this, HTMLElementNode);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HTMLElementNode).call(this, _environment, _elementNodeDataObject, _preInjectProps, _isMaster));
	
	    if (Orient.bn === 'ie' && Orient.bv <= 10) {
	      _TagBaseElementNode3['default'].call(_this, _environment, _elementNodeDataObject, _preInjectProps, _isMaster);
	    }
	
	    _this.type = FINAL_TYPE_CONTEXT;
	    return _this;
	  }
	
	  _createClass(HTMLElementNode, [{
	    key: 'setEnvironment',
	    value: function setEnvironment(_env) {
	      _get(Object.getPrototypeOf(HTMLElementNode.prototype), 'setEnvironment', this).call(this, _env);
	
	      for (var i = 0; i < this.children.length; i++) {
	        this.children[i].setEnvironment(_env);
	      }
	    }
	
	    // 자식이 부모에게 요청
	
	  }, {
	    key: 'attachDOMChild',
	    value: function attachDOMChild(_idx, _mountChildDOM, _mountChild) {
	      var domnode = this.getDOMNode();
	
	      if (_idx !== null) {
	
	        if (domnode.childNodes[_idx]) {
	
	          domnode.insertBefore(_mountChildDOM, domnode.childNodes[_idx]);
	        } else {
	
	          domnode.appendChild(_mountChildDOM);
	        }
	      } else {
	        // 마운트 index가 null 인 경우 직접 mount 위치를 찾아서 자식을 붙인다.
	
	        var prevSiblingMountedIndex = 0,
	            realMountIndex = void 0,
	            nextSibling = void 0;
	
	        var child = void 0,
	            childDOM = void 0,
	            ghostChildPool = void 0,
	            ghostChild = void 0,
	            ghostChildDOM = void 0,
	            breakUpperLoop = false;
	        for (var j = 0; j < this.children.length; j++) {
	          child = this.children[j];
	
	          if (child.isRepeater()) {
	            ghostChildPool = child.clonePool;
	
	            for (var i = 0; i < ghostChildPool.length; i++) {
	              ghostChild = ghostChildPool[i];
	              ghostChildDOM = ghostChild.getDOMNode();
	
	              if (_mountChild === ghostChild) {
	
	                if (ghostChildDOM) {
	                  throw new Error(ghostChild.id + ' Component is Already mounted GhostChild.');
	                } else {
	                  breakUpperLoop = true;
	                  break;
	                }
	              } else {
	                if (ghostChildDOM) {
	                  prevSiblingMountedIndex++;
	                }
	              }
	            }
	
	            if (breakUpperLoop) break;
	          } else {
	            childDOM = child.getDOMNode();
	
	            if (child === _mountChild) {
	              if (childDOM) {
	                throw new Error(child.id + ' Component is Already mounted Child.');
	              } else {
	                break;
	              }
	            } else {
	              if (childDOM) {
	                prevSiblingMountedIndex++;
	              }
	            }
	          }
	        }
	
	        realMountIndex = prevSiblingMountedIndex + 1;
	        nextSibling = domnode.childNodes[realMountIndex];
	
	        if (nextSibling) {
	          domnode.insertBefore(_mountChildDOM, nextSibling);
	        } else {
	          domnode.appendChild(_mountChildDOM);
	        }
	      }
	      // 뒤에 있으면 잡아서 appendBefore 없으면 appendChild
	    }
	
	    // 자식이 부모에게 요청
	
	  }, {
	    key: 'dettachDOMChild',
	    value: function dettachDOMChild(_child) {
	
	      this.getDOMNode().removeChild(_child.getDOMNode());
	    }
	  }, {
	    key: 'unmountComponent',
	    value: function unmountComponent(_options) {
	
	      // 자식모두에게 unmount render
	      var child = void 0,
	          repeat_child = void 0;
	      for (var i = 0; i < this.children.length; i++) {
	        child = this.children[i];
	
	        if (child.isRepeater()) {
	          for (var repeat_i = 0; repeat_i < child.clonePool.length; repeat_i++) {
	            repeat_child = child.clonePool[repeat_i];
	
	            repeat_child.render(_options, true);
	          }
	        } else {
	          child.render(_options, true);
	        }
	      }
	
	      // unmount는 자식먼저 unmount를 진행한 후 자신도 진행하도록 한다.
	      _get(Object.getPrototypeOf(HTMLElementNode.prototype), 'unmountComponent', this).call(this, _options);
	    }
	  }, {
	    key: 'mountComponent',
	    value: function mountComponent(_options, _parentCount, _mountIndex) {
	      _get(Object.getPrototypeOf(HTMLElementNode.prototype), 'mountComponent', this).call(this, _options, _parentCount, _mountIndex);
	
	      this.debug('render', '[html] Will render children from mount component');
	      this.renderChild(_options, _parentCount);
	    }
	  }, {
	    key: 'updateComponent',
	    value: function updateComponent(_options, _parentCount, _mountIndex) {
	      _get(Object.getPrototypeOf(HTMLElementNode.prototype), 'updateComponent', this).call(this, _options, _parentCount, _mountIndex);
	
	      this.debug('render', '[html] Will render children from update component');
	      this.renderChild(_options, _parentCount);
	    }
	  }, {
	    key: 'renderChild',
	    value: function renderChild(_options, _parentCount) {
	      var child = void 0,
	          repeat_child = void 0;
	      var count = 0;
	      for (var i = 0; i < this.children.length; i++) {
	        child = this.children[i];
	
	        if (child.isRepeater()) {
	          var prevRepeatLength = child.clonePool.length;
	          var repeatIngredient = _options.resolve ? child.getControlWithResolve('repeat-n') : parseInt(child.getControl('repeat-n'));
	          var repeatCount = void 0;
	
	          if (repeatIngredient instanceof Array) {
	
	            repeatCount = repeatIngredient.length;
	          } else if (typeof repeatIngredient === 'number' && !isNaN(repeatIngredient)) {
	
	            repeatCount = repeatIngredient;
	            repeatIngredient = null;
	          } else if (typeof repeatIngredient === 'string' && /^\d+$/.test(repeatIngredient)) {
	            repeatCount = parseInt(repeatIngredient);
	            repeatIngredient = null;
	          } else {
	            //console.warn(`#${this.id} invalid repeat value[${JSON.stringify(repeatIngredient)}]. Matter Argument:[${child.getControl('repeat-n')}] ${this.DEBUG_FILE_NAME_EXPLAIN}`);
	            throw new Error('#' + this.id + ' invalid repeat value[' + JSON.stringify(repeatIngredient) + ']. Matter Argument:[' + child.getControl('repeat-n') + '] ' + this.DEBUG_FILE_NAME_EXPLAIN);
	          }
	
	          // 반복자 소스 요소는 unmount 를 진행한다.
	          child.render(_options, true);
	
	          for (var repeat_i = 0; repeat_i < Math.max(repeatCount, prevRepeatLength); repeat_i++) {
	            if (repeat_i < repeatCount) {
	              repeat_child = child.clonePool[repeat_i];
	
	              // clonePool 인덱스에 해당하는 요소가 존재 하지 않는 경우 복제하여 clonePool에 push
	              if (!repeat_child) {
	                repeat_child = _Factory2['default'].takeElementNode(child['export'](false, '@' + repeat_i), {
	                  isGhost: true,
	                  repeatOrder: repeat_i,
	                  repeatItem: repeatIngredient ? repeatIngredient[repeat_i] : null,
	                  isRepeated: true
	                }, child.getType(), child.environment, null);
	
	                child.clonePool.push(repeat_child);
	              } else {
	                repeat_child.repeatItem = repeatIngredient ? repeatIngredient[repeat_i] : null;
	              }
	
	              repeat_child.parent = this;
	              repeat_child.upperContainer = this;
	              count = repeat_child.render(_options, false, count);
	              count++;
	            } else {
	              // 현재 반복 인덱스보다 높은 요소는 unmount 진행
	              //child.clonePool[repeat_i].render(_options, true);
	              var willbeunmount = child.clonePool.pop();
	              willbeunmount.render(_options, true);
	            }
	          }
	        } else {
	          count = child.render(_options, false, count);
	          count++;
	        }
	      }
	    }
	  }, {
	    key: 'applyHiddenState',
	    value: function applyHiddenState() {
	      _get(Object.getPrototypeOf(HTMLElementNode.prototype), 'applyHiddenState', this).call(this);
	
	      this.childrenIteration(function (_child) {
	        _child.applyHiddenState();
	      });
	    }
	  }, {
	    key: 'appendChild',
	    value: function appendChild(_elementNode) {
	      if (this.getType() === 'string') {
	        return false;
	      }
	
	      _elementNode.setParent(this);
	      _elementNode.upperContainer = this;
	
	      this.children.push(_elementNode);
	
	      return true;
	    }
	
	    // 기존자식리스트들을 버리고 하나의 자식만 추가한다.
	
	  }, {
	    key: 'setOneChild',
	    value: function setOneChild(_elementNode) {
	      if (this.getType() === 'string') {
	        return false;
	      }
	
	      _elementNode.setParent(this);
	
	      this.children = [_elementNode];
	
	      return true;
	    }
	
	    /**************
	     * dettachChild
	     * 자신의 Children에서 하나의 child를 제거한다.
	     */
	
	  }, {
	    key: 'detachChild',
	    value: function detachChild(_child) {
	      var children = this.children;
	      var newChildList = [];
	
	      for (var i = 0; i < children.length; i++) {
	        var child = children[i];
	
	        if (child != _child) {
	          newChildList.push(child);
	        }
	      }
	
	      this.children = newChildList;
	    }
	  }, {
	    key: 'findById',
	    value: function findById(_id, _absolute) {
	      var targetSplitedId = _id.split('@');
	
	      return this.findRecursive(function (_compareElement) {
	
	        // _absolute 옵션이 있는 경우 ID가 완전히 일치하는 요소를 찾는다.
	        if (_absolute) {
	          return _compareElement.id === _id;
	        }
	
	        if (targetSplitedId.length === 1) {
	          // no depth
	          if (_compareElement.isGhost) {
	            var splited = _compareElement.id.split('@');
	
	            return splited[0] === _id;
	          } else {
	
	            return _compareElement.id === _id;
	          }
	        } else {
	          // has depth
	
	          if (_compareElement.isGhost) {
	            var _splited = _compareElement.id.split('@');
	
	            for (var i = 0; i < targetSplitedId.length; i++) {
	              if (_splited[i]) {
	                if (_splited[i] !== targetSplitedId[i]) {
	                  return false;
	                }
	              }
	            }
	
	            return true;
	          } else {
	            return false;
	          }
	        }
	        return false;
	      });
	    }
	  }, {
	    key: 'findRecursive',
	    value: function findRecursive(_finder) {
	      var result = _finder(this);
	
	      if (result) {
	        return this;
	      } else {
	
	        if (this.isRepeater()) {
	          for (var i = 0; i < this.clonePool.length; i++) {
	            if (typeof this.clonePool[i].findRecursive === 'function') {
	              var recvResult = this.clonePool[i].findRecursive(_finder);
	              if (recvResult) {
	                return recvResult;
	              }
	            }
	          }
	        }
	
	        if (this.children !== undefined) {
	
	          for (var i = 0; i < this.children.length; i++) {
	            if (typeof this.children[i].findRecursive === 'function') {
	              var recvResult = this.children[i].findRecursive(_finder);
	              if (recvResult) {
	                return recvResult;
	              }
	            }
	          }
	        }
	      }
	      return false;
	    }
	
	    // alias : result[Array] == this.children.map(Function)
	
	  }, {
	    key: 'childrenIteration',
	    value: function childrenIteration(_processFunc) {
	      return this.children.map(_processFunc);
	    }
	
	    // HTML 엘리먼트 기반의 요소 기준으로 Tree를 탐색한다.
	    // 탐색은 사용자가 정의 할 수 있으며 treeExplore 메소드를 호출 할 때 인자로 탐색 클로져를 넘겨준다.
	
	  }, {
	    key: 'treeExplore',
	    value: function treeExplore(_explorerFunc) {
	      if (_explorerFunc(this) === null) return;
	
	      if (/^html|grid|ref$/.test(this.getType())) this.childrenIteration(function (_child) {
	        if (_child.isRepeater()) {
	          for (var i = 0; i < _child.clonePool.length; i++) {
	            _child.clonePool[i].treeExplore(_explorerFunc);
	          }
	        }
	
	        if (/^html|grid|ref$/.test(_child.getType())) _child.treeExplore(_explorerFunc);else // string type
	          _explorerFunc(_child);
	      });
	    }
	
	    // buildByComponent(_component) {
	    //   super.buildByComponent(_component);
	    //
	    //   var parsingDom = document.createElement('div');
	    //   parsingDom.innerHTML = React.renderToStaticMarkup(React.createElement(_component.class));
	    //
	    //   this.buildByElement(parsingDom.childNodes[0]);
	    //
	    //   if (typeof _component.CSS !== 'undefined') {
	    //     this.setCSS(_component.CSS);
	    //     this.environment.appendHTMLElementNodeCSS(_component.componentName, _component.CSS);
	    //   }
	    // }
	
	    /******************
	     * buildByDomElement
	     * DomElement 을 자신에게 매핑하여 자신을 빌드한다.
	     * child는 재귀로 호출한다.
	     */
	
	  }, {
	    key: 'buildByElement',
	    value: function buildByElement(_domElement, _absorbOriginDOM) {
	      //    console.time('Build By ElementNode[html]');
	
	      _get(Object.getPrototypeOf(HTMLElementNode.prototype), 'buildByElement', this).call(this, _domElement, _absorbOriginDOM);
	
	      // this.setType('html');
	
	      //////////////////
	      // 자식노드 재귀처리 //
	      var children = [];
	      var childNodes = _ObjectExtends2['default'].arrayToArray(_domElement.childNodes);
	
	      // 자식노드도 생성
	      var child_ = null;
	      var prevElementNode = null;
	      var elementNodeBuildResult = void 0;
	      for (var i = 0; i < childNodes.length; i++) {
	        child_ = childNodes[i];
	
	        // en- 으로 시작되는 태그를 ScopeNode로 취급한다.
	        if (/^en:/i.test(child_.nodeName) || child_.nodeName.toLowerCase() === 'script' && child_.getAttribute('en-scope-type') !== null) {
	
	          this.appendScopeNode(this.buildScopeNodeByScopeDom(child_));
	
	          _domElement.removeChild(child_);
	          continue;
	        }
	
	        var newChildElementNode;
	        // comment node 는 Scope 선언자가 있는지 확인 하고 존재한다면 Scope 로 빌드
	
	        if (child_.nodeName === '#comment') {
	          var text = child_.nodeValue;
	
	          if (/^\@scope/i.test(text)) {
	            this.appendScopeNode(this.buildScopeNodeByScopeText(text));
	          }
	
	          _domElement.removeChild(child_);
	          continue;
	        } else if (child_.nodeName === '#text') {
	          if (child_.parentNode !== null) {
	
	            // 부모 태그가  pre 태그의 경우 공백과 탭 줄바꿈을 그대로 유지하여 랜더링 함으로 그대로 생성을 진행 하도록 한다.
	            // 부모 태그가 pre 태그가 아닌 경우 text노드의 nodeValue 즉 내용이 공백과 줄바꿈 탭으로만 이루어 져 있을 경우 택스트 노드 생성을 스킵하도록 한다.
	            if (child_.parentNode.nodeName.toLowerCase() === "pre") {
	              if (/^[\s\n]+$/g.test(child_.nodeValue)) {
	                _domElement.removeChild(child_);
	                continue;
	              }
	            }
	          }
	
	          newChildElementNode = _Factory2['default'].takeElementNode(undefined, {}, 'string', this.environment);
	        } else {
	          var type = _Factory2['default'].checkElementNodeType(child_);
	
	          newChildElementNode = _Factory2['default'].takeElementNode(undefined, {}, type, this.environment);
	        }
	
	        elementNodeBuildResult = newChildElementNode.buildByElement(child_, _absorbOriginDOM);
	
	        if (elementNodeBuildResult === null) {
	          _domElement.removeChild(child_);
	          continue;
	        }
	
	        newChildElementNode.prevSibling = prevElementNode;
	        children.push(newChildElementNode);
	        newChildElementNode.setParent(this);
	        newChildElementNode.upperContainer = this;
	
	        prevElementNode = newChildElementNode;
	      }
	      // 선택적 재귀끝  //
	      ////////////
	      this.children = children;
	      //    console.timeEnd('Build By ElementNode[html]');
	    }
	
	    // 해당 _child를 제일 마지막 인덱스로 이동시킨다.
	
	  }, {
	    key: 'childBringToBackIndex',
	    value: function childBringToBackIndex(_targetChild) {
	      var sortedArray = [];
	      var targetIndex = void 0;
	      // _child의 인덱스 찾기
	      this.childrenIteration(function (_child, _i) {
	        if (_targetChild === _child) {
	          targetIndex = _i;
	        }
	      });
	
	      var cursor = targetIndex;
	      for (var i = 0; i < this.children.length; i++) {
	        var child = this.children[i];
	        if (i != targetIndex) {
	          sortedArray.push(child);
	        }
	      }
	
	      sortedArray.push(this.children[targetIndex]);
	      this.children = sortedArray;
	    }
	
	    //////////////////////////
	    // import methods
	    /*************
	     * inspireChildren
	     * ElementNode Data객체 리스트를 실제 ElementNode 객체 리스트로 변환한다.
	     * @Param _childrenDataList : JSON Array
	     */
	
	  }, {
	    key: 'inspireChildren',
	    value: function inspireChildren(_childrenDataList) {
	      if (typeof _childrenDataList === 'undefined' || _childrenDataList === null) return []; // object가 아니면 빈 배열을 리턴한다.
	      if (typeof _childrenDataList.length !== 'number') throw new Error("element child nodes is not Array.");
	      var list = [];
	
	      var preInjectProps = {
	        //isRepeated: this.isRepeated,
	        isGhost: this.isGhost
	      };
	
	      var elementNodeData = void 0;
	      var child = void 0;
	      var prevChild = null;
	      for (var i = 0; i < _childrenDataList.length; i++) {
	
	        elementNodeData = _childrenDataList[i];
	
	        // children 에 ElementNode가 바로 입력될 수도 있다.
	        if (!elementNodeData.isElementNode) {
	          child = _Factory2['default'].takeElementNode(elementNodeData, preInjectProps, undefined, this.environment);
	        }
	        child.setParent(this);
	        child.upperContainer = this;
	
	        // 이전 요소 지정
	        child.prevSibling = prevChild;
	
	        list.push(child);
	
	        prevChild = child;
	      }
	
	      return list;
	    }
	  }, {
	    key: 'import',
	    value: function _import(_elementNodeDataObject) {
	      _get(Object.getPrototypeOf(HTMLElementNode.prototype), 'import', this).call(this, _elementNodeDataObject);
	
	      this.children = this.inspireChildren(_elementNodeDataObject.c || []);
	    }
	  }, {
	    key: 'export',
	    value: function _export(_withoutId, _idAppender) {
	      var result = _get(Object.getPrototypeOf(HTMLElementNode.prototype), 'export', this).call(this, _withoutId, _idAppender);
	      result.c = [];
	
	      this.children.map(function (_child) {
	        if (!_child.isGhost) {
	          // 자식이 고스트가 아닌경우만 export한다.
	          result.c.push(_child['export'](_withoutId, _idAppender));
	        } else {
	
	          // 자식이 고스트이면서 반복된 요소일 떄는 export한다.
	          if (!_child.isRepeated) {
	            result.c.push(_child['export'](_withoutId, _idAppender));
	          }
	        }
	      });
	
	      return result;
	    }
	  }, {
	    key: 'exportAsScript',
	    value: function exportAsScript() {
	      // 컴포넌트 지시자 필요
	      // ref없이 컴포넌트 지시자로 지정한 객체로 component가 동작하도록
	
	      Orient.createInstance('html', 'div', {/* etc data */}, {/* properties */});
	      Orient.createInstance('html', 'div', {
	        children: [Orient.createInstance('html', 'div'), Orient.createInstance('html', 'div')]
	      });
	    }
	  }]);
	
	  return HTMLElementNode;
	}(_TagBaseElementNode3['default']);
	
	exports['default'] = HTMLElementNode;

/***/ },

/***/ 56:
/*!*********************************************************************!*\
  !*** ./client/src/js/serviceCrew/ElementNode/TagBaseElementNode.js ***!
  \*********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _ElementNode2 = __webpack_require__(/*! ./ElementNode.js */ 57);
	
	var _ElementNode3 = _interopRequireDefault(_ElementNode2);
	
	var _ObjectExtends = __webpack_require__(/*! ../../util/ObjectExtends */ 27);
	
	var _ObjectExtends2 = _interopRequireDefault(_ObjectExtends);
	
	var _MetaText = __webpack_require__(/*! ../Data/MetaText */ 66);
	
	var _MetaText2 = _interopRequireDefault(_MetaText);
	
	var _ArrayHandler = __webpack_require__(/*! ../../util/ArrayHandler */ 34);
	
	var _ArrayHandler2 = _interopRequireDefault(_ArrayHandler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }
	
	"use strict";
	
	var PIPE_EVENT_SPLIT_REGEXP = /^en-pipe-event-([\w\-\_\d]+)$/;
	var METHOD_SPLIT_REGEXP = /^en-method-([\w\-\_\d\$]+)$/;
	
	var DOM_EVENTS = [
	// Mouse Events
	'click', 'contextmenu', 'dblclick', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseover', 'mouseout', 'mouseup',
	
	// Keyboard Events
	'keydown', 'keypress', 'keyup',
	
	// Frame/Object Events
	'abort', 'beforeunload', 'error', 'hashchange', 'load', 'pageshow', 'pagehide', 'resize', 'scroll', 'unload',
	
	// Form Events
	'blur', 'change', 'focus', 'focusin', 'focusout', 'input', 'invalid', 'reset', 'search', 'select', 'submit',
	
	// Drag Events
	'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop',
	
	// Clipboard Events
	'copy', 'cut', 'paste',
	
	// Print Events
	'afterprint', 'beforeprint',
	
	// Media Events
	'abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'ended', 'error', 'loadeddata', 'loadedmetadata', 'loadstart', 'pause', 'play', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend', 'timeupdate', 'volumechange', 'waiting',
	
	// Animation Events
	'animationend', 'animationiteration', 'animationstart',
	
	// Transition Events
	'transitionend',
	
	// Server-Sent Events
	'error', 'message', 'open',
	
	// Misc Events
	'message', 'mousewheel', 'online', 'offline', 'popstate', 'show', 'storage', 'toggle', 'wheel',
	
	// Touch Events
	'touchcancel', 'touchend', 'touchmove', 'touchstart'];
	
	var ELEMENT_NODE_EVENTS = ["will-update", "did-update", "will-refresh", "did-refresh", "will-dc-request", "will-dc-request-join", "will-dc-bind", "will-dc-bind-join", "dc-did-load", "dc-fail-load", "complete-bind", "complete-bind-join", "first-rendered", // -> component-did-mount
	"io-received", "io-sent", "component-will-update", "component-did-update", "component-will-mount", "component-did-mount", "component-will-unmount", "component-did-unmount", "ref-did-mount", "ref-will-mount"];
	
	var RESERVED_DOM_ATTRIBUTES = {
	  'value': {
	    sync_field: 'value'
	  },
	
	  'checked': {
	    sync_field: 'checked'
	  },
	
	  'selected-index': {
	    sync_field: 'selectedIndex'
	  },
	
	  'selected-item': {
	    sync_field: 'selectedItem'
	  },
	
	  'selected': {
	    sync_field: 'selected'
	  }
	};
	
	var ATTRIBUTE_STATE = {
	  OLD: -1,
	  NOT_MODIFIED: 0,
	  NEW: 1,
	  MODIFIED: 2
	};
	
	var SUPPORT_HTML_TAG_STYLES = {};
	try {
	  if (window) {
	    SUPPORT_HTML_TAG_STYLES = _ObjectExtends2['default'].clone(window.document.head.style);
	  }
	} catch (_e) {
	  console.warn('Window is not declared');
	}
	
	var FINAL_TYPE_CONTEXT = 'base';
	
	var TagBaseElementNode = function (_ElementNode) {
	  _inherits(TagBaseElementNode, _ElementNode);
	
	  function TagBaseElementNode(_environment, _elementNodeDataObject, _preInjectProps, _isMaster) {
	    _classCallCheck(this, TagBaseElementNode);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TagBaseElementNode).call(this, _environment, _elementNodeDataObject, _preInjectProps, _isMaster));
	
	    _this.type = FINAL_TYPE_CONTEXT;
	
	    if (Orient.bn === 'ie' && Orient.bv <= 10) {
	      _ElementNode3['default'].call(_this, _environment, _elementNodeDataObject, _preInjectProps, _isMaster);
	    }
	
	    _this.tagName;
	    _this.attributes;
	    _this.css;
	
	    // remain : 부모의 영역중 자신외의 다른 child가 차지하는 공간을 모두 합하여 부모의 영역에서 그만큼 감소 시켰을 때 남은 값
	    _this.phase; // 위상 자신의 위치정보를 가진다. { horizon: (px|%|left|center|top), vertical: (px|%|top|middle|bottom) }
	
	    if ((typeof _elementNodeDataObject === 'undefined' ? 'undefined' : _typeof(_elementNodeDataObject)) !== 'object') {
	      // 새 엘리먼트가 생성되었다.
	      _this.attributes = [];
	      _this.children = [];
	    }
	    return _this;
	  }
	
	  // will deprecate
	
	
	  _createClass(TagBaseElementNode, [{
	    key: 'test',
	    value: function test() {
	      _get(Object.getPrototypeOf(TagBaseElementNode.prototype), 'test', this).call(this);
	      console.log('test tagbase');
	    }
	  }, {
	    key: 'getTagName',
	
	
	    // Getters
	    // element.tagName -> getTagName()
	    value: function getTagName() {
	      return this.tagName || 'div';
	    }
	  }, {
	    key: 'hasAttribute',
	    value: function hasAttribute(_name) {
	      return this.findAttributeIndex(_name) !== -1;
	    }
	  }, {
	    key: 'findAttributeIndex',
	    value: function findAttributeIndex(_name) {
	
	      return _ArrayHandler2['default'].findIndex(this.getAttributes(), function (_v) {
	        return _v.name === _name;
	      });
	    }
	
	    // attribute
	
	  }, {
	    key: 'getAttribute',
	    value: function getAttribute(_name) {
	      var foundIndex = this.findAttributeIndex(_name);
	
	      if (foundIndex !== -1) {
	        return this.attributes[foundIndex].variable;
	      }
	
	      console.error('ElementNode#' + this.id + ' 의 Attribute \'' + _name + '\' 가 정의되지 않았습니다. ' + this.DEBUG_FILE_NAME_EXPLAIN);
	    }
	  }, {
	    key: 'getAttributeWithResolve',
	    value: function getAttributeWithResolve(_attrName) {
	      return this.interpret(this.getAttribute(_attrName));
	    }
	
	    // will deprecate
	    // id
	
	  }, {
	    key: 'getIdAtrribute',
	    value: function getIdAtrribute() {
	      return this.getAttribute('id');
	    }
	
	    // will deprecate
	    // classes
	
	  }, {
	    key: 'getClasses',
	    value: function getClasses() {
	      return this.getAttribute('class');
	    }
	
	    // attributes
	
	  }, {
	    key: 'getAttributes',
	    value: function getAttributes() {
	      return this.attributes;
	    }
	
	    // will deprecate
	    // Inline Style
	
	  }, {
	    key: 'getInlineStyle',
	    value: function getInlineStyle() {
	      return this.getAttribute('style');
	    }
	
	    // will deprecate
	
	  }, {
	    key: 'getRectangle',
	    value: function getRectangle() {
	      return this.rectangle;
	    }
	  }, {
	    key: 'getBoundingRect',
	    value: function getBoundingRect() {
	
	      var boundingRect;
	      var realElement = this.getDOMNode();
	
	      boundingRect = realElement.getBoundingClientRect();
	
	      return boundingRect;
	    }
	
	    // will deprecate
	
	  }, {
	    key: 'getCurrentRectangle',
	    value: function getCurrentRectangle() {
	      //    console.log(this);
	      //switch (this.environment.contextController.getScreenSizing()) {
	      // switch (this.environment.getScreenSizing()) {
	      //   case "desktop":
	      //     return this.rectangle['desktop'];
	      //   case "tablet":
	      //     return this.rectangle['tablet'];
	      //   case "mobile":
	      //     return this.rectangle['mobile'];
	      // }
	      return {};
	    }
	  }, {
	    key: 'getRectangleByScreenMode',
	    value: function getRectangleByScreenMode(_screenMode) {
	      return this.rectangle[_screenMode];
	    }
	  }, {
	    key: 'setIdAtrribute',
	
	
	    // Setters
	    // Id Atrribute
	    value: function setIdAtrribute(_id) {
	      this.setAttribute('id', _id);
	    }
	
	    // tagName
	
	  }, {
	    key: 'setTagName',
	    value: function setTagName(_tagName) {
	      this.tagName = _tagName;
	    }
	
	    // classes
	
	  }, {
	    key: 'setClasses',
	    value: function setClasses(_classes) {
	      this.setAttribute('class', _classes);
	    }
	
	    // css
	
	  }, {
	    key: 'setCSS',
	    value: function setCSS(_css) {
	      this.css = _css;
	    }
	
	    // tstyle 에 저장된 내용은 랜더링 시에 반영된다.
	    // Temporary Style
	
	  }, {
	    key: 'setTStyle',
	    value: function setTStyle(_name, _value) {
	
	      this.tstyle = this.tstyle || {};
	      this.tstyle[_name] = _value;
	    }
	  }, {
	    key: 'delTStyle',
	    value: function delTStyle(_name) {
	      delete this.tstyle[_name];
	
	      var styleKeys = Object.keys(this.tstyle);
	
	      if (styleKeys.length === 0) {
	        this.tstyle = null;
	      }
	    }
	
	    // attribute
	
	  }, {
	    key: 'setAttribute',
	    value: function setAttribute(_name, _value) {
	      var that = this;
	
	      var foundIndex = this.findAttributeIndex(_name);
	
	      if (foundIndex !== -1) {
	        this.attributes[foundIndex].variable = _value;
	      } else {
	        console.warn('ElementNode#' + this.id + ' 의 \'' + _name + '\' attribute 가 정의되지 않았습니다. 정의되지 않은 Attribute의 값을 변경할 수 없습니다. ' + this.DEBUG_FILE_NAME_EXPLAIN);
	      }
	    }
	  }, {
	    key: 'setInitialAttribute',
	    value: function setInitialAttribute(_name, _initValue) {
	      var foundIndex = this.findAttributeIndex(_name);
	
	      if (foundIndex !== -1) {
	        this.attributes[foundIndex].seed = _initValue;
	      } else {
	        console.warn('ElementNode#' + this.id + ' 의 \'' + _name + '\' attribute 가 정의되지 않았습니다. 새 Attribute를 생성합니다. ' + this.DEBUG_FILE_NAME_EXPLAIN);
	        this.defineNewAttribute(_name, _initValue);
	      }
	    }
	  }, {
	    key: 'defineNewAttribute',
	    value: function defineNewAttribute(_name, _initialValue) {
	      var that = this;
	
	      var duplIndex = this.findAttributeIndex(_name);
	
	      if (duplIndex === -1) {
	        var newAttribute = new _MetaText2['default']({
	          name: _name,
	          seed: _initialValue
	        });
	
	        this.attributes.push(newAttribute);
	      } else {
	        console.warn('ElementNode#' + this.id + ' 의 이미 있는 Attribute\'' + _name + '\'를 정의하려 합니다. 이 작업은 무시됩니다. ' + this.DEBUG_FILE_NAME_EXPLAIN);
	      }
	    }
	
	    // setAttributeWithEvent(_name, _value){
	    //   this.setAttribute(_name, _value)
	    // }
	
	    // will deprecate
	
	  }, {
	    key: 'setRectanglePartWithScreenMode',
	    value: function setRectanglePartWithScreenMode(_partName, _partValue, _screenMode) {
	      var rectangleRef = this.getRectangleByScreenMode(_screenMode);
	      console.log(arguments);
	      // 단순화
	      rectangleRef[_partName] = _partValue;
	
	      // 밑의 구문이 원래 구문이었음 후에 Rectangle관련 문제시 참조하기
	      // if (/^[\d\.]+$/.test(rectangleRef[_partName])) {
	      //   // 숫자로만 이루어져 있을 경우
	      //   rectangleRef[_partName] = _partValue;
	      // } else if (/^[\d\.]+((\w+)|%)$/.test(rectangleRef[_partName])) {
	      //   // 숫자와 알파벳 또는 퍼센트로 이루어져 있을 경우
	      //   this.setRectanglePartWithKeepingUnit(_partValue, _partName);
	      // } else {
	      //   // 아무것도 해당되지 않을 경우
	      //   rectangleRef[_partName] = _partValue;
	      // }
	    }
	
	    // will deprecate
	
	  }, {
	    key: 'setRectanglePartWithKeepingUnit',
	    value: function setRectanglePartWithKeepingUnit(_partValue, _partName) {
	      //console.log(valueWithUnitSeperator(_partValue));
	    }
	  }, {
	    key: 'mappingAttributes',
	    value: function mappingAttributes(_domNode, _options) {
	
	      var oldAttributes = _domNode.attributes;
	      var calculatedAttr = {};
	      var attrName = void 0;
	      var attrValue = void 0;
	      for (var i = 0; i < _domNode.attributes.length; i++) {
	        attrName = oldAttributes[i].nodeName;
	        attrValue = oldAttributes[i].nodeValue;
	
	        calculatedAttr[attrName] = {
	          v: attrValue, // value
	          s: ATTRIBUTE_STATE.OLD // state // OLD 어트리뷰트는 삭제된다.
	        };
	      }
	
	      for (var _i = 0; _i < this.attributes.length; _i++) {
	        attrName = this.attributes[_i].name;
	        attrValue = this.attributes[_i].variable;
	        attrValue = _options.resolve ? this.interpret(attrValue) : attrValue;
	
	        if (attrValue !== null) {
	          if (attrValue instanceof Object) {
	
	            if (attrName === 'style') {
	              /*
	                convert
	                {
	                  fontFamily : 'sans-serif',
	                  WebkitTransition: 'none'
	                }
	                to
	                >  font-family:'sans-serif';-webkit-transition:'none';
	              */
	              var styleKeys = Object.keys(attrValue);
	              var toInlineStyleStringArray = styleKeys.map(function (_key) {
	                return _key.replace(/([A-Z])/g, function (_full, _capital) {
	                  return '-' + _capital.toLowerCase();
	                }) + ':' + attrValue[_key];
	              });
	
	              attrValue = toInlineStyleStringArray.join(';');
	            }
	          }
	
	          if (calculatedAttr[attrName] && calculatedAttr[attrName].v === attrValue) {
	
	            calculatedAttr[attrName].s = ATTRIBUTE_STATE.NOT_MODIFIED;
	          } else {
	            calculatedAttr[attrName] = {
	              v: attrValue,
	              s: ATTRIBUTE_STATE.MODIFIED
	            };
	
	            // calculatedAttr[attrName].v = attrValue;
	            // calculatedAttr[attrName].s = ATTRIBUTE_STATE.MODIFIED;
	          }
	        }
	      }
	
	      var calculatedAttrKeys = Object.keys(calculatedAttr);
	
	      var state = void 0,
	          name = void 0,
	          value = void 0;
	      for (var _i2 = 0; _i2 < calculatedAttrKeys.length; _i2++) {
	        name = calculatedAttrKeys[_i2];
	        state = calculatedAttr[name].s;
	        value = calculatedAttr[name].v;
	
	        if (state === ATTRIBUTE_STATE.OLD) {
	          _domNode.removeAttribute(name);
	
	          if (RESERVED_DOM_ATTRIBUTES[name]) {
	            _domNode[RESERVED_DOM_ATTRIBUTES[name].sync_field] = null;
	          }
	        } else if (state === ATTRIBUTE_STATE.MODIFIED) {
	          _domNode.setAttribute(name, value);
	
	          if (RESERVED_DOM_ATTRIBUTES[name]) {
	            _domNode[RESERVED_DOM_ATTRIBUTES[name].sync_field] = value;
	          }
	        }
	      }
	
	      if (window.ORIENT_SHOW_SPECIAL_ATTRIBUTES) {
	        // #Normals
	        _domNode.setAttribute('en-id', this.getId());
	        _domNode.setAttribute('en-type', this.getType());
	        if (this.getName()) _domNode.setAttribute('en-name', this.getName());
	        if (this.behavior) _domNode.setAttribute('en-behavior', this.behavior);
	
	        // #Controls
	        if (this.getControl('repeat-n')) _domNode.setAttribute('en-ctrl-repeat-n', this.getControl('repeat-n'));
	        if (this.getControl('hidden')) _domNode.setAttribute('en-ctrl-hidden', this.getControl('hidden'));
	        if (this.getControl('fixed-container')) _domNode.setAttribute('en-ctrl-fixed-container', this.getControl('fixed-container'));
	
	        // #DynamicContext
	        if (this.dynamicContextSID) _domNode.setAttribute('en-dc-source-id', this.dynamicContextSID);
	        if (this.dynamicContextPassive !== undefined) _domNode.setAttribute('en-dc-passive', String(this.dynamicContextPassive));
	        if (this.dynamicContextRID) _domNode.setAttribute('en-dc-request-id', this.dynamicContextRID);
	        if (this.dynamicContextNS) _domNode.setAttribute('en-dc-ns', this.dynamicContextNS);
	        if (this.dynamicContextSync) _domNode.setAttribute('en-dc-sync', '');
	        if (this.dynamicContextInjectParams) _domNode.setAttribute('en-dc-inject-params', this.dynamicContextInjectParams);
	
	        if (this.dynamicContextLocalCache) _domNode.setAttribute('en-dc-local-cache', this.dynamicContextLocalCache);
	
	        if (this.dynamicContextSessionCache) _domNode.setAttribute('en-dc-session-cache', this.dynamicContextSessionCache);
	
	        // #Events
	        // dom defaults events
	        if (this.getEvent('click')) _domNode.setAttribute('en-event-click', this.getEvent('click'));
	
	        if (this.getEvent('mouseenter')) _domNode.setAttribute('en-event-mouseenter', this.getEvent('mouseenter'));
	
	        if (this.getEvent('complete-bind')) _domNode.setAttribute('en-event-complete-bind', this.getEvent('complete-bind'));
	      }
	    }
	  }, {
	    key: 'mappingAttribute',
	    value: function mappingAttribute(_dom, _attribute, _options) {
	      var options = _options || {};
	      var value = options.resolve ? this.interpret(_attribute.byString) : _attribute.byString;
	      var name = _attribute.name;
	      console.log(name, value);
	      // Temporary Style 적용
	      if (this.tstyle) {
	        _ObjectExtends2['default'].mergeByRef(_dom.style, this.tstyle, true);
	      }
	
	      // value 의 최종 값이 null 이라면 Attribute가 아얘 추가되지 않도록 함수를 종료한다.
	      if (value === null) return;
	
	      switch (name) {
	        case 'style':
	
	          if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== undefined) {
	            _ObjectExtends2['default'].mergeByRef(_dom.style, value, true);
	            return;
	          }
	          break;
	        case 'value':
	          _dom.value = value;
	          break;
	      }
	
	      this.mappingAttributeDirect(_dom, name, value);
	    }
	  }, {
	    key: 'mappingAttributeDirect',
	    value: function mappingAttributeDirect(_dom, _name, _value) {
	
	      try {
	        _dom.setAttribute(_name, _value);
	      } catch (_e) {
	        if (_e instanceof DOMException) {
	          var error = new Error('ElementNode#' + this.id + ' 의 잘못 된 attribute명 입니다. origin:' + _e.message + ' ' + this.DEBUG_FILE_NAME_EXPLAIN, this.DEBUG_FILE_NAME);
	          error.stack = _e.stack;
	
	          console.info('Error Help :', _e, this.sourceElement, this.DEBUG_FILE_NAME_EXPLAIN);
	          throw error;
	        }
	
	        throw _e;
	      }
	    }
	  }, {
	    key: 'addEventListener',
	    value: function addEventListener(_eventKey, _listenerFunc, _listenerKey) {}
	
	    /*
	      CreateNode
	        HTMLNode를 생성한다.
	    */
	
	  }, {
	    key: 'createNode',
	    value: function createNode() {
	
	      var htmlDoc = void 0;
	
	      if (this.environment) {
	        htmlDoc = this.environment.document;
	      } else {
	        htmlDoc = document;
	      }
	
	      return htmlDoc.createElement(this.getTagName() || 'div');
	    }
	
	    ///////////
	    // Remove Attribute
	
	  }, {
	    key: 'removeAttribute',
	    value: function removeAttribute(_attrName) {
	      var that = this;
	      var newAttributes = [];
	      var deleted = false;
	
	      this.attributes = this.attributes.filter(function (_attribute) {
	
	        if (_attribute.name !== _attrName) {
	          return true;
	        } else {
	          deleted = true;
	          return false;
	        }
	      });
	
	      if (!deleted) {
	        console.error('정의되지 않은 Attribute ' + _attrName + ' 를 제거하려 합니다.');
	      }
	    }
	
	    //////////
	    // Remove Attribute
	
	  }, {
	    key: 'renameAttribute',
	    value: function renameAttribute(_prevName, _nextName) {
	      var foundIndex = this.findAttributeIndex(_prevName);
	
	      if (foundIndex !== -1) {
	        this.attributes[foundIndex].name = _nextName;
	      } else {
	        console.error('정의되지 않은 Attribute ' + _prevName + ' 의 이름을 변경하려 합니다.');
	      }
	    }
	  }, {
	    key: 'buildByElement',
	    value: function buildByElement(_domElement, _absorbOriginDOM) {
	      // for Debug
	      this.sourceElement = _domElement;
	      this.copyAllAtrributeFromDOMElement(_domElement);
	
	      // 빌드시에 참조된 DOM을 흡수하는 경우, 참조된 DOM을 forwardDOM으로 편입시키며 en Event 를 바인딩 한다.
	      // 이 시점에서 Event 를 바인딩하는 이유는 Event 바인딩은 최초랜더링 시에 forwardDOM이 생성될 때만 이벤트가 바인딩 되므로
	      // 참조된 DOM을 흡수하여 빌드 한 후에 랜더링때는 backupDOM으로 DOM이 생성되기 때문이다.
	      if (_absorbOriginDOM === true) {
	        this.forwardDOM = _domElement;
	        this.forwardDOM.___en = this;
	        this.isAttachedDOM = true;
	        this.bindDOMEvents(_domElement, {});
	      }
	    }
	  }, {
	    key: 'copyAllAtrributeFromDOMElement',
	    value: function copyAllAtrributeFromDOMElement(_domElement) {
	      this.setTagName(_domElement.nodeName);
	
	      // __vid__ attribute를 제외하고 요소의 모든 attribute를 카피한다.
	      var attributes = _domElement.attributes;
	      var attrName = void 0;
	      var attrValue = void 0;
	      for (var i = 0; i < attributes.length; i++) {
	        attrName = attributes[i].name;
	        attrValue = attributes[i].value;
	
	        // en 으로 시작하는 모든 attribute 는 특수 예약 attribute로 따로 처리한다.
	        if (/^(en-)|(__vid__$)/.test(attrName)) {
	
	          switch (attrName) {
	            case 'en-id':
	              if (/@/.test(_domElement.getAttribute('en-id'))) {
	                throw new Error("ElementNode Id로 @가 사용 될 수 없습니다.");
	              }
	
	              this.setId(attrValue);
	              break;
	            case 'en-type':
	              this.setType(attrValue);
	              break;
	            case 'en-behavior':
	              this.behavior = attrValue;
	              break;
	            case 'en-name':
	              this.setName(attrValue);
	              break;
	            // DynamicContext
	            case 'en-dc-source-id':
	
	              this.dynamicContextSID = attrValue;
	              break;
	            case 'en-dc-request-id':
	              this.dynamicContextRID = attrValue;
	              break;
	            case 'en-dc-inject-params':
	              this.dynamicContextInjectParams = attrValue;
	              break;
	            case 'en-dc-ns':
	              this.dynamicContextNS = attrValue;
	              break;
	            case 'en-dc-local-cache':
	              this.dynamicContextLocalCache = attrValue;
	              break;
	            case 'en-dc-session-cache':
	              this.dynamicContextSessionCache = attrValue;
	              break;
	            case 'en-dc-passive':
	              if (attrValue === 'false') {
	                this.dynamicContextPassive = false;
	              } else {
	                this.dynamicContextPassive = true;
	              }
	              break;
	            case 'en-dc-sync':
	
	              this.dynamicContextSync = true;
	              break;
	            case 'en-dc-attitude':
	
	              throw new Error("en-dc-attitude='passive' 를 지정하셨습니다. en-dc-passive Attribute로 변경 해 주세요. 사라지게될 attribute입니다.");
	            case 'en-dc-render-dont-care-loading':
	
	              this.dynamicContextRenderDontCareLoading = true;
	              break;
	            case 'en-io-on':
	
	              this.ioListenNames = attrValue;
	
	              break;
	            // Controls
	            case 'en-ctrl-repeat-n':
	
	              if (this.isMaster) throw new Error("Master ElementNode 는 Repeat Control을 사용 할 수 없습니다.");
	
	              this.setControl('repeat-n', attrValue);
	
	              break;
	            case 'en-ctrl-fixed-container':
	
	              this.setControl('fixed-container', attrValue);
	
	              break;
	            case 'en-ctrl-hidden':
	              this.setControl('hidden', attrValue);
	              break;
	            case 'en-ctrl-show':
	              this.setControl('show', attrValue);
	              break;
	
	            case 'en-build-attr-src':
	              /* HTML 빌드 를 거칠 때 브라우저의 처리를 회피하기 위해 */
	
	              this.defineNewAttribute('src', attrValue);
	              break;
	
	            case 'en-build-attr-style':
	              /* HTML 빌드 를 거칠 때 브라우저의 처리를 회피하기 위해 */
	
	              this.defineNewAttribute('style', attrValue);
	              break;
	
	            case 'en-component-representer':
	              this.componentRepresenter = true;
	              break;
	
	            default:
	              // pipe
	              var matched = void 0;
	              if (matched = attrName.match(PIPE_EVENT_SPLIT_REGEXP)) {
	
	                this.setPipeEvent(matched[1], attrValue);
	              } else if (matched = attrName.match(METHOD_SPLIT_REGEXP)) {
	
	                this.setMethod(matched[1], attrValue);
	              } else if (matched = attrName.match(/^en-event-([\w\-\_\d]+)$/)) {
	                // normal
	
	                this.setEvent(matched[1], attrValue);
	              }
	          }
	        } else {
	
	          this.defineNewAttribute(attrName, attrValue);
	        }
	      }
	    }
	
	    // 편집자에 의해 Rect가 변경될 떄
	
	  }, {
	    key: 'transformRectByEditor',
	    value: function transformRectByEditor(_left, _top, _width, _height) {
	
	      var currentRectangleRef = this.getCurrentRectangle();
	
	      if (_left !== undefined) {
	        this.setRectanglePart(_left, 'left');
	      }
	
	      if (_top !== undefined) {
	        this.setRectanglePart(_top, 'top');
	      }
	
	      if (_width !== undefined) {
	        this.setRectanglePart(_width, 'width');
	      }
	
	      if (_height !== undefined) {
	        this.setRectanglePart(_height, 'height');
	      }
	    }
	  }, {
	    key: 'import',
	    value: function _import(_elementNodeDataObject) {
	      _get(Object.getPrototypeOf(TagBaseElementNode.prototype), 'import', this).call(this, _elementNodeDataObject);
	      this.tagName = _elementNodeDataObject.tname;
	      this.behavior = _elementNodeDataObject.beh;
	      this.attributes = _elementNodeDataObject.a || [];
	      this.attributes = this.attributes.map(function (_attributeO) {
	        return new _MetaText2['default'](_attributeO);
	      });
	    }
	  }, {
	    key: 'export',
	    value: function _export(_withoutId, _idAppender) {
	      var result = _get(Object.getPrototypeOf(TagBaseElementNode.prototype), 'export', this).call(this, _withoutId, _idAppender);
	      result.beh = this.behavior;
	      result.a = _ObjectExtends2['default'].clone(this.attributes.map(function (_attribute) {
	        return _attribute['export']();
	      }));
	
	      result.tname = this.getTagName();
	      return result;
	    }
	  }, {
	    key: 'behavior',
	    get: function get() {
	      return this._behavior;
	    },
	    set: function set(_behavior) {
	      this._behavior = _behavior;
	    }
	  }, {
	    key: 'zIndex',
	    get: function get() {
	      return this._zIndex;
	    },
	    set: function set(_zIndex) {
	      this._zIndex = _zIndex;
	    }
	  }]);
	
	  return TagBaseElementNode;
	}(_ElementNode3['default']);
	
	exports['default'] = TagBaseElementNode;

/***/ },

/***/ 57:
/*!**************************************************************!*\
  !*** ./client/src/js/serviceCrew/ElementNode/ElementNode.js ***!
  \**************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	// Actions Import
	
	
	// Functions Import
	
	
	var _events = __webpack_require__(/*! events */ 23);
	
	var _events2 = _interopRequireDefault(_events);
	
	var _ElementNodeMulti = __webpack_require__(/*! ./ElementNodeMulti */ 58);
	
	var _ElementNodeMulti2 = _interopRequireDefault(_ElementNodeMulti);
	
	var _Returns = __webpack_require__(/*! ../../Returns.js */ 59);
	
	var _Returns2 = _interopRequireDefault(_Returns);
	
	var _Factory = __webpack_require__(/*! ./Factory.js */ 54);
	
	var _Factory2 = _interopRequireDefault(_Factory);
	
	var _Identifier = __webpack_require__(/*! ../../util/Identifier.js */ 26);
	
	var _Identifier2 = _interopRequireDefault(_Identifier);
	
	var _ObjectExplorer = __webpack_require__(/*! ../../util/ObjectExplorer.js */ 32);
	
	var _ObjectExplorer2 = _interopRequireDefault(_ObjectExplorer);
	
	var _ObjectExtends = __webpack_require__(/*! ../../util/ObjectExtends.js */ 27);
	
	var _ObjectExtends2 = _interopRequireDefault(_ObjectExtends);
	
	var _ArrayHandler = __webpack_require__(/*! ../../util/ArrayHandler */ 34);
	
	var _ArrayHandler2 = _interopRequireDefault(_ArrayHandler);
	
	var _DynamicContext = __webpack_require__(/*! ./DynamicContext */ 60);
	
	var _DynamicContext2 = _interopRequireDefault(_DynamicContext);
	
	var _Resolver = __webpack_require__(/*! ../DataResolver/Resolver */ 33);
	
	var _Resolver2 = _interopRequireDefault(_Resolver);
	
	var _Action = __webpack_require__(/*! ../Action */ 61);
	
	var _Action2 = _interopRequireDefault(_Action);
	
	var _ActionResult = __webpack_require__(/*! ../ActionResult */ 62);
	
	var _ActionResult2 = _interopRequireDefault(_ActionResult);
	
	var _Factory3 = __webpack_require__(/*! ./ScopeNode/Factory */ 63);
	
	var _Factory4 = _interopRequireDefault(_Factory3);
	
	var _ActionStore = __webpack_require__(/*! ../Actions/ActionStore */ 72);
	
	var _ActionStore2 = _interopRequireDefault(_ActionStore);
	
	var _FunctionStore = __webpack_require__(/*! ../Functions/FunctionStore */ 73);
	
	var _FunctionStore2 = _interopRequireDefault(_FunctionStore);
	
	__webpack_require__(/*! ../Actions/BasicElementNodeActions */ 75);
	
	__webpack_require__(/*! ../Functions/BasicFunctions */ 76);
	
	var _Point = __webpack_require__(/*! ../../util/Point */ 77);
	
	var _Point2 = _interopRequireDefault(_Point);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	"use strict";
	
	var SIGN_BY_ELEMENTNODE = 'EN';
	var EVENT_TASK_MATCHER = /^([\w-]+)@([\w-]+)$/;
	var MAX_RENDER_SERIAL_NUMBER = 70000000;
	var SCOPE_TEXT_OPTIONS_REGEXP = /@([\w\:\-\_\d]+)/g;
	var SCOPE_TEXT_OPTION_SEPARATE_REGEXP = /^@([\w\-\_\d]+?)(?:\:(.*))?$/;
	
	var GET_TEMPORARY_ID_STORE = _Identifier2['default'].chars32SequenceStore();
	var GET_ERORR_ID_STORE = _Identifier2['default'].chars32SequenceStore();
	
	var FINAL_TYPE_CONTEXT = 'base';
	
	var ElementNode = function () {
	  _createClass(ElementNode, null, [{
	    key: 'SIGN_BY_ELEMENTNODE',
	    get: function get() {
	      return SIGN_BY_ELEMENTNODE;
	    }
	  }]);
	
	  function ElementNode(_environment, _elementNodeDataObject, _preInjectProps, _isMaster) {
	    _classCallCheck(this, ElementNode);
	
	    //Object.assign(this, events.EventEmitter.prototype);
	    _ObjectExtends2['default'].liteExtends(this, _events2['default'].EventEmitter.prototype);
	    this.type = FINAL_TYPE_CONTEXT;
	
	    //_.extendOwn(this, Events.EventEmitter.prototype);
	    this[SIGN_BY_ELEMENTNODE] = SIGN_BY_ELEMENTNODE;
	
	    // 미리 삽입된 프로퍼티
	    var preInjectProps = _preInjectProps || {};
	
	    //////////////
	    // 필드 정의
	    ////////////////////////
	
	    // environment profile
	    this.id;
	    this.type; // html / string / ~~react~~ / ~~grid~~ / ref
	    this.name; // 참고용 이름
	
	    this.componentName;
	    this.comment;
	
	    // Element Controls
	    this.controls;
	    /**
	    Controls {
	        repeat-n: number or ${...},
	        hidden: "true|false" or interpert
	    } **/
	
	    this.nodeEvents;
	    this.pipeEvents;
	
	    // date fields
	    this.createDate;
	    this.updateDate;
	
	    // parent refference
	    this.parent = null;
	    this.upperContainer = null; // 자신의 DOM을 붙여 줄 HTMLElementNode
	
	    this.clonePool = []; // repeated
	    this.cloned = false;
	    this.backupDOM = null;
	    this.forwardDOM = null;
	    this.hiddenForwardDOM = null; // hidden construct 가 되었을 때 이전에 forwardDOM을 담는다.
	
	    // Repeat by parent's Repeat Control
	    this.isGhost = preInjectProps.isGhost || false; // 계보에 반복된 부모가 존재하는경우 자식노드의 경우 Ghost로 표시한다.
	    this.isRepeated = preInjectProps.isRepeated || false; // repeat에 의해 반복된 ElementNode 플래그
	    this.repeatOrder = preInjectProps.repeatOrder > -1 ? preInjectProps.repeatOrder : -1; // repeat에 의해 반복된 자신이 몇번째 반복요소인지를 나타낸다.
	    this.repeatItem = preInjectProps.repeatItem || undefined;
	
	    this.properties = _preInjectProps || {};
	
	    this._environment = _environment;
	    this.mode = 'normal';
	    this.dynamicContext = null;
	    // this.parentDynamicContext = _parentDynamicContext || null;
	    this.defaultResolver = new _Resolver2['default']();
	    this.nextSibling = null;
	    this.prevSibling = null;
	
	    // update Queue
	    this.updateQueue = [];
	
	    // 상위 forwardDOM 에서 차지중인 index 범위
	    // repeater 의 경우 index 거리의 차이가 있으며
	    // single 의 경우 x,y 값이 동일하며
	    // hidden 으로 차지 하지 않는 경우 x,y 값이 -1이 된다.
	    // forwardDOM 이 화면에 랜더링 되지 않은 경우도 x,y 값이 -1을 갖는다.
	    this.indexOccupyRange = new _Point2['default'](-1, -1);
	
	    this.isAttachedDOM = false;
	
	    // ElementNode 컴포넌트의 최상위 ElementNode
	    this.isMaster = _isMaster || false;
	
	    this.renderSerialNumber = 0;
	
	    this.connectedSocketIO = false;
	
	    //////////////////////////
	    // 처리로직
	    //////////////////////////
	    // 이미 있는 엘리먼트를 로드한 경우 데이터를 객체에 맵핑해준다.
	    // if (typeof _elementNodeDataObject === 'object') {
	    this['import'](_elementNodeDataObject);
	    // } else {
	    //   // 새 엘리먼트가 생성되었다.
	    //   this.createDate = new Date();
	    //   this.controls = {};
	    //   this.comment = '';
	    // }
	  }
	
	  _createClass(ElementNode, [{
	    key: 'setEnvironment',
	    value: function setEnvironment(_env) {
	      this.environment = _env;
	    }
	
	    //
	    // set parentDynamicContext(_parentDynamicContext) {
	    //   this._parentDynamicContext = _parentDynamicContext;
	    // }
	
	    ////////////////////
	    // Getters
	    // id
	
	  }, {
	    key: 'getId',
	    value: function getId() {
	      return this.id;
	    }
	
	    // name
	
	  }, {
	    key: 'getName',
	    value: function getName() {
	      return this.name;
	    }
	
	    // type
	
	  }, {
	    key: 'getType',
	    value: function getType() {
	      return this.type;
	    }
	
	    // control
	
	  }, {
	    key: 'getControl',
	    value: function getControl(_controlName) {
	      return this.controls[_controlName];
	    }
	  }, {
	    key: 'getMethod',
	    value: function getMethod(_name) {
	      return this.methods[_name];
	    }
	  }, {
	    key: 'getEvent',
	    value: function getEvent(_name) {
	      return this._nodeEvents[_name];
	    }
	  }, {
	    key: 'hasEvent',
	    value: function hasEvent(_name) {
	      return this._nodeEvents[_name] ? true : false;
	    }
	  }, {
	    key: 'getPipeEvent',
	    value: function getPipeEvent(_name) {
	      return this._pipeEvents[_name];
	    }
	  }, {
	    key: 'hasPipeEvent',
	    value: function hasPipeEvent(_name) {
	      return this._pipeEvents[_name] ? true : false;
	    }
	
	    // controls
	
	  }, {
	    key: 'getControls',
	    value: function getControls() {
	      return this.controls;
	    }
	
	    // componentName
	
	  }, {
	    key: 'getComponentName',
	    value: function getComponentName() {
	      return this.componentName;
	    }
	
	    // realElement
	
	  }, {
	    key: 'getRealization',
	    value: function getRealization() {
	      return this.realElement;
	    }
	
	    // parent
	
	  }, {
	    key: 'getParent',
	    value: function getParent() {
	      return this.parent;
	    }
	
	    // css
	
	  }, {
	    key: 'getCSS',
	    value: function getCSS() {
	      return this.css;
	    }
	
	    // comment : 주석
	
	  }, {
	    key: 'getComment',
	    value: function getComment() {
	      return this.comment;
	    }
	  }, {
	    key: 'getControlWithResolve',
	    value: function getControlWithResolve(_controlName) {
	      return this.interpret(this.controls[_controlName]);
	    }
	  }, {
	    key: 'increaseRenderSerialNumber',
	    value: function increaseRenderSerialNumber() {
	      this.renderSerialNumber++;
	
	      if (this.renderSerialNumber === MAX_RENDER_SERIAL_NUMBER) this.renderSerialNumber = 0;
	    }
	
	    ////////////////////
	    // Setters
	    // enid
	
	  }, {
	    key: 'setId',
	    value: function setId(_id) {
	      this.id = _id;
	    }
	
	    // name
	
	  }, {
	    key: 'setName',
	    value: function setName(_name) {
	      this.name = _name;
	    }
	
	    // type
	
	  }, {
	    key: 'setType',
	    value: function setType(_type) {
	      this.type = _type;
	    }
	
	    // componentName
	
	  }, {
	    key: 'setComponentName',
	    value: function setComponentName(_componentName) {
	      this.componentName = _componentName;
	    }
	
	    // parent // 상위노드로 부터 호출됨
	
	  }, {
	    key: 'setParent',
	    value: function setParent(_parentENode) {
	      this.parent = _parentENode;
	    }
	
	    //  will Deprecate
	
	  }, {
	    key: 'unlinkParent',
	    value: function unlinkParent() {
	      this.parent = null;
	    }
	
	    // control
	
	  }, {
	    key: 'setControl',
	    value: function setControl(_controlName, _value) {
	      this.controls[_controlName] = _value;
	    }
	  }, {
	    key: 'setEvent',
	    value: function setEvent(_name, _value) {
	      this._nodeEvents[_name] = _value;
	    }
	  }, {
	    key: 'setMethod',
	    value: function setMethod(_name, _methodSource, _force) {
	      var _this = this;
	
	      this.methods[_name] = _methodSource;
	
	      if (this.hasOwnProperty(_name) && _force !== true) {
	        throw new Error(_name + ' 속성은 예약되어 있거나 이미 정의된 Method 입니다. 강제로 변경하길 원하신다면 force Parameter(3번째 인수)를 true 로 입력하십시오.(정상동작은 보장 할 수 없습니다.)');
	      }
	
	      var methodSourceType = typeof _methodSource === 'undefined' ? 'undefined' : _typeof(_methodSource);
	
	      if (methodSourceType !== 'function' && methodSourceType !== 'string') {
	        throw new Error(_name + ' Method를 부여할 수 없습니다. MethodSource[' + _methodSource + '] 는 Function 타입이거나 바인딩 블럭으로 이루어진 String이어야 합니다.');
	      }
	
	      Object.defineProperty(this, _name, {
	        get: function get() {
	          if (typeof _methodSource === 'function') {
	
	            return _methodSource.bind(_this);
	          } else if (typeof _methodSource === 'string') {
	            var retrievedFunction = _this.interpret(_methodSource);
	
	            var retrievedFunctionType = typeof retrievedFunction === 'undefined' ? 'undefined' : _typeof(retrievedFunction);
	
	            if (retrievedFunctionType === 'function') {
	              return retrievedFunction.bind(_this);
	            } else {
	              throw new Error('Method[' + _name + '] 를 가져 올 수 없습니다.  는 [' + retrievedFunctionType + '] 타입 일 수 없습니다.');
	            }
	          } else {
	            // Method를 Set 할 때 체크하므로 else 에 걸릴 일은 없다.
	            throw new Error(_methodSource + ' 는 Method 로 사용 할 수 없습니다. 바인딩 블럭을 사용하여 Function을 반환 하도록 하거나, Function을 입력하세요.');
	          }
	        }
	      });
	    }
	  }, {
	    key: 'setPipeEvent',
	    value: function setPipeEvent(_name, _value) {
	      this._pipeEvents[_name] = _value;
	    }
	
	    // controls
	
	  }, {
	    key: 'setControls',
	    value: function setControls(_controls) {
	      this.controls = _controls;
	    }
	
	    // comment : 주석
	
	  }, {
	    key: 'setComment',
	    value: function setComment(_comment) {
	      this.comment = _comment;
	    }
	
	    // runtime parameter 로 자신이 변경할 수 없고 외부에서 주입한 값에 따라 동작을 달리한다.
	
	  }, {
	    key: 'getProperty',
	    value: function getProperty(_propKey) {
	      return this.properties[_propKey];
	    }
	
	    // runtime parameter 로 자신이 변경할 수 없고 외부에서 주입한 값에 따라 동작을 달리한다.
	
	  }, {
	    key: 'setProperty',
	    value: function setProperty(_propKey, _value) {
	      this.properties[_propKey] = _value;
	    }
	  }, {
	    key: 'hasProperty',
	    value: function hasProperty(_propKey) {
	      return this.properties.hasOwnProperty(_propKey);
	    }
	  }, {
	    key: 'constructDOMs',
	    value: function constructDOMs(_options) {
	      var that = this;
	
	      try {
	        // options.linkType = options.linkType || 'downstream'; // will deprecate
	        _options.resolve = _options.resolve != undefined ? _options.resolve : true;
	        // options.forward = options.forward != undefined ? options.forward : true;
	        _options.keepDC = _options.keepDC != undefined ? _options.keepDC : false;
	      } catch (_e) {
	        /**
	          _options 인자는 오직 Object만 입력 되어야 한다 null, undefined, NaN 은 허용하지 않는다.
	          _options 객체는 랜러링 흐름에서 단 하나만 존재 하여야 하며 랜더링 중 값이 수정되면 다음 랜더링 대상이 그 값을 상속 받을 수 있도록 한다.
	        **/
	
	        throw new Error("_options is not normal Object");
	      }
	
	      var result = this.constructDOMsInner(_options);
	
	      return result;
	    }
	  }, {
	    key: 'getDOMNode',
	    value: function getDOMNode() {
	      return this.forwardDOM;
	    }
	  }, {
	    key: 'attachForwardDOM',
	    value: function attachForwardDOM(_target) {
	      _target.appendChild(this.forwardDOM);
	      this.isAttachedDOM = true;
	
	      // if (this.isMaster) {
	      //   this.tryEventScope('component-did-mount', {}, null);
	      // }
	      // this.forwardDOM = this.backupDOM;
	      // this.backupDOM = null;
	    }
	  }, {
	    key: 'attachForwardDOMByReplace',
	    value: function attachForwardDOMByReplace(_parentTarget, _old) {
	      _parentTarget.replaceChild(this.forwardDOM, _old);
	      this.isAttachedDOM = true;
	
	      // if (this.isMaster) {
	      //   this.tryEventScope('component-did-mount', {}, null);
	      // }
	      // this.forwardDOM = this.backupDOM;
	      // this.backupDOM = null;
	    }
	
	    // 자신의 이전인덱스에 있는 형제중 상위 DOM에 부착된 가장 가까운 형제를 찾는다.
	
	  }, {
	    key: 'getAttachedPrevSibling',
	    value: function getAttachedPrevSibling() {
	      if (this.prevSibling) {
	        if (this.prevSibling.isAttachedDOM === true) {
	          return this.prevSibling;
	        } else {
	          return this.prevSibling.getAttachedPrevSibling();
	        }
	      }
	
	      return null;
	    }
	
	    // 자신의 다음인덱스에 있는 형제중 상위 DOM에 부착된 가장 가까운 형제를 찾는다.
	
	  }, {
	    key: 'getAttachedNextSibling',
	    value: function getAttachedNextSibling() {
	      if (this.nextSibling) {
	        if (this.nextSibling.isAttachedDOM === true) {
	          return this.nextSibling;
	        } else {
	          return this.nextSibling.getAttachedNextSibling();
	        }
	      }
	
	      return null;
	    }
	  }, {
	    key: 'reconstructDOMs',
	    value: function reconstructDOMs() {
	      this.hiddenForwardDOM = this.forwardDOM;
	      this.forwardDOM = null;
	
	      this.treeExplore(function (_child) {
	        _child.forwardDOM = null;
	        _child.isAttachedDOM = false;
	      });
	    }
	
	    /*
	        ConstructDOMsInner
	          Parameters
	          _options  {
	                resolve: boolean , default:true // 바인딩 진행 여부
	                keelDC: boolean | 'once' , default:false // true - 전체 , false - 유지하지 않음, once - 단 한번 유지된다. constructDOMs 의 대상의 dc만 유지되며 그 하위의 ElementNode의 dc는 유지되지 않는다.
	              }
	        Return
	          true or false
	    */
	
	  }, {
	    key: 'constructDOMsInner',
	    value: function constructDOMsInner(_options) {
	      this.render(_options);
	    }
	
	    // this.forwardDOM이 없을 때
	
	  }, {
	    key: 'mountComponent',
	    value: function mountComponent(_options, _mountIndex) {
	      var domnode = this.createNode(_options);
	      var mountIndex = _mountIndex;
	      this.mappingAttributes(domnode, _options);
	      this.bindDOMEvents(domnode, _options);
	
	      domnode.__orient_mount_index = mountIndex;
	      domnode.___en = this;
	
	      // console.log(_mountIndex, this.parent, this, this.id);
	      if (this.upperContainer) {
	        this.upperContainer.attachDOMChild(mountIndex, domnode, this);
	        this.forwardDOM = domnode;
	      }
	    }
	
	    // this.forwardDOM 이 존재하고 hidden 상태로 변경되거나 , 반복인덱스에서 제외되어 제거 되어야 할 때 호출 한다.
	
	  }, {
	    key: 'unmountComponent',
	    value: function unmountComponent(_options) {
	      //console.log('unmount');
	      if (this.upperContainer) {
	        this.upperContainer.dettachDOMChild(this);
	        this.forwardDOM = null;
	      }
	    }
	
	    // this.forwardDOM이 존재할 때
	
	  }, {
	    key: 'updateComponent',
	    value: function updateComponent(_options, _mountIndex) {
	      var domNode = this.getDOMNode();
	      this.mappingAttributes(domNode, _options);
	      this.bindDOMEvents(domNode, _options);
	
	      domNode.__orient_mount_index = _mountIndex;
	      domNode.___en = this;
	    }
	
	    /**
	      render
	        parameters
	        _options : 랜더링흐름에 공유되는 옵션 오브젝트
	        // _domIndex : 부모 DOM에서의 자신의 위치
	        //   - -1 : 자신이 Unmount 되어야 한다.
	        //   - _domIndex > -1 : 자신이 부착 될 부모DOM 에서의 child Index
	    */
	
	  }, {
	    key: 'render',
	    value: function render(_options, _unmount) {
	      var _this2 = this;
	
	      var _mountIndex = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
	
	      /*
	        랜더링 옵션
	          * careUnknown : Orient 가 알지 못 하는 태그를 보호하며 랜더링 한다. ( ex: modified dom by jquery )
	            - default : false // 알지 못 하는 DOM을 만났을 때 Error 발생.
	          * resolve : 바인딩 블럭을 바인딩 처리하여 결과를 매핑한다.
	            - default : false
	          * keepDC : DynamicContext 를 랜더링 때 실행 한다.
	            - default : false
	      */
	
	      var domNode = this.getDOMNode();
	
	      // this.connectSocketIO();
	
	      this.debug("render", "render start", _options, 'MountIdx : ' + _mountIndex);
	
	      // 자신이 hidden 으로 전환 될 경우 _mountIndex 에서 1을 뺀 값이 returnCount 로 반환된다.
	      var returnCount = _mountIndex;
	      if (!_unmount) {
	        var hidden = _options.resolve ? this.getControlWithResolve('hidden') : this.getControl('hidden');
	        var isHidden = hidden === true || hidden === 'true';
	
	        if (domNode === null) {
	          ////////////////////////////////////////////////////////////////
	          ///////////////////////// Mount Flow ///////////////////////////
	          ////////////////////////////////////////////////////////////////
	
	          // if (this.renderWithHidden(_options)) {
	          //   return returnCount - 1;
	          // }
	
	          this.scopesResolve();
	          if (this.renderWithDC(_options)) {
	            // console.log('DCDCDC ', this.dynamicContextNS);
	            if (this.renderWithHidden(_options)) {
	              //#####################
	              //#### Pass mount #####
	              //#####################
	              // console.log('$$Pass Mount ', this.dynamicContextNS)
	              this.debug("render", "pass mount"); // DEBUG
	              return returnCount - 1;
	            } else {
	              //#####################
	              //####### Mount #######
	              //#####################
	              // console.log('$$ Mount ', this.dynamicContextNS)
	              this.debug("render", "will mount", _options); // DEBUG
	              this.tryEventScope('component-will-mount', null, null, function (_result) {
	
	                _this2.mountComponent(_options, _mountIndex);
	                _this2.debug("render", "did mount", _options); // DEBUG
	                _this2.tryEventScope('component-did-mount', null, null);
	              });
	            }
	          } else {
	            // console.log('$$Stay Mount ', this.dynamicContextNS)
	            return returnCount - 1;
	          }
	        } else {
	          ////////////////////////////////////////////////////////////////
	          //////////////////////// Update Flow ///////////////////////////
	          ////////////////////////////////////////////////////////////////
	
	          if (this.renderWithHidden(_options)) {
	            //##########################
	            //#### to hidden state #####
	            //##########################
	
	            this.debug("render", "will unmount", _options); // DEBUG
	            this.tryEventScope('component-will-unmount', null, null, function (_result) {
	              _this2.unmountComponent(_options);
	
	              _this2.debug("render", "did unmount", _options); // DEBUG
	              _this2.tryEventScope('component-did-unmount', null, null);
	            });
	
	            returnCount = returnCount - 1;
	          } else {
	            //########################
	            //#### general update ####
	            //########################
	
	            this.scopesResolve();
	            if (this.renderWithDC(_options)) {
	
	              this.debug("render", "will update", _options); // DEBUG
	
	              this.tryEventScope('component-will-update', null, null, function (_result) {
	                _this2.updateComponent(_options, _mountIndex);
	
	                _this2.debug("render", "did update", _options); // DEBUG
	                _this2.tryEventScope('component-did-update', null, null);
	              });
	            }
	          }
	        }
	      } else {
	        ////////////////////////////////////////////////////////////////
	        //////////////////////// Unmount Flow //////////////////////////
	        ////////////////////////////////////////////////////////////////
	
	        if (domNode !== null) {
	
	          this.debug("render", "will unmount", _options); // DEBUG
	          this.tryEventScope('component-will-unmount', null, null, function (_result) {
	            _this2.unmountComponent(_options);
	
	            _this2.debug("render", "did unmount", _options); // DEBUG
	            _this2.tryEventScope('component-did-unmount', null, null);
	          });
	        }
	      }
	
	      return returnCount;
	    }
	
	    // hidden 이면 true 반환 아니면 false 반환
	
	  }, {
	    key: 'renderWithHidden',
	    value: function renderWithHidden(_options) {
	      var hidden = _options.resolve ? this.getControlWithResolve('hidden') : this.getControl('hidden');
	      var isHidden = hidden === true || hidden === 'true';
	
	      return isHidden;
	    }
	  }, {
	    key: 'renderWithDC',
	    value: function renderWithDC(_options) {
	      // DC 일때
	      if (this.isDynamicContext()) {
	
	        // active 모드인 경우
	        if (this.dynamicContextPassive !== true) {
	          this.debug('dc', 'is active');
	          // console.log('&& ---- 01 -- ', this.dynamicContextNS);
	
	          // keepDC 가 부정 일 때
	          if (_options.keepDC === false || _options.keepDC === undefined || _options.keepDC === 'false') {
	            this.debug('dc', 'execute');
	            // console.log('&& ---- 02 -- ', this.dynamicContextNS);
	            // DC실행
	            this.executeDynamicContext();
	          } else if (_options.keepDC === 'once') {
	            // console.log('&& ---- 03 -- ', this.dynamicContextNS);
	            this.debug('dc', 'once ignore.');
	            _options.keepDC = false;
	          }
	        } else {
	          this.debug('dc', 'is passive');
	        }
	
	        // console.log('&& ---- MiD -- ', this.dynamicContextNS);
	        // console.dir(this.dynamicContext && this.dynamicContext.dataResolver && JSON.stringify(this.dynamicContext.dataResolver.dataSpace), this.dynamicContextRenderDontCareLoading);
	
	        // dc가 로드여부와 상관없이 랜더링을 진행 할 것인가 체크
	        // dc 로드가 되지 않으면 랜더링 진행을 허용하지 않음
	        if (this.dynamicContextRenderDontCareLoading === false) {
	          // console.log('&& ---- 04 -- ', this.dynamicContextNS);
	          this.debug('dc', 'render will cancel if not complete loading');
	          // console.log(`%% dynamicContextRenderDontCareLoading ${this.dynamicContextRenderDontCareLoading} : ${this.dynamicContextNS}`);
	          // dynamicContext 가 생성되어 있는가?
	          if (this.dynamicContext) {
	
	            // DC로딩이 완료 되었는가?
	            if (this.dynamicContext.isLoaded === true) {
	              this.debug('dc', 'dc is loaded. render continue');
	              return true;
	            } else {
	              this.debug('dc', 'dc is not loaded. render cancel');
	              return false;
	            }
	          } else {
	            // console.log('&& ---- 07 -- ', this.dynamicContextNS);
	            this.debug('dc', 'was not construct. render cancel');
	            return false;
	          }
	        }
	
	        this.debug('dc', 'render continue');
	      }
	
	      return true;
	    }
	  }, {
	    key: 'isRepeater',
	    value: function isRepeater() {
	      return this.getControl('repeat-n') && !this.isRepeated;
	    }
	  }, {
	    key: 'scopesResolve',
	    value: function scopesResolve() {
	      var sn_len = this.scopeNodes.length;
	      var savedPlainValue = void 0,
	          resolveResult = void 0;
	      for (var i = 0; i < sn_len; i++) {
	        if (this.scopeNodes[i].type === 'value' && this.scopeNodes[i].resolveOn) {
	          savedPlainValue = this.scopeNodes[i].plainValue;
	          // resolve 되는 결과는 오직 문자열로만 값을 받아 들인다.
	
	          //this.scopeNodes[i].plainValue = this.interpret(this.scopeNodes[i].plainValue);
	
	          try {
	            resolveResult = this.interpret(savedPlainValue);
	
	            if (!(resolveResult instanceof Error)) {
	
	              if (typeof resolveResult === 'string') this.scopeNodes[i].plainValue = resolveResult;else this.scopeNodes[i].shapeValue = resolveResult;
	            }
	          } catch (_e) {
	            console.warn(_e);
	          }
	        }
	      }
	    }
	  }, {
	    key: 'connectSocketIO',
	    value: function connectSocketIO() {
	      var _this3 = this;
	
	      if (!this.ioListenNames) return;
	      if (!this.environment) throw new Error("Socket IO 이벤트를 청취하기 위해서는 SocketIO 인터페이스를 지원하는 Environment 가 필요 합니다.");
	
	      if (this.connectedSocketIO === false) {
	
	        var names = this.interpret(this.ioListenNames).split(',');
	        var _name2 = void 0;
	        for (var i = 0; i < names.length; i++) {
	          _name2 = names[i];
	
	          this.environment.io.on(_name2, function (_name, _data, _socket) {
	            _this3.tryEventScope('io-received', {
	              subject: _name,
	              data: _data,
	              socket: _socket
	            }, null, function done(_result) {});
	          }, this.id + '_' + _name2);
	        }
	
	        this.connectedSocketIO = true;
	      }
	    }
	  }, {
	    key: 'executeDynamicContext',
	    value: function executeDynamicContext(_callback) {
	      var that = this;
	      // 새로 생성
	
	      /****************************************/
	      /***** Emit Event 'will-dc-request' *****/
	      /****************************************/
	      that.tryEventScope('will-dc-request', {
	        dynamicContext: this.dynamicContext
	      }, null, function done(_result) {
	        if (that.checkAfterContinue(_result) === false) return;
	
	        that.rebuildDynamicContext();
	
	        that.debug('dc', 'Will fire');
	        try {
	          that.dynamicContext.fire(function (_err) {
	            that.debug('dc', 'burn');
	
	            if (_err) {
	              // fix
	              that.tryEventScope('dc-fail-load', {
	                dynamicContext: that.dynamicContext
	              }, null);
	
	              // error 일 때 콜백
	              _callback && _callback(_err, that);
	              return this.print_console_error('DC Loading Error.', 'Detail: ', _err);
	            }
	            // fix
	            that.tryEventScope('dc-did-load', {
	              dynamicContext: that.dynamicContext
	            }, null);
	
	            // 로드 완료시 콜백
	            _callback && _callback(null, that);
	
	            if (!that.dynamicContextSync) {
	              // en-ref-sync 는 will-dc-bind 와 complete-bind를 사용 불가능 하다.
	
	              // fix
	              that.tryEventScope('will-dc-bind', {
	                dynamicContext: that.dynamicContext
	              }, null, function done(_result) {
	                if (that.checkAfterContinue(_result) === false) return;
	
	                if (that.dynamicContextPassive) {
	                  that.update();
	                } else {
	                  that.update({
	                    keepDC: 'once'
	                  });
	                }
	
	                // fix
	                that.tryEventScope('complete-bind', {
	                  dynamicContext: that.dynamicContext
	                }, null);
	              });
	            } else {
	              // sync 는 이벤트를 타지 않는다는 알림
	
	            }
	          });
	        } catch (_e) {
	          //_e.message += that.DEBUG_FILE_NAME_EXPLAIN;
	          throw _e;
	        }
	        return;
	      });
	    }
	
	    // 자신의 backupDOM 을 forwardDOM에 반영한다.
	    // TagBaseElementNode 와 StringElementNode 에서 오버라이드한다.
	
	  }, {
	    key: 'applyForward',
	    value: function applyForward() {
	      // Done
	      throw new Error('오버라이드 해야됨');
	    }
	
	    /*
	      각 ElementType Class 에서 메소드를 구현하여야 한다.
	        CreateNode
	        HTMLElement 또는 TextNode 를 생성한다.
	        return DOMNode
	    */
	
	  }, {
	    key: 'createNode',
	    value: function createNode(options) {
	      throw new Error("Implement this method on ElementNode[" + this.getType() + "]");
	    }
	
	    /*
	      각 ElementType Class 에서 메소드를 구현하여야 한다.
	        MappingAttributes
	        인자로 들어온 DOMNode에 Attribute 또는 nodeValue(text) 를 입력한다.
	      return Nothing
	    */
	
	  }, {
	    key: 'mappingAttributes',
	    value: function mappingAttributes(htmlNode, options) {
	      throw new Error("Implement this method on ElementNode[" + this.getType() + "]");
	    }
	  }, {
	    key: 'bindDOMEvents',
	    value: function bindDOMEvents(_dom, options) {
	      var eventKeys = Object.keys(this.nodeEvents);
	      var that = this;
	
	      // 자신에게 설정된 모든 이벤트를 Dom에 바인딩한다.
	      // dom이 지원하지않는 이벤트(elementNode 전용 이벤트일 경우는 자동으로 무시된다.)
	      eventKeys.map(function (_key, _i) {
	        // 이미 바인딩 된 기록이 있을 경우 바인딩을 하지 않는다.
	        if (_dom['_orient_binded_event_' + _key]) return;
	
	        function handler(_e) {
	          console.log("DOM Event fire :" + _key + ' ' + that.DEBUG_FILE_NAME_EXPLAIN);
	
	          var eventReturn = void 0;
	
	          that.tryEventScope(_key, {
	            eventKey: _key
	          }, _e, function (_result) {
	            eventReturn = _result;
	
	            if (that.checkAfterContinue(_result) === false) return;
	          });
	
	          return eventReturn;
	        }
	
	        if (Orient.bn === 'ie' && Orient.bv >= 10) {
	
	          if (_key === 'input') {
	            if (/^deep-/.test(_key)) {
	              _dom.addEventListener('keyup', handler, true);
	              _dom.addEventListener('change', handler, true);
	            } else {
	              _dom.addEventListener('keyup', handler);
	              _dom.addEventListener('change', handler);
	            }
	
	            return;
	          }
	        }
	
	        if (/^deep-/.test(_key)) {
	          _dom.addEventListener(_key.replace(/^deep-/, ''), handler, true);
	          _dom['_orient_binded_event_' + _key] = true;
	        } else {
	          _dom.addEventListener(_key, handler);
	          _dom['_orient_binded_event_' + _key] = true;
	        }
	      });
	    }
	  }, {
	    key: 'bindJoinEvents',
	    value: function bindJoinEvents(_clonedElementNode) {
	
	      // DC이벤트는 업데이트가 일어날 때 발생한다.
	      if (this.hasEvent('will-dc-request-join')) {
	        _clonedElementNode.on('event-join-will-dc-request', function (_eventName, _clone, _eventResult) {
	          // Todo..
	        });
	      }
	
	      if (this.hasEvent('will-dc-bind-join')) {
	        _clonedElementNode.on('event-join-will-dc-join', function (_eventName, _clone, _eventResult) {
	          // Todo..
	        });
	      }
	
	      if (this.hasEvent('complete-bind-join')) {
	        _clonedElementNode.on('event-join-complete-bind', function (_eventName, _clone, _eventResult) {
	          // Todo..
	        });
	      }
	    }
	  }, {
	    key: 'isDynamicContext',
	    value: function isDynamicContext() {
	      if (this.dynamicContextSID !== undefined) {
	        return true;
	      }
	      return false;
	    }
	  }, {
	    key: 'resetDynamicContext',
	    value: function resetDynamicContext() {
	      var that = this;
	
	      this.dynamicContext = null;
	
	      if (this.isDynamicContext()) {
	
	        this.rebuildDynamicContext();
	
	        this.constructDOMs({});
	
	        this.updateChild(this);
	      } else {
	        throw new Error("resetDynamicContext 실패. DynamicContext 가 아닙니다. " + ('EN ID: ' + this.id));
	      }
	    }
	  }, {
	    key: 'rebuildDynamicContext',
	    value: function rebuildDynamicContext() {
	      var resolvedSourceId = this.interpret(this.dynamicContextSID);
	      var resolvedRequestId = this.interpret(this.dynamicContextRID);
	      var resolvedNamespaces = this.interpret(this.dynamicContextNS);
	
	      var resolvedInjectParams = this.interpret(this.dynamicContextInjectParams);
	
	      var resolvedLocalCache = this.interpret(this.dynamicContextLocalCache);
	      var resolvedSessionCache = this.interpret(this.dynamicContextSessionCache);
	
	      var newDynamicContext = new _DynamicContext2['default'](this.environment, {
	        sourceIDs: resolvedSourceId,
	        requestIDs: resolvedRequestId,
	        namespaces: resolvedNamespaces,
	        sync: this.dynamicContextSync,
	        injectParams: resolvedInjectParams,
	        localCache: resolvedLocalCache,
	        sessionCache: resolvedSessionCache
	      }, this.availableDynamicContext);
	
	      // console.log(newDynamicContext);
	      this.dynamicContext = newDynamicContext;
	    }
	  }, {
	    key: 'getBoundingRect',
	    value: function getBoundingRect() {
	
	      var boundingRect = null;
	      var realElement = this.getRealization();
	
	      if (realElement !== null) boundingRect = realElement.getBoundingClientRect();
	
	      return boundingRect;
	    }
	
	    // realControl
	
	  }, {
	    key: 'isUsingBind',
	    value: function isUsingBind(_controlName) {
	      return this.interpret(this.controls[_controlName]);
	    }
	
	    // isReferenced
	
	  }, {
	    key: 'isReferenced',
	    value: function isReferenced() {
	      return this.getParent() !== null;
	    }
	
	    ////////
	    /***********
	     * updated
	     * 요소가 변경되었을 때 호출한다.
	     */
	
	  }, {
	    key: 'updated',
	    value: function updated() {
	      this.updateDate = new Date();
	    }
	
	    /********
	     * checkDropableComponent
	     * 현재 ElementNode에 다른 component가 드랍될 수 있는지 체크
	     */
	
	  }, {
	    key: 'checkDropableComponentWithDirection',
	    value: function checkDropableComponentWithDirection(_component, _direction) {
	
	      var targetElementNode = null;
	
	      switch (_direction) {
	        case "in":
	          targetElementNode = this;
	          break;
	        case "left":
	        case "right":
	        case "top":
	        case "bottom":
	          targetElementNode = this.getParent();
	          break;
	      }
	
	      if (targetElementNode === null) {
	        return false;
	      }
	
	      switch (_component.elementType) {
	        case "html":
	          // html type component 는 모든곳에 드랍이 가능하다.
	          // react type component 는 실제로 elementNode가 생성되지는 않기 때문에 배제한다.
	          break;
	        case "empty":
	          // empty type Component 는 empty type elementNode를 제외하고 모두 드랍이 가능하다.
	          // react type component 는 실제로 elementNode가 생성되지는 않기 때문에 배제한다.
	          if (targetElementNode.getType() === 'empty') return false;
	          break;
	        // case "react":
	        //   // react type Component 는 empty type elementNode에만 드랍할 수 있다.
	        //   // react type component 는 실제로 elementNode가 생성되지는 않기 때문에 배제한다.
	        //   //if (targetElementNode.getType() !== 'empty') return false;
	        //   break;
	      }
	
	      return true;
	    }
	
	    //////////////////
	    // build my self
	    /******************
	     * buildByComponent
	     * Component 를 이용하여 자신의 필드를 세팅한다.
	     *
	     */
	
	  }, {
	    key: 'buildByComponent',
	    value: function buildByComponent(_component) {
	      //console.log('빌드해라', _component);
	      var elementNodeType = _component.elementType;
	      // this.setType(elementNodeType);
	    }
	  }, {
	    key: 'isDropableComponent',
	    value: function isDropableComponent(_dropType) {
	      var criterionElementNode;
	      var returns = new _Returns2['default']();
	
	      switch (_dropType) {
	        case "appendChild":
	          criterionElementNode = this;
	          break;
	        case "insertBefore":
	        case "insertAfter":
	          if (this.getParent() === null) {
	
	            returns.setReasonCode('has_not_parent');
	            returns.setResult(false);
	            return returns;
	          } else {
	            criterionElementNode = this.getParent();
	          }
	          break;
	      }
	
	      if (criterionElementNode.isGhost) {
	        returns.setReasonCode("is_ghost");
	        returns.setResult(false);
	        return returns;
	      }
	
	      returns.setResult(true);
	      return returns;
	    }
	
	    // 자신을 통해 부모에 삽입되므로 자신의 ElementNode Type과는 상관없이 insertBefore를 지원한다.
	
	  }, {
	    key: 'insertBefore',
	    value: function insertBefore(_elementNode) {
	      var parent = this.getParent();
	      var that = this;
	      if (parent.getType() === 'string') {
	        return false;
	      }
	
	      // 부모의 자식 배열에서 나를 찾는다.
	      var meIndex = _ArrayHandler2['default'].findIndex(parent.children, function (_child) {
	        return _child === that;
	      });
	
	      if (meIndex == 0) {
	        parent.children.unshift(_elementNode);
	      } else {
	        var newParentChildren = [];
	        for (var i = 0; i < parent.children.length; i++) {
	          if (i == meIndex) {
	            newParentChildren.push(_elementNode);
	          }
	          newParentChildren.push(parent.children[i]);
	        }
	
	        parent.children = newParentChildren;
	      }
	      _elementNode.setParent(parent);
	
	      return true;
	    }
	
	    // 자신을 통해 부모에 삽입되므로 자신의 ElementNode Type과는 상관없이 insertAfter를 지원한다.
	
	  }, {
	    key: 'insertAfter',
	    value: function insertAfter(_elementNode) {
	      var parent = this.getParent();
	      var that = this;
	      if (parent.getType() === 'string') {
	        return false;
	      }
	
	      var meIndex = _ArrayHandler2['default'].findIndex(parent.children, function (_child) {
	        return _child === that;
	      });
	
	      if (meIndex == parent.children.length - 1) {
	        parent.children.push(_elementNode);
	      } else {
	        var newParentChildren = [];
	        for (var i = 0; i < parent.children.length; i++) {
	          newParentChildren.push(parent.children[i]);
	          if (i == meIndex) {
	            newParentChildren.push(_elementNode);
	          }
	        }
	
	        parent.children = newParentChildren;
	      }
	
	      _elementNode.setParent(parent);
	
	      return true;
	    }
	  }, {
	    key: 'getParentList',
	    value: function getParentList() {
	      var current = this;
	      var parentList = [];
	
	      while (current.parent !== null) {
	        parentList.unshift(current.parent);
	        current = current.parent;
	      }
	
	      return parentList;
	    }
	  }, {
	    key: 'climbParents',
	    value: function climbParents(_climber) {
	      var current = this;
	
	      while (current.parent !== null) {
	        if (_climber(current.parent) === null) {
	          break;
	        }
	
	        current = current.parent;
	      }
	    }
	  }, {
	    key: 'getPropertyOfMaster',
	    value: function getPropertyOfMaster(_propKey) {
	      var masterElementNode = this.getMaster();
	
	      return masterElementNode.getProperty(_propKey);
	    }
	  }, {
	    key: 'getMaster',
	    value: function getMaster() {
	      var masterElementNode = null;
	
	      if (this.isMaster) return this;
	
	      this.climbParents(function (_forefatherEN) {
	        if (_forefatherEN.isMaster) {
	
	          masterElementNode = _forefatherEN;
	          return null;
	        }
	      });
	
	      if (masterElementNode !== null) {
	        return masterElementNode;
	      }
	
	      throw new Error('Not found Master ElementNode. ' + this.DEBUG_FILE_NAME_EXPLAIN, this);
	    }
	
	    /////////////
	    // String Resolve
	
	  }, {
	    key: 'interpret',
	    value: function interpret(_matterText, _getFeature) {
	      if (_matterText === undefined) return;
	
	      var injectGetterInterface = {
	        getAttribute: this.getAttrOnTree.bind(this),
	        getScope: this.getScope.bind(this),
	        getNodeMeta: this.getNodeMeta.bind(this), // en@
	
	        // extraGetterInterface
	        getFeature: _getFeature, // 사용 위치별 사용가능한 데이터 제공자
	        getProperty: this.getPropertyOfMaster.bind(this) };
	
	      // old fragmentPram
	      // todo .... geo 추가
	      //  getAttributeResolve: this.getAttrOnTreeWithResolve
	      if (this.environment) {
	        injectGetterInterface.executeI18n = this.environment.forInterpret_executeI18N_func; // with Framework
	        injectGetterInterface.getENVConfig = this.environment.forInterpret_config_func; // with Framework
	        // injectGetterInterface.getFragmentParam = this.environment.getParam.bind(this.environment); // to Property
	        // injectGetterInterface.getElementNodeById = this.environment.findById.bind(this.environment);
	      }
	
	      var solved = _matterText;
	      var dc = this.availableDynamicContext;
	
	      try {
	        if (dc) {
	          solved = dc.interpret(solved, injectGetterInterface, this);
	          return solved;
	        } else {
	          return this.defaultResolver.resolve(solved, injectGetterInterface, null, this);
	        }
	      } catch (_e) {
	        _e.message = '[#' + GET_ERORR_ID_STORE() + ']' + _e.message;
	
	        if (window.ORIENT_CLEAR_BD_LOG !== true) {
	          console.log('%c<BB Debug Hint> ' + _e.message + ' ' + this.DEBUG_FILE_NAME_EXPLAIN, 'background: rgb(255, 151, 151); color: rgb(29, 29, 29); padding: 2px; font-weight: normal;');
	          console.log('%cFull sentence : ' + _matterText, 'background: rgb(255, 235, 235); color: rgb(29, 29, 29); padding: 2px; font-weight: normal;');
	          if (_e.interpretArguments) {
	            console.log('%cBindBlock Arguments :', 'background: rgb(255, 235, 235); color: rgb(29, 29, 29); padding: 2px; font-weight: normal;', _e.interpretArguments);
	          }
	        }
	
	        // groupCollapsed 는 IE11부터
	        // console.groupCollapsed(`%c<BB Debug Hint> ${_e.message} ${this.DEBUG_FILE_NAME_EXPLAIN}`, 'background: rgb(255, 235, 235); color: rgb(29, 29, 29); padding: 2px; font-weight: normal;');
	        // console.log(`Full sentence : ${_matterText}`);
	        // if (_e.interpretArguments) {
	        //   console.log('BindBlock Arguments :', _e.interpretArguments);
	        // }
	        // console.groupEnd && console.groupEnd();
	
	        if (window.ORIENT_SUSPENDIBLE_ELEMENTNODE_INTERPRET) throw _e;
	
	        return _e.message;
	      }
	    }
	  }, {
	    key: 'getRepeatNOnTree',
	    value: function getRepeatNOnTree() {
	      if (this.isRepeated) {
	        return this.repeatOrder;
	      } else {
	        // 자신의 부모로부터 반복 순번을 얻음
	        var repeatNumber = -1;
	
	        this.climbParents(function (_parent) {
	          if (_parent.isRepeated) {
	            repeatNumber = _parent.repeatOrder;
	            return null;
	          }
	        });
	
	        if (repeatNumber !== -1) {
	          return repeatNumber;
	        } else {
	          return undefined;
	        }
	      }
	    }
	  }, {
	    key: 'getRepeatItemOnTree',
	    value: function getRepeatItemOnTree() {
	      if (this.isRepeated) {
	        return this.repeatItem;
	      } else {
	        // 자신의 부모로부터 반복 순번을 얻음
	        var repeatItem = -1;
	
	        this.climbParents(function (_parent) {
	          if (_parent.isRepeated) {
	            repeatItem = _parent.repeatItem;
	            return null;
	          }
	        });
	
	        if (repeatItem !== -1) {
	          return repeatItem;
	        } else {
	          return undefined;
	        }
	      }
	    }
	  }, {
	    key: 'getAttrOnTree',
	    value: function getAttrOnTree(_attrName, _resolving) {
	      if (typeof this.getAttribute === 'function') {
	        // 먼저 자신에게서 구한다.
	
	        if (this.hasAttribute(_attrName)) {
	          var attributeValue;
	
	          attributeValue = this.getAttribute(_attrName);
	
	          if (attributeValue !== undefined) {
	            return _resolving ? this.interpret(attributeValue) : attributeValue;
	          }
	        }
	      }
	
	      var parentAttribute = null;
	      this.climbParents(function (_parent) {
	        if (_parent.hasAttribute(_attrName)) {
	          var value = _parent.getAttribute(_attrName);
	
	          if (value !== undefined) {
	            parentAttribute = _resolving ? _parent.interpret(value) : value;
	            return null;
	          }
	        }
	      });
	
	      if (parentAttribute !== null) {
	        return parentAttribute;
	      } else {
	        return '`' + _attrName + '`is null';
	      }
	    }
	  }, {
	    key: 'getScope',
	    value: function getScope(_name, _type, _withString) {
	      var scope = this.getMyScope(_name, _type, _withString);
	
	      if (scope === null) {
	        if (this.parent !== null) return this.parent.getScope(_name, _type, _withString);
	
	        switch (_type) {
	          case "action":
	            var action = _ActionStore2['default'].instance().getAction(_name);
	            // 부모트리상에도 Action이 없다면 ActionStore 에서 Action을 얻는다.
	            return action ? this.__actionToActionScope(action) : null;
	
	          case "function":
	            var _function = _FunctionStore2['default'].instance().getFunction(_name);
	
	            return _function ? this.__functionToFunctionScope(_function) : null;
	        }
	
	        return null;
	      }
	
	      return scope;
	    }
	  }, {
	    key: 'getMyScope',
	    value: function getMyScope(_name, _type, _withString) {
	
	      var findIndex = _ArrayHandler2['default'].findIndex(this.scopeNodes, function (_scopeNode) {
	        return _scopeNode.name === _name && _scopeNode.type === _type;
	      });
	
	      return this.scopeNodes[findIndex] || null;
	    }
	
	    // 추가...
	
	  }, {
	    key: 'getNodeMeta',
	    value: function getNodeMeta(_metaName, _resolve) {
	      switch (_metaName) {
	        case "repeat-n":
	          return this.getRepeatNOnTree();
	        case "repeat-item":
	          return this.getRepeatItemOnTree();
	      }
	    }
	
	    // 모든 ElementNode type 의 Interpret작업이 필요한 항목들을 감지한다.
	    // bindBlockSetList를 반환함.
	
	  }, {
	    key: 'detectInterpret',
	    value: function detectInterpret() {
	      var bindBlockSetList = [];
	      var self = this;
	
	      var extractedBlocks = void 0;
	      _ObjectExplorer2['default'].explore(this.controls, function (_key, _data) {
	        extractedBlocks = self.extractBindBlocks(_data);
	
	        if (extractedBlocks !== null) {
	          extractedBlocks.map(function (_block) {
	            bindBlockSetList.push({
	              key: _key,
	              binder: _block
	            });
	          });
	        }
	      }, 'controls');
	
	      switch (this.getType()) {
	        case "string":
	          extractedBlocks = self.extractBindBlocks(this.getText());
	
	          if (extractedBlocks !== null) {
	            extractedBlocks.map(function (_block) {
	              bindBlockSetList.push({
	                key: 'text',
	                binder: _block
	              });
	            });
	          }
	          break;
	        // case "react":
	        //   ObjectExplorer.explore(this.attributes, function(_key, _data) {
	        //     extractedBlocks = self.extractBindBlocks(_data);
	        //
	        //     if (extractedBlocks !== null) {
	        //       extractedBlocks.map(function(_block) {
	        //         bindBlockSetList.push({
	        //           key: _key,
	        //           binder: _block
	        //         });
	        //       })
	        //     }
	        //   }, 'attributes');
	        //
	        //   ObjectExplorer.explore(this.getReactComponentProps(), function(_key, _data) {
	        //     extractedBlocks = self.extractBindBlocks(_data);
	        //
	        //     if (extractedBlocks !== null) {
	        //       extractedBlocks.map(function(_block) {
	        //         bindBlockSetList.push({
	        //           key: _key,
	        //           binder: _block
	        //         });
	        //       })
	        //     }
	        //   }, 'reactComponentProps');
	        //
	        //   break;
	        case "ref":
	        case "grid":
	        case "html":
	          _ObjectExplorer2['default'].explore(this.attributes, function (_key, _data) {
	            extractedBlocks = self.extractBindBlocks(_data);
	
	            if (extractedBlocks !== null) {
	              extractedBlocks.map(function (_block) {
	                bindBlockSetList.push({
	                  key: _key,
	                  binder: _block
	                });
	              });
	            }
	          }, 'attributes');
	          break;
	      }
	
	      if (bindBlockSetList.length > 0) {
	        return bindBlockSetList;
	      } else {
	        return undefined;
	      }
	    }
	
	    // ${*XXXX}형식의 문자열을 감지하여 리스트로 반환한다.
	    // 감지된 문자열이 없으면 null을 반환한다.
	
	  }, {
	    key: 'extractBindBlocks',
	    value: function extractBindBlocks(_string) {
	      var bindBlocks = [];
	
	      var matched = _string.match(/\$\{\*[^\{^\}]+\}/g);
	
	      return matched;
	    }
	
	    ////////////////////////////////////////// Scope Logics ///////////////////////////////////////////
	
	    // Done
	
	  }, {
	    key: 'buildScopeNodeByScopeDom',
	    value: function buildScopeNodeByScopeDom(_scopeDom) {
	      var scopeDomNodeName = _scopeDom.nodeName;
	      var scopeType = void 0;
	
	      var matches = String(_scopeDom.nodeName).match(/^en:(\w+)$/i);
	
	      if (matches === null) {
	        // SCRIPT 블럭
	        if (_scopeDom.nodeName === 'SCRIPT') {
	          var scopeTypeAttr = _scopeDom.getAttribute("en-scope-type");
	          if (scopeTypeAttr !== null) {
	
	            scopeType = scopeTypeAttr.toLowerCase();
	          } else {
	            console.warn('Script 선언에는 en-scope-type 어트리뷰트가 필요 합니다. ' + this.DEBUG_FILE_NAME_EXPLAIN);
	            return;
	            // throw new Error(`Script 선언에는 en-scope-type 어트리뷰트가 필요 합니다. ${this.DEBUG_FILE_NAME_EXPLAIN}`);
	          }
	        }
	      } else {
	          scopeType = matches[1].toLowerCase();
	        }
	
	      var ScopeNodeClass = _Factory4['default'].getClass(scopeType);
	      var scopeNodeInstance = void 0;
	
	      if (!ScopeNodeClass) {
	        throw new Error('해당 ScopeType' + scopeType + '의 Class를 찾을 수 없습니다. ' + this.DEBUG_FILE_NAME_EXPLAIN);
	      }
	
	      try {
	        scopeNodeInstance = ScopeNodeClass.CreateByScopeDom(_scopeDom);
	      } catch (_e) {
	
	        _e.message = _e.message + this.DEBUG_FILE_NAME_EXPLAIN;
	        throw _e;
	      }
	
	      return scopeNodeInstance;
	    }
	  }, {
	    key: 'buildScopeNodeByScopeText',
	    value: function buildScopeNodeByScopeText(_scopeText) {
	      var lines = _scopeText.split('\n');
	      var headLine = lines.shift();
	
	      var options = headLine.match(SCOPE_TEXT_OPTIONS_REGEXP);
	      if (options === null) throw new Error('ScopeNode 의 선언 Text형식이 잘못 되었습니다. Text:' + _scopeText + ' \n' + this.DEBUG_FILE_NAME_EXPLAIN);
	
	      var name = void 0,
	          type = void 0,
	          etcs = [];
	      var option = void 0,
	          key = void 0,
	          value = void 0;
	      for (var i = 0; i < options.length; i++) {
	        option = options[i];
	        var optionMatched = option.match(SCOPE_TEXT_OPTION_SEPARATE_REGEXP);
	        if (optionMatched === null) continue;
	        key = optionMatched[1];
	        value = optionMatched[2];
	
	        switch (key) {
	          case 'Scope':
	          case 'scope':
	            continue;
	          case 'name':
	            name = value;
	            break;
	          case 'type':
	            type = value;
	            break;
	          default:
	            etcs.push({
	              name: key,
	              value: value
	            });
	        }
	      }
	
	      if (name && type) {
	        var scriptElement = document.createElement('script');
	        scriptElement.setAttribute('name', name);
	        scriptElement.setAttribute('en-scope-type', type);
	
	        var etc = void 0;
	        for (var _i2 = 0; _i2 < etcs.length; _i2++) {
	          etc = etcs[_i2];
	          scriptElement.setAttribute(etc.name, etc.value);
	        }
	
	        for (var _i3 = 0; _i3 < lines.length; _i3++) {
	          scriptElement.innerHTML += lines[_i3] + '\n';
	        }
	
	        return this.buildScopeNodeByScopeDom(scriptElement);
	      } else {
	        throw new Error('Scope의 선언에는 name[' + name + '] 과 type[' + type + '] 이 필요합니다. ' + this.DEBUG_FILE_NAME_EXPLAIN);
	      }
	    }
	
	    // Done
	
	  }, {
	    key: 'appendScopeNode',
	    value: function appendScopeNode(_scopeNode) {
	      // 이미 존재하는 ScopeNode를 미리 찾아 중복을 체크한다.
	      // 중복을 판별하는 필드는 type 과 name 이 사용된다.
	      // 같은 타입간에 중복 name 은 사용이 불가능 하다.
	      var foundDupl = _ArrayHandler2['default'].findIndex(this.scopeNodes, function (_compareScopeNode) {
	        return _compareScopeNode.type === _scopeNode.type && _compareScopeNode.name === _scopeNode.name;
	      });
	
	      // foundDupl 값이 -1 이 아니면 이미 존재하는 ScopeNode로 에러를 발생시킨다.
	      if (foundDupl != -1) {
	        throw new Error("이미 존재하는 ScopeNode 입니다. ScopeNode 는 같은 태그내에서 name 이 중복 될 수 없습니다. \n" + JSON.stringify(_scopeNode['export']()));
	      }
	
	      this.scopeNodes.push(_scopeNode);
	    }
	
	    // ToDo... how? . uh
	
	  }, {
	    key: 'updateScopeNode',
	    value: function updateScopeNode(_scopeNode) {}
	
	    // 상위트리에 존재하는 attribute를 찾아 해당 값을 변경한다.
	
	  }, {
	    key: 'setScopeAttribute',
	    value: function setScopeAttribute(_name, _value) {
	      var owner = this.findAttributeOwner(_name);
	
	      if (owner) {
	        owner.setAttribute(_name, _value);
	      } else {
	        throw new Error(name + ' Atrribute의 값을 변경할 수 없습니다. Attribute \'' + _name + '\' 을 가진 Element를 찾을 수 없었습니다. ' + this.DEBUG_FILE_NAME_EXPLAIN);
	      }
	    }
	  }, {
	    key: 'findAttributeOwner',
	    value: function findAttributeOwner(_name) {
	      if (this.hasAttribute(_name)) {
	        return this;
	      }
	      var target = void 0;
	
	      this.climbParents(function (_parent) {
	
	        if (_parent.hasAttribute(_name)) {
	          target = _parent;
	          return null;
	        }
	      });
	
	      return target;
	    }
	
	    /***************************************
	        Value Scope 값 사용 및 조작 메서드 군
	      *****/
	
	  }, {
	    key: 'setValueScopeData',
	    value: function setValueScopeData(_scopeName, _scopeValue) {
	      var valueScope = this.getScope(_scopeName, 'value');
	      if (valueScope) valueScope.shapeValue = _scopeValue;else throw new Error('선언 되지 않은 변수' + _scopeName + ' 노드(<en:value>)의 값을 변경하려 합니다. <en:value name=\'' + _scopeName + '\' ...></en:value>를 선언 해 주세요.');
	    }
	
	    // Array 타입의 ValueScope 에 _scopeValue 를 push함
	
	  }, {
	    key: 'pushToValueScopeArray',
	    value: function pushToValueScopeArray(_scopeName, _value) {
	      var valueScope = this.getScope(_scopeName, 'value');
	
	      if (valueScope) {
	        if (valueScope.dataType === 'array') {
	          var array = valueScope.shapeValue;
	
	          array.push(_value);
	
	          valueScope.shapeValue = array;
	        } else {
	          throw new Error('Array 타입이 아닌 변수[' + _scopeName + '] 에 Push 연산을 하려 합니다.\n array 타입인 변수를 사용 해 주세요.');
	        }
	      } else throw new Error('선언 되지 않은 변수[' + _scopeName + '] 노드(<en:value>)의 값을 변경하려 합니다.\n <en:value name=\'' + _scopeName + '\' type=\'array\' ...></en:value>를 선언 해 주세요.');
	    }
	  }, {
	    key: 'popToValueScopeArray',
	    value: function popToValueScopeArray(_scopeName) {
	      if (valueScope) {
	        if (valueScope.dataType === 'array') {
	          var array = valueScope.shapeValue;
	
	          array.pop();
	
	          valueScope.shapeValue = array;
	        } else {
	          throw new Error('Array 타입이 아닌 변수[' + _scopeName + '] 에 Pop 연산을 하려 합니다.\n array 타입인 변수를 사용 해 주세요.');
	        }
	      } else throw new Error('선언 되지 않은 변수[' + _scopeName + '] 노드(<en:value>)의 값을 변경하려 합니다.\n <en:value name=\'' + _scopeName + '\' type=\'array\' ...></en:value>를 선언 해 주세요.');
	    }
	
	    // Array 타입의 ValueScope 에 _scopeValue 를 push함
	
	  }, {
	    key: 'popToValueScopeArrayByValue',
	    value: function popToValueScopeArrayByValue(_scopeName, _value) {
	      var valueScope = this.getScope(_scopeName, 'value');
	
	      if (valueScope) {
	        if (valueScope.dataType === 'array') {
	          var array = valueScope.shapeValue;
	          var newArray = [];
	
	          for (var i = 0; i < array.length; i++) {
	            if (_value !== array[i]) newArray.push(array[i]);
	          }
	
	          valueScope.shapeValue = newArray;
	        } else {
	          throw new Error('Array 타입이 아닌 변수[' + _scopeName + '] 에 PopByValue 연산을 하려 합니다.\n array 타입인 변수를 사용 해 주세요.');
	        }
	      } else throw new Error('선언 되지 않은 변수[' + _scopeName + '] 노드(<en:value>)의 값을 변경하려 합니다.\n <en:value name=\'' + _scopeName + '\' type=\'array\' ...></en:value>를 선언 해 주세요.');
	    }
	
	    // Array 타입의 Value Scope내용에 _scopeValue가 존재 하는지 확인 하고
	    // 존재하면 true를 반환 존재하지 않으면 false 를 반환
	    // 이 메서드는 Processing Scope로 제공 되어야 한다.
	
	  }, {
	    key: 'isValueInArrayValueScope',
	    value: function isValueInArrayValueScope(_scopeName, _scopeValue) {
	      var valueScope = this.getScope(_scopeName, 'value');
	
	      if (valueScope) {
	        if (valueScope.dataType === 'array') {
	          var array = valueScope.shapeValue;
	
	          for (var i = 0; i < array.length; i++) {
	            if (array[i] === _value) {
	              return true;
	            }
	          }
	
	          return false;
	        } else {
	          throw new Error('Array 타입이 아닌 변수[' + _scopeName + '] 에 Push 연산을 하려 합니다.\n array 타입인 변수를 사용 해 주세요.');
	        }
	      } else throw new Error('선언 되지 않은 변수[' + _scopeName + '] 노드(<en:value>)의 값을 변경하려 합니다.\n <en:value name=\'' + _scopeName + '\' type=\'array\' ...></en:value>를 선언 해 주세요.');
	    }
	
	    /******
	        Value Scope 사용 및 조작 메서드 군 끝
	      ****************************************/
	
	    /******
	        Pipe
	      ****************************************/
	
	    /*
	      ElementNode 를 찾는다
	    */
	
	  }, {
	    key: 'getElementNodeByInterpretField',
	    value: function getElementNodeByInterpretField(_fieldValue) {
	      // delegate 값에 ElementNode ID 를 입력해도 되고, 바인딩블럭을 이용해 직접 ElementNode 객체를 얻도록 코드를 입력해도 된다.
	      var delegateValue = this.interpret(_fieldValue);
	      var foundEN = void 0;
	
	      // interpret 된 delegateValue 의 데이터타입이 string이면 EN ID로 간주하며
	      // 그 밖의 타입일 경우 ElementNode 객체로 간주한다.
	      if (typeof delegateValue === 'string') {
	
	        foundEN = this.getMaster().findById(_fieldValue);
	      } else {
	        foundEN = delegateValue;
	      }
	
	      if (foundEN && foundEN[SIGN_BY_ELEMENTNODE] === SIGN_BY_ELEMENTNODE) {
	        return foundEN;
	      }
	
	      throw new Error('#' + this.id + ' ' + foundEN + ' is Not ElementNode. \nSEED:\'' + _fieldValue + '\' ' + this.DEBUG_FILE_NAME_EXPLAIN);
	    }
	
	    ///////////////////////////////////// End Scope Logics ////////////////////////////////////////////
	
	    /*
	    ██████  ██ ██████  ███████
	    ██   ██ ██ ██   ██ ██
	    ██████  ██ ██████  █████
	    ██      ██ ██      ██
	    ██      ██ ██      ███████
	    */
	
	  }, {
	    key: 'findPipeEventOwner',
	    value: function findPipeEventOwner(_pipeEventName) {
	      if (this.getPipeEvent(_pipeEventName) !== undefined) {
	        return this;
	      }
	
	      var owner = null;
	      this.climbParents(function (_elementNode) {
	        if (_elementNode.getPipeEvent(_pipeEventName) !== undefined) {
	          owner = _elementNode;
	          return null;
	        }
	      });
	
	      return owner;
	    }
	  }, {
	    key: 'executeEventPipe',
	    value: function executeEventPipe(_pipeName, _pipeEventObject, _completeProcess) {
	      var pipeOwner = this.findPipeEventOwner(_pipeName);
	
	      if (pipeOwner) {
	        pipeOwner.__progressPipeEvent(_pipeName, _pipeEventObject, _completeProcess);
	      } else {
	        console.warn('PIPE 를 Listen하는 ElementNode를 찾을 수 없습니다. PipeName: ' + _pipeName);
	      }
	    }
	
	    /*
	        ███████ ██    ██ ███████ ███    ██ ████████ ███████
	        ██      ██    ██ ██      ████   ██    ██    ██
	        █████   ██    ██ █████   ██ ██  ██    ██    ███████
	        ██       ██  ██  ██      ██  ██ ██    ██         ██
	        ███████   ████   ███████ ██   ████    ██    ███████
	    */
	
	    // 이벤트 발생지점 이후 처리를 진행 할 것인가 말 것인가를 반환
	
	  }, {
	    key: 'checkAfterContinue',
	    value: function checkAfterContinue(_result) {
	      if (_result) {
	        if (_result.returns) {
	          if (_result.returns['continue'] === false) {
	            return false;
	          }
	        }
	      } else if (_result === false) {
	        return false;
	      }
	
	      return true;
	    }
	
	    // 이벤트가 바인드 되어 있다면 이벤트 처리 후 nextProcedure를 실행하고
	    // 이벤트가 바인드 되어 있지 않다면 바로 _nextProcedure를 실행한다.
	
	  }, {
	    key: 'tryEventScope',
	    value: function tryEventScope(_name, _elementNodeEvent, _originDomEvent, _nextProcedure) {
	      //console.log('Fire event :', _name, this.id);
	
	      if (this.hasEvent(_name)) {
	        // event 발생
	
	        // 이벤트 실행 후 다음 function이 있냐에 따라 다음 처리를 수행한다.
	        this.__progressEvent(_name, _elementNodeEvent, _originDomEvent, function done(_result) {
	
	          // for original of clone
	          //this.emit(`event-join-${_name}`, _name, this, result);
	
	          if (typeof _nextProcedure === 'function') _nextProcedure(_result);
	        });
	      } else {
	
	        // 이벤트에 해당되는 지점에서 이벤트에 관한 처리를 진행하려 하였지만
	        // 등록된 이벤트가 없으므로 Event에 대한 처리는 진행하지 않으며 _nextProcedure가 등록되어 있다면
	        // _nextProcedure를 호출하여 이벤트의 다음 처리를 진행한다.
	        if (typeof _nextProcedure === 'function') _nextProcedure({});
	      }
	    }
	  }, {
	    key: 'addRuntimeEventListener',
	    value: function addRuntimeEventListener(_eventKey, _listenerFunc, _listenerKey) {
	      if (this.nodeEvents[_eventKey]) {
	        if (!(this.nodeEvents[_eventKey] instanceof Array)) {
	
	          this.nodeEvents[_eventKey] = [{
	            desc: this.nodeEvents[_eventKey]
	          }];
	        }
	      } else {
	        this.nodeEvents[_eventKey] = [];
	      }
	
	      this.nodeEvents[_eventKey].push({
	        desc: _listenerFunc,
	        key: _listenerKey,
	        runtime: true // 런타임 중에 스크립트로 인해 직접 추가된 Event임을 표시 한다.
	      });
	
	      this.bindDOMEvents(this.getDOMNode());
	    }
	  }, {
	    key: 'removeRuntimeEventListener',
	    value: function removeRuntimeEventListener(_eventKey, _listenerKey) {
	      if (this.nodeEvents[_eventKey]) {
	        if (this.nodeEvents[_eventKey] instanceof Array) {
	          // listener Key 도 입력되었다면 해당 key 의 이벤트만 제거 한다.
	
	          this.nodeEvents[_eventKey] = this.nodeEvents[_eventKey].filter(function (_eventElem) {
	
	            // listenerKey 가 입력되었다면 해당 key 만 제거 하고
	            if (_listenerKey) {
	              return _eventElem.key !== _listenerKey;
	            } else {
	              // key 가 입력되지 않았다면 runtime 등록 이벤트만 모두 제거한다.
	              return _eventElem.runtime ? false : true;
	            }
	          });
	        } else {
	          throw new Error('런타임 중 추가된 [' + _eventKey + ']이벤트가 존재 하지 않습니다.' + this.DEBUG_FILE_NAME_EXPLAIN);
	        }
	      } else {
	
	        throw new Error('삭제할 이벤트 [' + _eventKey + ']가 존재 하지 않습니다.');
	      }
	    }
	
	    /**
	      _name : Event의 이름
	      _elementNodeEvent : ElementNode에서 생성된 이벤트 객체
	      _originDomEvent : DOM Event 객체 ( DOM 이벤트 기반의 이벤트일 경우 세팅 )
	      _completeProcess : 이벤트로 인해 시작된 Task 처리가 완료 되었을 때 호출 된다. ( chain 된 이벤트의 경우 chain 상의 마지막 Task 가 실행완료 된 후 실행 )
	    */
	
	  }, {
	    key: '__progressEvent',
	    value: function __progressEvent(_name, _elementNodeEvent, _originDomEvent, _completeProcess) {
	      var eventDescs = this.getEvent(_name);
	
	      if (eventDescs instanceof Array) {
	        for (var i = 0; i < eventDescs.length; i++) {
	
	          this.__progressEventDesc(eventDescs[i].desc, _elementNodeEvent, _originDomEvent, _completeProcess);
	        }
	      } else {
	        this.__progressEventDesc(eventDescs, _elementNodeEvent, _originDomEvent, _completeProcess);
	      }
	    }
	
	    // PIPE 이벤트
	
	  }, {
	    key: '__progressPipeEvent',
	    value: function __progressPipeEvent(_name, _elementNodeEvent, _completeProcess) {
	      var eventDesc = this.getPipeEvent(_name);
	      console.log('pipe 실행', _name);
	      this.__progressEventDesc(eventDesc, _elementNodeEvent, null, _completeProcess);
	    }
	  }, {
	    key: '__progressEventDesc',
	    value: function __progressEventDesc(_desc, _elementNodeEvent, _originDomEvent, _completeProcess) {
	      if (_desc === undefined) return;
	
	      if (typeof _desc === 'function') {
	
	        this.__executeEventAsFunction(_desc, _elementNodeEvent, _originDomEvent, _completeProcess);
	      } else if (_desc.indexOf('{{') === 0 && _desc.lastIndexOf('}}') === _desc.length - 2) {
	
	        this.__executeEventAsInterpret(_desc, _elementNodeEvent, _originDomEvent, _completeProcess);
	      } else if (_desc.match(EVENT_TASK_MATCHER) !== null) {
	
	        var scope = this.interpret('{{<< ' + _desc + '}}');
	        if (!scope) throw new Error(' ' + _desc + ' Task 를 찾지 못 하였습니다.');
	
	        switch (scope.type) {
	          case "task":
	            // Scope 의 종류가 TaskScopeNode 인가
	            return this.__executeTask(scope, _elementNodeEvent, _originDomEvent, _completeProcess);
	        }
	
	        throw new Error('사용 할 수 없는 eventDescription 입니다. Description: ' + _desc + '. ' + this.DEBUG_FILE_NAME_EXPLAIN);
	      } else {
	        throw new Error('사용 할 수 없는 eventDescription 입니다. \nDescription: ' + _desc + '. ' + this.DEBUG_FILE_NAME_EXPLAIN);
	      }
	    }
	  }, {
	    key: '__executeEventAsInterpret',
	    value: function __executeEventAsInterpret(_desc, _elementNodeEvent, _originDomEvent, _completeProcess) {
	      var enEvent = _elementNodeEvent || {};
	      if (_originDomEvent) {
	        enEvent.originEvent = _originDomEvent;
	      }
	
	      var interpretResult = this.interpret(_desc, function getFeature(_target) {
	        switch (_target) {
	          case "event":
	            return enEvent;
	        }
	      });
	
	      _completeProcess(interpretResult);
	    }
	
	    /*
	      eventListener 로 function이 입력되어 있을 경우 이 메서드를 타게된다.
	      eventListener로 입력된 function은 실행 될 때 인자로 event 객체와 _completeProcess 콜백 함수가 주입된다.
	    */
	
	  }, {
	    key: '__executeEventAsFunction',
	    value: function __executeEventAsFunction(_funcDesc, _elementNodeEvent, _originDomEvent, _completeProcess) {
	      var enEvent = _elementNodeEvent || {};
	      if (_originDomEvent) {
	        enEvent.originEvent = _originDomEvent;
	      }
	
	      _funcDesc.apply(this, [enEvent, _completeProcess]);
	    }
	
	    /*
	      private executeTask
	      Parameters
	        _taskScope : TaskScopeNode객체
	        _enEvent : Orient 에서 정의된 Event의 내용을 포함하는 오브젝트
	        _originEvent : Task 실행의 시발점이 된 DOM 이벤트 오브젝트
	        _completeProcess : Function or Callback Dictionary by Chain code
	        _prevActionResult : 이전 액션 실행 결과
	        _TASK_STACK : Task chain 및 실행 추적 배열
	        _mandator : 최초 위임한 자
	        Return
	        undefined
	    */
	
	  }, {
	    key: '__executeTask',
	    value: function __executeTask(_taskScope, _enEvent, _originEvent, _completeProcess, _prevActionResult, _TASK_STACK, _mandator) {
	
	      // Task 처리 위임
	      // delegate 설정이 입력되어 있고 _mandator(위임자)가 undefined 로 입력되었을 때 위임을 진행한다.
	      if (_taskScope.delegate !== null && _mandator === undefined) {
	
	        var foundEN = this.getElementNodeByInterpretField(_taskScope.delegate);
	
	        if (foundEN) {
	          // 마지막 인자로 위임명령자(mandator, 자신)을 입력한다.
	          foundEN.__executeTask(_taskScope, _enEvent, _originEvent, _completeProcess, _prevActionResult, _TASK_STACK, this);
	        } else {
	          throw new Error('Not found Task delegate target[' + _taskScope.delegate + '].');
	        }
	
	        return true;
	      }
	
	      var __TASK_STACK__ = _TASK_STACK || [];
	      var that = this;
	      var actionName = _taskScope.action;
	      var action = this.__getAction(actionName);
	      var executeParamMap = {}; // {paramName : inject Param Datas, ...}
	      var taskArgs = _taskScope.args;
	      var taskArgMatchIndex = void 0;
	      var enEvent = _enEvent || {};
	      if (_originEvent) {
	        enEvent.originEvent = _originEvent;
	      }
	
	      if (!action) throw new Error(actionName + ' Action을 찾지 못 하였습니다.');
	
	      // action 이 필요로 하는 param에 값을 입력하기 위해
	      // task 의 argument 리스트의 값을가져와 입력한다.
	      // action 이 필요로 하지만 task 의 argument로 입력되지 않은 param 에는 undefined 를 입력한다.
	      action.params.map(function (_paramKey) {
	        taskArgMatchIndex = _ArrayHandler2['default'].findIndex(taskArgs, function (_taskArg) {
	          return _paramKey.toLowerCase() === _taskArg.name.toLowerCase();
	        });
	
	        if (taskArgMatchIndex != -1) {
	          // executeParamMap[_paramKey] = that.interpret(taskArgs[taskArgMatchIndex].value, _prevActionResult, enEvent);
	
	          // 하나의 태스크에는 한번의 위임만 일어날 수 있으며
	          // 위임이 일어나고 위임된 Task 를 위임자가 처음 실행 할 때 인자값에 대한 바인딩은 위임을 명령한요소로 부터 진행한다.
	          // interpret 를 처리 할 요소를 결정한다. _mandator(위임자, 위임명령자)가 입력되어 있을 경우 위임자로 부터 interpret를 진행하며
	          // 위임자가 지정되지 않았을 때 자신으로 interpret 를 진행한다.
	          executeParamMap[_paramKey] = (_mandator || that).interpret(taskArgs[taskArgMatchIndex].value, function getFeature(_target) {
	            switch (_target) {
	              case "event":
	                return enEvent;
	              case "prev-result":
	                return _prevActionResult;
	            }
	          });
	        } else {
	          executeParamMap[_paramKey] = undefined;
	        }
	      });
	
	      // _enEvent, domEvent와 이전 액션의 수행결과를 삽입
	      executeParamMap['_event'] = _enEvent;
	      executeParamMap['_originEvent'] = _originEvent;
	      executeParamMap['_prevResult'] = _prevActionResult;
	
	      // __TASK_STACK__.push({
	      //   task: _taskScope,
	      //   action: action,
	      //   arguments: executeParamMap
	      // });
	
	      __TASK_STACK__.push(_taskScope.name + '@' + _taskScope.action, {
	        task: _taskScope,
	        action: action,
	        paramMap: executeParamMap
	      });
	
	      if (_taskScope.trace) {
	        console.warn('TASK TRACE : ' + _taskScope.name + '@' + _taskScope.action, __TASK_STACK__);
	      }
	
	      var executor = this; // action 에 this로 바인딩 될 action실행자.
	      if (_taskScope.executor !== null) {
	        var _foundEN = this.getElementNodeByInterpretField(_taskScope.executor);
	
	        executor = _foundEN;
	      }
	
	      // 액션을 실행하고 결과를 콜백으로 통보 받는다.
	      //action.execute(executeParamMap, this, this.forwardDOM.ownerDocument.defaultView, function(_actionResult) {
	      action.execute(executeParamMap, executor, _prevActionResult, function (_actionResult) {
	        var chainedTask = void 0;
	
	        // task chain 처리
	        if (_actionResult !== undefined) {
	          _actionResult.origin = 'task@' + _taskScope.name;
	
	          if (/\w+/.test(_actionResult.code)) {
	            var nextTaskName = _taskScope.getChainedTaskName(_actionResult.code);
	
	            if (/\w+/.test(nextTaskName || '')) {
	
	              chainedTask = that.__getTask(nextTaskName);
	
	              // code 에 대응하는 task 명이 지정되어 있지만
	              // getTask 로 지정된 Task를 가져오지 못 했을 때 에러를 발생한다.
	              // 비선언 에러
	              if (!chainedTask) {
	                throw new Error('선언되지 않은 Task를 체인으로 지정하였습니다.\n지정된 TaskName: [' + nextTaskName + '], 체인을 실행시킨 Task: [' + _taskScope.name + '], EID:[' + that.id + ']');
	              }
	            }
	          }
	
	          if (chainedTask) that.__executeTask(chainedTask, _enEvent, _originEvent, _completeProcess, _actionResult, __TASK_STACK__);else {
	            if (typeof _completeProcess === 'function') {
	              _completeProcess(_actionResult);
	            } else if ((typeof _completeProcess === 'undefined' ? 'undefined' : _typeof(_completeProcess)) === 'object' && _completeProcess) {
	              var code = _actionResult.code;
	
	              if (_completeProcess[code] !== undefined) {
	                _completeProcess[code](_actionResult);
	              }
	            }
	          }
	        }
	      });
	    }
	
	    /*
	             █████   ██████ ████████ ██  ██████  ███    ██        ██        ████████  █████  ███████ ██   ██
	            ██   ██ ██         ██    ██ ██    ██ ████   ██        ██           ██    ██   ██ ██      ██  ██
	            ███████ ██         ██    ██ ██    ██ ██ ██  ██     ████████        ██    ███████ ███████ █████
	            ██   ██ ██         ██    ██ ██    ██ ██  ██ ██     ██  ██          ██    ██   ██      ██ ██  ██
	            ██   ██  ██████    ██    ██  ██████  ██   ████     ██████          ██    ██   ██ ███████ ██   ██
	    */
	
	    // scope에서 먼저 action을 찾고
	
	  }, {
	    key: '__getAction',
	    value: function __getAction(_actionName) {
	      var actionScope = this.getScope(_actionName, 'action');
	
	      if (actionScope !== null) return this.__actionScopeToAction(actionScope);
	
	      // actionStore 에서 action가져와서 반환
	      return _ActionStore2['default'].instance().getAction(_actionName);
	    }
	  }, {
	    key: '__actionScopeToAction',
	    value: function __actionScopeToAction(_actionScope) {
	      var action = new _Action2['default']({
	        name: _actionScope.name,
	        params: _actionScope.params,
	        actionBody: _actionScope.actionBody
	      });
	
	      return action;
	    }
	  }, {
	    key: '__actionToActionScope',
	    value: function __actionToActionScope(_action) {
	      var actionScopeClass = _Factory4['default'].getClass('action');
	
	      return new actionScopeClass({
	        name: _action.name,
	        params: _action.params,
	        actionBody: _action.actionBody
	      });
	    }
	  }, {
	    key: '__functionToFunctionScope',
	    value: function __functionToFunctionScope(_function) {
	      var functionScopeClass = _Factory4['default'].getClass('function');
	      var functionScope = new functionScopeClass({
	        name: _function.name,
	        functionReturner: null
	      });
	
	      functionScope.executableFunction = _function.executableFunction;
	
	      return functionScope;
	    }
	  }, {
	    key: '__getTask',
	    value: function __getTask(_taskName) {
	      return this.interpret('{{<< task@' + _taskName + '}}');
	    }
	
	    // Event end
	
	  }, {
	    key: 'update',
	    value: function update(_options) {
	      var options = _options || {};
	      if (options.resolve === undefined || options.resolve === null) {
	        options.resolve = true;
	      }
	
	      if (options.keepDC === undefined || options.keepDC === null) {
	        options.keepDC = false;
	      }
	
	      this.render(options);
	    }
	
	    /*
	        ██████  ██    ██ ██████  ██      ██  ██████      █████  ██████  ██
	        ██   ██ ██    ██ ██   ██ ██      ██ ██          ██   ██ ██   ██ ██
	        ██████  ██    ██ ██████  ██      ██ ██          ███████ ██████  ██
	        ██      ██    ██ ██   ██ ██      ██ ██          ██   ██ ██      ██
	        ██       ██████  ██████  ███████ ██  ██████     ██   ██ ██      ██
	    */
	
	  }, {
	    key: 'setValue',
	    value: function setValue(_name, _value) {
	      this.setValueScopeData(_name, _value);
	    }
	  }, {
	    key: 'updateSingle',
	    value: function updateSingle(_options) {
	      this.constructDOM(_options);
	      this.applyForward(_options);
	    }
	  }, {
	    key: 'getValue',
	    value: function getValue(_name) {
	
	      var valueScope = this.getScope(_name, 'value');
	
	      if (valueScope) return valueScope.shapeValue;else throw new Error('선언 되지 않은 변수[' + _name + ']를 참조합니다.');
	    }
	  }, {
	    key: 'setAttrR',
	    value: function setAttrR(_name, _value) {
	      this.setScopeAttribute(_name, _value);
	    }
	  }, {
	    key: 'getAttrR',
	    value: function getAttrR(_name) {
	      var owner = this.findAttributeOwner(_name);
	
	      if (owner) {
	        return owner.getAttributeWithResolve(_name);
	      } else {
	        throw new Error('Attribute ' + _name + '을 찾아 올 수 없습니다. Attribute ' + _name + '을 가진 Element가 없습니다. ' + this.DEBUG_FILE_NAME_EXPLAIN);
	      }
	    }
	  }, {
	    key: 'executeDC',
	    value: function executeDC(_callback) {
	      this.executeDynamicContext(_callback);
	    }
	  }, {
	    key: 'executeTask',
	    value: function executeTask() {
	      var taskScope = this.getScope(arguments[0], 'task');
	      if (!taskScope) {
	        throw new Error('Task를 찾을 수 없습니다. "' + arguments[0] + '"');
	      }
	
	      if (arguments.length === 3) {
	        /*
	          arguments[0] : TaskName
	          arguments[1] : prevResult
	          arguments[2] : completeCallback
	        */
	
	        this.__executeTask(taskScope, {}, null, arguments[2], arguments[1]);
	      } else if (arguments.length === 2) {
	        /*
	          arguments[0] : TaskName
	          arguments[1] : completeCallback
	        */
	
	        this.__executeTask(taskScope, {}, null, arguments[1]);
	      } else {
	        /*
	          arguments[0] : TaskName
	        */
	
	        this.__executeTask(taskScope, {}, null, null);
	      }
	    }
	  }, {
	    key: 'execActionDirect',
	    value: function execActionDirect(_actionName, _argMap, _callback) {
	      var action = this.__getAction(_actionName);
	
	      if (action) {
	        var paramList = action.params;
	        var paramMap = {};
	
	        for (var i = 0; i < paramList.length; i++) {
	          paramMap[paramList[i]] = null;
	        }
	
	        _ObjectExtends2['default'].mergeByRef(paramMap, _argMap || {}, true);
	
	        action.execute(paramMap, this, null, function (_actionResult) {
	
	          _callback && _callback(_actionResult);
	        });
	      } else {
	        throw new Error('\'' + _actionName + '\' Action is not declared.');
	      }
	    }
	  }, {
	    key: 'executeTaskWithPrevResult',
	    value: function executeTaskWithPrevResult(_taskName, _prevActionResult, _completeProcess) {
	      var taskScope = this.getScope(_taskName, 'task');
	
	      // if (_prevActionResult) {
	      //   if (_prevActionResult.clazz !== "ActionResult") {
	      //     throw new Error("직접 Task 를 실행할 때 3번째 인자로 ActionResult 객체를 입력해 주세요.");
	      //   }
	      // }
	
	      this.__executeTask(taskScope, {}, null, _completeProcess, _prevActionResult);
	    }
	  }, {
	    key: 'getFunction',
	    value: function getFunction(_functionName) {
	      var functionScope = this.getScope(_functionName, 'function');
	      return functionScope.executableFunction;
	    }
	  }, {
	    key: 'setEventListener',
	    value: function setEventListener(_eventName, _eventDesc) {
	      this.nodeEvents[_eventName] = _eventDesc;
	    }
	  }, {
	    key: 'setPipeEventListener',
	    value: function setPipeEventListener(_eventName, _eventDesc) {
	      this.pipeEvents[_eventName] = _eventDesc;
	    }
	
	    // Method 에 제공할(컴포넌트의 확장용 ) this오브젝트를 얻는다.
	
	  }, {
	    key: 'getMethodOwner',
	    value: function getMethodOwner() {
	      return {};
	    }
	
	    /*
	        ██████  ███████ ██████  ██    ██  ██████  ███████ ██████
	        ██   ██ ██      ██   ██ ██    ██ ██       ██      ██   ██
	        ██   ██ █████   ██████  ██    ██ ██   ███ █████   ██████
	        ██   ██ ██      ██   ██ ██    ██ ██    ██ ██      ██   ██
	        ██████  ███████ ██████   ██████   ██████  ███████ ██   ██
	    */
	
	    /**
	      Keys: dc, construct, hidden
	    **/
	
	  }, {
	    key: 'debug',
	    value: function debug(_key) {
	      if (!(console.info.apply instanceof Function)) return;
	
	      if (this.type !== 'string') {
	        if (this.hasAttribute('trace')) {
	
	          var args = [];
	          args.push(_key.toUpperCase() + ' : [' + this.id + ']');
	          for (var i = 1; i < arguments.length; i++) {
	            args.push(arguments[i]);
	          }
	
	          if (!_key && !(args.length > 0)) throw new Error("Key 와 다음 내용을 입력하지 않았습니다. log사용을 위해서는 this.log(KEY, LOG MESSAGES ... )를 사용해야 합니다.");
	
	          var trace = this.getAttribute('trace');
	          if (trace === '') {
	            console.info.apply(console, args);
	            return;
	          }
	
	          // trace = dc:error,construct:warn
	          var keyPair = this.getAttribute('trace').split(',');
	          for (var _i4 = 0; _i4 < keyPair.length; _i4++) {
	            var keyAndLevel = keyPair[_i4].split(':');
	
	            if (keyAndLevel[0] === _key) {
	              switch (keyAndLevel[1]) {
	                case "alert":
	                  args.toString = function () {
	                    return this.join(' ');
	                  };
	                  alert(args);
	                  break;
	                case "error":
	                  console.error.apply(console, args);
	                  break;
	                case "info":
	                  console.info.apply(console, args);
	                  break;
	                case "warn":
	                  console.warn.apply(console, args);
	                  break;
	                case "debug":
	                  console.debug.apply(console, args);
	                  break;
	                case "trace":
	                  if (console.trace) console.trace.apply(console, args);
	                  break;
	                default:
	                  console.log.apply(console, args);
	              }
	            }
	          }
	        }
	      }
	    }
	  }, {
	    key: 'debugKeyToTitle',
	    value: function debugKeyToTitle(_key) {
	      switch (_key) {
	        case "dc":
	          return "DynamicContext";
	        case "construct":
	          return "DOM Construct";
	        default:
	          return _key;
	      }
	    }
	  }, {
	    key: 'setDebuggingInfo',
	    value: function setDebuggingInfo(_key, _value) {
	      this.debuggingStore = this.debuggingStore || {};
	      this.debuggingStore[_key] = _value;
	    }
	  }, {
	    key: 'getDebuggingInfo',
	    value: function getDebuggingInfo(_key, _value) {
	      return (this.debuggingStore || {})[_key];
	    }
	  }, {
	    key: 'print_console_warn',
	    value: function print_console_warn() {
	      if (window.console) {
	        if (window.console.warn.apply instanceof Function) {
	          var modifiedArgs = _ObjectExtends2['default'].union(['Warning : '], _ObjectExtends2['default'].arrayToArray(arguments), [this.DEBUG_FILE_NAME_EXPLAIN]);
	
	          console.warn.apply(console, modifiedArgs);
	        }
	      }
	    }
	  }, {
	    key: 'print_console_info',
	    value: function print_console_info() {
	      if (window.console) {
	        if (window.console.info.apply instanceof Function) {
	          var modifiedArgs = _ObjectExtends2['default'].union(['Info : '], _ObjectExtends2['default'].arrayToArray(arguments), [this.DEBUG_FILE_NAME_EXPLAIN]);
	
	          console.info.apply(console, modifiedArgs);
	        }
	      }
	    }
	  }, {
	    key: 'print_console_error',
	    value: function print_console_error() {
	      if (window.console) {
	        if (window.console.error.apply instanceof Function) {
	          var modifiedArgs = _ObjectExtends2['default'].union(['Error : '], _ObjectExtends2['default'].arrayToArray(arguments), [this.DEBUG_FILE_NAME_EXPLAIN]);
	
	          console.error.apply(console, modifiedArgs);
	        }
	      }
	    }
	  }, {
	    key: 'throw_new_error',
	    value: function throw_new_error(_message) {
	      throw new Error('Error : ' + _message + ' ' + this.DEBUG_FILE_NAME_EXPLAIN);
	    }
	
	    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	    /* ------------------ Event Handing Methods End --------------------------------------------------------------------------------- */
	    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	  }, {
	    key: 'import',
	    value: function _import(_elementNodeDataObject) {
	      var _this4 = this;
	
	      // this.id = _elementNodeDataObject.id || Identifier.genUUID().toUpperCase();
	      this.id = _elementNodeDataObject.id || "!en_" + GET_TEMPORARY_ID_STORE();
	
	      this.type = _elementNodeDataObject.type;
	      this.name = _elementNodeDataObject.name;
	
	      this.dynamicContextPassive = _elementNodeDataObject.dcp;
	      this.dynamicContextSID = _elementNodeDataObject.dcsid;
	      this.dynamicContextRID = _elementNodeDataObject.dcrid;
	      this.dynamicContextNS = _elementNodeDataObject.dcns;
	      this.dynamicContextSync = _elementNodeDataObject.dcsync;
	      this.dynamicContextInjectParams = _elementNodeDataObject.dcip;
	      this.dynamicContextRenderDontCareLoading = _elementNodeDataObject.dcrdcl || false;
	      this.dynamicContextLocalCache = _elementNodeDataObject.dclc;
	      this.dynamicContextSessionCache = _elementNodeDataObject.dcsc;
	
	      // 참조되는 컴포넌트의 대표자
	      this.componentRepresenter = _elementNodeDataObject.cr;
	
	      // Socket IO
	      this.ioListenNames = _elementNodeDataObject.iln;
	
	      this.componentName = _elementNodeDataObject.cn;
	
	      this.methods = Object.keys(_elementNodeDataObject.methods || {}).map(function (_key) {
	        _this4.setMethod(_key, _elementNodeDataObject.methods[_key], true);
	      });
	
	      this.controls = _elementNodeDataObject.controls || {};
	
	      this.scopeNodes = _elementNodeDataObject.scopeNodes ? _elementNodeDataObject.scopeNodes.map(function (_scopeNodeObject) {
	        return new (_Factory4['default'].getClass(_scopeNodeObject.type))(_scopeNodeObject);
	      }) : [];
	
	      this.nodeEvents = _elementNodeDataObject.nodeEvents || {};
	      this.pipeEvents = _elementNodeDataObject.pipeEvents || {};
	
	      this.comment = _elementNodeDataObject.comment || '';
	
	      this.createDate = _elementNodeDataObject.cd;
	      this.updateDate = _elementNodeDataObject.ud;
	    }
	
	    //////////////////////////
	    // export methods
	
	  }, {
	    key: 'export',
	    value: function _export(_withoutId, _idAppender) {
	      var exportObject = {
	        id: _withoutId ? undefined : this.id + (_idAppender || ''),
	        name: this.getName(),
	        cn: this.getComponentName()
	      };
	
	      if (this.type !== 'html') {
	        exportObject.type = this.getType();
	      }
	
	      if (this.getComment()) {
	        exportObject.comment = this.getComment();
	      }
	
	      if (Orient.Shortcut.isntEmpty(this.methods || {})) {
	        exportObject.methods = _ObjectExtends2['default'].clone(this.methods);
	      }
	
	      if (Orient.Shortcut.isntEmpty(this.controls || {})) {
	        exportObject.controls = _ObjectExtends2['default'].clone(this.getControls());
	      }
	
	      if (Orient.Shortcut.isntEmpty(this.scopeNodes || [])) {
	        exportObject.scopeNodes = _ObjectExtends2['default'].clone(this.scopeNodes.map(function (_scopeNode) {
	          return _scopeNode['export']();
	        }));
	      }
	
	      if (Orient.Shortcut.isntEmpty(this.nodeEvents || {})) {
	        exportObject.nodeEvents = {};
	        var keys = Object.keys(this.nodeEvents);
	        var key = void 0;
	        for (var i = 0; i < keys.length; i++) {
	          key = keys[i];
	
	          if (this.nodeEvents[key] instanceof Array) {
	            for (var j = 0; j < this.nodeEvents[key].length; j++) {
	              if (!this.nodeEvents[key][j].runtime) exportObject.nodeEvents[key] = this.nodeEvents[key][j].desc;
	            }
	          } else {
	            exportObject.nodeEvents[key] = this.nodeEvents[key];
	          }
	        }
	      }
	
	      if (Orient.Shortcut.isntEmpty(this.pipeEvents || {})) {
	        exportObject.pipeEvents = _ObjectExtends2['default'].clone(this.pipeEvents);
	      }
	
	      if (this.createDate) {
	        exportObject.cd = new Date(this.createDate);
	      }
	
	      if (this.updateDate) {
	        exportObject.ud = new Date(this.updateDate);
	      }
	
	      // DC
	      if (this.dynamicContextPassive) exportObject.dcp = this.dynamicContextPassive;
	      if (this.dynamicContextSID) exportObject.dcsid = this.dynamicContextSID;
	      if (this.dynamicContextRID) exportObject.dcrid = this.dynamicContextRID;
	      if (this.dynamicContextNS) exportObject.dcns = this.dynamicContextNS;
	      if (this.dynamicContextSync) exportObject.dcsync = this.dynamicContextSync;
	      if (this.dynamicContextInjectParams) exportObject.dcip = this.dynamicContextInjectParams;
	      if (this.dynamicContextRenderDontCareLoading) exportObject.dcrdcl = this.dynamicContextRenderDontCareLoading;
	      if (this.dynamicContextLocalCache) exportObject.dclc = this.dynamicContextLocalCache;
	      if (this.dynamicContextSessionCache) exportObject.dcsc = this.dynamicContextSessionCache;
	
	      if (this.componentRepresenter === true) exportObject.cr = this.componentRepresenter;
	
	      // Socket IO
	      if (this.ioListenNames) exportObject.iln = this.ioListenNames;
	
	      return exportObject;
	    }
	  }, {
	    key: 'clone',
	    value: function clone() {
	      var exported = this['export']();
	      return _Factory2['default'].takeElementNode(exported, undefined, exported.type, this.environment, undefined);
	    }
	  }, {
	    key: 'isElementNode',
	    get: function get() {
	      return true;
	    }
	
	    // Getters
	
	  }, {
	    key: 'dynamicContextSID',
	    get: function get() {
	      return this._dynamicContextSID;
	    },
	
	
	    //
	    // get parentDynamicContext() {
	    //   return this._parentDynamicContext;
	    // }
	
	    // Setters
	    set: function set(_dynamicContextSID) {
	      this._dynamicContextSID = _dynamicContextSID;
	    }
	  }, {
	    key: 'dynamicContextRID',
	    get: function get() {
	      return this._dynamicContextRID;
	    },
	    set: function set(_dynamicContextRID) {
	      this._dynamicContextRID = _dynamicContextRID;
	    }
	  }, {
	    key: 'dynamicContextNS',
	    get: function get() {
	      return this._dynamicContextNS;
	    },
	    set: function set(_dynamicContextNS) {
	      this._dynamicContextNS = _dynamicContextNS;
	    }
	  }, {
	    key: 'dynamicContextInjectParams',
	    get: function get() {
	      return this._dynamicContextInjectParams;
	    },
	    set: function set(_dynamicContextInjectParams) {
	      this._dynamicContextInjectParams = _dynamicContextInjectParams;
	    }
	  }, {
	    key: 'dynamicContext',
	    get: function get() {
	      return this._dynamicContext;
	    }
	
	    // 상위로 탐색하면서 사용가능한 dynamicContext를 확인한다.
	    ,
	    set: function set(_dynamicContext) {
	      this._dynamicContext = _dynamicContext;
	    }
	  }, {
	    key: 'availableDynamicContext',
	    get: function get() {
	      if (this.dynamicContext !== null) return this.dynamicContext;else {
	        // dynamicContext를 찾을 때 까지 부모에게 요청 할 것이다.
	        // like climbParents
	        if (this.parent === null) return null;
	        return this.parent.availableDynamicContext;
	      }
	    }
	  }, {
	    key: 'properties',
	    get: function get() {
	      return this._properties;
	    },
	    set: function set(_properties) {
	      this._properties = _properties;
	    }
	  }, {
	    key: 'prop',
	    get: function get() {
	      return this._properties;
	    }
	  }, {
	    key: 'scopeNodes',
	    get: function get() {
	      return this._scopeNodes;
	    },
	    set: function set(_scopeNodes) {
	      this._scopeNodes = _scopeNodes;
	    }
	  }, {
	    key: 'nextSibling',
	    get: function get() {
	      return this._nextSibling;
	    },
	    set: function set(_e) {
	      this._nextSibling = _e;
	      if (this._nextSibling) {
	        this._nextSibling._prevSibling = this;
	      }
	    }
	  }, {
	    key: 'prevSibling',
	    get: function get() {
	      return this._prevSibling;
	    },
	    set: function set(_e) {
	      this._prevSibling = _e;
	
	      if (this._prevSibling) {
	        this._prevSibling._nextSibling = this;
	      }
	    }
	  }, {
	    key: 'isAttachedDOM',
	    get: function get() {
	      return this._isAttachedDOM;
	    },
	    set: function set(_isAttachedDOM) {
	      if (_isAttachedDOM !== this._isAttachedDOM) {
	        this._isAttachedDOM = _isAttachedDOM;
	
	        if (_isAttachedDOM === true) {
	
	          this.tryEventScope('first-rendered', {}, null);
	        } else {
	
	          //this.tryEventScope('', {}, null);
	        }
	      }
	    }
	  }, {
	    key: 'environment',
	    get: function get() {
	      return this.__environment;
	    }
	  }, {
	    key: '_environment',
	    set: function set(_env) {
	      this.__environment = _env;
	    }
	  }, {
	    key: 'nodeEvents',
	    get: function get() {
	      return this._nodeEvents;
	    },
	    set: function set(_nodeEvents) {
	      this._nodeEvents = _nodeEvents;
	    }
	  }, {
	    key: 'methods',
	    get: function get() {
	      return this._methods;
	    },
	    set: function set(_methods) {
	      this._methods = _methods;
	    }
	  }, {
	    key: 'pipeEvents',
	    get: function get() {
	      return this._pipeEvents;
	    },
	    set: function set(_pipeEvents) {
	      this._pipeEvents = _pipeEvents;
	    }
	  }, {
	    key: 'renderSerialNumber',
	    set: function set(_renderSerialNumber) {
	      this._renderSerialNumber = _renderSerialNumber;
	    },
	    get: function get() {
	      return this._renderSerialNumber;
	    }
	  }, {
	    key: 'DEBUG_FILE_NAME',
	    get: function get() {
	      try {
	        var master = this.getMaster();
	        return master.getDebuggingInfo('FILE_NAME') || location.pathname;
	      } catch (_e) {
	        return 'Unknown or ' + location.pathname;
	      }
	    }
	  }, {
	    key: 'DEBUG_FILE_NAME_EXPLAIN',
	    get: function get() {
	      return '<From: ' + this.DEBUG_FILE_NAME + '>';
	    }
	  }]);
	
	  return ElementNode;
	}();
	
	exports['default'] = ElementNode;

/***/ },

/***/ 58:
/*!*******************************************************************!*\
  !*** ./client/src/js/serviceCrew/ElementNode/ElementNodeMulti.js ***!
  \*******************************************************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ElementNodeMulti = function () {
	  function ElementNodeMulti(_elementNodes) {
	    _classCallCheck(this, ElementNodeMulti);
	
	    this.elementNodes = _elementNodes;
	  }
	
	  _createClass(ElementNodeMulti, null, [{
	    key: "newByDOMList",
	    value: function newByDOMList(_domList) {
	      console.log(_domList);
	    }
	  }]);
	
	  return ElementNodeMulti;
	}();
	
	exports["default"] = ElementNodeMulti;

/***/ },

/***/ 59:
/*!**********************************!*\
  !*** ./client/src/js/Returns.js ***!
  \**********************************/
/***/ function(module, exports) {

	"use strict";
	
	var ReasonCodes = {
	  "has_not_parent": "has_not_parent",
	  "is_ghost": "is_ghost"
	};
	
	var Returns = function Returns() {
	  this.result;
	  this.reasonCode;
	  this.detail;
	
	  this.setResult = function (_result) {
	    this.result = _result;
	  };
	
	  this.setReasonCode = function (_reasonCode) {
	    if (ReasonCodes[_reasonCode] !== undefined) {
	      this.reasonCode = _reasonCode;
	    } else {
	      throw new Error("Reason Code is invailid");
	    }
	  };
	
	  this.setDetail = function (_detail) {
	    this.detail = _detail;
	  };
	};
	
	Returns.ReasonCodes = ReasonCodes;
	
	module.exports = Returns;

/***/ },

/***/ 60:
/*!*****************************************************************!*\
  !*** ./client/src/js/serviceCrew/ElementNode/DynamicContext.js ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	// import ICEAPISource from '../APISource/ICEAPISource';
	// import APIFarmSource from '../APISource/APIFarmSource';
	
	var _ObjectExplorer = __webpack_require__(/*! ../../util/ObjectExplorer.js */ 32);
	
	var _ObjectExplorer2 = _interopRequireDefault(_ObjectExplorer);
	
	var _ObjectExtends = __webpack_require__(/*! ../../util/ObjectExtends.js */ 27);
	
	var _ObjectExtends2 = _interopRequireDefault(_ObjectExtends);
	
	var _ArrayHandler = __webpack_require__(/*! ../../util/ArrayHandler.js */ 34);
	
	var _ArrayHandler2 = _interopRequireDefault(_ArrayHandler);
	
	var _BrowserStorage = __webpack_require__(/*! ../../util/BrowserStorage.js */ 42);
	
	var _BrowserStorage2 = _interopRequireDefault(_BrowserStorage);
	
	var _APIRequest = __webpack_require__(/*! ../../Orient/common/APIRequest */ 28);
	
	var _APIRequest2 = _interopRequireDefault(_APIRequest);
	
	var _async = __webpack_require__(/*! async */ 47);
	
	var _async2 = _interopRequireDefault(_async);
	
	var _events = __webpack_require__(/*! events */ 23);
	
	var _events2 = _interopRequireDefault(_events);
	
	var _Resolver = __webpack_require__(/*! ../DataResolver/Resolver */ 33);
	
	var _Resolver2 = _interopRequireDefault(_Resolver);
	
	var _Identifier = __webpack_require__(/*! ../../util/Identifier */ 26);
	
	var _Identifier2 = _interopRequireDefault(_Identifier);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var REGEXP_APISOURCE_MEAN = /^\[([\w\d-_]+)\](.+)$/;
	
	var DynamicContext = function () {
	  /*
	    _props -
	    ~_interpretInterfaceFollowObject - interpret 메소드를 구현한 Object를 입력한다. 현재 가능한 대상 : {}ElementNode~
	  */
	
	  function DynamicContext(_env, _props, _upperDynamicContext /*_interpretInterfaceFollowObject*/) {
	    _classCallCheck(this, DynamicContext);
	
	    //Object.assign(this, Events.EventEmitter.prototype);
	    _ObjectExtends2['default'].liteExtends(this, _events2['default'].EventEmitter.prototype);
	
	    this.environment = _env;
	
	    this.id = _Identifier2['default'].genUUID();
	
	    // 상위 dynamicContext로 입력된 resolver 를 입력함
	    this.dataResolver = new _Resolver2['default'](_upperDynamicContext ? _upperDynamicContext.dataResolver : null);
	
	    //this.interpretInterfaceFollowObject = _interpretInterfaceFollowObject || null;
	    this.upperDynamicContext = _upperDynamicContext || null;
	    this.params = {};
	
	    // 모든 다중 요청의 구분은 콤마(,)로 한다.
	    // 다중요청을 사용 할 때 모든 필드의 순서를 맞추어 주어야 한다.
	    this.sourceID = _props.sourceIDs;
	    this.requestID = _props.requestIDs || '';
	    this.namespace = _props.namespaces;
	    this.isSync = _props.sync;
	    this.injectParam = _props.injectParams || '';
	    this.localCacheName = _props.localCache || null;
	    this.sessionCacheName = _props.sessionCache || null;
	
	    // sourceID 에 대한 예외처리를 하지 않는 이유는 sourceID가 존재하지 않으면 DynamicContext가 생성되지 않으므로.
	
	    if (!this.namespace) {
	      throw new Error('RequestID 가 지정되지 않았습니다. 연관 SourceID : \'' + this.sourceID + '\', 연관 RequestID : \'' + this.requestID + '\'');
	    }
	
	    this.apisources = [];
	    this.isLoading = false;
	    this.isLoaded = false;
	  }
	
	  _createClass(DynamicContext, [{
	    key: 'getParam',
	    value: function getParam(_ns) {
	      return this.params[_ns];
	    }
	
	    // Object.keys($('..')[0].___en.dynamicContext.params).length > 0
	
	    // dc를 실행한다.
	
	  }, {
	    key: 'fire',
	    value: function fire(_complete) {
	      var that = this;
	
	      // let sources = this.sourceID.split(',');
	      // let injectParam = this.injectParam.split(',');
	      // let requestID = this.requestID.split(',');
	      // let nss = this.namespace.split(',');
	
	      var sources = [this.sourceID];
	      var injectParams = [this.injectParam];
	      var requestIDs = [this.requestID];
	      var nss = [this.namespace];
	
	      var usingCache = void 0;
	      var cacheName = void 0;
	      var cacheGetter = void 0;
	      var cacheSetter = void 0;
	
	      if (this.checkUsingLocalCache()) {
	        cacheGetter = _BrowserStorage2['default'].getLocal.bind(_BrowserStorage2['default']);
	        cacheSetter = _BrowserStorage2['default'].setLocal.bind(_BrowserStorage2['default']);
	
	        usingCache = true;
	        cacheName = this.localCacheName;
	      } else if (this.checkUsingSessionCache()) {
	        cacheGetter = _BrowserStorage2['default'].getSession.bind(_BrowserStorage2['default']);
	        cacheSetter = _BrowserStorage2['default'].setSession.bind(_BrowserStorage2['default']);
	
	        usingCache = true;
	        cacheName = this.sessionCacheName;
	      }
	
	      var parallelFunctions = sources.map(function (_apiSource, _i) {
	
	        var requestID = requestIDs[_i];
	        var paramsPairs = (injectParams[_i] || '').split('&'); // aa=aa&aas=bb
	        var paramsObject = {};
	
	        var param = void 0;
	        for (var i = 0; i < paramsPairs.length; i++) {
	          param = paramsPairs[i].split('=');
	          // 0번 인덱스를 제외한 나머지 인덱스 요소들을
	          paramsObject[param.shift()] = param.join('=');
	        }
	
	        return function (_callback) {
	
	          if (usingCache) {
	
	            var cachedRetrievedObject = cacheGetter(that.getCachingName(cacheName));
	            // let cacheData_ERR = BrowserStorage.getLocal(this.getCacheName(`${this.localCacheName}_err`));
	            // let cacheData_STATUS = BrowserStorage.getLocal(this.getCacheName(`${this.localCacheName}_status`));
	            // let cacheData_LEVEL = BrowserStorage.getLocal(this.getCacheName(`${this.localCacheName}_level`));
	
	            if (cachedRetrievedObject) {
	              that.setResultToNS(nss[_i], null, cachedRetrievedObject, null);
	              _callback(null, cachedRetrievedObject);
	              console.log('>>>2', that);
	              return;
	            }
	          }
	
	          _APIRequest2['default'][that.isSync ? 'RequestAPISync' : 'RequestAPI'](that.environment, _apiSource, requestID, paramsObject, function (_err, _retrievedObject, _response) {
	            that.setResultToNS(nss[_i], _err, _retrievedObject, _response);
	
	            if (usingCache) {
	              if (_retrievedObject) {
	                cacheSetter(that.getCachingName(cacheName), _retrievedObject);
	              }
	            }
	
	            _callback(null, _retrievedObject);
	          });
	        };
	      });
	
	      that.isLoading = true;
	      _async2['default'].parallel(parallelFunctions, function (_err, _results) {
	        if (_err !== null) return _complete(_err);
	        that.emit('complete-load');
	
	        that.isLoading = false;
	        that.isLoaded = true;
	        _complete(null);
	      });
	    }
	  }, {
	    key: 'setResultToNS',
	    value: function setResultToNS(_ns, _err, _retrievedObject, _response) {
	
	      if (_err) {
	        this.dataResolver.setNS(_ns, null);
	        this.dataResolver.setNS(_ns + '_err', _err);
	        this.dataResolver.setNS(_ns + '_status', null);
	        this.dataResolver.setNS(_ns + '_level', null);
	      } else {
	        this.dataResolver.setNS(_ns, _retrievedObject);
	        this.dataResolver.setNS(_ns + '_status', _response && _response.statusCode);
	        this.dataResolver.setNS(_ns + '_level', _response && _response.statusType);
	      }
	    }
	  }, {
	    key: 'parseParamString',
	    value: function parseParamString(_paramString) {
	      var paramsPairs = _paramString.split('&');
	      var paramObject = {};
	
	      var pair = void 0;
	      for (var i = 0; i < paramsPairs.length; i++) {
	        pair = paramsPairs[i].split('=');
	
	        var key = pair[0];
	        var value = pair[1];
	
	        value = this.dataResolver.resolve(value || '');
	        paramObject[key] = value;
	      }
	
	      return paramObject;
	    }
	  }, {
	    key: 'reset',
	    value: function reset() {
	      this.dataResolver.empty();
	      this.isLoaded = false;
	    }
	  }, {
	    key: 'feedbackLoadState',
	    value: function feedbackLoadState() {}
	  }, {
	    key: 'checkUsingLocalCache',
	    value: function checkUsingLocalCache() {
	      if (this.localCacheName === null) {
	        return false;
	      }
	
	      return true;
	    }
	  }, {
	    key: 'checkUsingSessionCache',
	    value: function checkUsingSessionCache() {
	      if (this.sessionCacheName === null) {
	        return false;
	      }
	
	      return true;
	    }
	  }, {
	    key: 'getCachingName',
	    value: function getCachingName(_name) {
	      return '$dc_' + _name;
	    }
	  }, {
	    key: 'interpret',
	    value: function interpret(_text, externalGetterInterface, _caller) {
	      var self = this;
	
	      return this.dataResolver.resolve(_text, externalGetterInterface, null, _caller || this);
	      //
	      // // 바인딩 문자열 단 하나만 있을 때는 replace를 하지 않고
	      // // 객체를 보존하여 반환하도록 한다.
	      // if (/^\$\{.*?\}$/.test(_text)) {
	      //   let matched = _text.match(/(\${(.*?)})/);
	      //
	      //   let signString = matched[2];
	      //
	      //   return this.valueResolve(signString);
	      // } else {
	      //   let valuesResolved = _text.replace(/\${(.*?)}(?:(\.[a-z]+))?/g, function(_matched, _signString, _optionString) {
	      //     let rsvResult = self.valueResolve(_signString);
	      //     console.log('resolve', rsvResult, _signString);
	      //     // ${...}.optionString 과 같은 형식을 사용 하였을 때 유효한 옵션이면 옵션처리 결과를 반환하며
	      //     // 유효하지 않은 옵션은 signString의 리졸브 결과와 optionString형식으로 입력된 문자열을 살려서 반환한다.
	      //     // 추후에 함수 형식도 지원
	      //     switch (_optionString) {
	      //       case ".count":
	      //         return rsvResult.length;
	      //     }
	      //     if (_optionString !== undefined)
	      //       return rsvResult + (_optionString || '');
	      //     else
	      //       return rsvResult;
	      //   });
	      //
	      //   return valuesResolved.replace(/(\%\((.*?)\))/g, function(_matched, _matched2, _formularString) {
	      //
	      //     return self.processingFormularBlock(_formularString);
	      //   });
	      // }
	    }
	
	    // valueResolve(_sign) {
	    //   let self = this;
	    //
	    //   if (/^(\*?)([^\:^\*]*)$/.test(_sign)) {
	    //     let matched = _sign.match(/^(\*?)(.*)$/);
	    //     let firstMark = matched[1];
	    //     let refValue = matched[2];
	    //
	    //
	    //     if (firstMark === '*') {
	    //
	    //       let splited = refValue.split(/\//);
	    //       let ns = splited.shift();
	    //       let detail = splited.length > 0 ? splited.join('/') : undefined;
	    //
	    //       let param = self.getParam(ns);
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
	
	  }, {
	    key: 'interpretInterfaceFollowObject',
	    get: function get() {
	      return this._interpretInterfaceFollowObject;
	    },
	    set: function set(_interpretInterfaceFollowObject) {
	      this._interpretInterfaceFollowObject = _interpretInterfaceFollowObject;
	    }
	  }, {
	    key: 'upperDynamicContext',
	    get: function get() {
	      return this._upperDynamicContext;
	    },
	    set: function set(_upperDynamicContext) {
	      this._upperDynamicContext = _upperDynamicContext;
	    }
	  }]);
	
	  return DynamicContext;
	}();
	
	exports['default'] = DynamicContext;

/***/ },

/***/ 61:
/*!*********************************************!*\
  !*** ./client/src/js/serviceCrew/Action.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _ActionResult = __webpack_require__(/*! ./ActionResult */ 62);
	
	var _ActionResult2 = _interopRequireDefault(_ActionResult);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// class Action {
	//   constructor(_callPoint, _targetActionKey, _params) {
	//     this.callPoint = _callPoint;
	//     this.targetActionKey = _targetActionKey;
	//     this.params = _params; // [];
	//   }
	//
	//   get callPoint() {
	//     return this._callPoint;
	//   }
	//
	//   get targetActionKey() {
	//     return this._targetActionKey;
	//   }
	//
	//   get params() {
	//     return this._params;
	//   }
	//
	//   set callPoint(_callPoint) {
	//     this._callPoint = _callPoint;
	//   }
	//
	//   set targetActionKey(_targetActionKey) {
	//     this._targetActionKey = _targetActionKey;
	//   }
	//
	//   set params(_params) {
	//     this._params = _params;
	//   }
	// }
	
	var ActionParam = function () {
	  function ActionParam() {
	    _classCallCheck(this, ActionParam);
	  }
	
	  _createClass(ActionParam, [{
	    key: 'name',
	    get: function get() {
	      return this._name;
	    },
	    set: function set(_name) {
	      this._name = _name;
	    }
	  }]);
	
	  return ActionParam;
	}();
	
	var Action = function () {
	  function Action(_actionData) {
	    _classCallCheck(this, Action);
	
	    this['import'](_actionData);
	  }
	
	  _createClass(Action, [{
	    key: 'execute',
	
	
	    /*
	      _argsMap: action 이 필요로 하는 param 데이터 맵
	      _caller : action이 실행 될 때 this에 바인딩 될 오브젝트
	      _window : 현재의 러닝 Frame 의 window 객체
	      _notice: action실행이 완료되고 통지할 callback
	        Action Context에 삽입되는 고정 Params
	        _event : ElementNode가 생성한 이벤트 객체 --- from ElementNode __executeTask
	        _originEvent : DomEvent 로 인해 발생되었을 경우의 Dom Event 객체 --- from ElementNode __executeTask
	        _prevResult : 이전 Action이 실행되어 반환한 actionResult 객체 chain 된 액션의 경우 삽입 --- from ElementNode __executeTask
	        _actionResult : 새로운 ActionResult 인스턴스
	        //_ActionResult : 새로운 ActionResult 인스턴스를 생성 할 수 있는 ActionResult 클래스 -- 사용안함
	        addReturn : 반환값을 키와 밸류로 입력
	        setChain  : 이용가능 한 체인 명 지정
	        _callback : Action 실행이 완료 되었을 때 호출하는 Callback 메서드. 인자로 actionResult 인스턴스를 입력하여야 한다.
	    */
	    value: function execute(_argsMap, _caller, _upperActionResult, _notice) {
	      var functionParamDefineArray = []; // 제일 마지막 요소는 function의 body 이자 action의 body가 삽입된다.
	      var actionArgArray = []; //action이 실행 될 때 입력될 인수 배열 위의 functionParamDefineArray와 각각의 요소가 (마지막을 제외한.body)대응해야 한다.
	      var emptyActionResult = new _ActionResult2['default']();
	      emptyActionResult.setUpperActionResult(_upperActionResult);
	
	      // action ArgArray 의 배치구조
	      // actionParam, ... , actionResult instance, _ActionResult Class, _callback(Callback)
	      Object.keys(_argsMap).map(function (_argKey) {
	        functionParamDefineArray.push(_argKey);
	        actionArgArray.push(_argsMap[_argKey]);
	      });
	
	      // actionResult instance 삽입
	      functionParamDefineArray.push('_actionResult');
	      actionArgArray.push(emptyActionResult);
	
	      functionParamDefineArray.push('addReturn');
	      actionArgArray.push(function (_returnKey, _returnValue) {
	        emptyActionResult.returns[_returnKey] = _returnValue;
	      });
	
	      functionParamDefineArray.push('setChain');
	      actionArgArray.push(function (_chainCode) {
	        emptyActionResult.code = _chainCode;
	      });
	
	      // // ActionResult Class 삽입 Action내에서 한번이상 End Callback 이 호출 될 때 데이터 공간을 공유하여
	      // // 오동작이 발생하는 것을 방지
	      // // 필요 할 때 사용가능
	      // functionParamDefineArray.push('_ActionResult');
	      // actionArgArray.push(ActionResult);
	
	      // action callback
	      functionParamDefineArray.push('_callback');
	      actionArgArray.push(function (_actionResult) {
	        // callback 에서 받은 _actionResult를 그대로 반환한다.
	        _notice(_actionResult);
	      });
	
	      // functionParamDefineArray.push("__window__");
	      // actionArgArray.push(_window);
	
	      //functionParamDefineArray.push('with(__window__){' + this.actionBody + '}');
	      functionParamDefineArray.push(this.actionBody);
	      var vfunc = Function.constructor.apply(null, functionParamDefineArray);
	
	      vfunc.apply(_caller, actionArgArray);
	    }
	  }, {
	    key: 'import',
	    value: function _import(_actionData) {
	      this.name = _actionData.name;
	      this.params = _actionData.params;
	      this.actionBody = _actionData.actionBody;
	    }
	  }, {
	    key: 'export',
	    value: function _export() {
	      return {
	        name: this.name,
	        params: this.params,
	        actionBody: this.actionBody
	      };
	    }
	  }, {
	    key: 'name',
	    get: function get() {
	      return this._name;
	    },
	    set: function set(_name) {
	      this._name = _name;
	    }
	  }, {
	    key: 'params',
	    get: function get() {
	      return this._params;
	    },
	    set: function set(_params) {
	      this._params = _params;
	    }
	  }, {
	    key: 'actionBody',
	    get: function get() {
	      return this._actionBody;
	    },
	    set: function set(_actionBody) {
	      this._actionBody = _actionBody;
	    }
	  }]);
	
	  return Action;
	}();
	
	exports['default'] = Action;

/***/ },

/***/ 62:
/*!***************************************************!*\
  !*** ./client/src/js/serviceCrew/ActionResult.js ***!
  \***************************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ActionResult = function () {
	  function ActionResult(_data, _taskChain) {
	    _classCallCheck(this, ActionResult);
	
	    this.clazz = 'ActionResult';
	
	    this.data = _data || null;
	    this.taskChain = _taskChain || undefined;
	    this.returns = {
	      "continue": true // continue 가 true 로 유지되어 있을 때 이벤트의 다음 처리를 진행한다.
	    };
	
	    this.code = 'next';
	
	    // ActionResult의 내용을 세팅 한 action:task 또는 function:task의 name
	    this.origin;
	
	    // 상위(이전에 처리되어 반환된) result 객체
	    this.upperResult;
	  }
	
	  _createClass(ActionResult, [{
	    key: 'setUpperActionResult',
	    value: function setUpperActionResult(_actionResult) {
	      this.upperResult = _actionResult;
	    }
	  }, {
	    key: 'getUpperByTaskName',
	    value: function getUpperByTaskName(_taskName) {
	      var found = null;
	
	      var curr = this;
	      while (curr = curr.upperResult) {
	        if (curr.origin === 'task@' + _taskName) {
	          found = curr;
	          break;
	        }
	      }
	
	      if (found) {
	        return found;
	      } else {
	        throw new Error("상위의 ActionResult를 찾을 수 없습니다.");
	      }
	    }
	  }, {
	    key: 'upperResult',
	    get: function get() {
	      return this._upperResult;
	    },
	    set: function set(_upperResult) {
	      this._upperResult = _upperResult;
	    }
	  }, {
	    key: 'origin',
	    get: function get() {
	      return this._origin;
	    },
	    set: function set(_origin) {
	      this._origin = _origin;
	    }
	  }, {
	    key: 'data',
	    get: function get() {
	      return this._data;
	    },
	    set: function set(_data) {
	      this._data = _data;
	    }
	  }, {
	    key: 'returns',
	    get: function get() {
	      return this._returns;
	    },
	    set: function set(_returns) {
	      this._returns = _returns;
	    }
	  }, {
	    key: 'taskChain',
	    get: function get() {
	      return this._taskChain;
	    }
	
	    // code 에 따라 태스크의 후처리를 진행
	    // success 로 반환될 경우 task 의 chain-success 필드에 입력된 task명으로 다음 태스크를 실행한다.
	    // 대부분의 task 는 success로 반환 될 것이며 taskChain 에 입력된 값의 여부에 따라 무시 될 수 있다.
	    ,
	    set: function set(_taskChain) {
	      this._taskChain = _taskChain;
	    }
	  }, {
	    key: 'code',
	    get: function get() {
	      return this._code;
	    },
	    set: function set(_code) {
	      this._code = String(_code);
	    }
	  }]);
	
	  return ActionResult;
	}();
	
	exports['default'] = ActionResult;

/***/ },

/***/ 63:
/*!********************************************************************!*\
  !*** ./client/src/js/serviceCrew/ElementNode/ScopeNode/Factory.js ***!
  \********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _ValueScopeNode = __webpack_require__(/*! ./ValueScopeNode */ 64);
	
	var _ValueScopeNode2 = _interopRequireDefault(_ValueScopeNode);
	
	var _ActionScopeNode = __webpack_require__(/*! ./ActionScopeNode */ 68);
	
	var _ActionScopeNode2 = _interopRequireDefault(_ActionScopeNode);
	
	var _TaskScopeNode = __webpack_require__(/*! ./TaskScopeNode */ 69);
	
	var _TaskScopeNode2 = _interopRequireDefault(_TaskScopeNode);
	
	var _ParamScopeNode = __webpack_require__(/*! ./ParamScopeNode */ 70);
	
	var _ParamScopeNode2 = _interopRequireDefault(_ParamScopeNode);
	
	var _FunctionScopeNode = __webpack_require__(/*! ./FunctionScopeNode */ 71);
	
	var _FunctionScopeNode2 = _interopRequireDefault(_FunctionScopeNode);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ScopeNodeFactory = function () {
	  function ScopeNodeFactory() {
	    _classCallCheck(this, ScopeNodeFactory);
	  }
	
	  _createClass(ScopeNodeFactory, null, [{
	    key: 'getClass',
	    value: function getClass(_type) {
	
	      switch (_type) {
	        case 'value':
	          return _ValueScopeNode2['default'];
	        case 'task':
	          return _TaskScopeNode2['default'];
	        case 'action':
	          return _ActionScopeNode2['default'];
	        case 'function':
	          return _FunctionScopeNode2['default'];
	        case 'param':
	          return _ParamScopeNode2['default'];
	      }
	    }
	  }]);
	
	  return ScopeNodeFactory;
	}();
	
	exports['default'] = ScopeNodeFactory;

/***/ },

/***/ 64:
/*!***************************************************************************!*\
  !*** ./client/src/js/serviceCrew/ElementNode/ScopeNode/ValueScopeNode.js ***!
  \***************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _ScopeNode2 = __webpack_require__(/*! ./ScopeNode */ 65);
	
	var _ScopeNode3 = _interopRequireDefault(_ScopeNode2);
	
	var _MetaText = __webpack_require__(/*! ../../Data/MetaText */ 66);
	
	var _MetaText2 = _interopRequireDefault(_MetaText);
	
	var _MetaData = __webpack_require__(/*! ../../Data/MetaData */ 67);
	
	var _MetaData2 = _interopRequireDefault(_MetaData);
	
	var _ObjectExtends = __webpack_require__(/*! ../../../util/ObjectExtends */ 27);
	
	var _ObjectExtends2 = _interopRequireDefault(_ObjectExtends);
	
	var _GeneralLocation = __webpack_require__(/*! ../../../util/GeneralLocation */ 239);
	
	var _GeneralLocation2 = _interopRequireDefault(_GeneralLocation);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }
	
	var DataTypes = Object.freeze({
	  Number: "number",
	  String: "string",
	  Object: "object",
	  Array: "array",
	  Boolean: "boolean",
	  Function: "function",
	
	  number: "number",
	  string: "string",
	  object: "object",
	  array: "array",
	  boolean: "boolean",
	  'function': "function"
	});
	
	var ValueScopeNode = function (_ScopeNode) {
	  _inherits(ValueScopeNode, _ScopeNode);
	
	  function ValueScopeNode(_scopeData) {
	    _classCallCheck(this, ValueScopeNode);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ValueScopeNode).call(this, _scopeData));
	
	    if (Orient.bn === 'ie' && Orient.bv <= 10) {
	      _ScopeNode3['default'].call(_this, _scopeData);
	    }
	
	    _this.type = 'value';
	    _this.scannedHashbang = false;
	
	    if (_this.mappingHashbangParam) {
	      if (_this.mappingHashbangParam === true) {
	        _this.plainValue = _GeneralLocation2['default'].getHashbangParam(_this.name);
	        _this.scannedHashbang = true;
	      } else {
	        _this.plainValue = _GeneralLocation2['default'].getHashbangParam(_this.mappingHashbangParam);
	        _this.scannedHashbang = true;
	      }
	    }
	
	    return _this;
	  }
	
	  _createClass(ValueScopeNode, [{
	    key: 'import',
	    value: function _import(_scopeData) {
	      _get(Object.getPrototypeOf(ValueScopeNode.prototype), 'import', this).call(this, _scopeData);
	      this.resolveOn = _scopeData.resolveOn;
	      this.dataType = _scopeData.dataType;
	      this.value = new _MetaText2['default'](_scopeData.value || '');
	      this.initializer = _scopeData.initializer;
	      this.mappingHashbangParam = _scopeData.mappingHashbangParam;
	    }
	  }, {
	    key: 'export',
	    value: function _export() {
	      var exportObject = _get(Object.getPrototypeOf(ValueScopeNode.prototype), 'export', this).call(this);
	      exportObject.resolveOn = this.resolveOn;
	      exportObject.dataType = this.dataType;
	      exportObject.value = _ObjectExtends2['default'].clone(this.value['export']());
	      exportObject.initializer = this.initializer;
	      exportObject.mappingHashbangParam = this.mappingHashbangParam;
	      return exportObject;
	    }
	  }, {
	    key: 'resolveOn',
	    get: function get() {
	      return this._resolveOn;
	    },
	    set: function set(_onRes) {
	      this._resolveOn = _onRes;
	    }
	
	    // 외부에서는 value setter 를 사용하지 않아야 한다.
	    // value Node는 MetaText 객체이다.
	
	  }, {
	    key: 'value',
	    get: function get() {
	      return this._value;
	    }
	
	    // 본 모습 : 자신의 데이터타입에 맞춰 데이터를 반환한다.
	    ,
	    set: function set(_value) {
	      this._value = _value;
	    }
	  }, {
	    key: 'shapeValue',
	    get: function get() {
	      // return this.value.variable;
	
	      try {
	        switch (this.dataType) {
	          case DataTypes.String:
	            return this.value.byString;
	          case DataTypes.Number:
	            return this.value.byNumber;
	          case DataTypes.Boolean:
	            return this.value.byBoolean;
	          case DataTypes.Array:
	          case DataTypes.Object:
	            return this.value.byObject;
	        }
	      } catch (_e) {
	        throw _e;
	      }
	    },
	
	
	    // 입력된 데이터를 데이터 타입에 따라 분별하여 자신에게 저장한다.
	    set: function set(_shape) {
	      // this.value.variable = _shape;
	
	      if (this.mappingHashbangParam) {
	        if (this.mappingHashbangParam === true) {
	          _GeneralLocation2['default'].setHashbangParam(this.name, _shape);
	        } else {
	          _GeneralLocation2['default'].setHashbangParam(this.mappingHashbangParam, _shape);
	        }
	      }
	
	      switch (this.dataType) {
	        case DataTypes.String:
	          this.value.fromString = _shape;
	          break;
	        case DataTypes.Number:
	          this.value.fromNumber = _shape;
	          break;
	        case DataTypes.Boolean:
	          this.value.fromBoolean = _shape;
	          break;
	        case DataTypes.Array:
	        case DataTypes.Object:
	          this.value.fromObject = _shape;
	          break;
	        default:
	          throw new Error("invalid value type :" + this.dataType);
	      }
	    }
	
	    /**
	    Task Implement
	    **/
	
	  }, {
	    key: 'plainValue',
	    get: function get() {
	      return this.value.variable;
	    },
	    set: function set(_value) {
	      this.value.variable = _value;
	    }
	  }, {
	    key: 'dataType',
	    get: function get() {
	      return this._dataType;
	    },
	    set: function set(_dataType) {
	      this._dataType = _dataType;
	    }
	  }], [{
	    key: 'CreateByScopeDom',
	    value: function CreateByScopeDom(_scopeDom) {
	
	      var newScopeNode = new ValueScopeNode(ValueScopeNode.BuildScopeSpecObjectByScopeDom(_scopeDom));
	
	      return newScopeNode;
	    }
	  }, {
	    key: 'BuildScopeSpecObjectByScopeDom',
	    value: function BuildScopeSpecObjectByScopeDom(_dom) {
	
	      var scopeSpecObject = _ScopeNode3['default'].BuildScopeSpecObjectByScopeDom(_dom);
	
	      // 확장클래스에서 사용하는 attribute 읽기 및 지정
	
	      // type attribute 는 dataType 으로 지정된다.
	      scopeSpecObject.dataType = DataTypes[_dom.getAttribute('type')];
	      scopeSpecObject.value = _dom.getAttribute('value') || _dom.innerHTML || '';
	      scopeSpecObject.resolveOn = _dom.getAttribute('resolve-on') !== null ? true : false;
	      scopeSpecObject.initializer = _dom.getAttribute('initializer') !== null ? _dom.getAttribute('initializer') : null;
	      if (_dom.hasAttribute('mapping-hashbang-param')) scopeSpecObject.mappingHashbangParam = _dom.getAttribute('mapping-hashbang-param') || true;
	      return scopeSpecObject;
	    }
	  }]);
	
	  return ValueScopeNode;
	}(_ScopeNode3['default']);
	
	exports['default'] = ValueScopeNode;

/***/ },

/***/ 65:
/*!**********************************************************************!*\
  !*** ./client/src/js/serviceCrew/ElementNode/ScopeNode/ScopeNode.js ***!
  \**********************************************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ScopeNode = function () {
	  function ScopeNode(_scopeData) {
	    _classCallCheck(this, ScopeNode);
	
	    this['import'](_scopeData);
	  }
	
	  // Dom 으로부터 기본 scope 필드를 추출하여 반환한다.
	
	
	  _createClass(ScopeNode, [{
	    key: 'import',
	    value: function _import(_scopeData) {
	      this.name = _scopeData.name;
	      this.type = _scopeData.type;
	      this.debug = _scopeData.debug;
	    }
	  }, {
	    key: 'export',
	    value: function _export() {
	      var exportObject = {};
	      exportObject.name = this.name;
	      exportObject.type = this.type;
	      exportObject.debug = this.debug;
	
	      return exportObject;
	    }
	  }, {
	    key: 'name',
	    get: function get() {
	      return this._name;
	    },
	    set: function set(_name) {
	      this._name = _name;
	    }
	  }, {
	    key: 'type',
	    get: function get() {
	      return this._type;
	    },
	    set: function set(_type) {
	      this._type = _type;
	    }
	  }], [{
	    key: 'BuildScopeSpecObjectByScopeDom',
	    value: function BuildScopeSpecObjectByScopeDom(_dom) {
	      var scopeSpecObject = {};
	
	      scopeSpecObject.debug = _dom.getAttribute('debug');
	
	      scopeSpecObject.name = _dom.getAttribute('name');
	      if (!/\w+/.test(scopeSpecObject.name || '')) {
	        console.info(_dom);
	        throw new Error("Scope 선언에는 name 이 포함되어야 합니다.", _dom);
	      }
	
	      _dom.removeAttribute('name'); // name Attribute 를 읽었으므로 제거
	
	      return scopeSpecObject;
	    }
	  }]);
	
	  return ScopeNode;
	}();
	
	exports['default'] = ScopeNode;

/***/ },

/***/ 66:
/*!****************************************************!*\
  !*** ./client/src/js/serviceCrew/Data/MetaText.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _MetaData2 = __webpack_require__(/*! ./MetaData */ 67);
	
	var _MetaData3 = _interopRequireDefault(_MetaData2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }
	
	var MetaText = function (_MetaData) {
	  _inherits(MetaText, _MetaData);
	
	  function MetaText(_object) {
	    _classCallCheck(this, MetaText);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MetaText).call(this, _object));
	
	    if (Orient.bn === 'ie' && Orient.bv <= 10) {
	      _MetaData3['default'].call(_this, _object);
	    }
	
	    _this['import'](_object);
	    return _this;
	  }
	
	  // Setters
	
	
	  _createClass(MetaText, [{
	    key: 'reset',
	    value: function reset() {
	      this.variable = this.seed;
	    }
	  }, {
	    key: 'save',
	    value: function save() {
	      this.stored = this.variable;
	    }
	  }, {
	    key: 'load',
	    value: function load() {
	      this.variable = this.stored;
	    }
	  }, {
	    key: 'variable',
	    set: function set(_v) {
	      this._variable = _v;
	    }
	
	    // Getters
	    ,
	    get: function get() {
	      return this._variable;
	    }
	  }, {
	    key: 'seed',
	    set: function set(_s) {
	      this._seed = _s;
	    },
	    get: function get() {
	      return this._seed;
	    }
	  }, {
	    key: 'default',
	    set: function set(_d) {
	      this._default = _d;
	    },
	    get: function get() {
	      return this._default;
	    }
	  }, {
	    key: 'stored',
	    set: function set(_stored) {
	      this._stored = _stored;
	    },
	    get: function get() {
	      return this._stored;
	    }
	
	    // Read With Type Casting
	
	  }, {
	    key: 'byInteger',
	    get: function get() {
	      return parseInt(this.variable);
	    }
	  }, {
	    key: 'byFloat',
	    get: function get() {
	      return parseFloat(this.variable);
	    }
	  }, {
	    key: 'byNumber',
	    get: function get() {
	      return Number(this.variable);
	    }
	
	    // 일반 반환이 string 이므로 무의미함
	
	  }, {
	    key: 'byString',
	    get: function get() {
	      return String(this.variable);
	    }
	  }, {
	    key: 'byBoolean',
	    get: function get() {
	      if (this.variable === 'true' || this.variable === true) {
	        return true;
	      } else if (this.variable === 'false' || this.variable === false) {
	        return false;
	      } else {
	        throw new Error(_typeof(this.variable) + ' 타입인 \'' + this.variable + '\' 을 Boolean 으로 변환 할 수 없습니다.');
	      }
	    }
	  }, {
	    key: 'byObject',
	    get: function get() {
	      try {
	        return JSON.parse(this.variable);
	      } catch (_e) {
	        throw new Error('Fail Parse JSON. target : \'' + this.variable + '\', Native error message : ' + _e.message);
	      }
	    }
	
	    // Read With Type Casting
	
	  }, {
	    key: 'fromInteger',
	    set: function set(_v) {
	      this._variable = String(_v);
	    }
	
	    // Read With Type Casting
	
	  }, {
	    key: 'fromFloat',
	    set: function set(_v) {
	      this._variable = String(_v);
	    }
	  }, {
	    key: 'fromNumber',
	    set: function set(_v) {
	      this._variable = String(_v);
	    }
	
	    // Read With Type Casting
	
	  }, {
	    key: 'fromString',
	    set: function set(_v) {
	      this._variable = _v;
	    }
	
	    // Read With Type Casting
	
	  }, {
	    key: 'fromBoolean',
	    set: function set(_v) {
	      if (_v === true) {
	        this._variable = 'true';
	      } else if (_v === false) {
	        this._variable = 'false';
	      } else {
	        throw new Error("Boolean 값이 아닌 값을 입력하셨습니다. boolean 값을 입력하세요.");
	      }
	    }
	
	    // Read With Type Casting
	
	  }, {
	    key: 'fromObject',
	    set: function set(_v) {
	      this._variable = JSON.stringify(_v);
	    }
	  }]);
	
	  return MetaText;
	}(_MetaData3['default']);
	
	exports['default'] = MetaText;

/***/ },

/***/ 67:
/*!****************************************************!*\
  !*** ./client/src/js/serviceCrew/Data/MetaData.js ***!
  \****************************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var MetaData = function () {
	  function MetaData(_object) {
	    _classCallCheck(this, MetaData);
	
	    this['import'](_object);
	  }
	
	  // Setters
	
	
	  _createClass(MetaData, [{
	    key: 'reset',
	    value: function reset() {
	      this.variable = this.seed;
	    }
	  }, {
	    key: 'save',
	    value: function save() {
	      this.stored = this.variable;
	    }
	  }, {
	    key: 'load',
	    value: function load() {
	      this.variable = this.stored;
	    }
	  }, {
	    key: 'import',
	    value: function _import(_data) {
	      if ((typeof _data === 'undefined' ? 'undefined' : _typeof(_data)) === 'object') {
	        this.variable = _data.seed; // variable 는 런타임에 언제든지 변경될 수 있는 데이터이다.
	        this.seed = _data.seed; // Seed 는 런타임에 변경되지 않는 데이터이다.
	        this['default'] = _data['default']; // default 는 seed의 데이터 리졸브가 실패하였을 때 대체될 데이터이다.
	        this.name = _data.name;
	      } else {
	        // object 가 아닌 타입으로 들어온다면 그것을 초기값으로 입력한다.
	        this.seed = this.variable = _data;
	      }
	    }
	  }, {
	    key: 'export',
	    value: function _export() {
	      var exportO = {
	        seed: this.seed,
	        'default': this['default']
	      };
	
	      if (this.name) {
	        exportO.name = this.name;
	      }
	
	      return exportO;
	    }
	  }, {
	    key: 'variable',
	    set: function set(_v) {
	      this._variable = _v;
	    }
	
	    // Getters
	    ,
	    get: function get() {
	      return this._variable;
	    }
	  }, {
	    key: 'seed',
	    set: function set(_s) {
	      this._seed = _s;
	    },
	    get: function get() {
	      return this._seed;
	    }
	  }, {
	    key: 'default',
	    set: function set(_d) {
	      this._default = _d;
	    },
	    get: function get() {
	      return this._default;
	    }
	  }, {
	    key: 'stored',
	    set: function set(_stored) {
	      this._stored = _stored;
	    },
	    get: function get() {
	      return this._stored;
	    }
	  }, {
	    key: 'name',
	    set: function set(_n) {
	      this._name = _n;
	    },
	    get: function get() {
	      return this._name;
	    }
	
	    // Read With Type Casting
	
	  }, {
	    key: 'byInteger',
	    get: function get() {
	      return parseInt(this.variable);
	    }
	  }, {
	    key: 'byFloat',
	    get: function get() {
	      return parseFloat(this.variable);
	    }
	  }, {
	    key: 'byNumber',
	    get: function get() {
	      return Number(this.variable);
	    }
	
	    // 일반 반환이 string 이므로 무의미함
	
	  }, {
	    key: 'byString',
	    get: function get() {
	      return String(this.variable);
	    }
	  }, {
	    key: 'byBoolean',
	    get: function get() {
	      if (this.variable === 'true') {
	        return true;
	      } else if (this.variable === 'false') {
	        return false;
	      } else {
	        throw new Error("Boolean 으로 변환 할 수 없습니다.");
	      }
	    }
	  }, {
	    key: 'byObject',
	    get: function get() {
	      try {
	        return JSON.parse(this.variable);
	      } catch (_e) {
	        throw new Error('Fail Parse JSON. target : \'' + this.variable + '\', Native error message:' + _e.message);
	      }
	    }
	
	    // Read With Type Casting
	
	  }, {
	    key: 'fromInteger',
	    set: function set(_v) {
	      this._variable = String(_v);
	    }
	
	    // Read With Type Casting
	
	  }, {
	    key: 'fromFloat',
	    set: function set(_v) {
	      this._variable = String(_v);
	    }
	  }, {
	    key: 'fromNumber',
	    set: function set(_v) {
	      this._variable = String(_v);
	    }
	
	    // Read With Type Casting
	
	  }, {
	    key: 'fromString',
	    set: function set(_v) {
	      this._variable = _v;
	    }
	
	    // Read With Type Casting
	
	  }, {
	    key: 'fromBoolean',
	    set: function set(_v) {
	      if (_v === true) {
	        this._variable = 'true';
	      } else if (_v === false) {
	        this._variable = 'false';
	      } else {
	        throw new Error("Boolean 값이 아닌 값을 입력하셨습니다. boolean 값을 입력하세요.");
	      }
	    }
	
	    // Read With Type Casting
	
	  }, {
	    key: 'fromObject',
	    set: function set(_v) {
	      this._variable = JSON.stringify(_v);
	    }
	  }]);
	
	  return MetaData;
	}();
	
	exports['default'] = MetaData;

/***/ },

/***/ 68:
/*!****************************************************************************!*\
  !*** ./client/src/js/serviceCrew/ElementNode/ScopeNode/ActionScopeNode.js ***!
  \****************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _ScopeNode2 = __webpack_require__(/*! ./ScopeNode */ 65);
	
	var _ScopeNode3 = _interopRequireDefault(_ScopeNode2);
	
	var _ObjectExtends = __webpack_require__(/*! ../../../util/ObjectExtends */ 27);
	
	var _ObjectExtends2 = _interopRequireDefault(_ObjectExtends);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }
	
	var DomAttrMatcher = new RegExp("(\\w+?)-([\\w+-_]+)");
	//const ACTION_DESC_START_CAPTURE_REGEXP = /^[\s\t]*\![\s\t]*?function/;
	var ACTION_START_CAPTURE_REGEXP = /^[\s\t]*\![\s\t]*?function/;
	
	var ActionScopeNode = function (_ScopeNode) {
	  _inherits(ActionScopeNode, _ScopeNode);
	
	  function ActionScopeNode(_scopeData) {
	    _classCallCheck(this, ActionScopeNode);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ActionScopeNode).call(this, _scopeData));
	
	    if (Orient.bn === 'ie' && Orient.bv <= 10) {
	      _ScopeNode3['default'].call(_this, _scopeData);
	    }
	
	    _this.type = 'action';
	
	    return _this;
	  }
	
	  _createClass(ActionScopeNode, [{
	    key: 'import',
	    value: function _import(_scopeData) {
	      _get(Object.getPrototypeOf(ActionScopeNode.prototype), 'import', this).call(this, _scopeData);
	      this.params = _scopeData.params;
	      this.actionBody = _scopeData.actionBody;
	    }
	  }, {
	    key: 'export',
	    value: function _export() {
	      var exportObject = _get(Object.getPrototypeOf(ActionScopeNode.prototype), 'export', this).call(this);
	      exportObject.params = _ObjectExtends2['default'].clone(this.params);
	      exportObject.actionBody = this.actionBody;
	      return exportObject;
	    }
	  }, {
	    key: 'params',
	    get: function get() {
	      return this._params;
	    },
	    set: function set(_params) {
	      this._params = _params;
	    }
	  }, {
	    key: 'actionBody',
	    get: function get() {
	      return this._actionBody;
	    },
	    set: function set(_actionBody) {
	      this._actionBody = _actionBody;
	    }
	  }], [{
	    key: 'CreateByScopeDom',
	    value: function CreateByScopeDom(_scopeDom) {
	      var newScopeNode = new ActionScopeNode(ActionScopeNode.BuildScopeSpecObjectByScopeDom(_scopeDom));
	      //console.log(newScopeNode);
	      return newScopeNode;
	    }
	  }, {
	    key: 'BuildScopeSpecObjectByScopeDom',
	    value: function BuildScopeSpecObjectByScopeDom(_dom) {
	      var attr = void 0,
	          formatMathed = void 0;
	      var scopeSpecObject = _ScopeNode3['default'].BuildScopeSpecObjectByScopeDom(_dom);
	      var attrs = _dom.attributes;
	      var length = attrs.length;
	
	      scopeSpecObject.params = [];
	      for (var i = 0; i < length; i++) {
	        attr = attrs[i];
	        formatMathed = attr.nodeName.match(DomAttrMatcher);
	
	        if (formatMathed !== null) {
	          if (formatMathed[1] === 'param') {
	            scopeSpecObject.params.push(formatMathed[2]);
	          }
	        }
	      }
	
	      var actionBody = _dom.innerHTML;
	      var refinedActionBody = '';
	      var bodyLines = actionBody.split('\n');
	
	      var foundStartSymbol = false;
	      var line = void 0;
	      bodyLines = bodyLines.map(function (_line) {
	        return _line.replace(ACTION_START_CAPTURE_REGEXP, function () {
	          foundStartSymbol = true;
	          return 'return function';
	        });
	      });
	
	      if (!foundStartSymbol) {
	        throw new Error('action needed a start symbol(!function) name:' + scopeSpecObject.name + ' desc:' + actionBody);
	      }
	
	      var extractorFunction = new Function(bodyLines.join('\n'));
	      var extractedFunc = extractorFunction();
	
	      if (!extractedFunc instanceof Function) {
	        throw new Error('Invalid action declare format. declared action name:' + scopeSpecObject.name + ' desc:' + actionBody);
	      }
	
	      // 추출한 함수를 문자열로 변환
	      refinedActionBody = extractedFunc.toString();
	
	      // function 에서 body 코드만 남도록 함
	      // function ...() { 를 제거
	      // function 블럭의 끝(}) 제거
	      refinedActionBody = refinedActionBody.replace(/^function.*?\{/, '');
	      refinedActionBody = refinedActionBody.replace(/}$/, '');
	
	      scopeSpecObject.actionBody = refinedActionBody;
	
	      return scopeSpecObject;
	    }
	  }]);
	
	  return ActionScopeNode;
	}(_ScopeNode3['default']);
	
	exports['default'] = ActionScopeNode;

/***/ },

/***/ 69:
/*!**************************************************************************!*\
  !*** ./client/src/js/serviceCrew/ElementNode/ScopeNode/TaskScopeNode.js ***!
  \**************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _ScopeNode2 = __webpack_require__(/*! ./ScopeNode */ 65);
	
	var _ScopeNode3 = _interopRequireDefault(_ScopeNode2);
	
	var _ArrayHandler = __webpack_require__(/*! ../../../util/ArrayHandler */ 34);
	
	var _ArrayHandler2 = _interopRequireDefault(_ArrayHandler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var DomAttrMatcher = new RegExp("(\\w+?)-([\\w+-_]+)");
	
	var TaskArgument = function () {
	  function TaskArgument(_argData) {
	    _classCallCheck(this, TaskArgument);
	
	    this['import'](_argData);
	    this.type = 'task';
	  }
	
	  _createClass(TaskArgument, [{
	    key: 'import',
	    value: function _import(_argData) {
	      this.name = _argData.name;
	      this.value = _argData.value;
	    }
	  }, {
	    key: 'export',
	    value: function _export() {
	      return {
	        name: this.name,
	        value: this.value
	      };
	    }
	  }]);
	
	  return TaskArgument;
	}();
	
	var TaskChain = function () {
	  function TaskChain(_argData) {
	    _classCallCheck(this, TaskChain);
	
	    this['import'](_argData);
	  }
	
	  _createClass(TaskChain, [{
	    key: 'import',
	    value: function _import(_argData) {
	      this.name = _argData.name;
	      this.value = _argData.value;
	    }
	  }, {
	    key: 'export',
	    value: function _export() {
	      return {
	        name: this.name,
	        value: this.value
	      };
	    }
	  }]);
	
	  return TaskChain;
	}();
	
	var TaskScopeNode = function (_ScopeNode) {
	  _inherits(TaskScopeNode, _ScopeNode);
	
	  function TaskScopeNode(_scopeData) {
	    _classCallCheck(this, TaskScopeNode);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TaskScopeNode).call(this, _scopeData));
	
	    if (Orient.bn === 'ie' && Orient.bv <= 10) {
	      _ScopeNode3['default'].call(_this, _scopeData);
	    }
	    _this.type = 'task';
	
	    return _this;
	  }
	
	  _createClass(TaskScopeNode, [{
	    key: 'getChainedTaskName',
	    value: function getChainedTaskName(_chainCode) {
	      var index = _ArrayHandler2['default'].findIndex(this.chains, function (_chain) {
	
	        return _chain.name.toLowerCase() === _chainCode.toLowerCase();
	      });
	
	      if (this.chains[index]) {
	        return this.chains[index].value;
	      }
	
	      return undefined;
	    }
	  }, {
	    key: 'import',
	    value: function _import(_scopeData) {
	      _get(Object.getPrototypeOf(TaskScopeNode.prototype), 'import', this).call(this, _scopeData);
	      this.action = _scopeData.action;
	
	      this.delegate = _scopeData.delegate;
	      this.executor = _scopeData.executor;
	
	      this.args = _scopeData.args.map(function (_arg) {
	        return new TaskArgument(_arg);
	      });
	      this.chains = _scopeData.chains.map(function (_chain) {
	        return new TaskChain(_chain);
	      });
	      this.trace = _scopeData.trace;
	    }
	  }, {
	    key: 'export',
	    value: function _export() {
	      var exportObject = _get(Object.getPrototypeOf(TaskScopeNode.prototype), 'export', this).call(this);
	      exportObject.action = this.action;
	
	      exportObject.delegate = this.delegate;
	      exportObject.executor = this.executor;
	
	      exportObject.args = this.args.map(function (_taskArgument) {
	        return _taskArgument['export']();
	      });
	
	      exportObject.chains = this.chains.map(function (_taskChain) {
	        return _taskChain['export']();
	      });
	
	      exportObject.trace = this.trace;
	
	      return exportObject;
	    }
	  }, {
	    key: 'args',
	    get: function get() {
	      return this._args;
	    },
	    set: function set(_args) {
	      this._args = _args;
	    }
	  }, {
	    key: 'chains',
	    get: function get() {
	      return this._chains;
	    },
	    set: function set(_chains) {
	      this._chains = _chains;
	    }
	  }], [{
	    key: 'CreateByScopeDom',
	    value: function CreateByScopeDom(_scopeDom) {
	
	      var newScopeNode = new TaskScopeNode(TaskScopeNode.BuildScopeSpecObjectByScopeDom(_scopeDom));
	
	      return newScopeNode;
	    }
	  }, {
	    key: 'BuildScopeSpecObjectByScopeDom',
	    value: function BuildScopeSpecObjectByScopeDom(_dom) {
	
	      var attr = void 0,
	          formatMathed = void 0;
	      var scopeSpecObject = _ScopeNode3['default'].BuildScopeSpecObjectByScopeDom(_dom);
	      var attrs = _dom.attributes;
	      var length = attrs.length;
	
	      scopeSpecObject.trace = _dom.getAttribute('trace') !== null ? true : false;
	
	      scopeSpecObject.delegate = _dom.getAttribute('en-delegate') || null;
	      scopeSpecObject.executor = _dom.getAttribute('en-executor') || null;
	
	      // 확장클래스에서 사용하는 attribute 읽기 및 지정
	      scopeSpecObject.action = _dom.getAttribute('action');
	      if (!/\w+/.test(scopeSpecObject.action || '')) throw new Error('TaskScope 선언에는 action 이 포함되어야 합니다. Task Name:[' + scopeSpecObject.name + ']');
	
	      scopeSpecObject.args = [];
	      scopeSpecObject.chains = [];
	      for (var i = 0; i < length; i++) {
	        attr = attrs[i];
	        formatMathed = attr.nodeName.match(DomAttrMatcher);
	        if (formatMathed !== null) {
	          if (formatMathed[1] === 'arg') {
	            scopeSpecObject.args.push({
	              name: formatMathed[2],
	              value: attr.nodeValue
	            });
	          } else if (formatMathed[1] === 'chain') {
	            scopeSpecObject.chains.push({
	              name: formatMathed[2],
	              value: attr.nodeValue
	            });
	          }
	        }
	      }
	
	      return scopeSpecObject;
	    }
	  }]);
	
	  return TaskScopeNode;
	}(_ScopeNode3['default']);
	
	exports['default'] = TaskScopeNode;

/***/ },

/***/ 70:
/*!***************************************************************************!*\
  !*** ./client/src/js/serviceCrew/ElementNode/ScopeNode/ParamScopeNode.js ***!
  \***************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _ValueScopeNode2 = __webpack_require__(/*! ./ValueScopeNode */ 64);
	
	var _ValueScopeNode3 = _interopRequireDefault(_ValueScopeNode2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }
	
	var ParamScopeNode = function (_ValueScopeNode) {
	  _inherits(ParamScopeNode, _ValueScopeNode);
	
	  function ParamScopeNode(_scopeData) {
	    _classCallCheck(this, ParamScopeNode);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ParamScopeNode).call(this, _scopeData));
	
	    if (Orient.bn === 'ie' && Orient.bv <= 10) {
	      _ValueScopeNode3['default'].call(_this, _scopeData);
	    }
	    _this.type = 'param';
	
	    console.log('param scope member created');
	    return _this;
	  }
	
	  /**
	  Task Implement
	  **/
	
	
	  _createClass(ParamScopeNode, null, [{
	    key: 'CreateByScopeDom',
	    value: function CreateByScopeDom(_scopeDom) {
	      var newScopeNode = new ParamScopeNode(ParamScopeNode.BuildScopeSpecObjectByScopeDom(_scopeDom));
	      console.log(newScopeNode);
	      return newScopeNode;
	    }
	  }]);
	
	  return ParamScopeNode;
	}(_ValueScopeNode3['default']);
	
	exports['default'] = ParamScopeNode;

/***/ },

/***/ 71:
/*!******************************************************************************!*\
  !*** ./client/src/js/serviceCrew/ElementNode/ScopeNode/FunctionScopeNode.js ***!
  \******************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _ScopeNode2 = __webpack_require__(/*! ./ScopeNode */ 65);
	
	var _ScopeNode3 = _interopRequireDefault(_ScopeNode2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }
	
	var FUNCTION_START_CAPTURE_REGEXP = /^[\s\t]*\![\s\t]*?function/;
	
	var DomAttrMatcher = new RegExp("(\\w+?)-([\\w+-_]+)");
	
	var FunctionScopeNode = function (_ScopeNode) {
	  _inherits(FunctionScopeNode, _ScopeNode);
	
	  function FunctionScopeNode(_scopeData) {
	    _classCallCheck(this, FunctionScopeNode);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FunctionScopeNode).call(this, _scopeData));
	
	    if (Orient.bn === 'ie' && Orient.bv <= 10) {
	      _ScopeNode3['default'].call(_this, _scopeData);
	    }
	
	    _this.type = 'function';
	    return _this;
	  }
	
	  _createClass(FunctionScopeNode, [{
	    key: 'extractFunction',
	    value: function extractFunction() {
	      // function Returner 를 실행하여 실제 Function을 얻는다.
	      var executableFunction = void 0;
	      // console.log(this.functionReturner);
	
	      try {
	        executableFunction = new Function(this.functionReturner);
	        executableFunction = executableFunction();
	      } catch (_e) {
	        _e.message = '함수를 추출 할 수 없었습니다. <Native:' + _e.message + '> \nSource\n' + this.functionReturner + '\n';
	        throw _e;
	      }
	
	      if (typeof executableFunction === 'function') {
	        this.executableFunction = executableFunction;
	      } else {
	        throw new Error("FunctionNode 는 반드시 함수를 반환 해야 합니다.");
	      }
	    }
	  }, {
	    key: 'import',
	    value: function _import(_scopeData) {
	      _get(Object.getPrototypeOf(FunctionScopeNode.prototype), 'import', this).call(this, _scopeData);
	
	      this.functionReturner = _scopeData.functionReturner;
	
	      if (this.functionReturner !== null) {
	        this.extractFunction();
	      }
	    }
	  }, {
	    key: 'export',
	    value: function _export() {
	      var exportObject = _get(Object.getPrototypeOf(FunctionScopeNode.prototype), 'export', this).call(this);
	
	      exportObject.functionReturner = this.functionReturner;
	      return exportObject;
	    }
	  }, {
	    key: 'functionReturner',
	    get: function get() {
	      return this._functionReturner;
	    },
	    set: function set(_functionReturner) {
	      this._functionReturner = _functionReturner;
	    }
	  }, {
	    key: 'executableFunction',
	    get: function get() {
	      return this._executableFunction;
	    },
	    set: function set(_executableFunction) {
	      this._executableFunction = _executableFunction;
	    }
	  }], [{
	    key: 'CreateByScopeDom',
	    value: function CreateByScopeDom(_scopeDom) {
	      var newScopeNode = new FunctionScopeNode(FunctionScopeNode.BuildScopeSpecObjectByScopeDom(_scopeDom));
	
	      return newScopeNode;
	    }
	  }, {
	    key: 'BuildScopeSpecObjectByScopeDom',
	    value: function BuildScopeSpecObjectByScopeDom(_dom) {
	
	      var scopeSpecObject = _ScopeNode3['default'].BuildScopeSpecObjectByScopeDom(_dom);
	
	      var scopeBody = _dom.innerHTML;
	      var lines = scopeBody.split('\n');
	      lines = lines.map(function (_line) {
	        return _line.replace(FUNCTION_START_CAPTURE_REGEXP, 'return function');
	      });
	
	      scopeSpecObject.functionReturner = lines.join('\n');
	
	      return scopeSpecObject;
	    }
	  }]);
	
	  return FunctionScopeNode;
	}(_ScopeNode3['default']);
	
	exports['default'] = FunctionScopeNode;

/***/ },

/***/ 72:
/*!**********************************************************!*\
  !*** ./client/src/js/serviceCrew/Actions/ActionStore.js ***!
  \**********************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Action = __webpack_require__(/*! ../Action */ 61);
	
	var _Action2 = _interopRequireDefault(_Action);
	
	var _ArrayHandler = __webpack_require__(/*! ../../util/ArrayHandler */ 34);
	
	var _ArrayHandler2 = _interopRequireDefault(_ArrayHandler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var NEW_CHECK = '082dc829-7b48-4107-b119-f8ec2f0d9ecc';
	
	// Singletone 클래스
	// Gelato가 기본으로 지원하는 Action을 포함하여 사용자가 입력한 CustomAction 모두를 제공하는 ActionStore 이다.
	var _instance = null;
	
	var ActionStore = function () {
	  _createClass(ActionStore, null, [{
	    key: 'instance',
	    value: function instance() {
	      if (_instance === null) _instance = new ActionStore(NEW_CHECK);
	
	      return _instance;
	    }
	  }]);
	
	  function ActionStore(_NEW_CHECK) {
	    _classCallCheck(this, ActionStore);
	
	    this.actions = [];
	
	    if (_NEW_CHECK !== NEW_CHECK) {
	      throw new Error("ActionStore를 직접 생성 하실 수 없습니다. ActionStore.instance() 로 인스턴스를 얻으세요.");
	    }
	
	    if (_instance !== null) throw new Error("이미 ActionStore 가 생성되어 있습니다.");
	  }
	
	  _createClass(ActionStore, [{
	    key: 'registerAction',
	
	
	    /*
	      _name : action Name
	      _params : paramKey Array
	      _actionFunction : Parameter 정의가 되어 있지 않은 익명함수. 함수의 Body 만 추출하여 입력된다.
	    */
	    value: function registerAction(_name, _params, _actionFunction) {
	      var oldAction = this.getAction(_name);
	
	      var actionFunctionString = _actionFunction.toString();
	      var actionBody = actionFunctionString.substring(actionFunctionString.indexOf('{') + 1, actionFunctionString.lastIndexOf('}'));
	
	      var action = new _Action2['default']({
	        name: _name,
	        params: _params,
	        actionBody: actionBody
	      });
	
	      if (oldAction !== null) console.warn("동일한 Name 의 Action이 재정의 되었습니다. old, new", oldAction, _actionFunction);
	
	      this.actions.push(action);
	    }
	  }, {
	    key: 'getAction',
	    value: function getAction(_name) {
	      var index = _ArrayHandler2['default'].findIndex(this.actions, function (_action) {
	        return _action.name === _name;
	      });
	
	      return this.actions[index] || null;
	    }
	  }, {
	    key: 'actions',
	    get: function get() {
	      return this._actions;
	    },
	    set: function set(_actions) {
	      this._actions = _actions;
	    }
	  }]);
	
	  return ActionStore;
	}();
	
	exports['default'] = ActionStore;

/***/ },

/***/ 73:
/*!**************************************************************!*\
  !*** ./client/src/js/serviceCrew/Functions/FunctionStore.js ***!
  \**************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Function2 = __webpack_require__(/*! ../Function */ 74);
	
	var _Function3 = _interopRequireDefault(_Function2);
	
	var _ArrayHandler = __webpack_require__(/*! ../../util/ArrayHandler */ 34);
	
	var _ArrayHandler2 = _interopRequireDefault(_ArrayHandler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var NEW_CHECK = '082dc829-7b48-4107-b119-f8ec2f0d9ecc';
	
	// Singletone 클래스
	// Gelato가 기본으로 지원하는 Function을 포함하여 사용자가 입력한 CustomFunction 모두를 제공하는 FunctionStore 이다.
	var _instance = null;
	
	var FunctionStore = function () {
	  _createClass(FunctionStore, null, [{
	    key: 'instance',
	    value: function instance() {
	      if (_instance === null) _instance = new FunctionStore(NEW_CHECK);
	
	      return _instance;
	    }
	  }]);
	
	  function FunctionStore(_NEW_CHECK) {
	    _classCallCheck(this, FunctionStore);
	
	    this.functions = [];
	
	    if (_NEW_CHECK !== NEW_CHECK) {
	      throw new Error("FunctionStore를 직접 생성 하실 수 없습니다. FunctionStore.instance() 로 인스턴스를 얻으세요.");
	    }
	
	    if (_instance !== null) throw new Error("이미 FunctionStore 가 생성되어 있습니다.");
	  }
	
	  _createClass(FunctionStore, [{
	    key: 'registerFunction',
	
	
	    /*
	      _name : function Name
	      _params : paramKey Array
	      _functionFunction : 미리 정의된 함수 스코프를 그대로 유지한다.
	    */
	    value: function registerFunction(_name, _functionFunction) {
	      var oldFunction = this.getFunction(_name);
	
	      var _function = new _Function3['default'](_name, _functionFunction);
	
	      if (oldFunction !== null) console.warn('동일한 Name[' + _name + '] 의 Function이 재정의 되었습니다. old, new', oldFunction, _functionFunction);
	
	      this.functions.push(_function);
	    }
	  }, {
	    key: 'getFunction',
	    value: function getFunction(_name) {
	      var index = _ArrayHandler2['default'].findIndex(this.functions, function (_function) {
	        return _function.name === _name;
	      });
	
	      return this.functions[index] || null;
	    }
	  }, {
	    key: 'functions',
	    get: function get() {
	      return this._functions;
	    },
	    set: function set(_functions) {
	      this._functions = _functions;
	    }
	  }]);
	
	  return FunctionStore;
	}();
	
	exports['default'] = FunctionStore;

/***/ },

/***/ 74:
/*!***********************************************!*\
  !*** ./client/src/js/serviceCrew/Function.js ***!
  \***********************************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _Function = function _Function(_name, _executableFunction) {
	  _classCallCheck(this, _Function);
	
	  this.name = _name;
	  this.executableFunction = _executableFunction;
	};
	
	exports["default"] = _Function;

/***/ },

/***/ 75:
/*!**********************************************************************!*\
  !*** ./client/src/js/serviceCrew/Actions/BasicElementNodeActions.js ***!
  \**********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ActionStore = __webpack_require__(/*! ./ActionStore */ 72);
	
	var _ActionStore2 = _interopRequireDefault(_ActionStore);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	// import ICEAPISource from '../ICEAPISource';
	// import APIFarmSource from '../APIFarmSource';
	// import SA_Loader from '../StandAloneLib/Loader';
	
	// window.ICEAPISource = ICEAPISource;
	// window.SA_Loader = SA_Loader;
	// window.APIFarmSource = APIFarmSource;
	
	var actionStore = _ActionStore2['default'].instance();
	
	// regexp = {
	//       empty     : function(){return /^\s*$/;},
	//       email     : function(){return /^[\w\d]+@[\w\d-]+\.[\w]+$/;},
	//       username  : function(){return /^[A-Za-z0-9_\-]+$/;},
	//       name      : function(){return /^[\w\d\s]+$/;},
	//       text      : function(){return /^[A-Za-z0-9_\-]+$/;},
	//       image_file    : function(){return /\.(jpg|png|gif|jpeg)$/i;},
	//       password_min_chars : function(){ return /^.{0,7}$/; },
	//       password_L1   : function(){return /^[a-z]+$/;},
	//       password_L2   : function(){return /^[a-z0-9]+$/;},
	//       password_L3   : function(){return /^[a-zA-Z0-9]+$/;},
	//       password_L4   : function(){return /^[a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\-\+\=]+$/;}
	//     };
	
	/*
	Action Function Scope 내 의 고정 인자
	  _event : ElementNode가 생성한 이벤트 객체 --- from ElementNode __executeTask
	  _originEvent : DomEvent 로 인해 발생되었을 경우의 Dom Event 객체 --- from ElementNode __executeTask
	  _prevResult : 이전 Action이 실행되어 반환한 actionResult 객체 chain 된 액션의 경우 삽입 --- from ElementNode __executeTask
	  _actionResult : 새로운 ActionResult 인스턴스
	  _ActionResult : 새로운 ActionResult 인스턴스를 생성 할 수 있는 ActionResult 클래스
	  _callback : Action 실행이 완료 되었을 때 호출하는 Callback 메서드. 인자로 actionResult 인스턴스를 입력하여야 한다.
	*/
	//
	// actionStore.registerAction('refresh', ['taskChain'], function() {
	//   _actionResult.taskChain = taskChain;
	//
	//   this.update();
	//
	//   _actionResult.code = 'success';
	//   _callback(_actionResult);
	//
	//   // this.refresh(function() {
	//   //   _actionResult.code = 'success';
	//   //   _callback(_actionResult);
	//   // });
	// });
	//
	// actionStore.registerAction('refresh-to', ['eid', 'selector', 'taskChain'], function() {
	//   _actionResult.taskChain = taskChain;
	//
	//   let targetElementNode;
	//   if (eid !== undefined) {
	//     targetElementNode = this.getMaster().findById(eid, false);
	//   }
	//
	//   targetElementNode.update();
	//   _actionResult.code = 'success';
	//
	//   _callback(_actionResult);
	// });
	
	actionStore.registerAction('update', ['keep_dc', 'resolve'], function () {
	
	  this.update({
	    keepDC: keep_dc || false,
	    resolve: resolve
	  });
	
	  _actionResult.code = 'success';
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('update-single', ['keep_dc', 'resolve'], function () {
	
	  this.updateSingle({
	    keepDC: keep_dc || false,
	    resolve: resolve
	  });
	
	  _actionResult.code = 'success';
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('update-to', ['eid', 'taskChain'], function () {
	  _actionResult.taskChain = taskChain;
	
	  var targetElementNode = void 0;
	  if (eid !== undefined) {
	    targetElementNode = this.getMaster().findById(eid, false);
	  }
	
	  targetElementNode.update();
	  _actionResult.code = 'success';
	
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('attr', ['name', 'value', 'taskChain'], function () {
	  this.setAttribute(name, value);
	
	  _actionResult.taskChain = taskChain;
	  _actionResult.code = 'success';
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('set-by-plain', ['name', 'value', 'taskChain'], function () {
	  var valueScope = this.getScope(name, 'value');
	
	  valueScope.plainValue = value;
	
	  _actionResult.taskChain = taskChain;
	  _actionResult.code = 'success';
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('set', ['name', 'value'], function () {
	  this.setValueScopeData(name, value);
	
	  _actionResult.code = 'success';
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('set-attr', ['name', 'value'], function () {
	  this.setAttrR(name, value);
	  _actionResult.data = {
	    name: name,
	    value: value
	  };
	
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('toggle-val', ['name'], function () {
	  var value = this.getValue(name);
	
	  this.setValue(name, value ? false : true);
	
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('attr-to', ['eid', 'selector', 'name', 'value', 'taskChain'], function () {
	  var targetElementNode = void 0;
	  if (eid !== undefined) {
	    targetElementNode = this.getMaster().findById(eid, false);
	  }
	
	  targetElementNode.setAttribute(name, value);
	
	  _actionResult.code = 'success';
	  _actionResult.taskChain = taskChain;
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('exists-toggle-attr-to', ['eid', 'name', 'taskChain'], function () {
	  var targetElementNode = void 0;
	  if (eid !== undefined) {
	    targetElementNode = this.getMaster().findById(eid, false);
	  }
	
	  if (targetElementNode.getAttribute(name) !== undefined) {
	    targetElementNode.removeAttribute(name);
	  } else {
	    targetElementNode.setAttribute(name, 'on');
	  }
	
	  _actionResult.code = 'success';
	  _actionResult.taskChain = taskChain;
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('scrollTop', ['taskChain'], function () {
	  this.forwardDOM.ownerDocument.defaultView.scrollTo(0, 0);
	
	  _actionResult.code = 'success';
	  _actionResult.taskChain = taskChain;
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('alert', ['message', 'taskChain'], function () {
	  alert(message);
	
	  _actionResult.code = 'success';
	  _actionResult.taskChain = taskChain;
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('move-location', ['location'], function () {
	  window.location.href = location;
	
	  _actionResult.code = 'success';
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('input-value-upsync', [], function () {
	  var value = this.forwardDOM.value;
	
	  this.setAttribute('value', value);
	
	  _actionResult.code = 'success';
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('input-value-test', ['testRegExp'], function () {
	  var value = this.forwardDOM.value;
	
	  if (testRegExp.test(new RegExp(value))) {
	    _actionResult.code = 'pass';
	  } else {
	    _actionResult.code = 'fail';
	  }
	
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('input-value-validate', ['type'], function () {
	  var value = this.forwardDOM.value;
	  var testRegExp = void 0;
	
	  switch (type) {
	    case 'id':
	      testRegExp = /^[\w\d]{6,}$/;
	      break;
	    case 'password':
	      testRegExp = /^[\w\d\!\@\#\$\%\^\*\?\_\~]{8,}$/;
	    default:
	
	  }
	
	  if (testRegExp.test(value)) {
	    _actionResult.code = 'pass';
	  } else {
	    _actionResult.code = 'fail';
	  }
	
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('validate', ['text', 'type'], function () {
	
	  function validate(_regExp, _value) {
	
	    if (_regExp.test(_value || '')) {
	      return 'pass';
	    } else {
	      return 'fail';
	    }
	  }
	
	  switch (type) {
	    case 'number':
	      _actionResult.code = validate(/^\d+$/, text);
	      break;
	
	    case 'words':
	      _actionResult.code = validate(/^\w+$/, text);
	      break;
	
	    case 'email':
	      _actionResult.code = validate(/^[\w\d]+@[\w\d-]+(\.[\w]+)+$/, text);
	      break;
	
	    case 'id6':
	      _actionResult.code = validate(/^[\w\d]{6,}$/, text);
	      break;
	
	    case 'password':
	      _actionResult.code = validate(/^[\w\d\!\@\#\$\%\^\*\?\_\~]{8,}$/, text);
	      break;
	
	    case 'email-host':
	      _actionResult.code = validate(/^[\w\d-]+\.[\w]+$/, text);
	      break;
	
	    case 'tel-number-ko':
	      _actionResult.code = validate(/^\d{2,3}-\d{3,4}-\d{3,4}$/, text);
	      break;
	
	    case 'birthdate':
	      // 19910211
	      _actionResult.code = validate(/^\d{4}\d{2}\d{2}$/, text);
	      break;
	
	    case 'birth-date':
	      // 1991-02-11
	      _actionResult.code = validate(/^\d{4}-\d{1,2}-\d{1,2}$/, text);
	      break;
	
	    case 'birth-day':
	      // 02-11
	      _actionResult.code = validate(/^\d{1,2}-\d{1,2}$/, text);
	      break;
	
	    case 'has-special-character':
	      _actionResult.code = validate(/[\!\@\#\$\%\^\*\?\_\~]+/, text);
	      break;
	
	    default:
	      throw new Error("지원하지 않는 유효성 검사 타입입니다.");
	  }
	
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('if', ['conditionResult'], function () {
	
	  if (conditionResult) {
	    _actionResult.code = 'true';
	  } else {
	    _actionResult.code = 'false';
	  }
	
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('loop', ['fps'], function () {
	  setInterval(function () {
	    _callback(_actionResult);
	  }, 1000 / fps);
	});
	
	/***
	 * chainCodeCriterion : Key Name or Function
	 */
	actionStore.registerAction('sendAPISourceForm', ['apiSourceId', 'requestId', 'chainCodeCriterion', 'enctype', 'fields', 'before_chain'], function () {
	  var that = this;
	
	  var transferFields = {};
	  // name Attribute 를 가진 TagElement 를 검색한다.
	  var foundElements = this.getDOMNode().querySelectorAll('[name]') || [];
	  var foundElementNodes = [];
	  var foundElement = void 0;
	  var foundElementNode = void 0;
	
	  // name Attribute를 가진 TagElement중 transfer-value 필드를 가진 ElementNode를 검색한다.
	  for (var i = 0; i < foundElements.length; i++) {
	    foundElement = foundElements[i];
	    foundElementNode = Orient.getNodeByDOM(foundElement);
	
	    if (foundElementNode !== null && foundElementNode.hasAttribute('transfer-value')) {
	      foundElementNodes.push(foundElement.___en);
	    }
	  }
	
	  var name = void 0,
	      value = void 0;
	  foundElementNodes.map(function (_elementNode) {
	
	    var pass = true;
	
	    _elementNode.climbParents(function (_parent) {
	      if (_parent === that) {
	
	        return null;
	      } else if (_parent.hasAttribute('ignore-transfer')) {
	
	        pass = false;
	        return null;
	      }
	    });
	
	    if (pass) {
	      name = _elementNode.getAttributeWithResolve('name');
	      value = _elementNode.getAttributeWithResolve('transfer-value');
	
	      if (name && value) {
	        transferFields[name] = value;
	      }
	    }
	  });
	
	  // 추가 필드 머지
	  __orient__ObjectExtends.mergeByRef(transferFields, fields || {}, true);
	
	  var requestMethodForHTTP = 'get';
	  if (this.getDOMNode().getAttribute('method')) {
	    requestMethodForHTTP = this.getDOMNode().getAttribute('method');
	  }
	
	  console.log("%c Transfer form", "font-size:100px; font-family: Arial, sans-serif; color:#fff;   text-shadow: 0 1px 0 #ccc,   0 2px 0 #c9c9c9, 0 3px 0 #bbb,   0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2),   0 20px 20px rgba(0,0,0,.15)");
	  console.log(apiSourceId, requestId, fields);
	
	  if (before_chain) {
	
	    // before 체인 발생
	    _actionResult.code = before_chain;
	    _callback(_actionResult);
	  }
	
	  console.log(this.environment);
	
	  Orient.APIRequest.RequestAPI(this.environment, apiSourceId, requestId, transferFields, function (_err, _retrievedObject, _originResponse) {
	    // http error 코드일 경우
	
	    if (_err) {
	      _actionResult.code = 'error';
	      _actionResult.data = _err;
	    } else {
	
	      if (chainCodeCriterion) {
	
	        if (chainCodeCriterion instanceof Function) {
	          _actionResult.code = chainCodeCriterion(_retrievedObject);
	        } else {
	          _actionResult.code = _retrievedObject[chainCodeCriterion];
	        }
	      } else {
	        _actionResult.code = _retrievedObject['result'];
	      }
	
	      _actionResult.data = _retrievedObject;
	    }
	    _callback(_actionResult);
	  }, enctype || (this.hasAttribute('enctype') ? this.getAttributeWithResolve('enctype') : undefined), requestMethodForHTTP);
	});
	
	actionStore.registerAction('focus', ['eid'], function () {
	  var targetElementNode = void 0;
	  if (eid !== undefined) {
	    targetElementNode = this.getMaster().findById(eid, false);
	  }
	
	  targetElementNode.forwardDOM.focus();
	
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('stopPropagation', [], function () {
	
	  _event.originEvent.stopPropagation();
	
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('preventDefault', [], function () {
	
	  _event.originEvent.preventDefault();
	
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('stopImmediatePropagation', [], function () {
	  _event.originEvent.stopImmediatePropagation();
	
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('singleReturn', ['returnValue'], function () {
	  _actionResult.returns = returnValue;
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('executeDC', [], function () {
	  this.executeDynamicContext();
	
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('resetDC', [], function () {
	  this.resetDynamicContext();
	
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('pipe', ['pipeName', 'pipeData'], function () {
	
	  this.executeEventPipe(pipeName, pipeData || {}, function (_pipeResult) {
	
	    _callback(_actionResult);
	  });
	});
	
	// 배열에 값을 추가
	actionStore.registerAction('push', ['name', 'value'], function () {
	
	  this.pushToValueScopeArray(name, value);
	
	  _callback(_actionResult);
	});
	
	// 배열에서 특정한 값을 제거
	actionStore.registerAction('pop2', ['name', 'value'], function () {
	
	  this.popToValueScopeArrayByValue(name, value);
	
	  _callback(_actionResult);
	});
	
	// 배열에서 특정한 값을 제거
	actionStore.registerAction('set-cookie', ['name', 'value', 'expires', 'path'], function () {
	  var options = {};
	  if (expires !== undefined) {
	    options.expires = expires;
	  }
	
	  if (path !== undefined) {
	    options.path = path;
	  }
	
	  Orient.Cookie.set(name, value, options);
	
	  _callback(_actionResult);
	});
	
	// 배열에서 특정한 값을 제거
	actionStore.registerAction('remove-cookie', ['name', 'path'], function () {
	  var options = {};
	
	  if (path !== undefined) {
	    options.path = path;
	  }
	
	  Orient.Cookie.remove(name, options);
	
	  _callback(_actionResult);
	});
	
	actionStore.registerAction('void', ['board'], function () {
	  _callback(_actionResult);
	});
	
	//****** ElementNode default Actions *****//

/***/ },

/***/ 76:
/*!***************************************************************!*\
  !*** ./client/src/js/serviceCrew/Functions/BasicFunctions.js ***!
  \***************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _FunctionStore = __webpack_require__(/*! ./FunctionStore */ 73);
	
	var _FunctionStore2 = _interopRequireDefault(_FunctionStore);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var functionStore = _FunctionStore2['default'].instance();
	
	functionStore.registerFunction('test', function (a) {
	
	  alert(a);
	});
	
	/*
	  Filter : validly
	    입력된 배열의 요소중 참으로 판단되는 요소만 추려 배열로 구성하여 반환한다.
	
	  Parameters:
	    array - 필터링 대상 Array
	
	  return
	    filtered Array
	
	*/
	functionStore.registerFunction('filter-validly', function (array) {
	  var newArray = [];
	
	  for (var i = 0; i < array.length; i++) {
	    if (array[i]) newArray.push(array[i]);
	  }
	
	  return newArray;
	});

/***/ },

/***/ 77:
/*!*************************************!*\
  !*** ./client/src/js/util/Point.js ***!
  \*************************************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Point = function () {
	  function Point(_x, _y) {
	    _classCallCheck(this, Point);
	
	    this.x = _x;
	    this.y = _y;
	  }
	
	  _createClass(Point, [{
	    key: "x",
	    set: function set(_x) {
	      this._x = _x;
	    },
	    get: function get() {
	      return this._x;
	    }
	  }, {
	    key: "y",
	    set: function set(_y) {
	      this._y = _y;
	    },
	    get: function get() {
	      return this._y;
	    }
	  }]);
	
	  return Point;
	}();
	
	exports["default"] = Point;

/***/ },

/***/ 78:
/*!*****************************************************************!*\
  !*** ./client/src/js/serviceCrew/ElementNode/SVGElementNode.js ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _HTMLElementNode2 = __webpack_require__(/*! ./HTMLElementNode.js */ 55);
	
	var _HTMLElementNode3 = _interopRequireDefault(_HTMLElementNode2);
	
	var _Factory = __webpack_require__(/*! ./Factory */ 54);
	
	var _Factory2 = _interopRequireDefault(_Factory);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }
	
	"use strict";
	
	var XML_NS = "http://www.w3.org/2000/svg";
	
	var FINAL_TYPE_CONTEXT = 'svg';
	
	var SVGElementNode = function (_HTMLElementNode) {
	  _inherits(SVGElementNode, _HTMLElementNode);
	
	  _createClass(SVGElementNode, null, [{
	    key: 'XML_NS',
	    get: function get() {
	      return XML_NS;
	    }
	  }]);
	
	  function SVGElementNode(_environment, _elementNodeDataObject, _preInjectProps, _isMaster) {
	    _classCallCheck(this, SVGElementNode);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SVGElementNode).call(this, _environment, _elementNodeDataObject, _preInjectProps, _isMaster));
	
	    if (Orient.bn === 'ie' && Orient.bv <= 10) {
	      _HTMLElementNode3['default'].call(_this, _environment, _elementNodeDataObject, _preInjectProps, _isMaster);
	    }
	    _this.type = FINAL_TYPE_CONTEXT;
	    return _this;
	  }
	
	  /*
	    CreateNode
	      HTMLNode를 생성한다.
	  */
	
	
	  _createClass(SVGElementNode, [{
	    key: 'createNode',
	    value: function createNode() {
	
	      var htmlDoc = void 0;
	
	      if (this.environment) {
	        htmlDoc = this.environment.document;
	      } else {
	        htmlDoc = document;
	      }
	
	      return htmlDoc.createElementNS(XML_NS, this.getTagName());
	    }
	  }, {
	    key: 'mappingAttributeDirect',
	    value: function mappingAttributeDirect(_dom, _name, _value) {
	      _dom.setAttributeNS(null, _name, _value);
	    }
	  }]);
	
	  return SVGElementNode;
	}(_HTMLElementNode3['default']);
	
	exports['default'] = SVGElementNode;

/***/ },

/***/ 79:
/*!********************************************************************!*\
  !*** ./client/src/js/serviceCrew/ElementNode/StringElementNode.js ***!
  \********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _ElementNode2 = __webpack_require__(/*! ./ElementNode.js */ 57);
	
	var _ElementNode3 = _interopRequireDefault(_ElementNode2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }
	
	"use strict";
	
	var FINAL_TYPE_CONTEXT = 'string';
	
	var StringElementNode = function (_ElementNode) {
	  _inherits(StringElementNode, _ElementNode);
	
	  function StringElementNode(_environment, _elementNodeDataObject, _preInjectProps, _isMaster) {
	    _classCallCheck(this, StringElementNode);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StringElementNode).call(this, _environment, _elementNodeDataObject, _preInjectProps, _isMaster));
	
	    if (Orient.bn === 'ie' && Orient.bv <= 10) {
	      _ElementNode3['default'].call(_this, _environment, _elementNodeDataObject, _preInjectProps, _isMaster);
	    }
	    _this.type = FINAL_TYPE_CONTEXT;
	    _this.text;
	    return _this;
	  }
	
	  _createClass(StringElementNode, [{
	    key: 'getText',
	    value: function getText() {
	      return this.text;
	    }
	  }, {
	    key: 'setText',
	
	
	    // getBoundingRect() {
	    //
	    //   var boundingRect;
	    //   var realElement = this.getRealization();
	    //
	    //   if (realElement.nodeValue === '') {
	    //
	    //     boundingRect = {
	    //       left: 0,
	    //       top: 0,
	    //       width: 0,
	    //       height: 0
	    //     }
	    //
	    //   } else {
	    //
	    //     var range = document.createRange();
	    //     range.selectNodeContents(realElement);
	    //     boundingRect = range.getClientRects()[0];
	    //   }
	    //
	    //
	    //
	    //   return boundingRect;
	    // }
	
	    value: function setText(_text) {
	      this.text = _text;
	    }
	  }, {
	    key: 'createNode',
	
	
	    /*
	      CreateNode
	        HTMLNode를 생성한다.
	    */
	    value: function createNode(_options) {
	      var _text = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
	
	      var htmlDoc = void 0;
	
	      if (this.environment) {
	        htmlDoc = this.environment.document;
	      } else {
	        htmlDoc = document;
	      }
	
	      if (this.wrappingTag !== null) {
	        var element = htmlDoc.createElement(this.wrappingTag);
	        element.innerHTML = _text;
	        return element;
	      }
	
	      return htmlDoc.createTextNode(_text);
	    }
	  }, {
	    key: 'applyForward',
	    value: function applyForward() {
	      if (this.wrappingTag !== null) {
	        this.forwardDOM.innerHTML = this.backupDOM.innerHTML;
	      } else {
	
	        this.forwardDOM.nodeValue = this.backupDOM.nodeValue;
	      }
	
	      this.forwardDOM.__renderstemp__ = this.renderSerialNumber;
	      //this.backupDOM = null;
	    }
	  }, {
	    key: 'mappingAttributes',
	    value: function mappingAttributes(_domNode, _options) {
	      var text = _options.resolve ? this.interpret(this.getText()) : this.getText();
	
	      if (_domNode.nodeName === '#text') {
	
	        _domNode.nodeValue = text || '';
	      } else {
	        _domNode.setAttribute('en-id', this.getId());
	        _domNode.setAttribute('en-type', this.getType());
	        if (this.getName()) _domNode.setAttribute('en-name', this.getName());
	
	        if (this.enableHTML) {
	          // enableHTML default : false
	          _domNode.setAttribute('en-enableHtml', '');
	
	          _domNode.innerHTML = text;
	        } else {
	          _domNode.appendChild(_domNode.ownerDocument.createTextNode(text));
	        }
	      }
	    }
	  }, {
	    key: 'buildByComponent',
	    value: function buildByComponent(_component) {
	      _get(Object.getPrototypeOf(StringElementNode.prototype), 'buildByComponent', this).call(this, _component);
	
	      this.setText("Text");
	    }
	  }, {
	    key: 'buildByElement',
	    value: function buildByElement(_stringNode, _absorbOriginDOM) {
	      this.setType('string');
	
	      // for Debug
	      this.sourceElement = _stringNode;
	      if (_absorbOriginDOM === true) {
	        this.forwardDOM = _stringNode;
	        this.forwardDOM.___en = this;
	        this.isAttachedDOM = true;
	      }
	
	      // null을 반환한 ElementNode는 유효하지 않은 ElementNode로 상위 ElementNode의 자식으로 편입되지 못 한다.
	      // 공백과 줄바꿈으로만 이루어진 TextNode는 필요하지 않은 요소이다.
	      if (/^[\s\n][\s\n]+$/.test(_stringNode.nodeValue)) return null;
	
	      // #text Node가 아닌 태그가 입력되었을 떄 해당 태그명을 wrappingTag 로 입력해둔다.
	      if (_stringNode.nodeName !== '#text') {
	        if (_stringNode.hasAttribute('en-enableHtml')) {
	          this.enableHTML = true;
	        } else {
	          this.enableHTML = false;
	        }
	
	        this.setText(_stringNode.innerHTML);
	        this.wrappingTag = _stringNode.nodeName;
	      } else {
	        this.setText(_stringNode.nodeValue);
	        this.wrappingTag = null;
	      }
	    }
	  }, {
	    key: 'isTextEditMode',
	    value: function isTextEditMode() {
	      return this.mode === 'textEdit';
	    }
	  }, {
	    key: 'changeTextEditMode',
	    value: function changeTextEditMode() {
	      this.mode = 'textEdit';
	      //this.getRealization().setAttribute("contenteditable", 'true');
	    }
	  }, {
	    key: 'changeNormalMode',
	    value: function changeNormalMode() {
	      if (this.isTextEditMode()) {
	        this.setText(this.realization.innerHTML);
	      }
	
	      this.mode = 'normal';
	      this.getRealization().removeAttribute("contenteditable");
	    }
	  }, {
	    key: 'import',
	    value: function _import(_elementNodeDataObject) {
	      _get(Object.getPrototypeOf(StringElementNode.prototype), 'import', this).call(this, _elementNodeDataObject);
	      this.enableHTML = _elementNodeDataObject.enhtml || false;
	      this.text = _elementNodeDataObject.text || false;
	      this.wrappingTag = _elementNodeDataObject.wrtag || null;
	    }
	  }, {
	    key: 'export',
	    value: function _export(_withoutId, _idAppender) {
	      var result = _get(Object.getPrototypeOf(StringElementNode.prototype), 'export', this).call(this, _withoutId, _idAppender);
	      result.text = this.getText();
	      result.enhtml = this.enableHTML;
	      result.wrtag = this.wrappingTag;
	      return result;
	    }
	  }, {
	    key: 'enableHTML',
	    get: function get() {
	      return this._enableHTML;
	    },
	    set: function set(_enableHTML) {
	      this._enableHTML = _enableHTML;
	    }
	  }]);
	
	  return StringElementNode;
	}(_ElementNode3['default']);
	
	exports['default'] = StringElementNode;

/***/ },

/***/ 80:
/*!*****************************************************************!*\
  !*** ./client/src/js/serviceCrew/ElementNode/RefElementNode.js ***!
  \*****************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	// Actions Import
	
	
	var _HTMLElementNode2 = __webpack_require__(/*! ./HTMLElementNode.js */ 55);
	
	var _HTMLElementNode3 = _interopRequireDefault(_HTMLElementNode2);
	
	var _Factory = __webpack_require__(/*! ./Factory */ 54);
	
	var _Factory2 = _interopRequireDefault(_Factory);
	
	var _ActionStore = __webpack_require__(/*! ../Actions/ActionStore */ 72);
	
	var _ActionStore2 = _interopRequireDefault(_ActionStore);
	
	var _ArrayHandler = __webpack_require__(/*! ../../util/ArrayHandler */ 34);
	
	var _ArrayHandler2 = _interopRequireDefault(_ArrayHandler);
	
	var _BrowserStorage = __webpack_require__(/*! ../../util/BrowserStorage */ 42);
	
	var _BrowserStorage2 = _interopRequireDefault(_BrowserStorage);
	
	__webpack_require__(/*! ../Actions/RefElementNodeActions */ 81);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	"use strict";
	
	var SETTING_START_STRING = "@Settings";
	var SETTING_START_STRING_LENGTH = SETTING_START_STRING.length;
	
	var SETTING_END_STRING = "@End";
	var SETTING_END_STRING_LENGTH = SETTING_END_STRING.length;
	
	var REGEXP_REF_TARGET_MEAN = /^\[([\w\d-_]+)\](.+)$/;
	
	var FINAL_TYPE_CONTEXT = 'ref';
	
	var RefComponentWrapper = function () {
	  function RefComponentWrapper() {
	    _classCallCheck(this, RefComponentWrapper);
	
	    this.wrapperDOM = null;
	  }
	
	  _createClass(RefComponentWrapper, [{
	    key: 'dettachDOMChild',
	
	
	    // 자식이 부모에게 요청
	    value: function dettachDOMChild(_child) {
	      var domnode = this.wrapperDOM;
	      domnode.removeChild(_child.getDOMNode());
	    }
	  }, {
	    key: 'attachDOMChild',
	    value: function attachDOMChild(_idx, _mountChildDOM, _mountChild) {
	      var domnode = this.wrapperDOM;
	
	      if (_idx !== null) {
	
	        if (domnode.childNodes[_idx]) {
	          domnode.insertBefore(_mountChildDOM, domnode.childNodes[_idx]);
	        } else {
	          domnode.appendChild(_mountChildDOM);
	        }
	      } else {
	        // 마운트 index가 null 인 경우 직접 mount 위치를 찾아서 자식을 붙인다.
	
	        var prevSiblingMountedIndex = 0,
	            realMountIndex = void 0,
	            nextSibling = void 0;
	
	        var child = void 0,
	            childDOM = void 0,
	            ghostChildPool = void 0,
	            ghostChild = void 0,
	            ghostChildDOM = void 0,
	            breakUpperLoop = false;
	        for (var j = 0; j < this.attachedDOMs.length; j++) {
	          child = this.attachedDOMs[j];
	
	          if (child.isRepeater()) {
	            ghostChildPool = child.clonePool;
	
	            for (var i = 0; i < ghostChildPool.length; i++) {
	              ghostChild = ghostChildPool[i];
	              ghostChildDOM = ghostChild.getDOMNode();
	
	              if (_mountChild === ghostChild) {
	
	                if (ghostChildDOM) {
	                  throw new Error(ghostChild.id + ' Component is Already mounted GhostChild.');
	                } else {
	                  breakUpperLoop = true;
	                  break;
	                }
	              } else {
	                if (ghostChildDOM) {
	                  prevSiblingMountedIndex++;
	                }
	              }
	            }
	
	            if (breakUpperLoop) break;
	          } else {
	            childDOM = child.getDOMNode();
	
	            if (child === _mountChild) {
	              if (childDOM) {
	                throw new Error(child.id + ' Component is Already mounted Child.');
	              } else {
	                break;
	              }
	            } else {
	              if (childDOM) {
	                prevSiblingMountedIndex++;
	              }
	            }
	          }
	        }
	
	        realMountIndex = prevSiblingMountedIndex + 1;
	        nextSibling = domnode.childNodes[realMountIndex];
	
	        if (nextSibling) {
	          domnode.insertBefore(_mountChildDOM, nextSibling);
	        } else {
	          domnode.appendChild(_mountChildDOM);
	        }
	      }
	    }
	
	    ////////////////////////////////
	    // Parent Interfaces Polyfill //
	    ////////////////////////////////
	
	  }, {
	    key: 'getScope',
	    value: function getScope() {
	      return null;
	    }
	  }, {
	    key: 'wrapperDOM',
	    get: function get() {
	      return this._wrapperDOM;
	    },
	    set: function set(_dom) {
	      this._wrapperDOM = _dom;
	    }
	  }]);
	
	  return RefComponentWrapper;
	}();
	
	var RefElementNode = function (_HTMLElementNode) {
	  _inherits(RefElementNode, _HTMLElementNode);
	
	  function RefElementNode(_environment, _elementNodeDataObject, _preInjectProps, _isMaster) {
	    _classCallCheck(this, RefElementNode);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RefElementNode).call(this, _environment, _elementNodeDataObject, _preInjectProps, _isMaster));
	
	    if (Orient.bn === 'ie' && Orient.bv <= 10) {
	      _HTMLElementNode3['default'].call(_this, _environment, _elementNodeDataObject, _preInjectProps, _isMaster);
	    }
	    _this.type = FINAL_TYPE_CONTEXT;
	
	    _this.loadedMasters = null;
	
	    _this.loadedInstance = null;
	    _this.loadedRefs = false;
	    _this.mountedRefs = false;
	    _this.loadedTargetId = null;
	
	    _this.masterElementNodes = [];
	
	    // 대표 masterElementNode
	    // masterElementNode 중 en-component-representer 을 지정한다.
	    _this.representerMasterElementNode = null;
	
	    //this.componentWrapper = new RefComponentWrapper();
	    return _this;
	  }
	
	  _createClass(RefElementNode, [{
	    key: 'mappingAttributes',
	    value: function mappingAttributes(_domNode, _options) {
	      _get(Object.getPrototypeOf(RefElementNode.prototype), 'mappingAttributes', this).call(this, _domNode, _options);
	
	      if (window.ORIENT_SHOW_SPECIAL_ATTRIBUTES) {
	        if (this.refTargetId) _domNode.setAttribute('en-ref-target-id', this.refTargetId);
	      }
	    }
	
	    // constructDOMs(_options) {
	    //   let returnHolder = super.constructDOMs(_options);
	    //   let that = this;
	    //
	    //   if (returnHolder.length === 0) {
	    //
	    //
	    //     // 하위 masterElementNodes 의 attach상태를 변경
	    //     this.masterElementNodes.map(function(_masterElementNode) {
	    //       _masterElementNode.forwardDOM = null;
	    //       _masterElementNode.isAttachedDOM = false;
	    //
	    //       if (_masterElementNode.treeExplore)
	    //         _masterElementNode.treeExplore(function(_child) {
	    //           _child.forwardDOM = null;
	    //           _child.isAttachedDOM = false;
	    //         });
	    //     });
	    //
	    //     return returnHolder;
	    //   }
	    //
	    //
	    //
	    //   let targetId = _options.resolve ? this.interpret(this.refTargetId) : this.refTargetId;
	    //
	    //
	    //   if (!targetId) {
	    //     this.print_console_error("Reference target is '" + targetId + "' from string '" + this.refTargetId + "' ");
	    //   }
	    //
	    //   if (this.loadedTargetId === null || this.loadedTargetId !== targetId || this.refAlwaysRemount) {
	    //     that.componentRepresenter = null;
	    //
	    //
	    //     that.tryEventScope('ref-will-mount', {
	    //
	    //     }, null, (_result) => {
	    //       this.loadComponent(targetId, (_masterElementNodes, _componentSettings) => {
	    //
	    //
	    //         // 일반 env_include 는 처리만 실행한다.
	    //         if (_componentSettings['env_include']) {
	    //           this.processingCSetting_include(_componentSettings['env_include']);
	    //         }
	    //
	    //         // env_include_async 는 처리를 실행 후 완료후에 _callback을 실행한다.
	    //
	    //         if (_componentSettings['env_include_async']) {
	    //           if (this.refAsync === false) {
	    //             // 경고
	    //             // component load type is
	    //             // component will be load by async. because component load type is sync, but dependent resource is async
	    //             // 컴포넌트는 비동기로 로딩될 것 이다. 컴포넌트 로딩 타입은 동기 이지만 비동기로 로딩되는 리소스 자원을 가지기 때문이다.
	    //             console.warn(`Warnning : Component will be load by async. because component load type is sync, but component has asynchronous dependence resources.\n${this.DEBUG_FILE_NAME_EXPLAIN} <Component: ${_targetId}>`);
	    //           }
	    //
	    //           this.processingCSetting_include_async(_componentSettings['env_include_async'], () => {
	    //             that.mountComponentBegin(_options, _masterElementNodes, targetId, _componentSettings, () => {
	    //
	    //             });
	    //           });
	    //         } else {
	    //           that.mountComponentBegin(_options, _masterElementNodes, targetId, _componentSettings, () => {
	    //
	    //           });
	    //         }
	    //
	    //
	    //
	    //       });
	    //
	    //
	    //
	    //       that.tryEventScope('ref-did-mount', {
	    //
	    //       }, null, (_result) => {
	    //
	    //       });
	    //     });
	    //
	    //   } else {
	    //     if (this.masterElementNodes) {
	    //       //
	    //       // this.scopeNodes.map(function(_scopeNode) {
	    //       //   if (_scopeNode.type === 'param') {
	    //       //     that.masterElementNodes.setParam(_scopeNode.name, that.interpret(_scopeNode.plainValue));
	    //       //   }
	    //       // });
	    //
	    //
	    //       let masterElementNode;
	    //       for (let i = 0; i < this.masterElementNodes.length; i++) {
	    //         masterElementNode = this.masterElementNodes[i];
	    //
	    //         for (let i = 0; i < this.attributes.length; i++) {
	    //           masterElementNode.setProperty(this.attributes[i].name, this.interpret(this.attributes[i].variable));
	    //         }
	    //
	    //         // let prevForwardDOM = masterElementNode.getDOMNode();
	    //         masterElementNode.update(_options);
	    //         //masterElementNode.attachForwardDOM(that.forwardDOM);
	    //       }
	    //     }
	    //   }
	    //
	    //
	    //   return returnHolder;
	    // }
	
	  }, {
	    key: 'attachDOMChild',
	    value: function attachDOMChild(_idx, _mountChildDOM, _mountChild) {
	      var domnode = this.getDOMNode();
	
	      if (_idx !== null) {
	
	        if (domnode.childNodes[_idx]) {
	          domnode.insertBefore(_mountChildDOM, domnode.childNodes[_idx]);
	        } else {
	          domnode.appendChild(_mountChildDOM);
	        }
	      } else {
	        // 마운트 index가 null 인 경우 직접 mount 위치를 찾아서 자식을 붙인다.
	
	        var prevSiblingMountedIndex = 0,
	            realMountIndex = void 0,
	            nextSibling = void 0;
	
	        var child = void 0,
	            childDOM = void 0,
	            ghostChildPool = void 0,
	            ghostChild = void 0,
	            ghostChildDOM = void 0,
	            breakUpperLoop = false;
	        for (var j = 0; j < this.masterElementNodes.length; j++) {
	          child = this.masterElementNodes[j];
	
	          if (child.isRepeater()) {
	            ghostChildPool = child.clonePool;
	
	            for (var i = 0; i < ghostChildPool.length; i++) {
	              ghostChild = ghostChildPool[i];
	              ghostChildDOM = ghostChild.getDOMNode();
	
	              if (_mountChild === ghostChild) {
	
	                if (ghostChildDOM) {
	                  throw new Error(ghostChild.id + ' Component is Already mounted GhostChild.');
	                } else {
	                  breakUpperLoop = true;
	                  break;
	                }
	              } else {
	                if (ghostChildDOM) {
	                  prevSiblingMountedIndex++;
	                }
	              }
	            }
	
	            if (breakUpperLoop) break;
	          } else {
	            childDOM = child.getDOMNode();
	
	            if (child === _mountChild) {
	              if (childDOM) {
	                throw new Error(child.id + ' Component is Already mounted Child.');
	              } else {
	                break;
	              }
	            } else {
	              if (childDOM) {
	                prevSiblingMountedIndex++;
	              }
	            }
	          }
	        }
	
	        realMountIndex = prevSiblingMountedIndex + 1;
	        nextSibling = domnode.childNodes[realMountIndex];
	
	        if (nextSibling) {
	          domnode.insertBefore(_mountChildDOM, nextSibling);
	        } else {
	          domnode.appendChild(_mountChildDOM);
	        }
	      }
	    }
	  }, {
	    key: 'unmountComponent',
	    value: function unmountComponent(_options) {
	
	      if (this.mountedRefs) {
	        for (var i = 0; i < this.masterElementNodes.length; i++) {
	          this.masterElementNodes[i].render(_options, true);
	        }
	      }
	
	      // unmount는 자식먼저 unmount를 진행한 후 자신도 진행하도록 한다.
	      _get(Object.getPrototypeOf(RefElementNode.prototype), 'unmountComponent', this).call(this, _options);
	    }
	  }, {
	    key: 'mountComponent',
	    value: function mountComponent(_options, _parentCount, _mountIndex) {
	      _get(Object.getPrototypeOf(RefElementNode.prototype), 'mountComponent', this).call(this, _options, _parentCount, _mountIndex);
	
	      this.renderRefComponents(_options);
	    }
	  }, {
	    key: 'updateComponent',
	    value: function updateComponent(_options, _parentCount, _mountIndex) {
	      _get(Object.getPrototypeOf(RefElementNode.prototype), 'updateComponent', this).call(this, _options, _parentCount, _mountIndex);
	
	      this.renderRefComponents(_options);
	    }
	  }, {
	    key: 'renderRefComponents',
	    value: function renderRefComponents(_options) {
	      var _this2 = this;
	
	      // if (this.componentWrapper.mounted) {
	      //
	      // }
	
	      var targetId = _options.resolve ? this.interpret(this.refTargetId) : this.refTargetId;
	
	      if (!targetId) {
	        this.print_console_error("Reference target is '" + targetId + "' from string '" + this.refTargetId + "' ");
	      }
	
	      if (this.loadedRefs && this.loadedTargetId === targetId) {
	        console.log('Mounted refs', this.id, this.getDOMNode());
	        var masterElementNode = void 0;
	        for (var i = 0; i < this.masterElementNodes.length; i++) {
	
	          masterElementNode = this.masterElementNodes[i];
	
	          for (var _i = 0; _i < this.attributes.length; _i++) {
	            masterElementNode.setProperty(this.attributes[_i].name, this.interpret(this.attributes[_i].variable));
	          }
	
	          masterElementNode.render(_options);
	        }
	      } else {
	        if (this.mountedRefs) {
	
	          for (var _i2 = 0; _i2 < this.masterElementNodes.length; _i2++) {
	            this.masterElementNodes[_i2].render({}, true);
	          }
	        }
	
	        this.componentRepresenter = null;
	        this.loadComponent(targetId, function (_masterElementNodes, _componentSettings) {
	          _this2.loadedRefs = true;
	          _this2.loadedTargetId = targetId;
	
	          // 일반 env_include 는 처리만 실행한다.
	          if (_componentSettings['env_include']) {
	            _this2.processingCSetting_include(_componentSettings['env_include']);
	          }
	
	          // env_include_async 는 처리를 실행 후 완료후에 _callback을 실행한다.
	
	          if (_componentSettings['env_include_async']) {
	            if (_this2.refAsync === false) {
	              // 경고
	              // component load type is
	              // component will be load by async. because component load type is sync, but dependent resource is async
	              // 컴포넌트는 비동기로 로딩될 것 이다. 컴포넌트 로딩 타입은 동기 이지만 비동기로 로딩되는 리소스 자원을 가지기 때문이다.
	              console.warn('Warnning : Component will be load by async. because component load type is sync, but component has asynchronous dependence resources.\n' + _this2.DEBUG_FILE_NAME_EXPLAIN + ' <Component: ' + _targetId + '>');
	            }
	
	            _this2.processingCSetting_include_async(_componentSettings['env_include_async'], function () {
	              _this2.mountComponentBegin(_options, _masterElementNodes, targetId, _componentSettings);
	              _this2.mountedRefs = true;
	            });
	          } else {
	            _this2.mountComponentBegin(_options, _masterElementNodes, targetId, _componentSettings);
	            _this2.mountedRefs = true;
	          }
	        });
	      }
	    }
	  }, {
	    key: 'mountComponentBegin',
	    value: function mountComponentBegin(_options, _masterElementNodes, targetId, _componentSettings, _callback) {
	
	      if (!_masterElementNodes) {
	        this.print_console_error('Fragment Load Warning. "' + targetId + '" was not load.');
	        return;
	      }
	
	      this.masterElementNodes = _masterElementNodes;
	
	      this.loadedTargetId = targetId;
	
	      // that.scopeNodes.map(function(_scopeNode) {
	      //   if (_scopeNode.type === 'param') {
	      //     that.loadedInstance.setParam(_scopeNode.name, that.interpret(_scopeNode.plainValue));
	      //   }
	      // });
	
	      // for (let i = 0; i < that.attributes.length; i++) {
	      //   that.loadedInstance.setParam(_scopeNode.name, that.interpret(that.attributes[i]));
	      // }
	      if (this.masterElementNodes.length === 1) {
	        this.representerMasterElementNode = this.masterElementNodes[0];
	      }
	
	      var masterElementNode = void 0;
	      for (var i = 0; i < this.masterElementNodes.length; i++) {
	
	        masterElementNode = this.masterElementNodes[i];
	        if (masterElementNode.componentRepresenter) {
	          this.representerMasterElementNode = masterElementNode;
	        }
	
	        for (var _i3 = 0; _i3 < this.attributes.length; _i3++) {
	          masterElementNode.setProperty(this.attributes[_i3].name, this.interpret(this.attributes[_i3].variable));
	        }
	
	        masterElementNode.setDebuggingInfo('FILE_NAME', targetId);
	
	        masterElementNode.setParent(null);
	        masterElementNode.upperContainer = this;
	        masterElementNode.render(_options, false, i);
	      }
	
	      // after include 처리
	      if (_componentSettings) {
	
	        if (_componentSettings.env_after_include) {
	          this.processingCSetting_include(_componentSettings.env_after_include);
	        }
	
	        if (_componentSettings.env_after_include_async) {
	          this.processingCSetting_include_async(_componentSettings.env_after_include_async);
	        }
	      }
	    }
	  }, {
	    key: 'applyHiddenState',
	    value: function applyHiddenState() {
	      _get(Object.getPrototypeOf(RefElementNode.prototype), 'applyHiddenState', this).call(this);
	
	      var masterElementNode = void 0;
	      for (var i = 0; i < this.masterElementNodes.length; i++) {
	        masterElementNode = this.masterElementNodes[i];
	
	        masterElementNode.applyHiddenState();
	      }
	    }
	  }, {
	    key: 'buildByElement',
	    value: function buildByElement(_domElement, _absorbOriginDOM) {
	      _get(Object.getPrototypeOf(RefElementNode.prototype), 'buildByElement', this).call(this, _domElement, _absorbOriginDOM);
	
	      var attributes = _domElement.attributes;
	      var attr = void 0;
	
	      if (_domElement.getAttribute('en-ref-target-id') !== null) this.refTargetId = _domElement.getAttribute('en-ref-target-id');
	
	      if (_domElement.getAttribute('en-ref-async') !== null) this.refAsync = _domElement.getAttribute('en-ref-async') || true;
	
	      if (_domElement.getAttribute('en-ref-remount-always') !== null) this.refAlwaysRemount = _domElement.getAttribute('en-ref-remount-always') || true;
	
	      if (_domElement.getAttribute('en-event-ref-will-mount') !== null) // Did Mount
	        this.setEvent('ref-will-mount', _domElement.getAttribute('en-event-ref-will-mount'));
	
	      if (_domElement.getAttribute('en-event-ref-did-mount') !== null) // Did Mount
	        this.setEvent('ref-did-mount', _domElement.getAttribute('en-event-ref-did-mount'));
	    }
	  }, {
	    key: 'appendChild',
	    value: function appendChild(_elementNode) {
	      this.children = [];
	      _get(Object.getPrototypeOf(RefElementNode.prototype), 'appendChild', this).call(this, _elementNode);
	      this.refType = RefferenceType.ElementNode;
	      this.refTargetId = _elementNode.id;
	
	      return true;
	    }
	  }, {
	    key: 'loadComponent',
	    value: function loadComponent(_targetId, _complete) {
	      var _this3 = this;
	
	      var that = this;
	      var matchedTargetId = _targetId.match(REGEXP_REF_TARGET_MEAN);
	      var type = void 0;
	      var targetId = void 0;
	      // targetId -> [html]aa.html or aa.html or [html]aa
	      if (matchedTargetId !== null) {
	        type = matchedTargetId[1];
	        targetId = matchedTargetId[2];
	      } else {
	        targetId = _targetId;
	        var matches = targetId.match(/\.(\w+)$/);
	        if (matches === null) return this.print_console_error('\'' + targetId + '\' is Invalid Target ID.');
	        type = matches[1];
	      }
	
	      if (window.ORIENT_REF_COMPONENT_CACHING) {
	        var cacheCheck = this.readCachedComponentJSON(_targetId, function (_masterElementNodes, _settings) {
	          if (_masterElementNodes !== null) {
	            _complete(_masterElementNodes, _settings);
	          }
	        });
	
	        if (cacheCheck) {
	          return;
	        }
	      }
	
	      var loaderFunction = void 0;
	      if (this.environment) {
	        if (this.refAsync) {
	          loaderFunction = this.environment.retriever.loadComponentSheet.bind(this.environment.retriever);
	        } else {
	          loaderFunction = this.environment.retriever.loadComponentSheetSync.bind(this.environment.retriever);
	        }
	
	        if (window.ORIENT_REF_FORCE_ASYNC) loaderFunction = this.environment.retriever.loadComponentSheet;
	
	        loaderFunction(targetId, function (_responseSheet) {
	          if (!_responseSheet) throw new Error('Not found component sheet. <target:' + targetId + '> ' + _this3.DEBUG_FILE_NAME_EXPLAIN);
	
	          _this3.interpretComponentSheet(type, _responseSheet, _targetId, function (_masterElementNodes, _settings) {
	            if (window.ORIENT_REF_COMPONENT_CACHING) _this3.cachingComponentJSON(_targetId, _masterElementNodes, _settings);
	
	            _complete(_masterElementNodes, _settings);
	          });
	        });
	      } else {
	        if (this.refAsync) {
	          loaderFunction = Orient.HTTPRequest.request.bind(Orient.HTTPRequest);
	        } else {
	          loaderFunction = Orient.HTTPRequest.requestSync.bind(Orient.HTTPRequest);
	        }
	
	        if (window.ORIENT_REF_FORCE_ASYNC) loaderFunction = Orient.HTTPRequest.request;
	
	        loaderFunction('get', targetId, {}, function (_err, _res) {
	          if (_err !== null) throw new Error("fail static component loading");
	
	          var responseText = _res.text;
	          _this3.interpretComponentSheet(type, responseText, _targetId, function (_masterElementNodes, _settings) {
	            if (window.ORIENT_REF_COMPONENT_CACHING) _this3.cachingComponentJSON(_targetId, _masterElementNodes, _settings);
	
	            _complete(_masterElementNodes, _settings);
	          });
	        });
	      }
	    }
	  }, {
	    key: 'cachingComponentJSON',
	    value: function cachingComponentJSON(_name, _masterElementNodes, _settings) {
	      var masterElementNodes = [];
	
	      masterElementNodes = _masterElementNodes.map(function (_masterElementNode) {
	
	        return _masterElementNode['export']();
	      });
	
	      _BrowserStorage2['default'].setLocal('_component_' + _name, {
	        component: masterElementNodes,
	        settings: _settings
	      });
	    }
	  }, {
	    key: 'readCachedComponentJSON',
	    value: function readCachedComponentJSON(_name, _callback) {
	      var componentData = _BrowserStorage2['default'].getLocal('_component_' + _name);
	
	      if (componentData) {
	        _callback(_Factory2['default'].convertToMasterElementNodesByJSONSheet(componentData.component, {}, this.environment), componentData.settings);
	        return true;
	      } else {
	        _callback(null);
	        return false;
	      }
	    }
	  }, {
	    key: 'convertMastersByType',
	    value: function convertMastersByType(_type) {
	      var _props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	      var _responseText = arguments[2];
	
	      if (_type === 'html') {
	        return _Factory2['default'].convertToMasterElementNodesByHTMLSheet(_responseText, _props, this.environment);
	      } else if (_type === 'json') {
	        return _Factory2['default'].convertToMasterElementNodesByJSONSheet(JSON.parse(_responseText), _props, this.environment);
	      } else if (_type === 'js') {
	        // return Factory.extractByJSModule(_responseText, this.environment);
	      }
	    }
	
	    // masterElementNode 들과 setting 오브젝트를 반환
	
	  }, {
	    key: 'interpretComponentSheet',
	    value: function interpretComponentSheet(_type, _sheet, _targetId, _callback) {
	      console.time('Build Component Sheet - ' + _targetId);
	
	      var masterElementNodes = void 0;
	      try {
	        masterElementNodes = this.convertMastersByType(_type, undefined, _sheet);
	      } catch (_e) {
	        this.print_console_error('Fail build ' + _targetId + ' to components. native:' + _e + ' \n' + this.DEBUG_FILE_NAME_EXPLAIN + '\n' + _sheet);
	      }
	
	      console.timeEnd('Build Component Sheet - ' + _targetId);
	
	      if (_type === 'html') {
	        var matcher = /^<!--[\n\s]+@Settings/g;
	
	        if (_sheet.match(matcher) !== null) {
	          var settingStartCursor = _sheet.indexOf(SETTING_START_STRING),
	              settingEndCursor = _sheet.indexOf(SETTING_END_STRING),
	              settingCommentEndCursor = _sheet.indexOf('-->');
	
	          if (settingEndCursor < settingCommentEndCursor) {
	            var settingsBlock = _sheet.slice(settingStartCursor + SETTING_START_STRING_LENGTH, settingEndCursor);
	
	            var componentSettingObject = this.htmlSettingBlockInterpret(settingsBlock);
	
	            // 일반 env_include 는 처리만 실행한다.
	            // if (componentSettingObject['env_include']) {
	            //   this.processingCSetting_include(componentSettingObject['env_include']);
	            // }
	            //
	            //
	            // // env_include_async 는 처리를 실행 후 완료후에 _callback을 실행한다.
	            //
	            // if (componentSettingObject['env_include_async']) {
	            //   if (this.refAsync === false) {
	            //     // 경고
	            //     // component load type is
	            //     // component will be load by async. because component load type is sync, but dependent resource is async
	            //     // 컴포넌트는 비동기로 로딩될 것 이다. 컴포넌트 로딩 타입은 동기 이지만 비동기로 로딩되는 리소스 자원을 가지기 때문이다.
	            //     console.warn(`Warnning : Component will be load by async. because component load type is sync, but component has asynchronous dependence resources.\n${this.DEBUG_FILE_NAME_EXPLAIN} <Component: ${_targetId}>`);
	            //   }
	            //
	            //   this.processingCSetting_include_async(componentSettingObject['env_include_async'], () => {
	            //
	            //     _callback(masterElementNodes, componentSettingObject);
	            //   });
	            // } else {
	            //   _callback(masterElementNodes, componentSettingObject);
	            // }
	
	            _callback(masterElementNodes, componentSettingObject);
	          } else {
	            throw new Error('Component Settings Block is Invalid');
	          }
	        } else {
	          _callback(masterElementNodes, {});
	        }
	      } else {
	
	        _callback(masterElementNodes, {});
	      }
	    }
	  }, {
	    key: 'htmlSettingBlockInterpret',
	    value: function htmlSettingBlockInterpret(_settingBlock) {
	      var settingLines = _settingBlock.split('\n');
	      var settingObjects = {};
	
	      var lineMatcher = /^@(\w+)[\s\t]+(.*);/;
	      var line = void 0,
	          matched = void 0,
	          keyword = void 0,
	          desc = void 0;
	      for (var i = 0; i < settingLines.length; i++) {
	        line = settingLines[i];
	        matched = line.match(lineMatcher);
	
	        if (matched !== null) {
	          keyword = matched[1];
	          desc = matched[2];
	
	          switch (keyword) {
	            case "env_include_async":
	            case "env_include":
	            case "env_after_include":
	            case "env_after_include_async":
	              if (settingObjects[keyword] === undefined) {
	                settingObjects[keyword] = [];
	              }
	
	              settingObjects[keyword].push(desc);
	              break;
	            case "trace":
	              settingObjects['trace'] = true;
	              break;
	            default:
	              throw new Error(keyword + ' is not supported setting.');
	          }
	        }
	      }
	
	      return settingObjects;
	    }
	  }, {
	    key: 'processingCSetting_include',
	    value: function processingCSetting_include(_includeList, _callback) {
	      var _this4 = this;
	
	      var includeList = _includeList.map(function (_include) {
	        return _this4.interpret(eval(_include));
	      });
	
	      this.environment.orbitDocument.loadReferencingElementParallel(undefined, includeList, function () {
	        _callback && _callback();
	      });
	    }
	  }, {
	    key: 'processingCSetting_include_async',
	    value: function processingCSetting_include_async(_includeList, _callback) {
	      var _this5 = this;
	
	      var includeList = _includeList.map(function (_include) {
	        return _this5.interpret(eval(_include));
	      });
	
	      this.environment.orbitDocument.loadReferencingElementSerial(undefined, includeList, function () {
	
	        _callback && _callback();
	      });
	    }
	
	    // 자신에게 로드된 masterElementNodes중 해당 ID를 가진 컴포넌트를 찾아 반환한다.
	
	  }, {
	    key: 'findLoadedComponent',
	    value: function findLoadedComponent(_en_id) {
	      var foundIndex = _ArrayHandler2['default'].findIndex(this.masterElementNodes, function (_masterElementNode) {
	        return _masterElementNode.id === _en_id;
	      });
	
	      if (foundIndex > -1) {
	        return this.masterElementNodes[foundIndex];
	      }
	
	      throw new Error('Not found Component#' + _en_id + ' in ' + this.interpret(this.refTargetId) + '. ' + this.DEBUG_FILE_NAME_EXPLAIN);
	    }
	  }, {
	    key: 'resetRefInstance',
	    value: function resetRefInstance() {
	      this.loadedRefs = false;
	      this.loadedInstance = null;
	    }
	
	    // 자신의 component가 include 될 공간을 청소한다.
	
	  }, {
	    key: 'clearContainer',
	    value: function clearContainer() {
	      var dom = this.forwardDOM;
	
	      while (dom.childNodes.length > 0) {
	        dom.removeChild(dom.childNodes[0]);
	      }
	    }
	  }, {
	    key: 'import',
	    value: function _import(_elementNodeDataObject) {
	      var result = _get(Object.getPrototypeOf(RefElementNode.prototype), 'import', this).call(this, _elementNodeDataObject);
	      this.refTargetId = _elementNodeDataObject.reftid;
	      this.refAsync = _elementNodeDataObject.refasync || false;
	      this.refAlwaysRemount = _elementNodeDataObject.refar || false;
	      return result;
	    }
	  }, {
	    key: 'export',
	    value: function _export(_withoutId) {
	      var result = _get(Object.getPrototypeOf(RefElementNode.prototype), 'export', this).call(this, _withoutId);
	      result.reftid = this.refTargetId;
	      result.refasync = this.refAsync;
	      result.refar = this.refAlwaysRemount;
	      return result;
	    }
	  }, {
	    key: 'refference',
	    get: function get() {}
	  }, {
	    key: 'refType',
	    get: function get() {
	      return this._refType;
	    },
	    set: function set(_refType) {
	      // refType 은 런타임에 변경 될 수 없다.
	
	      this._refType = _refType;
	    }
	  }, {
	    key: 'refTargetId',
	    get: function get() {
	      return this._refTargetId;
	    },
	    set: function set(_refTargetId) {
	      this._refTargetId = _refTargetId;
	    }
	  }, {
	    key: 'component',
	    get: function get() {
	      return this.representerMasterElementNode;
	    }
	  }]);
	
	  return RefElementNode;
	}(_HTMLElementNode3['default']);
	
	exports['default'] = RefElementNode;

/***/ },

/***/ 81:
/*!********************************************************************!*\
  !*** ./client/src/js/serviceCrew/Actions/RefElementNodeActions.js ***!
  \********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ActionStore = __webpack_require__(/*! ./ActionStore */ 72);
	
	var _ActionStore2 = _interopRequireDefault(_ActionStore);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var actionStore = _ActionStore2['default'].instance();
	
	actionStore.registerAction('resetRefInstance', [], function () {
	  this.resetRefInstance();
	
	  _callback(_actionResult);
	});

/***/ },

/***/ 82:
/*!************************************************!*\
  !*** ./client/src/js/Orient/common/Console.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Identifier = __webpack_require__(/*! ../../util/Identifier */ 26);
	
	var _Identifier2 = _interopRequireDefault(_Identifier);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _instance = null;
	
	var Console = function () {
	  function Console() {
	    _classCallCheck(this, Console);
	
	    this.tagCount = 0;
	
	    this.extraDictionary = {};
	  }
	
	  _createClass(Console, [{
	    key: 'getNewTag',
	    value: function getNewTag() {
	      this.tagCount = this.tagCount + 1;
	
	      return _Identifier2['default'].numberTo64Hash(this.tagCount);
	    }
	  }], [{
	    key: 'instance',
	    value: function instance() {
	      if (_instance === null) {
	        _instance = new Console();
	      }
	
	      return _instance;
	    }
	  }, {
	    key: 'logWithExtra',
	    value: function logWithExtra(_message) {
	      var _level = arguments.length <= 1 || arguments[1] === undefined ? "log" : arguments[1];
	
	      var _extras = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
	
	      if (!window.DEBUG_OCCURS_HTTP_REQUEST_LOG) return;
	
	      var logParams = ['%c' + _message, 'background: #333; color: rgb(229, 249, 78); padding:2px;'];
	
	      switch (_level) {
	        case "log":
	          // groupCollapsed 는 IE11부터
	          console.log.apply(console, logParams);
	          console.log.apply(console, _extras);
	
	          break;
	        case "info":
	          console.info.apply(console, logParams);
	          break;
	        case "warn":
	          console.warn.apply(console, logParams);
	          break;
	        case "error":
	          console.error.apply(console, logParams);
	          break;
	      }
	    }
	  }]);
	
	  return Console;
	}();
	
	exports['default'] = Console;

/***/ },

/***/ 239:
/*!***********************************************!*\
  !*** ./client/src/js/util/GeneralLocation.js ***!
  \***********************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var GeneralLocation = function () {
	  function GeneralLocation() {
	    _classCallCheck(this, GeneralLocation);
	  }
	
	  _createClass(GeneralLocation, null, [{
	    key: 'getHashbangParam',
	    value: function getHashbangParam(_key, _window) {
	      var hash_params = GeneralLocation.parseHashbangParams(_window);
	      var scannedElements = [];
	
	      var param_pair = void 0;
	      for (var i = 0; i < hash_params.length; i++) {
	        param_pair = hash_params[i];
	
	        if (param_pair[0] === _key) {
	          scannedElements.push(param_pair[1]);
	        }
	      }
	
	      if (scannedElements.length === 0) {
	        // isn't
	        return null;
	      } else if (scannedElements.length === 1) {
	        // Single
	        return scannedElements[0];
	      } else {
	        // Multi
	        return scannedElements;
	      }
	    }
	  }, {
	    key: 'parseHashbangParams',
	    value: function parseHashbangParams(_window) {
	      var targetWindow = _window || window;
	
	      var hashtag = targetWindow.location.hash;
	      if (!hashtag.match(/^\#!/)) {
	        console.warn('Location Hash was not format as Hashbang.');
	        return [];
	      }
	
	      var hashbang = hashtag.replace(/^\#!/, '');
	
	      var hash_params = [];
	      var splitedParamPair = hashbang.split('&');
	      var pair = void 0;
	      for (var i = 0; i < splitedParamPair.length; i++) {
	        pair = splitedParamPair[i];
	
	        var splitedParamComponents = pair.split('=');
	
	        if (splitedParamComponents[0]) hash_params.push([decodeURIComponent(splitedParamComponents[0]), decodeURIComponent(splitedParamComponents[1] || '')]);
	      }
	
	      return hash_params;
	    }
	  }, {
	    key: 'setHashbangParams',
	    value: function setHashbangParams(_hashbangParamArray, _window) {
	      var targetWindow = _window || window;
	
	      var hashbangString = '#!';
	      var paramComponents = [];
	
	      var param = void 0;
	      for (var i = 0; i < _hashbangParamArray.length; i++) {
	        param = _hashbangParamArray[i];
	
	        paramComponents.push(encodeURIComponent(param[0]) + '=' + encodeURIComponent(param[1]));
	      }
	
	      hashbangString += paramComponents.join('&');
	
	      targetWindow.location.href = hashbangString;
	    }
	  }, {
	    key: 'overwriteHashbangParams',
	    value: function overwriteHashbangParams(_newHashbangParamArray, _window) {
	      var hashParams = GeneralLocation.parseHashbangParams(_window);
	
	      var paramsArray = [];
	
	      var detectedOld = false,
	          oldParam = void 0,
	          newParam = void 0;
	      for (var i = 0; i < hashParams.length; i++) {
	        detectedOld = false;
	        oldParam = hashParams[i];
	
	        for (var j = 0; j < _newHashbangParamArray.length; j++) {
	          newParam = _newHashbangParamArray[j];
	          if (oldParam[0] === newParam[0]) {
	            detectedOld = true;
	            paramsArray.push(newParam);
	            break;
	          }
	        }
	
	        if (!detectedOld) {
	          paramsArray.push(oldParam);
	        }
	      }
	
	      GeneralLocation.setHashbangParams(paramsArray, _window);
	    }
	  }, {
	    key: 'setHashbangParam',
	    value: function setHashbangParam(_key, _value, _window) {
	      var hashParams = GeneralLocation.parseHashbangParams(_window);
	
	      var exsists = false;
	      var param = void 0;
	      for (var i = 0; i < hashParams.length; i++) {
	        param = hashParams[i];
	
	        if (param[0] === _key) {
	          exsists = true;
	          param[1] = _value;
	        }
	      }
	
	      if (!exsists) hashParams.push([_key, _value]);
	
	      GeneralLocation.setHashbangParams(hashParams, _window);
	    }
	  }, {
	    key: 'removeHashbangParam',
	    value: function removeHashbangParam(_key, _window) {
	      var hashParams = GeneralLocation.parseHashbangParams(_window);
	      var newParams = [];
	
	      var exsists = false;
	      var param = void 0;
	      for (var i = 0; i < hashParams.length; i++) {
	        param = hashParams[i];
	
	        if (param[0] !== _key) {
	          newParams.push(param);
	        }
	      }
	
	      GeneralLocation.setHashbangParams(newParams, _window);
	    }
	  }]);
	
	  return GeneralLocation;
	}();
	
	exports['default'] = GeneralLocation;

/***/ }

/******/ });
//# sourceMappingURL=orient.js.map