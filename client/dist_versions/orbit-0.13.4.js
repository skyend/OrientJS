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
/*!*******************!*\
  !*** multi orbit ***!
  \*******************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! ./client/src/js/Orient/Orbit.js */20);


/***/ },

/***/ 20:
/*!***************************************!*\
  !*** ./client/src/js/Orient/Orbit.js ***!
  \***************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	__webpack_require__(/*! ./common/polyfill */ 21);
	
	var _HTTPRequest = __webpack_require__(/*! ./common/HTTPRequest */ 22);
	
	var _HTTPRequest2 = _interopRequireDefault(_HTTPRequest);
	
	var _APIRequest = __webpack_require__(/*! ./common/APIRequest */ 28);
	
	var _APIRequest2 = _interopRequireDefault(_APIRequest);
	
	var _IO = __webpack_require__(/*! ./Orbit/IO */ 29);
	
	var _IO2 = _interopRequireDefault(_IO);
	
	var _Config = __webpack_require__(/*! ./Orbit/Config */ 30);
	
	var _Config2 = _interopRequireDefault(_Config);
	
	var _I18N = __webpack_require__(/*! ./Orbit/I18N */ 31);
	
	var _I18N2 = _interopRequireDefault(_I18N);
	
	var _Resolver = __webpack_require__(/*! ../serviceCrew/DataResolver/Resolver */ 33);
	
	var _Resolver2 = _interopRequireDefault(_Resolver);
	
	var _Retriever = __webpack_require__(/*! ./Orbit/Retriever */ 41);
	
	var _Retriever2 = _interopRequireDefault(_Retriever);
	
	var _Factory = __webpack_require__(/*! ./Orbit/APISource/Factory */ 43);
	
	var _Factory2 = _interopRequireDefault(_Factory);
	
	var _Document = __webpack_require__(/*! ./Orbit/Document */ 46);
	
	var _Document2 = _interopRequireDefault(_Document);
	
	var _ObjectExtends = __webpack_require__(/*! ../util/ObjectExtends */ 27);
	
	var _ObjectExtends2 = _interopRequireDefault(_ObjectExtends);
	
	var _GeneralLocation = __webpack_require__(/*! ../util/GeneralLocation */ 239);
	
	var _GeneralLocation2 = _interopRequireDefault(_GeneralLocation);
	
	var _events = __webpack_require__(/*! events */ 23);
	
	var _events2 = _interopRequireDefault(_events);
	
	var _detectBrowser = __webpack_require__(/*! detect-browser */ 24);
	
	var _detectBrowser2 = _interopRequireDefault(_detectBrowser);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var BROWSER_NAME = _detectBrowser2['default'].name;
	var BROWSER_VER = parseInt(_detectBrowser2['default'].version);
	
	var VERSION = '0.13.4';
	
	/*
	  Version : x.y.z
	  x: 판
	  y: 중형 짝수가 안정버전
	  z: 세부업데이트
	
	  Version history
	  - 0.13.3 (2016-06-22T01:50)
	    * APISource BrowserStorage 캐시 추가 (Orbit)
	  - 0.13.4 (2016-06-22T16:30)
	    * URL Location 핸들러(Hashbang 프로토콜) 추가
	*/
	
	var Orbit = function () {
	  /**
	    _window : Browser Window Object
	    _inlineConfig : 직접 JSON으로 입력한 Config Object
	    _retriever : 프레임웤 리소스를 확장하는 객체
	  */
	
	  function Orbit(_window, _inlineConfig, _retriever) {
	    _classCallCheck(this, Orbit);
	
	    // Orbit 에서 커스텀 이벤트를 사용 할 수 있도록 EventEmitter를 포함한다.
	    _ObjectExtends2['default'].liteExtends(this, _events2['default'].EventEmitter.prototype);
	
	    var that = this;
	
	    if (_window) {
	      this.window = _window;
	    } else {
	      throw new Error("Need the window.");
	    }
	
	    this.bodyAppearControlStyleDOM;
	    this.bodyOpacity = undefined;
	
	    // Framework Default Interpreters
	    this.bindedInterpretSupporters = {};
	
	    /* Initial Members */
	    this.config = new _Config2['default'](_inlineConfig, this);
	    this.bindedInterpretSupporters.getConfig = this.config.getField.bind(this.config); // config interpreter
	
	    this.api = new _APIRequest2['default'](this);
	    this.io = new _IO2['default'](this);
	    this.orbitDocument = new _Document2['default'](this.window, this);
	    this.apiSourceFactory = new _Factory2['default'](this);
	    this.resolver = new _Resolver2['default']();
	    this.i18n = new _I18N2['default'](this, {
	      languageDecider: '',
	      languageDefault: ''
	    });
	
	    this.bindedInterpretSupporters.executeI18n = this.i18n.executeI18n.bind(this.i18n); // i18n interpreter
	
	    this._retriever = new _Retriever2['default'](that, {
	      'relative-dir-i18n': this.config.getField('DIR_I18N'),
	      'relative-dir-apisource': this.config.getField('DIR_API_SOURCE'),
	      'relative-dir-component': this.config.getField('DIR_COMPONENT')
	    }, _retriever);
	
	    // Update Members by Config update
	    // config 가 변경될 때 마다 config를 사용하는 객체의 설정을 업데이트한다.
	    this.config.on('update', function (_e) {
	      // ※ this === this.config
	
	      // DIR PATH
	      that.retriever.dirpath_i18n = this.getField('DIR_I18N');
	      that.retriever.dirpath_apisource = this.getField('DIR_API_SOURCE');
	      that.retriever.dirpath_component = this.getField('DIR_COMPONENT');
	
	      that.i18n.languageDecider = this.getField('LANGUAGE_DECIDER');
	      that.i18n.languageDefault = this.getField('LANGUAGE_DEFAULT');
	
	      var mode = this.getField("MODE") || 'op'; // debug(디버그) || dev(개발) || op(운영)
	
	      if (mode === 'op') {
	        window.ORIENT_CLEAR_BD_LOG = true;
	        //
	      } else if (mode === 'dev') {
	          window.ORIENT_SHOW_SPECIAL_ATTRIBUTES = true;
	          window.ORIENT_OCCURS_BIND_ERROR = true;
	        } else if (mode === 'debug') {
	          window.ORIENT_SHOW_SPECIAL_ATTRIBUTES = true;
	          window.DEBUG_OCCURS_HTTP_REQUEST_LOG = true;
	          window.ORIENT_OCCURS_BIND_ERROR = true;
	        }
	    });
	  }
	
	  _createClass(Orbit, [{
	    key: 'interpret',
	    value: function interpret(_text, _defaultDataObject) {
	
	      return this.resolver.resolve(_text, {
	        getENVConfig: this.forInterpret_config_func,
	        executeI18n: this.forInterpret_executeI18N_func
	      }, _defaultDataObject, this);
	    }
	  }, {
	    key: 'pageMetaCompatibility',
	
	
	    // will Deprecate
	    value: function pageMetaCompatibility(_renderCallback, _finalCallback) {
	      var _this = this;
	
	      var pageMetaEl = document.getElementById('page-meta');
	      var pageMetaText = pageMetaEl.innerHTML;
	      var pageMeta = JSON.parse(pageMetaText);
	
	      // Early Scripts
	      this.orbitDocument.loadExtraJSSerial(pageMeta.earlyScripts || [], function (_failures) {
	        _renderCallback();
	
	        _this.orbitDocument.loadExtraJSSerial(pageMeta.scripts || [], function () {
	          _finalCallback();
	        });
	      });
	
	      this.orbitDocument.loadExtraCSSPararllel(pageMeta.styles || [], function () {
	        console.info("Style load complete");
	      });
	    }
	  }, {
	    key: 'bodyDisappear',
	    value: function bodyDisappear() {
	      var styleDOM = this.orbitDocument.document.createElement('style');
	
	      this.bodyOpacity = 0;
	
	      this.bodyAppearControlStyleDOM = styleDOM;
	      this.orbitDocument.document.head.appendChild(this.bodyAppearControlStyleDOM);
	
	      this.updateBodyOpacity();
	    }
	  }, {
	    key: 'bodyAppear',
	    value: function bodyAppear() {
	      var _this2 = this;
	
	      var itvid = setInterval(function () {
	        _this2.bodyOpacity += 1;
	        _this2.updateBodyOpacity();
	
	        if (_this2.bodyOpacity >= 1) clearInterval(itvid);
	      }, 1000 / 30);
	    }
	  }, {
	    key: 'updateBodyOpacity',
	    value: function updateBodyOpacity() {
	      if (this.bodyOpacity >= 1) {
	        this.bodyAppearControlStyleDOM.innerHTML = 'body { }';
	      } else {
	        this.bodyAppearControlStyleDOM.innerHTML = 'body { opacity:' + this.bodyOpacity + ';  pointer-events:none;  }';
	      }
	    }
	  }, {
	    key: 'foundationCompatibility',
	    value: function foundationCompatibility(_selector, _callback, _callbackFinal) {
	      var _this3 = this;
	
	      var _absorbOriginDOM = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];
	
	      this.pageMetaCompatibility(function () {
	        var targetDomNodes = void 0,
	            targetDomNode = void 0;
	        if (_selector) {
	          targetDomNodes = _this3.orbitDocument.document.querySelectorAll(_selector);
	        } else {
	          targetDomNodes = [_this3.orbitDocument.document.body];
	        }
	
	        console.time && console.time("First Built up");
	        for (var i = 0; i < targetDomNodes.length; i++) {
	          targetDomNode = targetDomNodes[i];
	          var masterElementNode = Orient[_absorbOriginDOM ? 'buildComponentByElementSafeOrigin' : 'buildComponentByElement'](targetDomNode, {}, _this3);
	
	          Orient.replaceRender(masterElementNode, targetDomNode);
	        }
	        console.timeEnd && console.timeEnd("First Built up");
	
	        if (_this3.bodyAppearControlStyleDOM) {
	          _this3.bodyAppear();
	        }
	
	        if (_callback) {
	          _callback(masterElementNode);
	        }
	      }, function () {
	        _this3.signalReady();
	        if (_callbackFinal) {
	          _callbackFinal(masterElementNode);
	        }
	      });
	    }
	
	    // 원하는 스크립트에 ready 를 이용하여 원하는 시점에 한번에 실행 할 수 있도록 기능을 제공한다.
	
	  }, {
	    key: 'ready',
	    value: function ready(_func) {
	      if (!this.readied) {
	        this.on('load', _func);
	      } else {
	        _func();
	      }
	    }
	  }, {
	    key: 'signalReady',
	    value: function signalReady() {
	      this.readied = true;
	      this.emit('load');
	    }
	
	    /*
	      ███████ ██   ██ ████████ ███████ ███    ██ ██████   █████  ██████  ██      ███████      ██████ ██       █████  ███████ ███████     ███████ ██   ██ ██████   ██████  ██████  ████████
	      ██       ██ ██     ██    ██      ████   ██ ██   ██ ██   ██ ██   ██ ██      ██          ██      ██      ██   ██ ██      ██          ██       ██ ██  ██   ██ ██    ██ ██   ██    ██
	      █████     ███      ██    █████   ██ ██  ██ ██   ██ ███████ ██████  ██      █████       ██      ██      ███████ ███████ ███████     █████     ███   ██████  ██    ██ ██████     ██
	      ██       ██ ██     ██    ██      ██  ██ ██ ██   ██ ██   ██ ██   ██ ██      ██          ██      ██      ██   ██      ██      ██     ██       ██ ██  ██      ██    ██ ██   ██    ██
	      ███████ ██   ██    ██    ███████ ██   ████ ██████  ██   ██ ██████  ███████ ███████      ██████ ███████ ██   ██ ███████ ███████     ███████ ██   ██ ██       ██████  ██   ██    ██
	    */
	
	    // Class Extention 을 제공하기 위해 Class를 export
	
	  }, {
	    key: 'window',
	    set: function set(_window) {
	      this._window = _window;
	    },
	    get: function get() {
	      return this._window;
	    }
	  }, {
	    key: 'document',
	    get: function get() {
	      return this.window.document;
	    }
	  }, {
	    key: 'apiSourceFactory',
	    set: function set(_apiSourceFactory) {
	      this._apiSourceFactory = _apiSourceFactory;
	    },
	    get: function get() {
	      return this._apiSourceFactory;
	    }
	  }, {
	    key: 'retriever',
	    set: function set(_retriever) {
	      this._retriever = _retriever;
	    },
	    get: function get() {
	      return this._retriever;
	    }
	  }, {
	    key: 'HTTPRequest',
	    get: function get() {
	      return _HTTPRequest2['default'];
	    }
	  }, {
	    key: 'forInterpret_executeI18N_func',
	    get: function get() {
	      return this.bindedInterpretSupporters.executeI18n;
	    }
	  }, {
	    key: 'forInterpret_config_func',
	    get: function get() {
	      return this.bindedInterpretSupporters.getConfig;
	    }
	  }], [{
	    key: 'Retriever',
	    get: function get() {
	      return _Retriever2['default'];
	    }
	  }, {
	    key: 'I18N',
	    get: function get() {
	      return _I18N2['default'];
	    }
	  }, {
	    key: 'Config',
	    get: function get() {
	      return _Config2['default'];
	    }
	  }, {
	    key: 'Resolver',
	    get: function get() {
	      return _Resolver2['default'];
	    }
	
	    /*
	      ███████ ████████  █████  ████████ ██  ██████      █████  ██████  ██
	      ██         ██    ██   ██    ██    ██ ██          ██   ██ ██   ██ ██
	      ███████    ██    ███████    ██    ██ ██          ███████ ██████  ██
	           ██    ██    ██   ██    ██    ██ ██          ██   ██ ██      ██
	      ███████    ██    ██   ██    ██    ██  ██████     ██   ██ ██      ██
	    */
	
	  }, {
	    key: 'ObjectExtends',
	    get: function get() {
	      return _ObjectExtends2['default'];
	    }
	  }, {
	    key: 'ExtendClass',
	    get: function get() {
	      return _ObjectExtends2['default'].ExtendClass;
	    }
	  }, {
	    key: 'APIFactory',
	    get: function get() {
	      return _Factory2['default'];
	    }
	  }, {
	    key: 'HTTPRequest',
	    get: function get() {
	      return _HTTPRequest2['default'];
	    }
	  }, {
	    key: 'Location',
	    get: function get() {
	      return _GeneralLocation2['default'];
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
	  }]);
	
	  return Orbit;
	}();
	
	Orbit.version = VERSION;
	
	exports['default'] = window.Orbit = Orbit;

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

