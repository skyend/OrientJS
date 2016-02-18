import ElementNode from './ElementNode.js';
import _ from 'underscore';
import Gelato from '../StandAloneLib/Gelato';
"use strict";


const DOMEvents = [
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



class TagBaseElementNode extends ElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps, _dynamicContext) {
    super(_environment, _elementNodeDataObject, _preInsectProps, _dynamicContext);
    this.tagName;
    this.attributes;
    this.css;
    this.rectangle; // 영역 정보 { width: (px|%|remain|auto), height:(px|%|remain|auto), shift-(left|right|top|bottom): (px|%),} // shift : 지정 값만큼 해당방향으로 밀어준다
    // remain : 부모의 영역중 자신외의 다른 child가 차지하는 공간을 모두 합하여 부모의 영역에서 그만큼 감소 시켰을 때 남은 값
    this.phase; // 위상 자신의 위치정보를 가진다. { horizon: (px|%|left|center|top), vertical: (px|%|top|middle|bottom) }

    if (typeof _elementNodeDataObject !== 'object') {
      // 새 엘리먼트가 생성되었다.
      this.attributes = {};
      this.children = [];
    }
  }


  get behavior() {
    return this._behavior;
  }

  // Getters
  // element.tagName -> getTagName()
  getTagName() {
    return this.tagName || 'div';
  }

  // attribute
  getAttribute(_name) {
    return this.attributes[_name];
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
    switch (this.environment.getScreenSizing()) {
      case "desktop":
        return this.rectangle['desktop'];
      case "tablet":
        return this.rectangle['tablet'];
      case "mobile":
        return this.rectangle['mobile'];
    }
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

  // Inline Style
  setInlineStyle(_style) {
    this.setAttribute('style', _style);
  }

  setRectangle(_rectangle) {
    this.rectangle = _rectangle;
  }

  // attribute
  setAttribute(_name, _value) {
    this.attributes = this.attributes || {};

    this.attributes[_name] = _value;
  }

  // setAttributeWithEvent(_name, _value){
  //   this.setAttribute(_name, _value)
  // }

  // attributes
  setAttributes(_attributes) {
    this.attributes = _attributes;
  }

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
    let attributes = this.getAttributes();

    let attributeKeys = Object.keys(attributes);
    let key;

    for (let i = 0; i < attributeKeys.length; i++) {
      key = attributeKeys[i];
      this.mappingAttribute(_domNode, key, _options);
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

    // #DynamicContext
    if (this.dynamicContextSID)
      _domNode.setAttribute('en-dc-source-id', this.dynamicContextSID);
    if (this.dynamicContextRID)
      _domNode.setAttribute('en-dc-request-id', this.dynamicContextRID);
    if (this.dynamicContextNS)
      _domNode.setAttribute('en-dc-ns', this.dynamicContextNS);
    if (this.dynamicContextInjectParams)
      _domNode.setAttribute('en-dc-inject-params', this.dynamicContextInjectParams);

    // #Events
    // dom defaults events
    if (this.getEvent('click'))
      _domNode.setAttribute('en-event-click', this.getEvent('click'));
    if (this.getEvent('mouseenter'))
      _domNode.setAttribute('en-event-mouseenter', this.getEvent('mouseenter'));
    if (this.getEvent('complete-bind'))
      _domNode.setAttribute('en-event-complete-bind', this.getEvent('complete-bind'));
  }

  mappingAttribute(_dom, _attrName, _options) {
    let options = _options || {};
    console.log(_attrName);
    _dom.setAttribute(_attrName, options.resolve ? this.getAttributeWithResolve(_attrName) : this.getAttribute(_attrName));
  }




  /*
    CreateNode
      HTMLNode를 생성한다.
  */
  createNode() {

    let htmlDoc;

    let gelato = Gelato.one();
    if (gelato !== null) {
      htmlDoc = gelato.page.doc;
    } else {
      htmlDoc = this.environment.getHTMLDocument();
    }

    return htmlDoc.createElement(this.getTagName() || 'div');
  }


  applyForward() {
    let oldAttributes = this.forwardDOM.attributes;
    let newAttributes = this.backupDOM.attributes;
    let attrName;
    let attrValue;

    // 사라질 예정의 attribute제거
    for (let i = 0; i < oldAttributes.length; i++) {
      attrName = oldAttributes[i].nodeName;
      attrValue = oldAttributes[i].nodeValue;

      // backupDOM 에 attribute가 없으면 forwardDOM의 attribute를 제거한다.
      if (!this.backupDOM.getAttribute(attrName)) {
        this.forwardDOM.removeAttribute(attrName);
      }
    }

    // 변경된 attribute반영
    for (let i = 0; i < newAttributes.length; i++) {
      attrName = newAttributes[i].nodeName;
      attrValue = newAttributes[i].nodeValue;

      if (this.forwardDOM.getAttribute(attrName) !== attrValue) {
        this.forwardDOM.setAttribute(attrName, attrValue);
      }

      if (attrName === 'value')
        this.forwardDOM.value = attrValue;
    }

    //this.backupDOM = null;
  }

  // realize
  realize(_realizeOptions, _complete) {
    let that = this;

    super.realize(_realizeOptions, function(_result) {
      if (_result === false) {
        that.realization = null;
        return _complete(_result);
      }

      that.createRealizationNode();

      let realizeOptions = _realizeOptions || {};

      // attribute 매핑
      that.mappingAttributes(realizeOptions.skipResolve);

      // 이벤트 매핑
      that.mappingEvent();

      that.mappingNavigate();

      _complete();
    });
  }


  mappingNavigate() {
    // navigate

    if (this.realization.getAttribute('data-navigate') !== undefined && this.realization.getAttribute('data-navigate') !== null) {
      let navigate = this.realization.getAttribute('data-navigate');
      let self = this;

      this.realization.onclick = function(_e) {
        //_e.preventDefault();

        let targetNavigate = _e.target.getAttribute('data-navigate');
        console.log(self.environment);
        if (self.environment.enableNavigate) {

          self.navigateHandling(targetNavigate);
        }
      }
    } else {

      // this.realization.onclick = function(_e) {
      //   _e.preventDefault();
      // }

    }

  }

  navigateHandling(_navigate) {
    this.environment.contextController.serviceManager.navigateService(_navigate);
  }

  valueWithUnitSeperator(_value) {

  }


  ///////////
  // Remove Attribute
  removeAttribute(_attrName) {
    delete this.attributes[_attrName];
  }


  //////////
  // Remove Attribute
  renameAttribute(_prevName, _nextName) {
    var fieldData = this.getAttribute(_prevName);
    this.removeAttribute(_prevName);
    this.setAttribute(_nextName, fieldData);

    this.applyAttributesToRealDOM();
  }

  buildByElement(_domElement, _ignoreAttrFields) {
    let ignoreAttrFields = _.union(['__vid__',

      // Normals
      'en-id',
      'en-type',
      'en-behavior',
      'en-name'

      // DynamicContext
      // 'en-dc-source-id',
      // 'en-dc-request-id',
      // 'en-dc-inject-params',
      // 'en-dc-ns'

      // Controls
      // 'en-ctrl-repeat-n',
      // 'en-ctrl-hidden'

      // Events
      // 'en-event-click',
      // 'en-event-mouseenter',
      // 'en-event-complete-bind'

    ], _ignoreAttrFields || []);


    this.copyAllAtrributeFromDOMElement(_domElement, ignoreAttrFields);

    if (this.realization === null) this.realization = _domElement;

    // Normals
    if (_domElement.getAttribute('en-id') !== null) {
      if (/@/.test(_domElement.getAttribute('en-id'))) {
        throw new Error("ElementNode Id로 @가 사용 될 수 없습니다.");
      }

      this.setId(_domElement.getAttribute('en-id'));
    }

    if (_domElement.getAttribute('en-type') !== null)
      this.setType(_domElement.getAttribute('en-type'));

    if (_domElement.getAttribute('en-behavior') !== null)
      this.behavior = _domElement.getAttribute('en-behavior');

    if (_domElement.getAttribute('en-name') !== null)
      this.setName(_domElement.getAttribute('en-name'));

    // DynamicContext
    if (_domElement.getAttribute('en-dc-source-id') !== null)
      this.dynamicContextSID = _domElement.getAttribute('en-dc-source-id');

    if (_domElement.getAttribute('en-dc-request-id') !== null)
      this.dynamicContextRID = _domElement.getAttribute('en-dc-request-id');

    if (_domElement.getAttribute('en-dc-inject-params') !== null)
      this.dynamicContextInjectParams = _domElement.getAttribute('en-dc-inject-params');

    if (_domElement.getAttribute('en-dc-ns') !== null)
      this.dynamicContextNS = _domElement.getAttribute('en-dc-ns');

    // Controls
    if (_domElement.getAttribute('en-ctrl-repeat-n') !== null)
      this.setControl('repeat-n', _domElement.getAttribute('en-ctrl-repeat-n'));

    if (_domElement.getAttribute('en-ctrl-hidden') !== null)
      this.setControl('hidden', _domElement.getAttribute('en-ctrl-hidden'));

    // Event reads
    // 모든 DOM 이벤트를 인식한다.
    for (let i = 0; i < DOMEvents.length; i++) {
      if (_domElement.getAttribute(`en-event-${DOMEvents[i]}`) !== null) // Click
        this.setEvent(DOMEvents[i], _domElement.getAttribute(`en-event-${DOMEvents[i]}`));
    }

    // Gelato Events
    // done
    if (_domElement.getAttribute('en-event-will-update') !== null) // will Update
      this.setEvent('will-update', _domElement.getAttribute('en-event-will-update'));
    // done
    if (_domElement.getAttribute('en-event-did-update') !== null) // did Update
      this.setEvent('did-update', _domElement.getAttribute('en-event-did-update'));
    // done
    if (_domElement.getAttribute('en-event-will-refresh') !== null) // will refresh
      this.setEvent('will-refresh', _domElement.getAttribute('en-event-will-refresh'));
    // done
    if (_domElement.getAttribute('en-event-did-refresh') !== null) // did refresh
      this.setEvent('did-refresh', _domElement.getAttribute('en-event-did-refresh'));

    //done
    if (_domElement.getAttribute('en-event-will-dc-request') !== null) // will DC request
      this.setEvent('will-dc-request', _domElement.getAttribute('en-event-will-dc-request'));

    // done
    if (_domElement.getAttribute('en-event-complete-bind') !== null) // Complete Bind
      this.setEvent('complete-bind', _domElement.getAttribute('en-event-complete-bind'));

    // done
    if (_domElement.getAttribute('en-event-will-hide') !== null) // will hide
      this.setEvent('will-hide', _domElement.getAttribute('en-event-will-hide'));

    // done
    if (_domElement.getAttribute('en-event-will-show') !== null) // will show
      this.setEvent('will-show', _domElement.getAttribute('en-event-will-show'));


    // 보류
    // if (_domElement.getAttribute('en-event-will-value-change') !== null) // will  value change
    //   this.setEvent('will-value-change', _domElement.getAttribute('en-event-will-value-change'));
    //
    // if (_domElement.getAttribute('en-event-did-value-change') !== null) // did value change
    //   this.setEvent('did-value-change', _domElement.getAttribute('en-event-did-value-change'));
    //
    // if (_domElement.getAttribute('en-event-will-attr-change') !== null) // will attr change
    //   this.setEvent('will-value-change', _domElement.getAttribute('en-event-will-attr-change'));
    //
    // if (_domElement.getAttribute('en-event-did-attr-change') !== null) // did attr change
    //   this.setEvent('did-value-change', _domElement.getAttribute('en-event-did-attr-change'));

  }



  copyAllAtrributeFromDOMElement(_domElement, _ignoreAttrFields) {
    this.setTagName(_domElement.nodeName);

    // __vid__ attribute를 제외하고 요소의 모든 attribute를 카피한다.
    var attributes = _domElement.attributes;
    let attrName;
    let attrValue;
    for (var i = 0; i < attributes.length; i++) {
      attrName = attributes[i].name;
      // if (_.findIndex(_ignoreAttrFields, (_name) => {
      //     return attrName.toLowerCase() === _name.toLowerCase();
      //   }) != -1) continue;

      // en 으로 시작하는 모든 attribute 는 무시한다.
      if (/^en-/.test(attrName)) continue;

      this.setAttribute(attrName, attributes[i].nodeValue);
    }
  }


  mappingEvent() {
    // Todo.....

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
    this.tagName = _elementNodeDataObject.tagName;
    this.behavior = _elementNodeDataObject.behavior;
    this.attributes = _elementNodeDataObject.attributes || {};
    this.zIndex = _elementNodeDataObject.zIndex;
    this.rectangle = _elementNodeDataObject.rectangle || {
      desktop: {},
      tablet: {},
      mobile: {}
    }
  }

  export (_withoutId) {
    let result = super.export(_withoutId);
    result.behavior = this.behavior;
    result.attributes = _.clone(this.getAttributes());
    result.rectangle = _.clone(this.getRectangle());
    result.zIndex = this.zIndex;
    result.tagName = this.getTagName();
    result.inherentCSS = this.getCSS(); // empty 타입을 제외하고 모든 요소의 고유CSS를 익스포트한다.
    return result;
  }
}

export default TagBaseElementNode;