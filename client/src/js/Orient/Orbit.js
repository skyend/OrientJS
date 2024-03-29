import './common/polyfill';
import './Orbit.copyright.js'

import HTTPRequest from './common/HTTPRequest';
import APIRequest from './common/APIRequest';
import IO from './Orbit/IO';
import Config from './Orbit/Config';
import I18N from './Orbit/I18N';
import Resolver from '../serviceCrew/DataResolver/Resolver';
import Cookie from './common/Cookie';
import BuiltinRetriever from './Orbit/Retriever';
import APISourceFactory from './Orbit/APISource/Factory';
import OrbitDocument from './Orbit/Document';
import ObjectExtends from '../util/ObjectExtends';
import GeneralLocation from '../util/GeneralLocation';

import events from 'events';

import browser from 'detect-browser';
import BrowserInfo from './common/Browser';

var BROWSER_NAME = BrowserInfo.name;
var BROWSER_VER = parseFloat(BrowserInfo.version);
window.BrowserInfo = BrowserInfo;

const LEGACY_BROWSER =
  (BROWSER_NAME === 'ie' && BROWSER_VER <= 10) ||
  (BROWSER_NAME === 'safari' && BROWSER_VER <= 534) ||
  (BROWSER_NAME === 'ios' && BROWSER_VER <= 8) ||
  (BROWSER_NAME === 'chrome' && BROWSER_VER <= 30) ||
  ( BROWSER_NAME === 'android' && BROWSER_VER <= 4 ) ||
  (BROWSER_NAME === 'weird');


const VERSION = '1.2.5#1006';

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

  - 0.13.5 (2016-06-26T11:30) : Orient 0.16.3
    * HTTPRequest 의 필드 value에 {dontencode} 지시자가 포함되어 있으면 해당 필드값을 인코딩하지 않는 기능 추가

  - 0.13.6 (2016-06-25T00:05)
    * ORBIT_APISOURCE_CACHING 버그 수정

  - 0.13.7 (2016-06-26T14:45)
    * foundationCompatibility 함수에서 두번째 인자는 earlyScripts로딩을 완료 한 뒤에 호출하는 콜백으로 콜백을 호출 할 때 next 콜백함수를 넘겨준다.
      외부에서 입력된 foundationCompatibility 두번째 인자함수 내에서 next콜백을 호출 하면 최초 랜더링이 시작된다.

  - 0.13.8 (2016-07-01T16:30)
    * orbit.ready 는 body가 ready될 때 발생하도록 변경

  - 0.13.9 (2016-07-05T11:30)
    * orbit 이벤트 추가 - http:request, http:response, http:begin, http:finish

  - 0.13.10 (2016-07-07T23:37)
    * FOUC Preventer

  - 0.14.0 (2016-07-13T00:25)
    * multi-part/formdata 도 uriEncode 하도록 수정

  - 0.14.1 (2016-08-09T17:55)
    * IE9 IFrame 이용 멀티파트 Ajax 지원 (response content type 이 text/plain 이어야 함)
    * HTTPRequest SSL옵션 추가

  - 1.14.2 (2016-08-11T22:30)
    * ObjectExtends 에 mergeDeep 메서드 추가.
    * i18n preparing.

  - 1.2.0 (2016-08-20T18:47) - # XSS 방어 업데이트
    * Orbit 의 Config 필드 변경 방지 및 Config 내의 Field 임의 변경 방지 최초의 retrieveConfig 또는 config.import 를 통해 한번만 실행 되도록 함
    * Config 의 한번 임포트 되어 지정된 필드는 변경 불가능 하도록 변경함
    * 없던 Field 에 대해서는 지정이 가능하도록 함
    * Retriever 와 Config 멤버변수는 외부에서 변경이 불가능 하도록 변경
  - 1.2.0#1000 (2016-09-07T16:39)
    * op 모드에 BrowserStorage 에러 블러킹 옵션 분기추가

  - 1.2.0#1001 (2016-09-07T16:39)
    * BrowserStorage 에러 블리킹 롤백

  - 1.2.2#1002 (2016-10-17T12:02)
    * 페이지의 context-ready 를 감시하여 페이지자신에게만 속한 DC가 모두 로딩 완료 되었을 때 FOUC를 풀어준다.

  - 1.2.3#1003 (2016-10-17T12:02)
    * attachFOUCPreventer 와 disableConsole static 메서드 추가
  - 1.2.4#1004 (2016-10-31T13:00)
    * BrowserStorage try catch
  - 1.2.4#1005 (2016-12-14T17:43)
    * 기타 버그 수정
  - 1.2.5#1006 (2016-12-26T17:43)
    * APIRequest withCredentials 옵션 지원