/***/ 29:
/*!******************************************!*\
  !*** ./client/src/js/Orient/Orbit/IO.js ***!
  \******************************************/
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var IO = function () {
	  function IO(_orbit) {
	    _classCallCheck(this, IO);
	
	    this.orbit = _orbit;
	
	    this.connected = false;
	    this.connection = null;
	
	    this.listenQueue = [];
	  }
	
	  _createClass(IO, [{
	    key: 'connect',
	    value: function connect(_socketIOClient, _url) {
	      var _this = this;
	
	      var socket = _socketIOClient.connect(_url);
	
	      socket.on('connect', function () {
	
	        _this.connected = true;
	
	        _this.connection = socket;
	
	        console.info('Client has connected to the server!');
	
	        // Listen Queue
	        var listen = void 0;
	        for (var i = 0; i < _this.listenQueue.length; i++) {
	
	          listen = _this.listenQueue[i];
	          _this.addListener(listen.name, listen.callback, listen.id);
	        }
	      });
	
	      socket.on('disconnect', function () {
	
	        _this.connected = false;
	
	        _this.connection = null;
	
	        console.info('The client has disconnected!');
	      });
	
	      socket.on('error', function (msg) {
	        console.info('error' + msg);
	      });
	    }
	  }, {
	    key: 'addListener',
	    value: function addListener(_listenName, _callback, _id) {
	      var forwardListener = function forwardListener(_data) {
	        console.log(_listenName, _data);
	        _callback(_listenName, _data, this.connection);
	      };
	
	      forwardListener.id = _id;
	      console.log(_listenName);
	
	      this.connection.on(_listenName, forwardListener);
	    }
	  }, {
	    key: 'on',
	    value: function on(_listenName, _callback, _id) {
	
	      if (this.connected) {
	
	        this.addListener(_listenName, _callback, _id);
	
	        // 이미 connect된 후에 listenQueue에 담으므로 두번 리스너가 등록되지 않는다.
	        this.addlistenQueue(_listenName, _callback, _id);
	      } else {
	        // connect 전에 등록된 listener 는 connect될 때 청취를 시작하도록 listenQueue 에 등록하여 준다.
	        this.addlistenQueue(_listenName, _callback, _id);
	      }
	    }
	  }, {
	    key: 'addlistenQueue',
	    value: function addlistenQueue(_listenName, _callback, _id) {
	      this.listenQueue.push({
	        name: _listenName,
	        callback: _callback,
	        id: _id
	      });
	    }
	  }, {
	    key: 'connection',
	    get: function get() {
	      return this._connection;
	    },
	    set: function set(_socket) {
	      this._connection = _socket;
	    }
	  }]);
	
	  return IO;
	}();
	
	exports['default'] = IO;

/***/ },

