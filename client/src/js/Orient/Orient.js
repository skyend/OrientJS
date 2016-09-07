import './Orient.copyright.js'
import './common/polyfill';
import Cookie from './common/Cookie';

import ElementNodeFactory from '../serviceCrew/ElementNode/Factory';
import HTTPRequest from './common/HTTPRequest';
import APIRequest from './common/APIRequest';
import OConsole from './common/Console';

import ElementNode from '../serviceCrew/ElementNode/ElementNode';
import HTMLElementNode from '../serviceCrew/ElementNode/HTMLElementNode';
import RefElementNode from '../serviceCrew/ElementNode/RefElementNode';
import SVGElementNode from '../serviceCrew/ElementNode/SVGElementNode';
import StringElementNode from '../serviceCrew/ElementNode/StringElementNode';
import TagBaseElementNode from '../serviceCrew/ElementNode/TagBaseElementNode';

import ObjectExtends from '../util/ObjectExtends';
import ArrayHandler from '../util/ArrayHandler';
import Identifier from '../util/Identifier';
import ObjectExplorer from '../util/ObjectExplorer';
import BrowserStorage from '../util/BrowserStorage';
import GeneralLocation from '../util/GeneralLocation';

import ActionStore from '../serviceCrew/Actions/ActionStore';
import FunctionStore from '../serviceCrew/Functions/FunctionStore';
import Shortcut from '../serviceCrew/DataResolver/Shortcut';

import browser from 'detect-browser';
const BROWSER_NAME = browser.name;
const BROWSER_VER = parseInt(browser.version);
const LEGACY_BROWSER =
  (BROWSER_NAME === 'ie' && BROWSER_VER <= 10) ||
  (BROWSER_NAME === 'safari' && BROWSER_VER <= 534) ||
  (BROWSER_NAME === 'ios' && BROWSER_VER <= 8) ||
  (BROWSER_NAME === 'chrome' && BROWSER_VER <= 30) ||
  ( BROWSER_NAME === 'android' && BROWSER_VER <= 4 );

let CLEAR_BIND_ERROR = false;