*/


// Config 객체를 담을 변수
// Config 객체에 직접 접근을 방지 하기 위해 지역변수로 선언하고 orbit 의 getter를 통해서 접근 할 수 있도록 한다.
var SECURE_CONFIG_BUCKET = null;
var SECURE_RETRIEVER_BUCKET = null;


class Orbit {
  /**
    _window : Browser Window Object
    _inlineConfig : 직접 JSON으로 입력한 Config Object
    _retriever : 프레임웤 리소스를 확장하는 객체
  */
  constructor(_window, _inlineConfig, _retriever) {
    if( window.console ){
      window.console.time && window.console.time('prepare render');
    }


    // Orbit 에서 커스텀 이벤트를 사용 할 수 있도록 EventEmitter를 포함한다.
    ObjectExtends.liteExtends(this, events.EventEmitter.prototype);
    this.setMaxListeners(20);

    let that = this;

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
    SECURE_CONFIG_BUCKET = new Config(_inlineConfig, this);
    this.bindedInterpretSupporters.getConfig = this.config.getField.bind(this.config); // config interpreter

    this.api = new APIRequest(this);
    this.io = new IO(this);
    this.orbitDocument = new OrbitDocument(this.window, this);
    this.apiSourceFactory = new APISourceFactory(this);
    this.resolver = new Resolver();
    this.i18n = new I18N(this, {
      languageDecider: '',
      languageDefault: ''
    });

    this.bindedInterpretSupporters.executeI18n = this.i18n.executeI18n.bind(this.i18n); // i18n interpreter

    SECURE_RETRIEVER_BUCKET = new BuiltinRetriever(that, {
      'relative-dir-i18n': this.config.getField('DIR_I18N'),
      'relative-dir-apisource': this.config.getField('DIR_API_SOURCE'),
      'relative-dir-component': this.config.getField('DIR_COMPONENT')
    }, _retriever);

    // Update Members by Config update
    // config 가 변경될 때 마다 config를 사용하는 객체의 설정을 업데이트한다.
    this.config.on('update', function(_e) {
      // ※ this === this.config

      // DIR PATH
      that.retriever.dirpath_i18n = this.getField('DIR_I18N');
      that.retriever.dirpath_apisource = this.getField('DIR_API_SOURCE');
      that.retriever.dirpath_component = this.getField('DIR_COMPONENT');

      that.i18n.languageDecider = this.getField('LANGUAGE_DECIDER');
      that.i18n.languageDefault = this.getField('LANGUAGE_DEFAULT');

      let mode = this.getField("MODE") || 'op'; // debug(디버그) || dev(개발) || op(운영)

      if (mode === 'op') {
        window.ORIENT_CLEAR_BD_LOG = true;
        window.BROWSER_STORAGE_OFF_SET_EXCEPTION = true;
        Orbit.disableConsole();
        //
      } else if (mode === 'dev') {
        window.ORIENT_SHOW_SPECIAL_ATTRIBUTES = true;
        window.ORIENT_OCCURS_BIND_ERROR = true;

      } else if (mode === 'debug') {
        window.ORIENT_SHOW_SPECIAL_ATTRIBUTES = true;
        window.DEBUG_OCCURS_HTTP_REQUEST_LOG = true;
        window.ORIENT_OCCURS_BIND_ERROR = true;
        window.ORIENT_COMPONENT_BUILD_TIMECHECK = true;
        window.ORIENT_SYNC_THROW_EVENT_ERROR = true;
        Orient.onTraceDebug();
      }
    });

    // HTTPRequest request one
    HTTPRequest.on('request', (_e) => {
      let remakeEvent = Object.assign({}, _e);
      remakeEvent.context = this;

      this.emit('http:request', remakeEvent);
    });

    // HTTPRequest response one
    HTTPRequest.on('response', (_e) => {
      let remakeEvent = Object.assign({}, _e);
      remakeEvent.context = this;

      this.emit('http:response', remakeEvent);
    });

    // HTTPRequest request stream begin
    HTTPRequest.on('begin', (_e) => {
      this.emit('http:begin', {});
    });

    // HTTPRequest request stream finish
    HTTPRequest.on('finish', (_e) => {
      this.emit('http:finish', {});
    });
  }