/***/ 30:
/*!**********************************************!*\
  !*** ./client/src/js/Orient/Orbit/Config.js ***!
  \**********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _ObjectExtends = __webpack_require__(/*! ../../util/ObjectExtends */ 27);
	
	var _ObjectExtends2 = _interopRequireDefault(_ObjectExtends);
	
	var _events = __webpack_require__(/*! events */ 23);
	
	var _events2 = _interopRequireDefault(_events);
	
	var _HTTPRequest = __webpack_require__(/*! ../common/HTTPRequest */ 22);
	
	var _HTTPRequest2 = _interopRequireDefault(_HTTPRequest);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var SUPER_LANGUAGE_DEFAULT = 'en';
	
	var DEFAULT_I18N_PATH = '/i18n/';
	var DEFAULT_API_SOURCE_PATH = '/api/';
	var DEFAULT_COMPONENT_PATH = '/component/';
	
	var Config = function () {
	  function Config(_inlineConfig, _orbit) {
	    _classCallCheck(this, Config);
	
	    _ObjectExtends2['default'].liteExtends(this, _events2['default'].EventEmitter.prototype);
	    this.orbit = _orbit;
	
	    if (_inlineConfig) {
	      this['import'](_inlineConfig);
	    }
	  }
	
	  _createClass(Config, [{
	    key: 'get_INIT_FUNCTION',
	    value: function get_INIT_FUNCTION() {
	      if (!(this.INIT_FUNCTION_SPLITED instanceof Array)) throw new Error('config : INIT_FUNCTION_SPLITED is not Array.');
	
	      var joinedFunctionString = 'return ' + this.INIT_FUNCTION_SPLITED.join('\n');
	
	      var funcExtractor = new Function(joinedFunctionString);
	      var extractedFunction = funcExtractor();
	
	      if (typeof extractedFunction !== 'function') {
	        throw new Error('config : INIT_FUNCTION_SPLITED was wrote invalid. start >> function(_orbit,_callback){');
	      }
	
	      var bindedFunction = extractedFunction.bind(this);
	
	      return bindedFunction;
	    }
	
	    //
	
	  }, {
	    key: 'retrieveConfig',
	
	
	    // 외부 config 파일을 사용할 때 이 메서드를 사용한다.
	    value: function retrieveConfig(_configURL, _complete) {
	      var _this = this;
	
	      // 1. 로딩
	      // 2. import
	      var that = this;
	      var configFileType = _configURL.replace(/.*?\.(\w+)$/, '$1');
	
	      _HTTPRequest2['default'].request('get', _configURL, {}, function (_err, _res) {
	        var importObject = void 0;
	
	        if (_res !== null) {
	          if (configFileType === 'json') {
	
	            importObject = _res.json;
	          } else if (configFileType === 'js') {
	            var configExtractor = new Function('var CONFIG; \n' + _res.responseText + '\n return CONFIG;');
	
	            importObject = configExtractor.apply(_this);
	          }
	
	          that['import'](importObject);
	
	          that.emit('update');
	
	          that.orbit.orbitDocument.loadExtraCSSPararllel(_this.GLOBAL_STYLES || []);
	          that.orbit.orbitDocument.loadExtraJSSerial(_this.GLOBAL_SCRIPTS || [], function () {
	
	            if (_this.INIT_FUNCTION_SPLITED) {
	              var initFunc = _this.get_INIT_FUNCTION();
	
	              initFunc(_this.orbit, function () {
	
	                _complete();
	              });
	            } else if (_this.INIT_FUNCTION) {
	              _this.INIT_FUNCTION.apply(_this, [_this.orbit, function () {
	                _complete();
	              }]);
	            } else {
	              _complete();
	            }
	          });
	        } else {
	          throw new Error('Fail load config. ' + _err);
	        }
	      });
	    }
	
	    // Config 에 입력된 필드값을 가져온다.
	
	  }, {
	    key: 'getField',
	    value: function getField(_name) {
	      var _this2 = this;
	
	      var fieldValue = undefined;
	
	      // 대상 field값이 string type 이 아니라면 그대로 반환하며 string타입 이라면 바인딩처리하여 반환한다.
	      if (this[_name]) {
	        fieldValue = this[_name];
	      } else {
	        if (this.configObject) {
	          if (this.configObject[_name]) {
	            fieldValue = this.configObject[_name];
	          }
	        }
	      }
	
	      if (fieldValue === undefined) console.warn('찾을 수 없는 config 필드[' + _name + '] 입니다.');
	
	      switch (typeof fieldValue === 'undefined' ? 'undefined' : _typeof(fieldValue)) {
	        case "string":
	          return this.orbit.interpret(fieldValue);
	        case "object":
	          return _ObjectExtends2['default'].clone(fieldValue, true, function (_value) {
	
	            if (typeof _value === 'string') {
	              return _this2.orbit.interpret(_value);
	            }
	
	            return _value;
	          });
	        default:
	          return fieldValue;
	      }
	
	      // if (this[_name]) {
	      //   if (typeof this[_name] === 'string') {
	      //     return this.orbit.interpret(this[_name]);
	      //   } else {
	      //     return this[_name];
	      //   }
	      // } else {
	      //   if (this.configObject) {
	      //     if (typeof this.configObject[_name] === 'string') {
	      //       return this.orbit.interpret(this.configObject[_name]);
	      //     } else {
	      //       return this.configObject[_name];
	      //     }
	      //   }
	      // }
	    }
	  }, {
	    key: 'setExtraField',
	    value: function setExtraField(_name, _value) {
	      this.configObject[_name] = _value;
	    }
	  }, {
	    key: 'import',
	    value: function _import(_config) {
	      this._LANGUAGE_DEFAULT = _config['LANGUAGE_DEFAULT'];
	      this._LANGUAGE_DECIDER = _config['LANGUAGE_DECIDER'];
	      this._LAZY_SCRIPTS = _config['LAZY_SCRIPTS'];
	      this._EARLY_SCRIPTS = _config['EARLY_SCRIPTS'];
	      this._STYLES = _config['STYLES'];
	
	      this._DIR_I18N = _config['DIR_I18N'];
	      this._DIR_COMPONENT = _config['DIR_COMPONENT'];
	      this._DIR_API_SOURCE = _config['DIR_API_SOURCE'];
	      this._MODE = _config['MODE'];
	      this._INIT_FUNCTION_SPLITED = _config['INIT_FUNCTION_SPLITED'];
	      this._INIT_FUNCTION = _config['INIT_FUNCTION'];
	      this._GLOBAL_SCRIPTS = _config['GLOBAL_SCRIPTS'];
	      this._GLOBAL_STYLES = _config['GLOBAL_STYLES'];
	      this._GLOBAL_VALUES = _config['GLOBAL_VALUES'];
	
	      window['ORIENT_SUSPENDIBLE_ELEMENTNODE_INTERPRET'] = _config['ORIENT_SUSPENDIBLE_ELEMENTNODE_INTERPRET'];
	
	      this.configObject = _config;
	
	      var globalValuesKeys = Object.keys(this.GLOBAL_VALUES || {});
	      for (var i = 0; i < globalValuesKeys.length; i++) {
	        window[globalValuesKeys[i]] = this.GLOBAL_VALUES[globalValuesKeys[i]];
	      }
	
	      this.emit('update');
	    }
	  }, {
	    key: 'export',
	    value: function _export() {
	      var config = {};
	      config['LANGUAGE_DEFAULT'] = this._LANGUAGE_DEFAULT;
	      config['LANGUAGE_DECIDER'] = this.LANGUAGE_DECIDER;
	      config['LAZY_SCRIPTS'] = _ObjectExtends2['default'].clone(this.LAZY_SCRIPTS);
	      config['EARLY_SCRIPTS'] = _ObjectExtends2['default'].clone(this.EARLY_SCRIPTS);
	      config['STYLES'] = _ObjectExtends2['default'].clone(this.STYLES);
	      config['DIR_I18N'] = this._DIR_I18N; // 직접 속성에 접근하는 이유는 Default 로 잡힌 값을 export하지 않기 위함
	      config['DIR_COMPONENT'] = this._DIR_COMPONENT;
	      config['DIR_API_SOURCE'] = this._DIR_API_SOURCE;
	      config['MODE'] = this._MODE;
	      config['INIT_FUNCTION_SPLITED'] = _ObjectExtends2['default'].clone(this._INIT_FUNCTION_SPLITED);
	      config['INIT_FUNCTION'] = this.INIT_FUNCTION;
	      config['GLOBAL_SCRIPTS'] = _ObjectExtends2['default'].clone(this.GLOBAL_SCRIPTS);
	      config['GLOBAL_STYLES'] = _ObjectExtends2['default'].clone(this.GLOBAL_STYLES);
	      config['GLOBAL_VALUES'] = _ObjectExtends2['default'].clone(this.GLOBAL_VALUES);
	
	      _ObjectExtends2['default'].mergeByRef(config, this.configObject, false);
	
	      return config;
	    }
	  }, {
	    key: 'LANGUAGE_DEFAULT',
	    set: function set(_langSetName) {
	      this._LANGUAGE_DEFAULT = _langSetName;
	
	      this.emit('update');
	    },
	    get: function get() {
	      return this._LANGUAGE_DEFAULT || SUPER_LANGUAGE_DEFAULT;
	    }
	  }, {
	    key: 'DIR_I18N',
	    set: function set(_DIR_I18N) {
	      this._DIR_I18N = _DIR_I18N;
	
	      this.emit('update');
	    },
	    get: function get() {
	      return this._DIR_I18N || DEFAULT_I18N_PATH;
	    }
	  }, {
	    key: 'DIR_API_SOURCE',
	    set: function set(_DIR_API_SOURCE) {
	      this._DIR_API_SOURCE = _DIR_API_SOURCE;
	
	      this.emit('update');
	    },
	    get: function get() {
	      return this._DIR_API_SOURCE || DEFAULT_API_SOURCE_PATH;
	    }
	  }, {
	    key: 'DIR_COMPONENT',
	    set: function set(_DIR_COMPONENT) {
	      this._DIR_COMPONENT = _DIR_COMPONENT;
	
	      this.emit('update');
	    },
	    get: function get() {
	      return this._DIR_COMPONENT || DEFAULT_COMPONENT_PATH;
	    }
	  }, {
	    key: 'LANGUAGE_DECIDER',
	    set: function set(_LANGUAGE_DECIDER) {
	      this._LANGUAGE_DECIDER = _LANGUAGE_DECIDER;
	
	      this.emit('update');
	    },
	    get: function get() {
	      return this._LANGUAGE_DECIDER;
	    }
	  }, {
	    key: 'LAZY_SCRIPTS',
	    set: function set(_LAZY_SCRIPTS) {
	      this.LAZY_SCRIPTS = _LAZY_SCRIPTS;
	
	      this.emit('update');
	    },
	    get: function get() {
	      // paths
	      return this._LAZY_SCRIPTS || [];
	    }
	  }, {
	    key: 'EARLY_SCRIPTS',
	    set: function set(_EARLY_SCRIPTS) {
	      this._EARLY_SCRIPTS = _EARLY_SCRIPTS;
	
	      this.emit('update');
	    },
	    get: function get() {
	      // paths
	      return this._EARLY_SCRIPTS || [];
	    }
	  }, {
	    key: 'STYLES',
	    set: function set(_STYLES) {
	      this._STYLES = _STYLES;
	
	      this.emit('update');
	    },
	    get: function get() {
	      // paths
	      return this._STYLES || [];
	    }
	  }, {
	    key: 'MODE',
	    set: function set(_MODE) {
	      this._MODE = _MODE;
	
	      this.emit('update');
	    },
	    get: function get() {
	      return this._MODE;
	    }
	  }, {
	    key: 'INIT_FUNCTION_SPLITED',
	    set: function set(_ia) {
	      this._INIT_FUNCTION_SPLITED = _ia;
	    },
	    get: function get() {
	      return this._INIT_FUNCTION_SPLITED;
	    }
	  }, {
	    key: 'INIT_FUNCTION',
	    set: function set(_if) {
	      this._INIT_FUNCTION = _if;
	    },
	    get: function get() {
	      return this._INIT_FUNCTION;
	    }
	  }, {
	    key: 'GLOBAL_SCRIPTS',
	    set: function set(_GLOBAL_SCRIPTS) {
	      this._GLOBAL_SCRIPTS = _GLOBAL_SCRIPTS;
	    },
	    get: function get() {
	      return this._GLOBAL_SCRIPTS;
	    }
	  }, {
	    key: 'GLOBAL_STYLES',
	    set: function set(_GLOBAL_STYLES) {
	      this._GLOBAL_STYLES = _GLOBAL_STYLES;
	    },
	    get: function get() {
	      return this._GLOBAL_STYLES;
	    }
	  }, {
	    key: 'GLOBAL_VALUES',
	    set: function set(_GLOBAL_VALUES) {
	      this._GLOBAL_VALUES = _GLOBAL_VALUES;
	    },
	    get: function get() {
	      return this._GLOBAL_VALUES;
	    }
	  }, {
	    key: 'configObject',
	    set: function set(_configO) {
	      this._configObject = _configO;
	    },
	    get: function get() {
	      return this._configObject || {};
	    }
	  }, {
	    key: 'ORIENT_SUSPENDIBLE_ELEMENTNODE_INTERPRET',
	    get: function get() {
	      return this.ORIENT_SUSPENDIBLE_ELEMENTNODE_INTERPRET;
	    },
	    set: function set(_flag) {
	      this.ORIENT_SUSPENDIBLE_ELEMENTNODE_INTERPRET = _flag;
	      window.ORIENT_SUSPENDIBLE_ELEMENTNODE_INTERPRET = _flag;
	    }
	  }]);
	
	  return Config;
	}();
	
	exports['default'] = Config;