const VERSION = '1.2.2';

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
    * ElementNode 의 parent 에서 upperContainer 의 개념을 분리해냄 ( 자신의 상위 DOM을 가진 요소를 upperContainer 로 지정
      실제 attachDOMChild 와 dettachDOMChild는 upperContainer 로 지정된 Node에서 담당한다.)
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

  - 0.16.3 (2016-06-24T11:30) : Orbit 0.13.5
    * HTTPRequest 의 필드 value에 {dontencode} 지시자가 포함되어 있으면 해당 필드값을 인코딩하지 않는 기능 추가

  - 0.16.4 (2016-06-25T00:03)
    * 랜더 옵션 dontcareMissed 추가 언마운트 중 잃어버린 요소로 인해 에러가 발생하여도 언마운트한것으로 인지한다.
    * DynamicContext 로딩이 완료 되지 않으면 자식들을 랜더링 하지 않도록 변경 ( 로딩이 되지 않아도 자신은 마운트및 업데이트를 진행 )
    * PipeEvent 가 componentOwner 까지 연결 되도록 수정 ( 이전에는 ref 의 component 에 parent 를 ref 로 지정하여서 사용에 문제가 없었음)
    * Repeater 는 랜더링중에 unmount되었으나 가끔 unmount가 실패 할 때가 있어 실패시도 unmount성공으로 동작하도록 수정( dontcareMissed 옵션 사용)

  - 0.16.5 (2016-06-25T00:33)
    * 랜더링중 pass mount 로 분기되었을 때 랜더링 프로세싱 플래그를 해제하지 않는 버그 수정

  - 0.16.6 (2016-06-27T00:40)
    * IE 에서 Input 이벤트 후킹시 이벤트 바인딩 플래그를 추가하지 않아 이벤트가 중복 바인딩 되는 버그 수정
    * DynamicContext 가 로딩 되지 않아도 내부를 랜더링 하는 en-dc-force-render-children 옵션 추가
    * Input Event를 keyup 과 change 이벤트로 분열시켜 ElementNode 이벤트로 바인딩 되도록 함 (이전에는 IE에서만 적용하였음)
    * Shortcut dateFormatter 내에 다른 타임스탬프 형식을 인식 하도록 추가. ( 2016-06-13T16:34:50+0900 )
    * safari 브라우저 5.3.4 이하는 클래스 상속을 IE10이하와 같게 함.
    * Shortcut dateFormatter safari 5이하 firefox 날짜 형식 보정 추가 (jun 27 2016 00:09:29 GMT+0900)

  - 0.16.7 (2016-06-28T02:00)
    * Shortcut DateFormatter 날짜 형식 감지 확장
    * HTTPRequest IE9 이면서 타도메인 요청시 XDomainRequest를 사용 할 때 enctype을 application/x-www-form-urlencoded로만 사용하고 method 또한 get으로 요청을 하도록 고정한다.
    * Orient Event 의 에러 핸들링 방식의 변경 : 이벤트 실행중 발생하는 에러는 throw 하도록 하였음.

  - 0.16.8 (2016-06-28T16:23)
    * DynamicContext / Ref Component Ready 이벤트 추가 각 MasterComponent 와 DC에서 동기화된 Async 흐름에 대한 Ready 이벤트를 들을 수 있다.

  - 0.16.10 (2016-06-28T17:41)
    * 상위에 ReadyHolder 를 걸 때 parent 가 없으면(없는 경우는 RefElementNode 가 참조하는 MasterComponent 일 경우 ) componentOwner를 사용 하도록 수정
    * en-event-ready FIX!!!

  - 0.18.0 (2016-06-28T23:53)
    * 최초 ready 와 뒤이어 발생하는 ready 이벤트에 대한 분리
      최초 ready 는 ready 라는 이름으로 이벤트가 발생하며 뒤이어 n(n > 1)번째 발생하는 ready 는 nth-ready 라는 이름으로 이벤트가 발생한다.
    * ready counter 의 값에 따라 nth-ready 로 ready를 발생 할 지 nth-ready로 발생할지 결정한다.
    * 최초 ready 는 nth 값이 0이며 그 이후발생하는 nth는 ready 횟수에 따라 결정된다.

  - 0.18.1 (2016-06-30T02:00)
    * tryEmitReady 를 실행 할 때 isRendering 플래그도 함께 체크하도록 변경 랜더링흐름을 타는 중 프래그먼트 로딩을 시작하고 로딩이 완료
      되면 랜더링흐름중 ready가 발생하여 프래그먼트의 내부프래그먼트가 로딩될 때 마다 ready가 발생하는 버그 수정

    ToDo
      * Hidden 과 함께 동작하는 DC에서 readyHolder가 잔류하는 버그가 있음. KOP main/prodWrap.html 에서 버그 확인 가능

  - 0.18.2 (2016-06-30T14:33)
      * Hidden 으로 판정된 상태에서 DC로딩을 시작하여 완료가 되었을 때는 forwardDOM이 존재하지 않는다. 사실 Hidden으로 판정되면 자식을 랜더링 하지 않고
        그 상태에서 DC가 로딩이 완료 되면 ready가 가능한 상태가 된다. 하지만 forwarDOM은 존재 하지않으므로 ready 를 시도하여도 할 수 없었다.
        -> 그래서 ready가 가능한 조건을 3개에서 2개로 줄였다. readyHolder가 비어있어야 하며 isRendering플래그가 false 여야 한다.
            isRendering플래그가 false 이면 랜더링은 완료된 상태라고 볼 수 있기 때문이다. 랜더링이 완료 되어도 hidden으로 판정 될 경우 forwardDOM이 없으므로
            조건에서 제외하였다.

  - 0.18.3 (2016-06-30T16:20)
    * Value Scope Node 에 mapping-session 어트리뷰트 추가 session 에 mapping되어 값이 변경될때 value가 빌드될 때 양방향 매핑이 이루어짐

  - 0.18.4 (2016-06-30T20:57)
    * enableHTML 인 String type ElementNode 의 innerHTML을 가져 올 때 이스케이프된 <,>,& 문자들을 다시 unescape 하도록 한다.
      (내부에 바인딩 블럭을 사용 하고 조건식을 사용 할 때 문제가 되었었음)

  - 0.18.5 (2016-06-30T20:57)
    * EN:Value 와 attribute 저장방식 변경 MetaText 를 MetaData 로 변경하고, 값을 set 하거나 get 할 때 JSON parse/stringify 하는 과정을 제거함
      그리하여 Value 와 Attribute 둘다에서 Object를 자유롭게 사용하고 객체를 저장할 수 있으며 참조 값을 가져온 후에 참조로 필드를 수정 할 수 있다.

  - 0.18.6 (2016-07-04T16:46)
    * 중복 Value Resolve 수정

  - 0.18.7 (2016-07-07T16:00)
    * 에러수정
    * Shortcut 의 dateFormatter 날자 형식 지원 확대 IOS8.0+

  - 0.18.8 (2016-07-13T00:25)
    * setValue 메서드 체이닝 setValue 메서드의 반환값이 this로 변경
    * splitByLength ArrayHandler 메서드 추가

  - 0.18.9 (2016-07-28T11:41)
    * Orient Shortcuts

  - 0.18.10 (2016-08-01T14:38)
    * Ref Master Ready 참조카운트 버그 수정

  - 0.19.1 (2016-08-09T17:55)
    * IE9 IFrame 이용 멀티파트 Ajax 지원 (response content type 이 text/plain 이어야 함)
    * HTTPRequest SSL옵션 추가
    * Orient 의 인스턴스 직접접근 및 메소드 제공객체 Global O객체 제공
    * 기타 액션및 함수 추가

  - 1.19.2 (2016-08-11T22:30)
    * ObjectExtends 에 mergeDeep 메서드 추가.
    * i18n preparing.

  - 1.2.0 (2016-08-20T21:04)
    * Value localStorage 바인딩 추가
    * Global O 업데이트

  - 1.2.1 (2016-08-26T16:30)
    * Orient Event 처리 흐름 수정 동기 서브루틴으로 처리되던 이벤트 흐름을 setTimeout 0초를 이용하여 비동기로 동작하도록 변경하여
     - 이벤트처리중 발생한 에러가 랜더링에 영향을 미치지 않도록 함
   - 1.2.2 (2016-09-06T10:37)
     * executeDCReadyNotice 메서드 추가
