import ElementNode from './ElementNode.js';
import ObjectExtends from '../../util/ObjectExtends';
import MetaText from '../Data/MetaText';
import ArrayHandler from '../../util/ArrayHandler';

"use strict";

const PIPE_EVENT_SPLIT_REGEXP = /^en-pipe-event-([\w\-\_\d]+)$/;
const METHOD_SPLIT_REGEXP = /^en-method-([\w\-\_\d\$]+)$/;



const RESERVED_DOM_ATTRIBUTES = {
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
}

const ATTRIBUTE_STATE = {
  OLD: -1,
  NOT_MODIFIED: 0,
  NEW: 1,
  MODIFIED: 2
};


var SUPPORT_HTML_TAG_STYLES = {};
try {
  if (window) {
    SUPPORT_HTML_TAG_STYLES = ObjectExtends.clone(window.document.head.style);
  }
} catch (_e) {
  console.warn('Window is not declared');
}


const FINAL_TYPE_CONTEXT = 'base';
class TagBaseElementNode extends ElementNode {
  constructor(_environment, _elementNodeDataObject, _preInjectProps, _isMaster) {
    super(_environment, _elementNodeDataObject, _preInjectProps, _isMaster);
    this.type = FINAL_TYPE_CONTEXT;

    if ((Orient.bn === 'ie' && Orient.bv <= 10) || (Orient.bn === 'safari' && Orient.bv <= 534)) {
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

  // will deprecate
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

  // will deprecate
  // id
  getIdAtrribute() {
    return this.getAttribute('id');
  }

  // will deprecate
  // classes
  getClasses() {
    return this.getAttribute('class');
  }

  // attributes
  getAttributes() {
    return this.attributes;
  }

  // will deprecate
  // Inline Style
  getInlineStyle() {
    return this.getAttribute('style');
  }

  // will deprecate
  getRectangle() {
    return this.rectangle;
  }

  getBoundingRect() {

    var boundingRect;
    var realElement = this.getDOMNode();

    boundingRect = realElement.getBoundingClientRect();

    return boundingRect;
  }

  // will deprecate
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

  // will deprecate
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

  // will deprecate
  setRectanglePartWithKeepingUnit(_partValue, _partName) {
    //console.log(valueWithUnitSeperator(_partValue));
  }

  set zIndex(_zIndex) {
    this._zIndex = _zIndex;
  }

  mappingAttributes(_domNode, _options) {

    let oldAttributes = _domNode.attributes;
    let calculatedAttr = {};
    let attrName;
    let attrValue;
    for (let i = 0; i < _domNode.attributes.length; i++) {
      attrName = oldAttributes[i].nodeName;
      attrValue = oldAttributes[i].nodeValue;

      calculatedAttr[attrName] = {
        v: attrValue, // value
        s: ATTRIBUTE_STATE.OLD // state // OLD 어트리뷰트는 삭제된다.
      };
    }

    for (let i = 0; i < this.attributes.length; i++) {
      attrName = this.attributes[i].name;
      attrValue = this.attributes[i].variable;
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
            let styleKeys = Object.keys(attrValue);
            let toInlineStyleStringArray = styleKeys.map(function(_key) {
              return _key.replace(/([A-Z])/g, function(_full, _capital) {
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

    let calculatedAttrKeys = Object.keys(calculatedAttr);

    let state, name, value;
    for (let i = 0; i < calculatedAttrKeys.length; i++) {
      name = calculatedAttrKeys[i];
      state = calculatedAttr[name].s;
      value = calculatedAttr[name].v;

      if (state === ATTRIBUTE_STATE.OLD) {
        if (RESERVED_DOM_ATTRIBUTES[name]) {
          _domNode[RESERVED_DOM_ATTRIBUTES[name].sync_field] = null;
        }

        _domNode.removeAttribute(name);
      } else if (state === ATTRIBUTE_STATE.MODIFIED) {
        if (RESERVED_DOM_ATTRIBUTES[name]) {
          if (_domNode[RESERVED_DOM_ATTRIBUTES[name].sync_field] !== value)
            _domNode[RESERVED_DOM_ATTRIBUTES[name].sync_field] = value;
        }

        _domNode.setAttribute(name, value);
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
    console.log(name, value);
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
      this.bindDOMEvents(_domElement, {});
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
          case 'en-dc-force-render-children':

            this.dynamicContextForceRenderChildren = true;
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