/***/ },

/***/ 31:
/*!********************************************!*\
  !*** ./client/src/js/Orient/Orbit/I18N.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _ObjectExtends = __webpack_require__(/*! ../../util/ObjectExtends */ 27);
	
	var _ObjectExtends2 = _interopRequireDefault(_ObjectExtends);
	
	var _ObjectExplorer = __webpack_require__(/*! ../../util/ObjectExplorer */ 32);
	
	var _ObjectExplorer2 = _interopRequireDefault(_ObjectExplorer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var I18N = function () {
	  function I18N(_orbit, _options) {
	    _classCallCheck(this, I18N);
	
	    this.languageDecider = _options.languageDecider;
	    this.languageDefault = _options.languageDefault;
	
	    this.orbit = _orbit;
	
	    this.i18nLangSetDict = {};
	  }
	
	  _createClass(I18N, [{
	    key: 'executeI18n',
	    value: function executeI18n(_textCode) {
	
	      var textCode = arguments[0];
	      var values = {};
	      var textSnippet = this.getI18NTextSnippet(_textCode);
	
	      for (var i = 1; i < arguments.length; i++) {
	        values[i - 1] = arguments[i];
	      }
	
	      if (textSnippet === null) {
	        return 'not found i18n textCode : ' + _textCode;
	      }
	
	      return this.orbit.interpret(textSnippet, values);
	    }
	  }, {
	    key: 'getI18NTextSnippet',
	    value: function getI18NTextSnippet(_textCode) {
	      var usingLanguageSet = this.orbit.interpret(this.languageDecider) || this.languageDefault;
	
	      /**
	        snippet을 가져오는 과정
	        1. i18n-lang-code 에 따라 language set 을 얻는다.
	        2. i18n-lang-code 로 얻은 Language set 에서 textCode에 맞는 값을 가져온다. 없을 경우 2.1
	          2.1 default-lang-set 에 따라 Language set 을 얻는다.
	          2.2 default-lang-set 으로 얻은 Language set 에서 textCode에 맞는 값을 가져온다. 없을 경우 3.1
	        3. 반환한다.
	        3.1 null을 반환한다.
	      */
	
	      var langSet = void 0,
	          snippet = void 0;
	      langSet = this.getI18NLangSet(this.orbit.interpret(this.languageDecider));
	
	      if (langSet !== null) {
	
	        snippet = _ObjectExplorer2['default'].getValueByKeyPath(langSet, _textCode);
	
	        if (snippet) {
	          return snippet;
	        }
	      }
	
	      langSet = this.getI18NLangSet(this.languageDefault);
	
	      if (langSet === null) {
	        return null;
	      }
	
	      snippet = _ObjectExplorer2['default'].getValueByKeyPath(langSet, _textCode);
	
	      return snippet || null;
	    }
	  }, {
	    key: 'getI18NLangSet',
	    value: function getI18NLangSet(_langCode) {
	      var langSet = this.i18nLangSetDict[_langCode];
	      //console.log("Load i18n lang set", _langCode, this.i18nLangSetDict, this.i18nLangSetDict[_langCode])
	
	      // language Set 이 로드 되지 않았을 때는 undefined 로 유지하며
	      // 로드를 시도 했지만 파일을 찾지 못 했을 때는 null 로 유지 한다.
	
	      if (langSet === undefined) {
	        langSet = this.i18nLangSetDict[_langCode] = this.orbit.retriever.loadI18NJSONSync(_langCode) || null;
	      }
	
	      return langSet;
	    }
	  }, {
	    key: 'languageDecider',
	    get: function get() {
	      return this._languageDecider;
	    },
	    set: function set(_languageDecider) {
	      this._languageDecider = _languageDecider;
	    }
	  }, {
	    key: 'languageDefault',
	    get: function get() {
	      return this._languageDefault;
	    },
	    set: function set(_languageDefault) {
	      this._languageDefault = _languageDefault;
	    }
	  }]);
	
	  return I18N;
	}();
	
	exports['default'] = I18N;

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

/***/ 41:
/*!*************************************************!*\
  !*** ./client/src/js/Orient/Orbit/Retriever.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _BrowserStorage = __webpack_require__(/*! ../../util/BrowserStorage */ 42);
	
	var _BrowserStorage2 = _interopRequireDefault(_BrowserStorage);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Retriever = function () {
	  function Retriever(_orbit, _options, _extender) {
	    _classCallCheck(this, Retriever);
	
	    this.orbit = _orbit;
	    this.extender = _extender;
	
	    this.dirpath_i18n = _options['relative-dir-i18n'];
	    this.dirpath_apisource = _options['relative-dir-apisource'];
	    this.dirpath_component = _options['relative-dir-component'];
	
	    this.caches = {
	      i18n: {},
	      apisource: {},
	      component: {}
	    };
	  }
	
	  _createClass(Retriever, [{
	    key: '_loadAPISource',
	    value: function _loadAPISource(_loadTarget, _cb) {
	      var _this = this;
	
	      // 상대경로인가 절대경로인가 판단
	      var url = void 0;
	      if (/^\//.test(_loadTarget)) {
	        url = _loadTarget;
	      } else if (/^https?:\/\//.test(_loadTarget)) {
	        // URL
	        url = _loadTarget;
	      } else {
	        // 상대경로
	        url = this.dirpath_apisource + _loadTarget;
	      }
	
	      if (this.caches.apisource[_loadTarget] !== undefined) {
	        _cb(this.caches.apisource[_loadTarget], url);
	        return;
	      }
	
	      // Browser LocalStorage Caching
	      if (ORBIT_APISOURCE_CACHING) {
	        var cachedSourceData = _BrowserStorage2['default'].getLocal('as_' + _loadTarget);
	        if (cachedSourceData) {
	          _cb(cachedSourceData, url);
	          return;
	        }
	      }
	
	      this.orbit.HTTPRequest.request('get', url, {}, function (_err, _res) {
	        if (_err !== null) return console.error('Error : Fail api source sheet loading. <detail:' + _err + '> <filepath:' + url + '>');
	
	        var responseText = _res.text;
	
	        if (ORBIT_APISOURCE_CACHING) {
	          _BrowserStorage2['default'].setLocal('as_' + _loadTarget, responseText);
	        }
	
	        // caching
	        _this.caches.apisource[_loadTarget] = responseText;
	        _cb(_this.caches.apisource[_loadTarget], url);
	      });
	    }
	  }, {
	    key: '_loadAPISourceSync',
	    value: function _loadAPISourceSync(_loadTarget, _cb) {
	      var _this2 = this;
	
	      // 상대경로인가 절대경로인가 판단
	      var url = void 0;
	      if (/^\//.test(_loadTarget)) {
	        url = _loadTarget;
	      } else if (/^https?:\/\//.test(_loadTarget)) {
	        // URL
	        url = _loadTarget;
	      } else {
	        // 상대경로
	        url = this.dirpath_apisource + _loadTarget;
	      }
	
	      if (this.caches.apisource[_loadTarget] !== undefined) {
	        _cb(this.caches.apisource[_loadTarget], url);
	        return;
	      }
	
	      // Browser LocalStorage Caching
	      if (window.ORBIT_APISOURCE_CACHING) {
	        var cachedSourceData = _BrowserStorage2['default'].getLocal('as_' + _loadTarget);
	        if (cachedSourceData) {
	          _cb(cachedSourceData, url);
	          return;
	        }
	      }
	
	      this.orbit.HTTPRequest.requestSync('get', url, {}, function (_err, _res) {
	        if (_err !== null) return console.error('Error : Fail api source sheet loading. <detail:' + _err + '> <filepath:' + url + '>');
	
	        var responseText = _res.text;
	
	        // caching
	        _this2.caches.apisource[_loadTarget] = responseText;
	
	        if (window.ORBIT_APISOURCE_CACHING) {
	          _BrowserStorage2['default'].setLocal('as_' + _loadTarget, responseText);
	        }
	
	        _cb(_this2.caches.apisource[_loadTarget], url);
	      });
	    }
	
	    // 메서드 반환
	
	  }, {
	    key: '_getComponentURL',
	    value: function _getComponentURL(_loadTarget) {
	      var url = void 0;
	
	      // 상대경로인가 절대경로인가 판단
	      if (/^\//.test(_loadTarget)) {
	        url = _loadTarget;
	      } else if (/^https?:\/\//.test(_loadTarget)) {
	        // URL
	        url = _loadTarget;
	      } else {
	        // 상대경로
	        url = this.dirpath_component + _loadTarget;
	      }
	
	      return url;
	    }
	  }, {
	    key: '_loadComponentSheet',
	    value: function _loadComponentSheet(_loadTarget, _cb) {
	      var _this3 = this;
	
	      if (this.caches.component[_loadTarget] !== undefined) {
	        _cb(this.caches.component[_loadTarget]);
	        return;
	      }
	
	      this.orbit.HTTPRequest.request('get', this._getComponentURL(_loadTarget), {}, function (_err, _res) {
	        if (_err !== null) return console.error("Fail static component sheet loading <" + _err + ">");
	        var responseText = _res.text;
	
	        // caching
	        _this3.caches.component[_loadTarget] = responseText;
	
	        _cb(_this3.caches.component[_loadTarget]);
	      });
	    }
	  }, {
	    key: '_loadComponentSheetSync',
	    value: function _loadComponentSheetSync(_loadTarget, _cb) {
	      var _this4 = this;
	
	      if (this.caches.component[_loadTarget] !== undefined) {
	        _cb(this.caches.component[_loadTarget]);
	        return;
	      }
	
	      console.log("Load Component", _loadTarget, this.caches.component[_loadTarget]);
	
	      var result = this.orbit.HTTPRequest.requestSync('get', this._getComponentURL(_loadTarget), {}, function (_err, _res) {
	        if (_err !== null) return console.error("fail static component sheet loading <" + _err + ">");
	        if (_res.statusType === 2 || _res.statusType === 3) {
	          var responseText = _res.text;
	
	          // caching
	          _this4.caches.component[_loadTarget] = responseText;
	
	          _cb(_this4.caches.component[_loadTarget]);
	        } else {
	          _cb(null);
	        }
	      });
	    }
	
	    // 메서드 반환
	
	  }, {
	    key: '_loadI18NJSONSync',
	    value: function _loadI18NJSONSync(_lang) {
	
	      var data = this.orbit.HTTPRequest.requestSync('get', '' + this.dirpath_i18n + _lang + '.json');
	
	      try {
	        return JSON.parse(data);
	      } catch (e) {
	        // undefined를 반환한다.
	        // i18n처리에서 undefined를 반환받으면 다음 후보 i18n 언어셋을 로딩하도록 되어 있기 때문이다.
	        return undefined;
	      }
	    }
	  }, {
	    key: 'loadAPISource',
	    get: function get() {
	      if (this._extender) {
	        if (this._extender.loadAPISource) {
	          return this._extender.loadAPISource;
	        }
	      }
	
	      return this._loadAPISource;
	    }
	  }, {
	    key: 'loadAPISourceSync',
	    get: function get() {
	      if (this._extender) {
	        if (this._extender.loadAPISourceSync) {
	          return this._extender.loadAPISourceSync;
	        }
	      }
	
	      return this._loadAPISourceSync;
	    }
	  }, {
	    key: 'loadComponentSheet',
	    get: function get() {
	      if (this._extender) {
	        if (this._extender.loadComponentSheet) {
	          return this._extender.loadComponentSheet;
	        }
	      }
	
	      return this._loadComponentSheet.bind(this);
	    }
	  }, {
	    key: 'loadComponentSheetSync',
	    get: function get() {
	      if (this._extender) {
	        if (this._extender.loadComponentSheetSync) {
	          return this._extender.loadComponentSheetSync;
	        }
	      }
	
	      return this._loadComponentSheetSync.bind(this);
	    }
	  }, {
	    key: 'loadI18NJSONSync',
	    get: function get() {
	      if (this._extender) {
	        if (this._extender.loadI18NJSONSync) {
	          return this._extender.loadI18NJSONSync;
	        }
	      }
	
	      return this._loadI18NJSONSync;
	    }
	  }]);
	
	  return Retriever;
	}();
	
	exports['default'] = Retriever;

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

