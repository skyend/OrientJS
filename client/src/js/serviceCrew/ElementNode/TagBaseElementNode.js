import ElementNode from './ElementNode.js';
import ObjectExtends from '../../util/ObjectExtends';
import MetaText from '../Data/MetaText';
import ArrayHandler from '../../util/ArrayHandler';

"use strict";

const PIPE_EVENT_SPLIT_REGEXP = /^en-pipe-event-([\w\-\_\d]+)$/;
const METHOD_SPLIT_REGEXP = /^en-method-([\w\-\_\d\$]+)$/;

const DOM_EVENTS = [
  // Mouse Events
  'click',
  'contextmenu',
  'dblclick',
  'mousedown',
  'mouseenter',
  'mouseleave',
  'mousemove',
  'mouseover',
  'mouseout',
  'mouseup',

  // Keyboard Events
  'keydown',
  'keypress',
  'keyup',

  // Frame/Object Events
  'abort',
  'beforeunload',
  'error',
  'hashchange',
  'load',
  'pageshow',
  'pagehide',
  'resize',
  'scroll',
  'unload',

  // Form Events
  'blur',
  'change',
  'focus',
  'focusin',
  'focusout',
  'input',
  'invalid',
  'reset',
  'search',
  'select',
  'submit',

  // Drag Events
  'drag',
  'dragend',
  'dragenter',
  'dragleave',
  'dragover',
  'dragstart',
  'drop',

  // Clipboard Events
  'copy',
  'cut',
  'paste',

  // Print Events
  'afterprint',
  'beforeprint',

  // Media Events
  'abort',
  'canplay',
  'canplaythrough',
  'durationchange',
  'emptied',
  'ended',
  'error',
  'loadeddata',
  'loadedmetadata',
  'loadstart',
  'pause',
  'play',
  'playing',
  'progress',
  'ratechange',
  'seeked',
  'seeking',
  'stalled',
  'suspend',
  'timeupdate',
  'volumechange',
  'waiting',

  // Animation Events
  'animationend',
  'animationiteration',
  'animationstart',

  // Transition Events
  'transitionend',

  // Server-Sent Events
  'error',
  'message',
  'open',

  // Misc Events
  'message',
  'mousewheel',
  'online',
  'offline',
  'popstate',
  'show',
  'storage',
  'toggle',
  'wheel',

  // Touch Events
  'touchcancel',
  'touchend',
  'touchmove',
  'touchstart'
];

const ELEMENT_NODE_EVENTS = [
  "will-update",
  "did-update",

  "will-refresh",
  "did-refresh",

  "will-dc-request",
  "will-dc-request-join",
  "will-dc-bind",
  "will-dc-bind-join",

  "dc-did-load",
  "dc-fail-load",

  "complete-bind",
  "complete-bind-join",

  "first-rendered", // -> component-did-mount
  "io-received",
  "io-sent",

  "component-will-update",
  "component-did-update",

  "component-will-mount",
  "component-did-mount",

  "ref-did-mount",
  "ref-will-mount",

];

var SUPPORT_HTML_TAG_STYLES = {};
try {
  if (window) {
    SUPPORT_HTML_TAG_STYLES = ObjectExtends.clone(window.document.head.style);
  }
} catch (_e) {
  console.warn('Window is not declared');
}


class TagBaseElementNode extends ElementNode {
  constructor(_environment, _elementNodeDataObject, _preInjectProps, _isMaster) {
    super(_environment, _elementNodeDataObject, _preInjectProps, _isMaster);
    if (Orient.bn === 'ie' && Orient.bv <= 10) {
      ElementNode.call(this, _environment, _elementNodeDataObject, _preInjectProps, _isMaster);
    }

    this.tagName;
    this.attributes;
    this.css;

    // remain : 부모의 영역중 자신외의 다른 child가 차지하는 공간을 모두 합하여 부모의 영역에서 그만큼 감소 시켰을 때 남은 값
    this.phase; // 위상 자신의 위치정보를 가진다. { horizon: (px|%|left|center|top), vertical: (px|%|top|middle|bottom) }


    if (typeof _elementNodeDataObject !== 'object') {
      // 새 엘리먼트가 생성되었다.
      this.attributes = [];
      this.children = [];
    }
  }


  test() {
    super.test();
    console.log('test tagbase');
  }

  get behavior() {
    return this._behavior;
  }

  // Getters
  // element.tagName -> getTagName()
  getTagName() {
    return this.tagName || 'div';
  }