  set window(_window) {
    this._window = _window;
  }

  get window() {
    return this._window;
  }

  get document() {
    return this.window.document;
  }

  set apiSourceFactory(_apiSourceFactory) {
    this._apiSourceFactory = _apiSourceFactory;
  }

  get apiSourceFactory() {
    return this._apiSourceFactory;
  }

  // set retriever(_retriever) {
  //   this._retriever = _retriever;
  // }

  get retriever() {
    return SECURE_RETRIEVER_BUCKET;
  }

  get HTTPRequest() {
    return HTTPRequest;
  }

  get config(){
    return SECURE_CONFIG_BUCKET;
  }


  interpret(_text, _defaultDataObject) {

    return this.resolver.resolve(_text, {
      getENVConfig: this.forInterpret_config_func,
      executeI18n: this.forInterpret_executeI18N_func
    }, _defaultDataObject, this);
  }

  get forInterpret_executeI18N_func() {
    return this.bindedInterpretSupporters.executeI18n;
  }

  get forInterpret_config_func() {
    return this.bindedInterpretSupporters.getConfig;
  }

  // will Deprecate
  pageMetaCompatibility(_renderCallback, _finalCallback) {
    let pageMetaEl = document.getElementById('page-meta');
    let pageMeta;

    let that = this;

    if( pageMetaEl ){
      let pageMetaText = pageMetaEl.innerHTML;

      try {
        pageMeta = JSON.parse(pageMetaText);
      } catch (_e) {
        throw new Error(`Page Meta Script Tag 에 문법적인 문제가 있습니다. ${_e}`);
      }
    } else {
      pageMeta = {};
    }



    this.orbitDocument.loadExtraCSSPararllel(pageMeta.styles || [], () => {
      // Early Script
      this.orbitDocument.loadExtraJSSerial(pageMeta.earlyScripts || [], (_failures) => {
        // Early Scipts 로드완료

        _renderCallback(function next() {
          that.orbitDocument.loadExtraJSSerial(pageMeta.scripts || [], () => {
            // Script 로드 완료

            _finalCallback();
          });
        });
      });
    });
  }


  bodyDisappear() {
    if (this.window.document.getElementById('fouc-preventer')) return;

    let styleDOM = this.orbitDocument.document.createElement('style');

    this.bodyOpacity = 0;
    styleDOM.setAttribute('id', 'fouc-preventer');
    this.bodyAppearControlStyleDOM = styleDOM;

    this.orbitDocument.document.head.appendChild(this.bodyAppearControlStyleDOM);

    this.updateBodyOpacity();
  }

  bodyAppear() {
    this.bodyOpacity = 0;
    var itvid = setInterval(() => {
      this.bodyOpacity += 1;
      this.updateBodyOpacity();

      if (this.bodyOpacity >= 1) clearInterval(itvid);
    }, 1000 / 30);
  }

  updateBodyOpacity() {
    let styleDOM = this.window.document.getElementById('fouc-preventer');
    if( styleDOM ){
      if (this.bodyOpacity >= 1) {
        styleDOM.innerHTML = `body { }`;
        styleDOM.parentNode.removeChild(styleDOM);
      } else {
        styleDOM.innerHTML = `body { opacity:${this.bodyOpacity};  pointer-events:none;  }`;
      }
    }
  }