/***/ 43:
/*!*********************************************************!*\
  !*** ./client/src/js/Orient/Orbit/APISource/Factory.js ***!
  \*********************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _APISource = __webpack_require__(/*! ./APISource */ 44);
	
	var _APISource2 = _interopRequireDefault(_APISource);
	
	var _BrowserStorage = __webpack_require__(/*! ../../../util/BrowserStorage */ 42);
	
	var _BrowserStorage2 = _interopRequireDefault(_BrowserStorage);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var TYPE_SUPPORTERS_POOL = {
	  'http': _APISource2['default'],
	  'https': _APISource2['default']
	};
	
	// Accept Addons
	
	var Factory = function () {
	  function Factory(_orbit) {
	    _classCallCheck(this, Factory);
	
	    this.orbit = _orbit;
	    //this.sourceDirPath = _options.sourceDirPath;
	  }
	
	  _createClass(Factory, [{
	    key: 'registerNewType',
	
	
	    // for addon
	    value: function registerNewType(_typeName, _class) {
	      TYPE_SUPPORTERS_POOL[_typeName] = _class;
	    }
	  }, {
	    key: 'getTypeClass',
	    value: function getTypeClass(_typeName) {
	      return TYPE_SUPPORTERS_POOL[_typeName];
	    }
	  }, {
	    key: 'getInstance',
	    value: function getInstance(_typeName, _dataObject) {
	      return new (this.getTypeClass(_typeName))(_dataObject, this.orbit);
	    }
	  }, {
	    key: 'getInstanceWithRemote',
	    value: function getInstanceWithRemote(_typeName, _target, _complete) {
	      var that = this;
	
	      this.orbit.retriever.loadAPISource(_target, function (_sheet, _filepath) {
	        var jsonSheet = void 0;
	        try {
	          jsonSheet = JSON.parse(_sheet);
	        } catch (_e) {
	          _e.message += '<File: ' + _filepath + '>\n' + _sheet;
	
	          throw _e;
	        }
	
	        var instance = that.getInstance(_typeName, jsonSheet);
	        instance.__filepath__ = _filepath;
	        instance.__name__ = _target;
	
	        _complete(instance);
	      });
	    }
	  }, {
	    key: 'getInstanceWithRemoteSync',
	    value: function getInstanceWithRemoteSync(_typeName, _target, _complete) {
	      var that = this;
	
	      this.orbit.retriever.loadAPISourceSync(_target, function (_sheet, _filepath) {
	        var jsonSheet = void 0;
	        try {
	          jsonSheet = JSON.parse(_sheet);
	        } catch (_e) {
	          _e.message += '<File: ' + _filepath + '>\n' + _sheet;
	
	          throw _e;
	        }
	
	        var instance = that.getInstance(_typeName, jsonSheet);
	        instance.__filepath__ = _filepath;
	        instance.__name__ = _target;
	
	        _complete(instance);
	      });
	    }
	  }, {
	    key: 'sourceDirPath',
	    get: function get() {
	      return this.sourceDirPath;
	    },
	    set: function set(_sourceDirPath) {
	      this.sourceDirPath = _sourceDirPath;
	    }
	  }], [{
	    key: 'RegisterNewType',
	    value: function RegisterNewType(_typeName, _class) {
	      TYPE_SUPPORTERS_POOL[_typeName] = _class;
	    }
	  }, {
	    key: 'APISource',
	    get: function get() {
	      return _APISource2['default'];
	    }
	  }]);
	
	  return Factory;
	}();
	
	exports['default'] = Factory;

