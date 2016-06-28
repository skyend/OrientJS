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

let CLEAR_BIND_ERROR = false;

const VERSION = '0.16.7';

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

*/


window.$$ = function(_message, _data) {
  console.log(_message, ' - ', _data);

  window.test = _data;
}


class Neutron {


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

Neutron.version = VERSION;

export default window.Orient = Neutron;