"use strict";
import ElementNode from './ElementNode.js';
import _ from 'underscore';

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
    this.attributes[_name] = _value;
  }

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


  createRealizationNode() {
    let htmlDoc = this.environment.getHTMLDocument();

    this.setRealization(htmlDoc.createElement(this.getTagName() || 'div'))
  }

  mappingAttributes2(_domNode, _options) {
    let attributes = this.getAttributes();

    let attributeKeys = Object.keys(attributes);
    let key;

    for (let i = 0; i < attributeKeys.length; i++) {
      key = attributeKeys[i];
      switch (key) {
        case "tagName":
          break;
        default:
          this.mappingAttribute2(key, _options);
      }
    }

    var currentRect = this.getCurrentRectangle();
    let rectKeys = Object.keys(currentRect);
    let rectKey;
    for (let i = 0; i < rectKeys.length; i++) {
      rectKey = rectKeys[i];
      if (/^\d+/.test(currentRect[rectKey])) {
        this.realization.style[rectKey] = currentRect[rectKey];
      }
    }

    if (this.getControl('repeat-n'))
      this.realization.setAttribute('en-ctrl-repeat-n', this.getControl('repeat-n'));
    if (this.getControl('hidden'))
      this.realization.setAttribute('en-ctrl-hidden', this.getControl('hidden'));
    if (this.getName())
      this.realization.setAttribute('en-name', this.getName());
    if (this.isDynamicContext)
      this.realization.setAttribute('en-dynamic-context', this.isDynamicContext);
    if (this.dynamicContextSID)
      this.realization.setAttribute('en-dc-source-id', this.dynamicContextSID);
    if (this.dynamicContextRID)
      this.realization.setAttribute('en-dc-request-id', this.dynamicContextRID);
    if (this.dynamicContextNS)
      this.realization.setAttribute('en-dc-ns', this.dynamicContextNS);
    if (this.dynamicContextInjectParams)
      this.realization.setAttribute('en-dc-inject-params', this.dynamicContextInjectParams);
  }

  /*
    CreateNode
      HTMLNode를 생성한다.
  */
  createNode() {
    let htmlDoc = this.environment.getHTMLDocument();

    return htmlDoc.createElement(this.getTagName() || 'div');
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
        _e.preventDefault();

        let targetNavigate = _e.target.getAttribute('data-navigate');
        console.log(self.environment);
        if (self.environment.enableNavigate) {

          self.navigateHandling(targetNavigate);
        }
      }
    } else {

      this.realization.onclick = function(_e) {
        _e.preventDefault();
      }

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

    if (this.getRealization() !== null) {
      this.getRealization().removeAttribute(_attrName);
    }
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
    let ignoreAttrFields = _.union(['__vid__', 'en-id', 'en-type', 'en-dynamic-context', 'en-dc-source-id', 'en-dc-request-id', 'en-dc-ns', 'en-ctrl-repeat-n', 'en-ctrl-hidden'], _ignoreAttrFields || []);

    this.copyAllAtrributeFromDOMElement(_domElement, ignoreAttrFields);
    if (this.realization === null) this.realization = _domElement;

    if (_domElement.getAttribute('en-id') !== null)
      this.setId(_domElement.getAttribute('en-id'));

    if (_domElement.getAttribute('en-ctrl-repeat-n') !== null)
      this.setControl('repeat-n', _domElement.getAttribute('en-ctrl-repeat-n'));

    if (_domElement.getAttribute('en-ctrl-hidden') !== null)
      this.setControl('hidden', _domElement.getAttribute('en-ctrl-hidden'));

    if (_domElement.getAttribute('name') !== null)
      this.setName(_domElement.getAttribute('name'));

    if (_domElement.getAttribute('en-dynamic-context') !== null)
      this.isDynamicContext = _domElement.getAttribute('en-dynamic-context');

    if (_domElement.getAttribute('en-dc-source-id') !== null)
      this.dynamicContextSID = _domElement.getAttribute('en-dc-source-id');

    if (_domElement.getAttribute('en-dc-request-id') !== null)
      this.dynamicContextRID = _domElement.getAttribute('en-dc-request-id');

    if (_domElement.getAttribute('en-dc-inject-params') !== null)
      this.dynamicContextInjectParams = _domElement.getAttribute('en-dc-inject-params');

    if (_domElement.getAttribute('en-dc-ns') !== null)
      this.dynamicContextNS = _domElement.getAttribute('en-dc-ns');

    if (this.isDynamicContext === 'true')
      this.buildDynamicContext();
  }



  copyAllAtrributeFromDOMElement(_domElement, _ignoreAttrFields) {
    this.setTagName(_domElement.nodeName);

    // __vid__ attribute를 제외하고 요소의 모든 attribute를 카피한다.
    var attributes = _domElement.attributes;
    let attrName;
    let attrValue;
    for (var i = 0; i < attributes.length; i++) {
      attrName = attributes[i].name;
      if (_.findIndex(_ignoreAttrFields, (_name) => {
          return attrName.toLowerCase() === _name.toLowerCase();
        }) != -1) continue;

      this.setAttribute(attributes[i].name, attributes[i].nodeValue);
    }
  }


  mappingEvent() {
    // Todo.....

  }

  mappingAttributes(_skipResolve) {
    let attributes = this.getAttributes();

    let attributeKeys = Object.keys(attributes);
    let key;

    for (let i = 0; i < attributeKeys.length; i++) {
      key = attributeKeys[i];
      switch (key) {
        case "tagName":
          break;
        default:
          this.mappingAttribute(key, _skipResolve);
      }
    }

    var currentRect = this.getCurrentRectangle();
    let rectKeys = Object.keys(currentRect);
    let rectKey;
    for (let i = 0; i < rectKeys.length; i++) {
      rectKey = rectKeys[i];
      if (/^\d+/.test(currentRect[rectKey])) {
        this.realization.style[rectKey] = currentRect[rectKey];
      }
    }

    // skipResolve 옵션이 걸려있다면 text-transform 를 해제한다. 대소문자
    if (_skipResolve && this.type !== 'string') {
      this.realization.style.textTransform = 'none';
    }



    if (this.getControl('repeat-n'))
      this.realization.setAttribute('en-ctrl-repeat-n', this.getControl('repeat-n'));
    if (this.getControl('hidden'))
      this.realization.setAttribute('en-ctrl-hidden', this.getControl('hidden'));
    if (this.getName())
      this.realization.setAttribute('en-name', this.getName());
    if (this.isDynamicContext)
      this.realization.setAttribute('en-dynamic-context', this.isDynamicContext);
    if (this.dynamicContextSID)
      this.realization.setAttribute('en-dc-source-id', this.dynamicContextSID);
    if (this.dynamicContextRID)
      this.realization.setAttribute('en-dc-request-id', this.dynamicContextRID);
    if (this.dynamicContextNS)
      this.realization.setAttribute('en-dc-ns', this.dynamicContextNS);
    if (this.dynamicContextInjectParams)
      this.realization.setAttribute('en-dc-inject-params', this.dynamicContextInjectParams);
  }

  mappingAttribute(_attrName, _skipResolve) {
    if (/\w+/.test(_attrName))
      this.realization.setAttribute(_attrName, _skipResolve ? this.getAttribute(_attrName) : this.getAttributeWithResolve(_attrName));
  }

  mappingAttribute2(_attrName, _options) {
    let options = _options || {};

    this.realization.setAttribute(_attrName, options.skipResolve ? this.getAttribute(_attrName) : this.getAttributeWithResolve(_attrName));
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
    result.attributes = _.clone(this.getAttributes());
    result.rectangle = _.clone(this.getRectangle());
    result.zIndex = this.zIndex;
    result.tagName = this.getTagName();
    result.inherentCSS = this.getCSS(); // empty 타입을 제외하고 모든 요소의 고유CSS를 익스포트한다.
    return result;
  }
}

export default TagBaseElementNode;