*/



class Neutron {

  constructor(){
  }

  static buildElement(_elementNodeObject) {

  }

  static get HTTPRequest() {
    return HTTPRequest;
  }

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
  static buildComponentByElement(_domElement, _props = {}, _env = null) {
    let masterType = ElementNodeFactory.checkElementNodeType(_domElement);

    // build
    // 랜더링 전에 Env 세팅
    let masterElementNode = ElementNodeFactory.takeElementNode(undefined, _props, masterType, _env, true);

    masterElementNode.buildByElement(_domElement);


    return masterElementNode;
  }

  static buildComponentByElementSafeOrigin(_domElement, _props = {}, _env = null) {
    let masterType = ElementNodeFactory.checkElementNodeType(_domElement);

    // build
    // 랜더링 전에 Env 세팅
    let masterElementNode = ElementNodeFactory.takeElementNode(undefined, _props, masterType, _env, true);
    masterElementNode.buildByElement(_domElement, true);

    return masterElementNode;
  }

  static buildComponentBySheet(_sheetType, _sheet, _props = {}, _env = null) {
    if (_sheetType === 'html') {
      return ElementNodeFactory.convertToMasterElementNodesByHTMLSheet(_sheet, _props, _env);
    } else if (_sheetType === 'json') {
      return ElementNodeFactory.convertToMasterElementNodesByJSONSheet(JSON.parse(_sheet), _props, _env);
    } else if (_sheetType === 'js') {
      // return ElementNodeFactory.extractByJSModule(_sheet, _props, _env);
    }
  }

  static renderVirtual(_elementNode) {
    let componentContainer = document.createElement('div');

    _elementNode.upperContainer = {
      attachDOMChild: function(_idx, _mountChildDOM, _mountChild) {
        componentContainer.appendChild(_mountChildDOM);
      },

      dettachDOMChild: function(_dom) {
        componentContainer.removeChild(_dom);
      }
    };

    _elementNode.render({
      resolve: true
    });

    return componentContainer;
  }

  static render_dev(_wrapper, _elementNode = null, _props = {}, _env = null) {
    if (_elementNode) {

      _elementNode.upperContainer = {
        attachDOMChild: function(_idx, _mountChildDOM, _mountChild) {
          _wrapper.appendChild(_mountChildDOM);
        },

        dettachDOMChild: function(_dom) {
          _wrapper.removeChild(_dom);
        }
      };

      _elementNode.render({
        resolve: true
      });
    } else {
      let wrapperElementNode = Neutron.buildComponentByElementSafeOrigin(_wrapper, _props, _env);
      wrapperElementNode.render({
        resolve: true
      });
    }
  }

  static mount(_elementNode, _targetDOMElement) {
    _elementNode.attachForwardDOM(_targetDOMElement);

  }

  static mountByReplace(_elementNode, _targetDOMElement) {
    let parentDOMElement = _targetDOMElement.parentNode;
    //parentDOMElement.replaceChild()
    _elementNode.attachForwardDOMByReplace(parentDOMElement, _targetDOMElement);
  }