  foundationCompatibility(_selector, _beforeRenderCallback, /* _afterRenderCallback,*/ _callbackFinal, _absorbOriginDOM = true) {
    let that = this;

    this.pageMetaCompatibility((_nextCallback) => {
      // Early Scrips 로드 완료시 호출됨
      if( window.console ){
        window.console.timeEnd && window.console.timeEnd('prepare render');
      }


      if( window.console ){
        window.console.time && window.console.time('ready');
        window.console.time && window.console.time('foucclear');
      }

      if (_beforeRenderCallback) {
        _beforeRenderCallback(function next() {

          that.foundationCompatibilityRender(_selector, function() {

            _nextCallback();
          });
        });
      } else {
        that.foundationCompatibilityRender(_selector, function() {

          _nextCallback();
        });
      }
    }, () => {
      // Scripts 로드 완료시 호출 됨
      this.signalReady();
      if (_callbackFinal) {
        _callbackFinal(masterElementNode);
      }
    });
  }

  foundationCompatibilityRender(_selector, _callback) {
    let targetDomNodes, targetDomNode;
    if (_selector) {
      targetDomNodes = this.orbitDocument.document.querySelectorAll(_selector);
    } else {
      targetDomNodes = [this.orbitDocument.document.body];
    }

    window.ORIENT_COMPONENT_BUILD_TIMECHECK && console.time && console.time("First Built up");
    let readyCounter = 0, ctxReadyCounter = 0;
    for (let i = 0; i < targetDomNodes.length; i++) {
      targetDomNode = targetDomNodes[i];
      // var masterElementNode = Orient[_absorbOriginDOM ? 'buildComponentByElementSafeOrigin' : 'buildComponentByElement'](targetDomNode, {}, this);
      //
      // Orient.replaceRender(masterElementNode, targetDomNode);

      var masterElementNode = Orient.buildComponentByElementSafeOrigin(targetDomNode, {}, this);


      masterElementNode.addRuntimeEventListener('ready', () => {
        masterElementNode.removeRuntimeEventListener('ready', 'orbit-ready');
        readyCounter++;

        if (readyCounter === targetDomNodes.length) {

          console.log('fouc-clear-by-ready')
          this.tryFOUCClear();
          _callback();
        }
      }, 'orbit-ready');

      masterElementNode.addRuntimeEventListener('ready-context', () => {
        masterElementNode.removeRuntimeEventListener('ready-context', 'toplevel-ctx-ready');
        ctxReadyCounter++;

        if (ctxReadyCounter === targetDomNodes.length) {

          console.log('fouc-clear-by-context-ready')
          this.tryFOUCClear();
        }
      }, 'toplevel-ctx-ready');


      masterElementNode.render({
        resolve: true
      });
    }

    if( !(window.ORBIT_FOUC_LAZY === true) ){

      this.tryFOUCClear();
    }

    window.ORIENT_COMPONENT_BUILD_TIMECHECK && console.timeEnd && console.timeEnd("First Built up");
  }

  // 원하는 스크립트에 ready 를 이용하여 원하는 시점에 한번에 실행 할 수 있도록 기능을 제공한다.
  ready(_func) {
    if (!this.readied) {
      this.on('load', _func);
    } else {
      _func();
    }
  }

  signalReady() {
    this.readied = true;
    this.emit('load');


    if( window.console ){
      window.console.timeEnd && window.console.timeEnd('ready');
    }
  }

  tryFOUCClear(){
    let styleDOM = this.window.document.getElementById('fouc-preventer');
    if (styleDOM) {

      if( window.console ){
        window.console.timeEnd && window.console.timeEnd('foucclear');
      }

      this.bodyAppear();
    }
  }



  /*
    ███████ ██   ██ ████████ ███████ ███    ██ ██████   █████  ██████  ██      ███████      ██████ ██       █████  ███████ ███████     ███████ ██   ██ ██████   ██████  ██████  ████████
    ██       ██ ██     ██    ██      ████   ██ ██   ██ ██   ██ ██   ██ ██      ██          ██      ██      ██   ██ ██      ██          ██       ██ ██  ██   ██ ██    ██ ██   ██    ██
    █████     ███      ██    █████   ██ ██  ██ ██   ██ ███████ ██████  ██      █████       ██      ██      ███████ ███████ ███████     █████     ███   ██████  ██    ██ ██████     ██
    ██       ██ ██     ██    ██      ██  ██ ██ ██   ██ ██   ██ ██   ██ ██      ██          ██      ██      ██   ██      ██      ██     ██       ██ ██  ██      ██    ██ ██   ██    ██
    ███████ ██   ██    ██    ███████ ██   ████ ██████  ██   ██ ██████  ███████ ███████      ██████ ███████ ██   ██ ███████ ███████     ███████ ██   ██ ██       ██████  ██   ██    ██
  */