/***/ },

/***/ 44:
/*!***********************************************************!*\
  !*** ./client/src/js/Orient/Orbit/APISource/APISource.js ***!
  \***********************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Request = __webpack_require__(/*! ./Request.js */ 45);
	
	var _Request2 = _interopRequireDefault(_Request);
	
	var _ArrayHandler = __webpack_require__(/*! ../../../util/ArrayHandler */ 34);
	
	var _ArrayHandler2 = _interopRequireDefault(_ArrayHandler);
	
	var _ObjectExtends = __webpack_require__(/*! ../../../util/ObjectExtends */ 27);
	
	var _ObjectExtends2 = _interopRequireDefault(_ObjectExtends);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var APISource = function () {
	  function APISource(_APISourceData, _orbit) {
	    _classCallCheck(this, APISource);
	
	    this.clazz = 'APISource';
	
	    this.orbit = _orbit;
	
	    this.importData = _APISourceData;
	
	    this['import'](_APISourceData);
	  }
	
	  _createClass(APISource, [{
	    key: 'addNewRequest',
	    value: function addNewRequest(_name, _crud) {
	      var newRequest = new _Request2['default']({
	        name: _name,
	        crud: _crud
	      });
	
	      this.requests.push(newRequest);
	    }
	  }, {
	    key: 'findRequest',
	    value: function findRequest(_id) {
	      var foundReqIdx = _ArrayHandler2['default'].findIndex(this.requests, function (_req) {
	        return _req.id === _id;
	      });
	
	      if (foundReqIdx !== -1) {
	        return this.requests[foundReqIdx];
	      } else {
	        return undefined;
	      }
	    }
	  }, {
	    key: 'changeRequestCRUD',
	    value: function changeRequestCRUD(_reqId, _crud) {
	      var req = this.findRequest(_reqId);
	
	      if (req !== undefined) {
	        req.crud = _crud;
	        return true;
	      }
	
	      return false;
	    }
	  }, {
	    key: 'changeRequestCustomCRUD',
	    value: function changeRequestCustomCRUD(_reqId, _value) {
	      var req = this.findRequest(_reqId);
	
	      if (req !== undefined) {
	        req.customCrud = _value;
	        return true;
	      }
	
	      return false;
	    }
	  }, {
	    key: 'changeRequestCustomURL',
	    value: function changeRequestCustomURL(_reqId, _value) {
	      var req = this.findRequest(_reqId);
	
	      if (req !== undefined) {
	        req.customURL = _value;
	        return true;
	      }
	
	      return false;
	    }
	  }, {
	    key: 'changeRequestMethod',
	    value: function changeRequestMethod(_reqId, _method) {
	      var req = this.findRequest(_reqId);
	
	      if (req !== undefined) {
	        req.method = _method;
	        return true;
	      }
	
	      return false;
	    }
	  }, {
	    key: 'requestNewField',
	    value: function requestNewField(_requestId) {
	      var req = this.findRequest(_requestId);
	
	      if (req !== undefined) {
	        req.addNewField();
	        return true;
	      }
	
	      return false;
	    }
	  }, {
	    key: 'changeRequestFieldKey',
	    value: function changeRequestFieldKey(_requestId, _fieldId, _value) {
	      var req = this.findRequest(_requestId);
	
	      if (req !== undefined) {
	        req.changeFieldKey(_fieldId, _value);
	        return true;
	      }
	
	      return false;
	    }
	  }, {
	    key: 'changeRequestFieldValue',
	    value: function changeRequestFieldValue(_requestId, _fieldId, _value) {
	      var req = this.findRequest(_requestId);
	
	      if (req !== undefined) {
	        req.changeFieldValue(_fieldId, _value);
	        return true;
	      }
	
	      return false;
	    }
	  }, {
	    key: 'changeRequestFieldTestValue',
	    value: function changeRequestFieldTestValue(_requestId, _fieldId, _value) {
	      var req = this.findRequest(_requestId);
	
	      if (req !== undefined) {
	        req.changeFieldTestValue(_fieldId, _value);
	        return true;
	      }
	
	      return false;
	    }
	  }, {
	    key: 'removeRequestField',
	    value: function removeRequestField(_requestId, _fieldId) {
	      var req = this.findRequest(_requestId);
	
	      if (req !== undefined) {
	        req.removeField(_fieldId);
	        return true;
	      }
	
	      return false;
	    }
	  }, {
	    key: 'removeRequest',
	    value: function removeRequest(_requestId) {
	      var req = this.findRequest(_requestId);
	
	      if (req !== undefined) {
	        this.requests = this.requests.filter(function (_r) {
	          return _requestId !== _r.id;
	        });
	        return true;
	      }
	
	      return false;
	    }
	
	    // Proposal Override
	
	  }, {
	    key: 'getRequestLocation',
	    value: function getRequestLocation(_reqId) {
	      var req = this.findRequest(_reqId);
	
	      if (req !== undefined) {
	        if (req.crud === '**') {
	          return req.customURL;
	        } else {
	          url = this.getRequestURL(_requestId); //this.host + "/api/" + this.nt_tid + "/" + req.crudPoint;
	        }
	
	        return '/api/' + this.nt_tid + '/' + req.crudPoint;
	      } else {
	        return '';
	      }
	    }
	  }, {
	    key: 'assemblyURLWithRequest',
	    value: function assemblyURLWithRequest(_reqId) {
	
	      var urlSnippet = this.getRequestLocation(_reqId);
	      if (!/http:\/\//.test(urlSnippet)) {
	
	        return this.host + urlSnippet;
	      } else {
	        return urlSnippet;
	      }
	    }
	  }, {
	    key: 'resolvefieldObject',
	    value: function resolvefieldObject(_fieldObject) {
	      var keys = Object.keys(_fieldObject);
	      var resolvedObject = {};
	      var key = void 0;
	      for (var i = 0; i < keys.length; i++) {
	        key = keys[i];
	        if (typeof _fieldObject[key] === 'string') {
	          resolvedObject[key] = this.orbit.interpret(_fieldObject[key]);
	        } else {
	          resolvedObject[key] = _fieldObject[key];
	        }
	      }
	
	      return resolvedObject;
	    }
	
	    // Proposal Override
	
	  }, {
	    key: 'getDefaultFields',
	    value: function getDefaultFields() {
	      return {};
	    }
	
	    /*
	      application/x-www-form-urlencoded: The default value if the attribute is not specified.
	      multipart/form-data: The value used for an <input> element with the type attribute set to "file".
	      text/plain (HTML5)
	    */
	
	  }, {
	    key: 'executeRequest',
	    value: function executeRequest(_requestId, _fields, _head, _cb, _enctypeOrComplete) {
	      var that = this;
	      var req = this.findRequest(_requestId);
	
	      if (!req) throw new Error('Not found a request[' + _requestId + '] of APISource[' + this.__filepath__ + ']');
	
	      var fieldObject = _ObjectExtends2['default'].merge(this.getDefaultFields(), _ObjectExtends2['default'].merge(this.resolvefieldObject(req.getFieldsObject()), _fields, true), true);
	
	      // let resolvedFieldObject = this.resolvefieldObject(fieldObject);
	      // console.log(fieldObject);
	      // let keys = Object.keys(fieldObject);
	      // let isValid = true;
	      // let matterFields = [];
	      // keys.map(function(_key) {
	      //   if (_key) {
	      //     if (fieldObject[_key] === null || fieldObject[_key] === undefined) {
	      //       matterFields.push(_key);
	      //       isValid = false;
	      //     }
	      //   }
	      // });
	      //
	      // if (isValid) {
	      this.orbit.HTTPRequest.request(req.method, this.assemblyURLWithRequest(_requestId), fieldObject, function (_err, _res) {
	
	        that.processAfterResponse(_err, _res, _cb);
	      }, _enctypeOrComplete);
	      // } else {
	      //   console.warn(`[${matterFields.join(',')}] 필드에 undefined 또는 null이 포함되어 있어 ${this.__filepath__}:${_requestId} 요청을 실행 하지 않습니다.`);
	      // }
	    }
	  }, {
	    key: 'executeRequestSync',
	    value: function executeRequestSync(_requestId, _fields, _head, _cb, _enctypeOrComplete) {
	      var that = this;
	      var req = this.findRequest(_requestId);
	
	      if (!req) throw new Error('Not found a request[' + _requestId + '] of APISource[' + this.__filepath__ + ']');
	
	      var fieldObject = _ObjectExtends2['default'].merge(this.getDefaultFields(), _ObjectExtends2['default'].merge(this.resolvefieldObject(req.getFieldsObject()), _fields, true));
	
	      // let resolvedFieldObject = this.resolvefieldObject(fieldObject);
	      // let keys = Object.keys(fieldObject);
	      //
	      // let matterFields = [];
	      // let isValid = true;
	      // keys.map(function(_key) {
	      //   if (_key) {
	      //     if (fieldObject[_key] === null || fieldObject[_key] === undefined) {
	      //       matterFields.push(_key);
	      //       isValid = false;
	      //     }
	      //   }
	      // });
	
	      // if (isValid) {
	      this.orbit.HTTPRequest.requestSync(req.method, this.assemblyURLWithRequest(_requestId), fieldObject, function (_err, _res) {
	
	        that.processAfterResponse(_err, _res, _cb);
	      }, _enctypeOrComplete);
	      // } else {
	      //   console.warn(`[${matterFields.join(',')}] 필드에 undefined 또는 null이 포함되어 있어 ${this.__filepath__}:${_requestId} 요청을 실행 하지 않습니다.`);
	      // }
	    }
	
	    // Proposal Override
	
	  }, {
	    key: 'processAfterResponse',
	    value: function processAfterResponse(_err, _res, _passCB) {
	      if (_err) {
	
	        _passCB(_err, null, null);
	      } else {
	
	        _passCB(null, _res.json, _res);
	      }
	    }
	  }, {
	    key: 'import',
	    value: function _import(_APISource) {
	      var APISource = _APISource || {};
	
	      this.id = APISource._id;
	      this.name = APISource.name;
	      this.title = APISource.title;
	      this.icon = APISource.icon;
	      this.serviceId = APISource.serviceId;
	      this.created = APISource.created;
	      this.requests = APISource.requests || [];
	      this.requests = this.requests.map(function (_r) {
	        return new _Request2['default'](_r);
	      });
	    }
	  }, {
	    key: 'export',
	    value: function _export() {
	      return {
	        _id: this.id,
	        name: this.name,
	        title: this.title,
	        icon: this.icon,
	        serviceId: this.serviceId,
	        created: this.created,
	        requests: this.requests.map(function (_request) {
	          return _request['export']();
	        })
	      };
	    }
	  }]);
	
	  return APISource;
	}();

	exports['default'] = APISource;