  // render = renderVirtual + mount
  static render(_elementNode, _targetDOMElement) {
    _elementNode.tryEventScope('component-will-mount', {

    }, null, (_result) => {

      this.renderVirtual(_elementNode);
      this.mount(_elementNode, _targetDOMElement);

      _elementNode.tryEventScope('component-did-mount', {

      }, null, (_result) => {});
    });

  }

  // replaceRender = renderVirtual + mountByReplace
  static replaceRender(_elementNode, _targetDOMElement) {
    _elementNode.tryEventScope('component-will-mount', {

    }, null, (_result) => {

      this.renderVirtual(_elementNode);
      this.mountByReplace(_elementNode, _targetDOMElement);

      _elementNode.tryEventScope('component-did-mount', {

      }, null, (_result) => {});
    });

  }

  static createNode() {

  }

  static getNodeByDOM(_domElement) {
    if (!_domElement) throw new Error(`Could not get ElementNode. ${_domElement} is not DOMNode.`);
    if (_domElement.isElementNode) return _domElement;

    return _domElement.___en || null;
  }

  static registerAction(_name, _paramKeys, _anonymousActionFunction) {
    let actionStore = ActionStore.instance();

    actionStore.registerAction(_name, _paramKeys, _anonymousActionFunction);
  }

  static registerFunction(_name, _function) {
    let functionStore = FunctionStore.instance();

    functionStore.registerFunction(_name, _function);
  }

  static retrieveFunction(_name) {
    let functionStore = FunctionStore.instance();

    let functionO = functionStore.getFunction(_name);

    return functionO.executableFunction;
  }

  static get actionStore() {
    return ActionStore.instance();
  }

  static get functionStore() {
    return FunctionStore.instance();
  }

  static get APIRequest() {
    return APIRequest;
  }

  static get HTTPRequest() {
    return HTTPRequest;
  }

  static get Cookie() {
    return Cookie;
  }

  static get Shortcut() {
    return Shortcut;
  }

  // ElementNode 를 찾는다.
  static DirectAccess(_forfatherElement, _enID) {

  }

  // ElementNode 를 찾는다.
  static DirectAccessEN(_forfatherElementNode, _enID) {

  }

  static get Console() {
    return OConsole.instance();
  }

  // BindError 를 숨긴다.
  static ClearBindError() {
    window.CLEAR_BIND_ERROR = true;
  }

