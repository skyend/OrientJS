import ElementNode from './ElementNode.js';
import _ from 'underscore';

class TagBaseElementNode extends ElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps) {
    super(_environment, _elementNodeDataObject, _preInsectProps);
    this.tagName;
    this.attributes;
    this.css;
    this.rectangle;


    if (typeof _elementNodeDataObject !== 'object') {
      // 새 엘리먼트가 생성되었다.
      this.attributes = {};
      this.children = [];
    }
  }

  // Getters
  // element.tagName -> getTagName()
  getTagName() {
    return this.tagName;
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
    console.log(this);
    switch (this.environment.contextController.getScreenSizing()) {
      case "desktop":
        return this.rectangle['desktop'];
      case "tablet":
        return this.rectangle['tablet'];
      case "mobile":
        return this.rectangle['mobile'];
    }
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

    if (/^[\d\.]+$/.test(rectangleRef[_partName])) {
      // 숫자로만 이루어져 있을 경우
      rectangleRef[_partName] = _partValue;
    } else if (/^[\d\.]+((\w+)|%)$/.test(rectangleRef[_partName])) {
      // 숫자와 알파벳 또는 퍼센트로 이루어져 있을 경우
      this.setRectanglePartWithKeepingUnit(_partValue, _partName);
    } else {
      // 아무것도 해당되지 않을 경우
      rectangleRef[_partName] = _partValue;
    }
  }

  setRectanglePartWithKeepingUnit(_partValue, _partName) {
    console.log(valueWithUnitSeperator(_partValue));
  }


  createRealizationNode() {
    let htmlDoc = this.environment.getHTMLDocument();
    this.realization = htmlDoc.createElement(this.getTagName());
    console.log(this.getTagName());
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
    this.attributes = _elementNodeDataObject.attributes;
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
    result.tagName = this.getTagName();
    result.inherentCSS = this.getCSS(); // empty 타입을 제외하고 모든 요소의 고유CSS를 익스포트한다.
    return result;
  }
}

export default TagBaseElementNode;