/***/ },

/***/ 45:
/*!*********************************************************!*\
  !*** ./client/src/js/Orient/Orbit/APISource/Request.js ***!
  \*********************************************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _ArrayHandler = __webpack_require__(/*! ../../../util/ArrayHandler */ 34);
	
	var _ArrayHandler2 = _interopRequireDefault(_ArrayHandler);
	
	var _ObjectExtends = __webpack_require__(/*! ../../../util/ObjectExtends */ 27);
	
	var _ObjectExtends2 = _interopRequireDefault(_ObjectExtends);
	
	var _Identifier = __webpack_require__(/*! ../../../util/Identifier.js */ 26);
	
	var _Identifier2 = _interopRequireDefault(_Identifier);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Request = function () {
	  function Request(_requestData) {
	    _classCallCheck(this, Request);
	
	    this['import'](_requestData);
	  }
	
	  _createClass(Request, [{
	    key: 'addNewField',
	    value: function addNewField() {
	      this.fields.push({
	        id: _Identifier2['default'].genUUID(),
	        key: '',
	        value: '',
	        testValue: ''
	      });
	    }
	  }, {
	    key: 'findField',
	    value: function findField(_id) {
	      var foundIndex = _ArrayHandler2['default'].findIndex(this.fields, function (_field) {
	        return _field.id === _id;
	      });
	
	      return this.fields[foundIndex];
	    }
	  }, {
	    key: 'changeFieldKey',
	    value: function changeFieldKey(_fieldId, _value) {
	      this.findField(_fieldId).key = _value;
	    }
	  }, {
	    key: 'changeFieldValue',
	    value: function changeFieldValue(_fieldId, _value) {
	      this.findField(_fieldId).value = _value;
	    }
	  }, {
	    key: 'changeFieldTestValue',
	    value: function changeFieldTestValue(_fieldId, _value) {
	      this.findField(_fieldId).testValue = _value;
	    }
	  }, {
	    key: 'getFieldsObject',
	    value: function getFieldsObject() {
	      var object = {};
	      var result = void 0;
	      for (var i = 0; i < this.fields.length; i++) {
	
	        result = this.fields[i].value || this.fields[i].defaultValue;
	
	        if (result && result !== '') {
	          object[this.fields[i].key] = result;
	        }
	      }
	
	      return object;
	    }
	  }, {
	    key: 'removeField',
	    value: function removeField(_fieldId) {
	      var fields = [];
	
	      this.fields = this.fields.filter(function (_field) {
	        return _field.id !== _fieldId;
	      });
	    }
	  }, {
	    key: 'import',
	    value: function _import(_requestData) {
	      var requestData = _requestData || {};
	
	      this.id = requestData.id || _Identifier2['default'].genUUID();
	
	      this.name = requestData.name;
	      this.method = requestData.method || 'get';
	      this.crud = requestData.crud;
	      this.customCrud = requestData.customCrud;
	      this.customURL = requestData.customURL;
	      this.fields = requestData.fields || [];
	      this.isVirtual = requestData.isVirtual;
	    }
	  }, {
	    key: 'export',
	    value: function _export() {
	      return {
	        id: this.id,
	        name: this.name,
	        method: this.method,
	        crud: this.crud,
	        customCrud: this.customCrud,
	        customURL: this.customURL,
	        fields: _ObjectExtends2['default'].clone(this.fields),
	        isVirtual: this.isVirtual
	      };
	    }
	  }, {
	    key: 'crudPoint',
	    get: function get() {
	      if (/\.[\w\d\-\_]+$/.test(this.crudType)) {
	        return this.crudType;
	      } else {
	        return this.crudType + '.json';
	      }
	    }
	  }, {
	    key: 'crudType',
	    get: function get() {
	      if (this.crud === '*') {
	        return this.customCrud;
	      } else {
	        return this.crud;
	      }
	    }
	  }]);
	
	  return Request;
	}();

	exports['default'] = Request;