  // BindError를 표시한다.
  static OccursBindError() {
    window.CLEAR_BIND_ERROR = false;
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

  // fix
  static get ObjectExtends() {
    return ObjectExtends;
  }

  // fix
  static get ObjectExplorer() {
    return ObjectExplorer;
  }

  // fix
  static get Identifier() {
    return Identifier;
  }

  // fix
  static get ArrayHandler() {
    return ArrayHandler;
  }

  static get BrowserStorage() {
    return BrowserStorage;
  }

  static get Location() {
    return GeneralLocation;
  }

  static onTraceDebug() {
    Neutron.USE_TRACE_DEBUGGER = true;
  }

  static offTraceDebug() {
    Neutron.USE_TRACE_DEBUGGER = false;
  }

  /*
    ███████ ██   ██ ████████ ███████ ███    ██ ██████   █████  ██████  ██      ███████      ██████ ██       █████  ███████ ███████     ███████ ██   ██ ██████   ██████  ██████  ████████
    ██       ██ ██     ██    ██      ████   ██ ██   ██ ██   ██ ██   ██ ██      ██          ██      ██      ██   ██ ██      ██          ██       ██ ██  ██   ██ ██    ██ ██   ██    ██
    █████     ███      ██    █████   ██ ██  ██ ██   ██ ███████ ██████  ██      █████       ██      ██      ███████ ███████ ███████     █████     ███   ██████  ██    ██ ██████     ██
    ██       ██ ██     ██    ██      ██  ██ ██ ██   ██ ██   ██ ██   ██ ██      ██          ██      ██      ██   ██      ██      ██     ██       ██ ██  ██      ██    ██ ██   ██    ██
    ███████ ██   ██    ██    ███████ ██   ████ ██████  ██   ██ ██████  ███████ ███████      ██████ ███████ ██   ██ ███████ ███████     ███████ ██   ██ ██       ██████  ██   ██    ██
  */

  static get ElementNode() {
    return ElementNode;
  }

  static get HTMLElementNode() {
    return HTMLElementNode;
  }

  static get RefElementNode() {
    return RefElementNode;
  }

  static get TagBaseElementNode() {
    return TagBaseElementNode;
  }

  static get StringElementNode() {
    return StringElementNode;
  }

  static get ElementNodeFactory() {
    return Factory;
  }

}

(function(window, Neutron){
  window.O = function O(_seed){
    var nodeList;
    if( typeof _seed === 'string' ){
      nodeList = document.querySelectorAll(_seed);
    } else if( typeof _seed === 'object' && _seed ){
      if( _seed instanceof Array ){

        nodeList = _seed;
      } else {
        nodeList = [_seed];
      }
    } else {
      throw new Error("Not supported type.");
    }





    return new MultipleContext(nodeList);
  };

  window.O = O.bind(window);

  function MultipleContext(_domList){
    Array.apply(this, []);
    this.orients = [];
    this.outterofbound = [];

    for( let i = 0; i < _domList.length ; i++ ){

      if( Neutron.getNodeByDOM(_domList[i]) ){
        this.push(Neutron.getNodeByDOM(_domList[i]));
        this.orients.push(Neutron.getNodeByDOM(_domList[i]));
      } else {
        this.outterofbound.push(i);
      }
    }
  }

  MultipleContext.prototype.push = Array.prototype.push;
  MultipleContext.prototype.pop = Array.prototype.pop;
  MultipleContext.prototype.shift = Array.prototype.shift;
  MultipleContext.prototype.unshift = Array.prototype.unshift;
  MultipleContext.prototype.filter = Array.prototype.filter;
  MultipleContext.prototype.reduce = Array.prototype.reduce;

  MultipleContext.prototype.setAttrR = function(){
    let roofArgs = arguments;

    this.each(function(){
      this.setAttrR.apply(this, roofArgs);
    });

    return this;
  }

  MultipleContext.prototype.getAttrR = function(){
    let roofArgs = arguments;

    return this.map(function(){
      return this.getAttrR.apply(this, roofArgs);
    });
  }

  MultipleContext.prototype.setValue = function(){
    let roofArgs = arguments;

    this.each(function(){
      this.setValue.apply(this, roofArgs);
    })
  }

  MultipleContext.prototype.getValue = function(){
    let roofArgs = arguments;

    return this.map(function(){
      return this.getValue.apply(this, roofArgs);
    });
  }

  MultipleContext.prototype.dom = function(){
    let roofArgs = arguments;

    return this.map(function(){
      return this.dom();
    });
  }

  MultipleContext.prototype.update = function(){
    let roofArgs = arguments;

    this.each(function(){
      this.update.apply(this, roofArgs);
    });
  }

  MultipleContext.prototype.addRuntimeEventListener = function(){
    let roofArgs = arguments;

    this.each(function(){
      this.addRuntimeEventListener.apply(this, roofArgs);
    });
  }

  MultipleContext.prototype.removeRuntimeEventListener = function(){
    let roofArgs = arguments;

    this.each(function(){
      this.removeRuntimeEventListener.apply(this, roofArgs);
    });
  }

  MultipleContext.prototype.render = function(){
    let roofArgs = arguments;

    this.each(function(){
      this.render.apply(this, roofArgs);
    });
  }

  MultipleContext.prototype.executeDC = function(){
    let roofArgs = arguments;

    this.each(function(){
      this.executeDC.apply(this, roofArgs);
    });
  }

  MultipleContext.prototype.executeDCReadyNotice = function(){
    let roofArgs = arguments;

    this.each(function(){
      this.executeDCReadyNotice.apply(this, roofArgs);
    });
  }

  MultipleContext.prototype.interpret = function(){
    let roofArgs = arguments;

    this.each(function(){
      this.interpret.apply(this, roofArgs);
    });
  }

  MultipleContext.prototype.executeTask = function(){
    let roofArgs = arguments;

    this.each(function(){
      this.executeTask.apply(this, roofArgs);
    });
  }

  MultipleContext.prototype.each = function(_func){

    for(let i = 0; i < this.length; i++ ){
      _func.apply(this[i], [this[i]]);
    }
  }

  MultipleContext.prototype.map = function(_func){
    let result = [];
    for(let i = 0; i < this.length; i++ ){
      result.push(_func.apply(this[i], [this[i]]));
    }

    return result;
  }

  MultipleContext.prototype.st = function(_n){
    return this[_n || 0];
  }

})(window, Neutron);






Neutron.version = VERSION;


export default window.Orient = Neutron;