  // Class Extention 을 제공하기 위해 Class를 export
  static get Retriever() {
    return BuiltinRetriever;
  }

  static get I18N() {
    return I18N;
  }

  static get Config() {
    return Config;
  }

  static get Resolver() {
    return Resolver;
  }

  /*
    ███████ ████████  █████  ████████ ██  ██████      █████  ██████  ██
    ██         ██    ██   ██    ██    ██ ██          ██   ██ ██   ██ ██
    ███████    ██    ███████    ██    ██ ██          ███████ ██████  ██
         ██    ██    ██   ██    ██    ██ ██          ██   ██ ██      ██
    ███████    ██    ██   ██    ██    ██  ██████     ██   ██ ██      ██
  */
  static get ObjectExtends() {
    return ObjectExtends;
  }

  static get ExtendClass() {
    return ObjectExtends.ExtendClass;
  }

  static get APIFactory() {
    return APISourceFactory;
  }

  static get HTTPRequest() {
    return HTTPRequest;
  }

  static get Location() {
    return GeneralLocation;
  }

  static get B() {
    return browser
  }

  static get bn() {
    return BROWSER_NAME;
  }

  static get bv() {
    return BROWSER_VER;
  }

  static get IS_LEGACY_BROWSER() {
    return LEGACY_BROWSER;
  }

  static get Cookie() {
    return Cookie;
  }

  static attachFOUCPreventer() {
    window.ORBIT_FOUC_LAZY = true;

    var styleDOM = document.createElement('style');

    styleDOM.setAttribute('id', 'fouc-preventer');
    styleDOM.innerHTML = 'body > * { opacity:0;  pointer-events:none;  };';

    document.head.appendChild(styleDOM);

    try {
      var foucLoaderStyleDOM = document.createElement('style');

      foucLoaderStyleDOM.setAttribute('id', 'fouc-loader-style');
      foucLoaderStyleDOM.innerHTML = ''+
      'body:before {'+
      'display: block;'+
      'content: " ";'+
      'position: absolute;'+
      'top: 50%;'+
      'left: 50%;'+
      'width: 20px;'+
      'height: 20px;'+
      'margin-top:-10px;'+
      'margin-left:-12.5px;'+
      //'background-color: rgb(15, 150, 180);'+
      'background-color: rgb(237, 28, 46);'+
      'border-radius: 50%;'+
      '}'+
      'body:after {'+
      'display: block;'+
      'content: " ";'+
      'position: absolute;'+
      'top: 50%;'+
      'left: 50%;'+
      'width: 20px;'+
      'height: 20px;'+
      'margin-top:-10px;'+
      'margin-left:12.5px;'+
      //'background-color: rgb(15, 81, 180);'+
      'background-color: rgb(0, 0, 0);'+
      'border-radius: 50%;'+
      '}';
      document.head.appendChild(foucLoaderStyleDOM);

      var foucLoaderDeltaStyleDOM = document.createElement('style');
      foucLoaderDeltaStyleDOM.setAttribute('id', 'fouc-loader-style-delta');
      document.head.appendChild(foucLoaderDeltaStyleDOM);

      var t = 0;
      var itvid = setInterval(function(){
        t += 0.2;
        foucLoaderDeltaStyleDOM.innerHTML = 'body:before { background-color: rgba(237, 28, 46, '+ Math.cos(t)* 0.6 + '); }'
        + 'body:after { background-color: rgba(0, 0, 0, '+ Math.sin(t) * 0.6  +'); }';

        if( !document.getElementById('fouc-preventer') ){
          document.head.removeChild(foucLoaderStyleDOM);
          document.head.removeChild(foucLoaderDeltaStyleDOM);
          clearInterval(itvid);
        }
      },1000/30);
    } catch(_e){

    }
  }

  static disableConsole(){
    if( window.console ){
        window._console = { info : console.info };
        console.log = console.warn = console.info = console.error = console.trace = console.time = console.timeEnd = console.group = console.groupEnd = console.groupCollapsed = function(){};
      }
  }
}




Orbit.version = VERSION;

export default window.Orbit = Orbit;