/***/ },

/***/ 46:
/*!************************************************!*\
  !*** ./client/src/js/Orient/Orbit/Document.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // import async from 'async';
	
	
	var _ObjectExtends = __webpack_require__(/*! ../../util/ObjectExtends */ 27);
	
	var _ObjectExtends2 = _interopRequireDefault(_ObjectExtends);
	
	var _ArrayHandler = __webpack_require__(/*! ../../util/ArrayHandler */ 34);
	
	var _ArrayHandler2 = _interopRequireDefault(_ArrayHandler);
	
	var _async = __webpack_require__(/*! async */ 47);
	
	var _async2 = _interopRequireDefault(_async);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ERROR_LOAD_SCRIPT = new Error("Error : fail load script.");
	
	var OrbitDocument = function () {
	  function OrbitDocument(_window, _orbit) {
	    _classCallCheck(this, OrbitDocument);
	
	    this.orbit = _orbit;
	    this.window = _window;
	
	    this.requestedResources = [];
	    this.responsedResources = [];
	  }
	
	  _createClass(OrbitDocument, [{
	    key: 'loadExtraScript',
	    value: function loadExtraScript(_src, _callback) {
	      this.loadReferencingElement('js', _src, _callback);
	    }
	  }, {
	    key: 'loadExtraCSS',
	    value: function loadExtraCSS(_href, _callback) {
	      this.loadReferencingElement('css', _href, _callback);
	    }
	  }, {
	    key: 'loadReferencingElement',
	    value: function loadReferencingElement(_type, _url, _callback) {
	      var _this = this;
	
	      var type = _type;
	      var extraElement = void 0;
	      var interpretedUrl = this.orbit.interpret(_url);
	
	      // 결과가 null 이면 무시한다.
	      if (interpretedUrl === null) {
	        return _callback(null, null);
	      }
	
	      if (!type) {
	        if (/\.js(\?[^\.]*)?$/i.test(interpretedUrl)) {
	          type = 'js';
	        } else if (/\.css(\?[^\.]*)?$/i.test(interpretedUrl)) {
	          type = 'css';
	        } else {
	          throw new Error("알 수 없는 type 입니다.");
	        }
	      }
	
	      /**
	        중복 체크
	      */
	
	      // 응답리스트에 존재 하는지 체크 후 존재한다면 바로 _callback 실행 후 메서드 종료
	      var foundCompleteIndex = _ArrayHandler2['default'].findIndex(this.responsedResources, function (_obj) {
	        return _obj.url === interpretedUrl;
	      });
	
	      if (foundCompleteIndex > -1) {
	        if (typeof _callback === 'function') return _callback(null);
	      }
	
	      // 요청리스트에 존재 하는지 체크 후 존재한다면 extraElement만 가져와 입력 후 아래에서 이벤트를 추가하도록 유도
	      var foundrequestedRIndex = _ArrayHandler2['default'].findIndex(this.requestedResources, function (_obj) {
	        return _obj.url === interpretedUrl;
	      });
	
	      if (foundrequestedRIndex > -1) {
	        extraElement = this.requestedResources[foundrequestedRIndex].element;
	      }
	
	      if (!extraElement) {
	        if (type === 'js') {
	          extraElement = this.document.createElement('script');
	
	          extraElement.setAttribute('src', interpretedUrl);
	          extraElement.setAttribute('type', 'text/Javascript');
	        } else if (type === 'css') {
	          extraElement = this.document.createElement('link');
	
	          extraElement.setAttribute('href', interpretedUrl);
	          extraElement.setAttribute('type', 'text/css');
	          extraElement.setAttribute('rel', 'stylesheet');
	        } else if (type === 'favicon') {
	          extraElement = this.document.createElement('link');
	
	          extraElement.setAttribute('href', interpretedUrl);
	          extraElement.setAttribute('rel', 'shortcut icon');
	        } else {
	          throw new Error(type + ' is not support referencing element type.');
	        }
	      }
	
	      extraElement.addEventListener('error', function (_event) {
	
	        // 요청된 리소스 리스트에 입력된 상태가 아니었을 때 응답 항목으로 추가한다.
	        if (foundrequestedRIndex === -1) {
	          _this.responsedResources.push({
	            url: interpretedUrl,
	            element: extraElement,
	            error: _event
	          });
	        }
	
	        if (typeof _callback === 'function') _callback(ERROR_LOAD_SCRIPT, null);
	      });
	
	      extraElement.addEventListener('load', function (_event) {
	
	        // 요청된 리소스 리스트에 입력된 상태가 아니었을 때 응답 항목으로 추가한다.
	        if (foundrequestedRIndex === -1) {
	          _this.responsedResources.push({
	            url: interpretedUrl,
	            element: extraElement
	          });
	        }
	
	        if (typeof _callback === 'function') _callback(null, _event);
	      });
	
	      // 요청된 리소스 리스트에 입력
	      this.requestedResources.push({
	        url: interpretedUrl,
	        element: extraElement
	      });
	
	      // 요청된 리소스가 아닐 경우에만 추가
	      if (foundrequestedRIndex === -1) {
	        this.head.appendChild(extraElement);
	      }
	    }
	  }, {
	    key: 'loadExtraJSSerial',
	    value: function loadExtraJSSerial(_srcList, _callback) {
	      this.loadReferencingElementSerial('js', _srcList, _callback);
	    }
	  }, {
	    key: 'loadExtraCSSSerial',
	    value: function loadExtraCSSSerial(_hrefList, _callback) {
	      this.loadReferencingElementSerial('css', _hrefList, _callback);
	    }
	  }, {
	    key: 'loadReferencingElementSerial',
	    value: function loadReferencingElementSerial(_type, _urlList, _callback) {
	      var series = _ObjectExtends2['default'].clone(_urlList);
	
	      var that = this;
	      var activeSrcList = [];
	      var unloadedSrcList = [];
	
	      _async2['default'].eachSeries(series, function (_url, _callback) {
	        that.loadReferencingElement(_type, _url, function (_err) {
	          if (_err) {
	            unloadedSrcList.push(_url);
	          } else {
	            activeSrcList.push(_url);
	          }
	
	          _callback();
	        });
	      }, function () {
	        if (typeof _callback !== 'function') return;
	
	        if (unloadedSrcList.length === 0) {
	          _callback(null);
	        } else {
	          _callback(unloadedSrcList);
	        }
	      });
	    }
	  }, {
	    key: 'loadExtraJSPararllel',
	    value: function loadExtraJSPararllel(_srcList, _callback) {
	      this.loadReferencingElementParallel('js', _srcList, _callback);
	    }
	  }, {
	    key: 'loadExtraCSSPararllel',
	    value: function loadExtraCSSPararllel(_hrefList, _callback) {
	      this.loadReferencingElementParallel('css', _hrefList, _callback);
	    }
	  }, {
	    key: 'loadReferencingElementParallel',
	    value: function loadReferencingElementParallel(_type, _urlList, _callback) {
	      var series = _ObjectExtends2['default'].clone(_urlList);
	
	      var that = this;
	      var activeSrcList = [];
	      var unloadedSrcList = [];
	
	      _async2['default'].parallel(series.map(function (_url) {
	        return function (_callback) {
	          that.loadReferencingElement(_type, _url, function (_err) {
	            if (_err) {
	              unloadedSrcList.push(_url);
	            } else {
	              activeSrcList.push(_url);
	            }
	
	            _callback();
	          });
	        };
	      }), function (_err, _result) {
	        if (typeof _callback !== 'function') return;
	
	        if (unloadedSrcList.length === 0) {
	          _callback(null);
	        } else {
	          _callback(unloadedSrcList);
	        }
	      });
	    }
	
	    // Title
	
	  }, {
	    key: 'window',
	    get: function get() {
	      return this._window;
	    },
	    set: function set(_window) {
	      this._window = _window;
	    }
	  }, {
	    key: 'document',
	    get: function get() {
	      return this._window.document;
	    }
	  }, {
	    key: 'head',
	    get: function get() {
	      return this.document.head;
	    }
	  }, {
	    key: 'headScriptElements',
	    get: function get() {
	      return this.document.head.getElementsByTagName('script');
	    }
	  }, {
	    key: 'titleElement',
	    get: function get() {
	      return this.document.head.getElementsByTagName('title')[0];
	    }
	  }, {
	    key: 'title',
	    get: function get() {
	      return this.titleElement.innerHTML;
	    },
	    set: function set(_title) {
	      var titleElement = this.titleElement;
	      if (!titleElement) {
	
	        titleElement = this.document.createElement('title');
	        this.head.appendChild(titleElement);
	      }
	
	      titleElement.innerHTML = _title;
	    }
	  }]);
	
	  return OrbitDocument;
	}();
	
	exports['default'] = OrbitDocument;

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
//# sourceMappingURL=orbit.js.map