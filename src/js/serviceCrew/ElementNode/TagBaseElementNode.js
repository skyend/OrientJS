"use strict";
import ElementNode from './ElementNode.js';
import _ from 'underscore';

class TagBaseElementNode extends ElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps) {
    super(_environment, _elementNodeDataObject, _preInsectProps);
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
    switch (this.environment.contextController.getScreenSizing()) {
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

  setRectanglePart(_partValue, _partName) {
    var rectangleRef = this.getCurrentRectangle();

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
    this.realization = htmlDoc.createElement(this.getTagName() || 'div');
    //console.log(this.getTagName());
    this.realization.___en = this;
    this.realization.setAttribute('___id___', this.id);
  }

  // realize
  realize(_realizeOptions) {
    super.realize(_realizeOptions);
    this.createRealizationNode();



    let realizeOptions = _realizeOptions || {};

    // attribute 매핑
    this.mappingAttributes(realizeOptions.skipResolve);




    // 이벤트 매핑
    this.mappingEvent();

    this.mappingNavigate();
  }

  mappingNavigate() {
    // navigate

    if (this.realization.getAttribute('data-navigate') !== undefined && this.realization.getAttribute('data-navigate') !== null) {
      let navigate = this.realization.getAttribute('data-navigate');
      let self = this;

      this.realization.onclick = function(_e) {
        _e.preventDefault();

        let targetNavigate = _e.target.getAttribute('data-navigate');

        self.navigateHandling(targetNavigate);
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


  changeTextEditMode() {
    this.mode = 'textEdit';
    //this.getRealization().setAttribute("contenteditable", 'true');
  }


  changeNormalMode() {
    if (this.mode === 'textEdit') {
      this.updateSyncDOMChanged();
    }

    this.mode = 'normal';
    this.getRealization().removeAttribute("contenteditable");
  }

  isTextEditMode() {
    return this.mode === 'textEdit';
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

  buildByElement(_domElement) {
    this.copyAllAtrributeFromDOMElement(_domElement);

  }


  copyAllAtrributeFromDOMElement(_domElement) {
    this.setTagName(_domElement.nodeName);

    // __vid__ attribute를 제외하고 요소의 모든 attribute를 카피한다.
    var attributes = _domElement.attributes;
    let attrName;
    let attrValue;
    for (var i = 0; i < attributes.length; i++) {
      attrName = attributes[i].name;
      if (/^__vid__$/.test(attrName)) continue;

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

    if (this.isTextEditMode()) {
      this.realization.setAttribute('contenteditable', true);
    }
  }

  mappingAttribute(_attrName, _skipResolve) {
    this.realization.setAttribute(_attrName, _skipResolve ? this.getAttribute(_attrName) : this.getAttributeWithResolve(_attrName));
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