  hasAttribute(_name) {
    return this.findAttributeIndex(_name) !== -1;
  }

  findAttributeIndex(_name) {

    return ArrayHandler.findIndex(this.getAttributes(), function(_v) {
      return _v.name === _name;
    });
  }

  // attribute
  getAttribute(_name) {
    let foundIndex = this.findAttributeIndex(_name);

    if (foundIndex !== -1) {
      return this.attributes[foundIndex].variable;
    }

    console.error(`ElementNode#${this.id} 의 Attribute '${_name}' 가 정의되지 않았습니다. ${this.DEBUG_FILE_NAME_EXPLAIN}`);
  }


  getAttributeWithResolve(_attrName) {
    return this.interpret(this.getAttribute(_attrName));
  }

  // id
  getIdAtrribute() {
    return this.getAttribute('id');
  }

  // classes
  getClasses() {
    return this.getAttribute('class');
  }

  // attributes
  getAttributes() {
    return this.attributes;
  }

  // Inline Style
  getInlineStyle() {
    return this.getAttribute('style');
  }

  getRectangle() {
    return this.rectangle;
  }

  getBoundingRect() {

    var boundingRect;
    var realElement = this.getRealization();

    boundingRect = realElement.getBoundingClientRect();

    return boundingRect;
  }

  getCurrentRectangle() {
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

  getRectangleByScreenMode(_screenMode) {
    return this.rectangle[_screenMode];
  }

  get zIndex() {
    return this._zIndex;
  }

  set behavior(_behavior) {
    this._behavior = _behavior;
  }

  // Setters
  // Id Atrribute
  setIdAtrribute(_id) {
    this.setAttribute('id', _id);
  }

  // tagName
  setTagName(_tagName) {
    this.tagName = _tagName;
  }

  // classes
  setClasses(_classes) {
    this.setAttribute('class', _classes);
  }

  // css
  setCSS(_css) {
    this.css = _css;
  }

  // tstyle 에 저장된 내용은 랜더링 시에 반영된다.
  // Temporary Style
  setTStyle(_name, _value) {

    this.tstyle = this.tstyle || {};
    this.tstyle[_name] = _value;
  }

  delTStyle(_name) {
    delete this.tstyle[_name];

    let styleKeys = Object.keys(this.tstyle);

    if (styleKeys.length === 0) {
      this.tstyle = null;
    }
  }

  // attribute
  setAttribute(_name, _value) {
    let that = this;

    let foundIndex = this.findAttributeIndex(_name);

    if (foundIndex !== -1) {
      this.attributes[foundIndex].variable = _value;
    } else {
      console.warn(`ElementNode#${this.id} 의 '${_name}' attribute 가 정의되지 않았습니다. 정의되지 않은 Attribute의 값을 변경할 수 없습니다. ${this.DEBUG_FILE_NAME_EXPLAIN}`);
    }
  }

  setInitialAttribute(_name, _initValue) {
    let foundIndex = this.findAttributeIndex(_name);

    if (foundIndex !== -1) {
      this.attributes[foundIndex].seed = _initValue;
    } else {
      console.warn(`ElementNode#${this.id} 의 '${_name}' attribute 가 정의되지 않았습니다. 새 Attribute를 생성합니다. ${this.DEBUG_FILE_NAME_EXPLAIN}`);
      this.defineNewAttribute(_name, _initValue);
    }
  }

  defineNewAttribute(_name, _initialValue) {
    let that = this;

    let duplIndex = this.findAttributeIndex(_name);


    if (duplIndex === -1) {
      let newAttribute = new MetaText({
        name: _name,
        seed: _initialValue
      });

      this.attributes.push(newAttribute);
    } else {
      console.warn(`ElementNode#${this.id} 의 이미 있는 Attribute'${_name}'를 정의하려 합니다. 이 작업은 무시됩니다. ${this.DEBUG_FILE_NAME_EXPLAIN}`);
    }
  }

  // setAttributeWithEvent(_name, _value){
  //   this.setAttribute(_name, _value)
  // }

  setRectanglePartWithScreenMode(_partName, _partValue, _screenMode) {
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

  setRectanglePartWithKeepingUnit(_partValue, _partName) {
    //console.log(valueWithUnitSeperator(_partValue));
  }

  set zIndex(_zIndex) {
    this._zIndex = _zIndex;
  }

  mappingAttributes(_domNode, _options) {
    for (let i = 0; i < this.attributes.length; i++) {
      this.mappingAttribute(_domNode, this.attributes[i], _options);
    }

    var currentRect = this.getCurrentRectangle();
    let rectKeys = Object.keys(currentRect);
    let rectKey;
    for (let i = 0; i < rectKeys.length; i++) {
      rectKey = rectKeys[i];
      if (/^\d+/.test(currentRect[rectKey])) {
        _domNode.style[rectKey] = currentRect[rectKey];
      }
    }

    if (window.ORIENT_SHOW_SPECIAL_ATTRIBUTES) {
      // #Normals
      _domNode.setAttribute('en-id', this.getId());
      _domNode.setAttribute('en-type', this.getType());
      if (this.getName())
        _domNode.setAttribute('en-name', this.getName());
      if (this.behavior)
        _domNode.setAttribute('en-behavior', this.behavior);

      // #Controls
      if (this.getControl('repeat-n'))
        _domNode.setAttribute('en-ctrl-repeat-n', this.getControl('repeat-n'));
      if (this.getControl('hidden'))
        _domNode.setAttribute('en-ctrl-hidden', this.getControl('hidden'));
      if (this.getControl('fixed-container'))
        _domNode.setAttribute('en-ctrl-fixed-container', this.getControl('fixed-container'));

      // #DynamicContext
      if (this.dynamicContextSID)
        _domNode.setAttribute('en-dc-source-id', this.dynamicContextSID);
      if (this.dynamicContextPassive !== undefined)
        _domNode.setAttribute('en-dc-passive', String(this.dynamicContextPassive));
      if (this.dynamicContextRID)
        _domNode.setAttribute('en-dc-request-id', this.dynamicContextRID);
      if (this.dynamicContextNS)
        _domNode.setAttribute('en-dc-ns', this.dynamicContextNS);
      if (this.dynamicContextSync)
        _domNode.setAttribute('en-dc-sync', '');
      if (this.dynamicContextInjectParams)
        _domNode.setAttribute('en-dc-inject-params', this.dynamicContextInjectParams);

      if (this.dynamicContextLocalCache)
        _domNode.setAttribute('en-dc-local-cache', this.dynamicContextLocalCache);

      if (this.dynamicContextSessionCache)
        _domNode.setAttribute('en-dc-session-cache', this.dynamicContextSessionCache);

      // #Events
      // dom defaults events
      if (this.getEvent('click'))
        _domNode.setAttribute('en-event-click', this.getEvent('click'));

      if (this.getEvent('mouseenter'))
        _domNode.setAttribute('en-event-mouseenter', this.getEvent('mouseenter'));

      if (this.getEvent('complete-bind'))
        _domNode.setAttribute('en-event-complete-bind', this.getEvent('complete-bind'));
    }
  }

  mappingAttribute(_dom, _attribute, _options) {
    let options = _options || {};
    let value = options.resolve ? this.interpret(_attribute.byString) : _attribute.byString;
    let name = _attribute.name;

    // Temporary Style 적용
    if (this.tstyle) {
      ObjectExtends.mergeByRef(_dom.style, this.tstyle, true);
    }




    // value 의 최종 값이 null 이라면 Attribute가 아얘 추가되지 않도록 함수를 종료한다.
    if (value === null) return;

    switch (name) {
      case 'style':

        if (typeof value === 'object' && value !== undefined) {
          ObjectExtends.mergeByRef(_dom.style, value, true);
          return;
        }
        break;
      case 'value':
        _dom.value = value;
        break;
    }

    this.mappingAttributeDirect(_dom, name, value);
  }

  mappingAttributeDirect(_dom, _name, _value) {
    try {
      _dom.setAttribute(_name, _value);
    } catch (_e) {
      if (_e instanceof DOMException) {
        let error = new Error(`ElementNode#${this.id} 의 잘못 된 attribute명 입니다. origin:${_e.message} ${this.DEBUG_FILE_NAME_EXPLAIN}`, this.DEBUG_FILE_NAME);
        error.stack = _e.stack;

        console.info('Error Help :', _e, this.sourceElement, this.DEBUG_FILE_NAME_EXPLAIN);
        throw error;
      }

      throw _e;
    }
  }


  /*
    CreateNode
      HTMLNode를 생성한다.
  */
  createNode() {

    let htmlDoc;

    if (this.environment) {
      htmlDoc = this.environment.document;
    } else {
      htmlDoc = document;
    }

    return htmlDoc.createElement(this.getTagName() || 'div');
  }


  applyForward() {
    if (!(this.forwardDOM && this.backupDOM)) return console.warn('forwardDOM 또는 backupDOM이 존재하지 않습니다. applyForward 는 무시됩니다.');

    let oldAttributes = this.forwardDOM.attributes;
    let newAttributes = this.backupDOM.attributes;
    let attrName;
    let attrValue;

    // 사라질 예정의 attribute제거
    for (let i = 0; i < oldAttributes.length; i++) {
      attrName = oldAttributes[i].nodeName;
      attrValue = oldAttributes[i].nodeValue;

      // backupDOM 에 attribute가 없으면 forwardDOM의 attribute를 제거한다.
      if (!this.backupDOM.hasAttribute(attrName)) {
        this.forwardDOM.removeAttribute(attrName);

        if (attrName === 'value')
          this.forwardDOM.value = null;

        if (attrName === 'checked')
          this.forwardDOM.checked = null;

        if (attrName === 'selected-index')
          this.forwardDOM.selectedItem = null;
      }
    }

    // 변경된 attribute반영
    for (let i = 0; i < newAttributes.length; i++) {
      attrName = newAttributes[i].nodeName;
      attrValue = newAttributes[i].nodeValue;

      if (attrName === 'value' && this.forwardDOM.value !== attrValue) {
        this.forwardDOM.value = attrValue;
      }

      if (attrName === 'checked' && this.forwardDOM.checked !== attrValue) {
        this.forwardDOM.checked = attrValue;
      }

      if (attrName === 'selected-index' && this.forwardDOM.selectedIndex !== attrValue) {
        this.forwardDOM.selectedIndex = attrValue;
      }

      if (this.forwardDOM.getAttribute(attrName) !== attrValue) {
        this.forwardDOM.setAttribute(attrName, attrValue);
      }
    }

    this.forwardDOM.__renderstemp__ = this.renderSerialNumber;
    //this.backupDOM = null;
  }

  ///////////
  // Remove Attribute
  removeAttribute(_attrName) {
    let that = this;
    let newAttributes = [];
    let deleted = false;

    this.attributes = this.attributes.filter(function(_attribute) {

      if (_attribute.name !== _attrName) {
        return true;
      } else {
        deleted = true;
        return false;
      }
    });

    if (!deleted) {
      console.error(`정의되지 않은 Attribute ${_attrName} 를 제거하려 합니다.`);
    }
  }


  //////////
  // Remove Attribute
  renameAttribute(_prevName, _nextName) {
    let foundIndex = this.findAttributeIndex(_prevName);

    if (foundIndex !== -1) {
      this.attributes[foundIndex].name = _nextName;
    } else {
      console.error(`정의되지 않은 Attribute ${_prevName} 의 이름을 변경하려 합니다.`);
    }
  }

  buildByElement(_domElement, _absorbOriginDOM) {
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
      this.bindDOMEvents({}, _domElement);
    }

  }



  copyAllAtrributeFromDOMElement(_domElement) {
    this.setTagName(_domElement.nodeName);


    // __vid__ attribute를 제외하고 요소의 모든 attribute를 카피한다.
    var attributes = _domElement.attributes;
    let attrName;
    let attrValue;
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
            let matched;
            if (matched = attrName.match(PIPE_EVENT_SPLIT_REGEXP)) {

              this.setPipeEvent(matched[1], attrValue);
            } else if (matched = attrName.match(METHOD_SPLIT_REGEXP)) {

              this.setMethod(matched[1], attrValue);
            } else if (matched = attrName.match(/^en-event-([\w\-\_\d]+)$/)) { // normal

              this.setEvent(matched[1], attrValue);
            }
        }
      } else {

        this.defineNewAttribute(attrName, attrValue);
      }
    }
  }


  // 편집자에 의해 Rect가 변경될 떄
  transformRectByEditor(_left, _top, _width, _height) {

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



  import (_elementNodeDataObject) {
    super.import(_elementNodeDataObject);
    this.tagName = _elementNodeDataObject.tname;
    this.behavior = _elementNodeDataObject.beh;
    this.attributes = _elementNodeDataObject.a || [];
    this.attributes = this.attributes.map(function(_attributeO) {
      return new MetaText(_attributeO);
    });
  }

  export (_withoutId, _idAppender) {
    let result = super.export(_withoutId, _idAppender);
    result.beh = this.behavior;
    result.a = ObjectExtends.clone(this.attributes.map(function(_attribute) {
      return _attribute.export();
    }));


    result.tname = this.getTagName();
    return result;
  }
}

export default TagBaseElementNode;