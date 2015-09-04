var React = require('react');
var EventEmitter = require('../lib/EventEmitter.js');
var Extender = require('../lib/Extender.js');

var _ = require('underscore');

var ElementNode = function(_document, _elementNodeDataObject) {
  Extender.extends(EventEmitter, this);

  //////////////
  // 필드 정의
  ////////////////////////

  // document profile
  this.id;
  this.type; // html / string / react / grid
  this.name; // 참고용 이름
  this.attributes;
  this.componentName;
  this.comment;

  // refference
  this.refferenceType; // react | document | ...
  this.refferenceTarget; // reactComponent{ _componentKey, _packageKey }
  this.refferenceTargetProps; // {...}

  this.refferenceInstance = null;

  this.reactPackageKey;
  this.reactComponentKey;
  this.reactComponentProps;

  // date fields
  this.createDate;
  this.updateDate;
  this.css;

  // children
  this.children;

  // parent refference
  this.parent = null;
  this.realElement = null;

  this.document = _document;

  //////////////////////////
  // 처리로직
  //////////////////////////
  // 이미 있는 엘리먼트를 로드한 경우 데이터를 객체에 맵핑해준다.
  if (typeof _elementNodeDataObject === 'object') {
    this.id = _elementNodeDataObject.id;
    this.type = _elementNodeDataObject.type;
    this.name = _elementNodeDataObject.name;

    this.attributes = _elementNodeDataObject.attributes;

    this.componentName = _elementNodeDataObject.componentName;

    this.refferenceType = _elementNodeDataObject.refferenceType;
    this.refferenceTarget = _elementNodeDataObject.refferenceTarget;

    this.reactPackageKey = _elementNodeDataObject.reactPackageKey;
    this.reactComponentKey = _elementNodeDataObject.reactComponentKey;
    this.reactComponentProps = _elementNodeDataObject.reactComponentProps;

    this.comment = _elementNodeDataObject.comment || '';

    this.createDate = _elementNodeDataObject.createDate;
    this.updateDate = _elementNodeDataObject.updateDate;

    this.children = this.inspireChildren(_elementNodeDataObject.children);

  } else {
    // 새 엘리먼트가 생성되었다.
    this.createDate = new Date();
    this.attributes = {};
    this.children = [];
    this.comment = '';
  }
};

////////////////////
// Setters
// enid
ElementNode.prototype.setId = function(_id) {
  this.id = _id;
};
// name
ElementNode.prototype.setName = function(_name) {
  this.name = _name;
};
// Id Atrribute
ElementNode.prototype.setIdAtrribute = function(_id) {
  this.attributes.id = _id;
};
// tagName
ElementNode.prototype.setTagName = function(_tagName) {
  this.attributes.tagName = _tagName;
};
// classes
ElementNode.prototype.setClasses = function(_classes) {
  this.attributes.class = _classes;
};
// type
ElementNode.prototype.setType = function(_type) {
  this.type = _type;
};
// packageKey
ElementNode.prototype.setReactPackageKey = function(_reactPackageKey) {
  this.reactPackageKey = _reactPackageKey;
};
// componentKey
ElementNode.prototype.setReactComponentKey = function(_reactComponentKey) {
  this.reactComponentKey = _reactComponentKey;
};
// componentName
ElementNode.prototype.setComponentName = function(_componentName) {
  this.componentName = _componentName;
};
// refferenceType
ElementNode.prototype.setRefferenceType = function(_refferenceType) {
  this.refferenceType = _refferenceType;
};
// refferenceTarget
ElementNode.prototype.setRefferenceTarget = function(_refferenceTarget) {
  this.refferenceTarget = _refferenceTarget;
};
// refferenceTargetProps
ElementNode.prototype.setRefferenceTargetProps = function(_refferenceTargetProps) {
  this.refferenceTargetProps = _refferenceTargetProps;
};
// refferenceInstance
ElementNode.prototype.setRefferenceInstance = function(_refferenceInstance) {
  this.refferenceInstance = _refferenceInstance;
  if (this.refferenceInstance !== 'none' && this.refferenceInstance !== undefined) {
    this.refferenceInstance.setParent(this);
  }
};
// clear refferenceInstance
ElementNode.prototype.clearRefferenceInstance = function() {
  if (this.refferenceInstance !== null) this.refferenceInstance.unlinkParent();
  else console.warn("참조중인 인스턴스가 없습니다.");
};
// parent
ElementNode.prototype.setParent = function(_parentENode) {
  this.parent = _parentENode;
};
ElementNode.prototype.unlinkParent = function() {
  this.parent = null;
};
// attribute
ElementNode.prototype.setAttribute = function(_name, _value) {
  this.attributes[_name] = _value;
};
// attributes
ElementNode.prototype.setAttributes = function(_attributes) {
  this.attributes = _attributes;
};
// css
ElementNode.prototype.setCSS = function(_css) {
  this.css = _css;
};
// Inline Style
ElementNode.prototype.setInlineStyle = function(_style) {
  this.attributes.style = _style;
};
// text
ElementNode.prototype.setText = function(_text) {
  this.attributes.text = _text;
};
// comment : 주석
ElementNode.prototype.setComment = function(_comment) {
  this.comment = _comment;
};
// ReactTypeComponent
ElementNode.prototype.setReactTypeComponent = function(_component) {
  this.reactTypeComponent = _component;
};

// real element
ElementNode.prototype.setRealElement = function(_realElement) {

  // 새 realElement 를 삽입하기전에 이전에 있던 realElement를 제거한다.
  // 제거하지 않으면 참조를 잃어버려 컨트롤할수없다.
  if (this.realElement !== null) {
    this.realElement.remove();
    this.realElement = null;
  }

  // RealElement 매핑
  this.realElement = _realElement;

  // RealElement의 ___en속성에 this(ElementNode) 매핑
  this.realElement.___en = this;

  // RealElement에 ElementNode를 가져올 수 있는 메소드 매핑
  this.realElement.getElementNode = function() {
    return this.___en;
  };

};



////////////////////
// Getters
// id
ElementNode.prototype.getId = function() {
  return this.id;
};
// name
ElementNode.prototype.getName = function() {
  return this.name;
};
// element.tagName -> getTagName()
ElementNode.prototype.getTagName = function() {
  return this.attributes.tagName;
};

ElementNode.prototype.getIdAtrribute = function() {
  return this.attributes.id;
};

ElementNode.prototype.getClasses = function() {
  return this.attributes.class;
};
// element.text -> getText()
ElementNode.prototype.getText = function() {
  return this.attributes.text;
};
// type
ElementNode.prototype.getType = function() {
  return this.type;
};
// packageKey
ElementNode.prototype.getReactPackageKey = function() {
  return this.reactPackageKey;
};
// componentKey
ElementNode.prototype.getReactComponentKey = function() {
  return this.reactComponentKey;
};
// attribute
ElementNode.prototype.getAttribute = function(_name) {
  return this.attributes[_name];
};
// attributes
ElementNode.prototype.getAttributes = function() {
  return this.attributes;
};
// componentName
ElementNode.prototype.getComponentName = function() {
  return this.componentName;
};
// refferenceType
ElementNode.prototype.getRefferenceType = function() {
  return this.refferenceType;
};
// refferenceTarget
ElementNode.prototype.getRefferenceTarget = function() {
  return this.refferenceTarget;
};
// refferenceTargetProps
ElementNode.prototype.getRefferenceTargetProps = function() {
  return this.refferenceTargetProps;
};
// refferenceInstance
ElementNode.prototype.getRefferenceInstance = function() {
  return this.refferenceInstance;
};
// realElement
ElementNode.prototype.getRealDOMElement = function() {
  return this.realElement;
};
// parent
ElementNode.prototype.getParent = function() {
  return this.parent;
};
// css
ElementNode.prototype.getCSS = function() {
  return this.css;
};
// Inline Style
ElementNode.prototype.getInlineStyle = function() {
  return this.attributes.style;
};
// text
ElementNode.prototype.getText = function() {
  return this.attributes.text;
};
// comment : 주석
ElementNode.prototype.getComment = function() {
  return this.comment;
};
// ReactTypeComponent
ElementNode.prototype.getReactTypeComponent = function() {
  return this.reactTypeComponent;
};


// isReferenced
ElementNode.prototype.isReferenced = function() {
  return this.getParent() !== null;
};

// getRefferencingElementNode //Empty Type elnode 의 참조중인 elNode를 가져옴
ElementNode.prototype.getRefferencingElementNode = function() {
  var refElNode = this.document.getElementNodeFromPool(this.getRefferenceTarget());
  return refElNode;
};

///////////
// Remove Attribute
ElementNode.prototype.removeAttribute = function(_attrName) {
  delete this.attributes[_attrName];

  if (this.getRealDOMElement() !== null) {
    this.getRealDOMElement().removeAttribute(_attrName);
  }
};

//////////
// Remove Attribute
ElementNode.prototype.renameAttribute = function(_prevName, _nextName) {
  var fieldData = this.getAttribute(_prevName);
  this.removeAttribute(_prevName);
  this.setAttribute(_nextName, fieldData);

  this.applyAttributesToRealDOM();
};


////////////////////
// Exists
// realElement
ElementNode.prototype.hasRealDOMElement = function() {
  return typeof this.realElement !== 'undefined';
};

////////////////////
/***************
 * getMyContextControllerOfDocument
 * 자신이 소속된 Document의 ContextController를 반환
 */
ElementNode.prototype.getMyContextControllerOfDocument = function() {
  return this.document.getMyDirector();
};

/////////////////
/***********
 * updated
 * 요소가 변경되었을 때 호출한다.
 */
ElementNode.prototype.updated = function() {
  this.updateDate = new Date();
};

/**************
 * dettachMeFromParent
 * 부모의 Children 리스트에서 자신을 제거한다.
 * 하지만 사라지지는 않는다.
 */
ElementNode.prototype.dettachMeFromParent = function() {

  var parent = this.getParent();

  // 부모 ElementNode가 존재한다면.
  if (parent !== null) {
    // 부모에게 detach요청
    parent.dettachChild(this);
  } else {
    // 부모 ElementNode가 존재하지 않는다면 자신이 Document의 RootElementNode이거나 ElementNodes 리스트에 존재하는 노드이므로
    // 다르게 처리해준다.

    // RootElement일 경우
    if (this.document.getRootElementNode() === this) {
      this.document.removeRootElementNode();
    } else {
      //  ElementNodes 리스트에 존재하는 노드
      // 추후 구현


    }
  }

  return this;
};

/**************
 * dettachChild
 * 자신의 Children에서 하나의 child를 제거한다.
 */
ElementNode.prototype.dettachChild = function(_child) {
  var children = this.children;
  var newChildList = [];

  for (var i = 0; i < children.length; i++) {
    var child = children[i];

    if (child != _child) {
      newChildList.push(child);
    }
  }

  this.children = newChildList;

  this.linkRealDOMofChild();
};


/********
 * checkDropableComponent
 * 현재 ElementNode에 다른 component가 드랍될 수 있는지 체크
 */
ElementNode.prototype.checkDropableComponentWithDirection = function(_component, _direction) {

  var targetElementNode = null;

  switch (_direction) {
    case "in":
      targetElementNode = this;
      break;
    case "left":
    case "right":
    case "top":
    case "bottom":
      targetElementNode = this.getParent();
      break;
  }

  if (targetElementNode === null) {
    return false;
  }


  switch (_component.elementType) {
    case "html":
      // html type component 는 모든곳에 드랍이 가능하다.
      // react type component 는 실제로 elementNode가 생성되지는 않기 때문에 배제한다.
      break;
    case "empty":
      // empty type Component 는 empty type elementNode를 제외하고 모두 드랍이 가능하다.
      // react type component 는 실제로 elementNode가 생성되지는 않기 때문에 배제한다.
      if (targetElementNode.getType() === 'empty') return false;
      break;
    case "react":
      // react type Component 는 empty type elementNode에만 드랍할 수 있다.
      // react type component 는 실제로 elementNode가 생성되지는 않기 때문에 배제한다.
      if (targetElementNode.getType() !== 'empty') return false;
      break;
  }

  return true;
};

//////////////////
// build my self
/******************
 * buildByComponent
 * Component 를 이용하여 자신의 필드를 세팅한다.
 *
 */
ElementNode.prototype.buildByComponent = function(_component) {
  //console.log('빌드해라', _component);

  var elementNodeType = _component.elementType;
  this.setType(elementNodeType);

  if (elementNodeType === 'html') {


    var parsingDom = document.createElement('div');
    parsingDom.innerHTML = React.renderToStaticMarkup(React.createElement(_component.class));

    this.buildByDomElement(parsingDom.childNodes[0]);

    if (typeof _component.CSS !== 'undefined') {
      this.setCSS(_component.CSS);
      this.document.appendHTMLElementNodeCSS(_component.componentName, _component.CSS);
    }

  } else if (elementNodeType === 'empty') {

    // Todo
    this.buildEmptyTypeElement();

  } else if (elementNodeType === 'string') {
    this.setText("Text");
    this.setTagName('text');
  } else if (elementNodeType === 'grid') {
    // Todo
  } else if (elementNodeType === 'react') {
    this.setTagName('div');
    this.setReactPackageKey(_component.packageKey);
    this.setReactComponentKey(_component.componentKey);
  }
};

/******************
 * buildByDomElement
 * DomElement 을 자신에게 매핑하여 자신을 빌드한다.
 * child는 재귀로 호출한다.
 */
ElementNode.prototype.buildEmptyTypeElement = function(_domElement) {

  this.setType('empty');
  this.setAttributes({
    'tagName': 'div',
    'style': "width:100px;height:100px;border:1px solid #fff"
  });

  this.setRefferenceType('none');
  this.setRefferenceTarget('none');
};

/******************
 * buildByDomElement
 * DomElement 을 자신에게 매핑하여 자신을 빌드한다.
 * child는 재귀로 호출한다.
 */
ElementNode.prototype.buildByDomElement = function(_domElement) {

  // TextNode 의 경우 단순한 빌딩
  if (_domElement.nodeName === '#text') {
    this.setType('string');
    this.setAttributes({
      'tagName': 'text',
      'text': _domElement.nodeValue
    });

    return;
  }

  // TextNode가 아닌경우
  this.setType('html');

  // element Attribute를 읽어서 자신에게 매핑한다.
  this.copyAllAtrributeFromDOMElement(_domElement);

  //////////////////
  // 자식노드 재귀처리 //
  var children = [];
  var childNodes = _domElement.childNodes;

  // 자식노드도 생성
  var child_ = null;
  for (var i = 0; i < childNodes.length; i++) {
    child_ = childNodes[i];

    // comment node 는 무시
    if (child_.nodeName === '#comment') continue;

    // 새 자식용 ElementNode 생성
    var newChildElementNode = this.document.newElementNode();
    newChildElementNode.buildByDomElement(child_);

    children.push(newChildElementNode);

    newChildElementNode.setParent(this);
  }
  // 재귀끝  //
  ////////////


  this.children = children;
};

ElementNode.prototype.copyAllAtrributeFromDOMElement = function(_domElement) {
  var elementSpec = {
    'tagName': _domElement.nodeName.toLowerCase(),
  };

  // __vid__ attribute를 제외하고 요소의 모든 attribute를 카피한다.
  var attributes = _domElement.attributes;
  for (var i = 0; i < attributes.length; i++) {
    switch (attributes[i].name) {
      case '__vid__':
        continue;
    }
    elementSpec[attributes[i].name] = attributes[i].nodeValue;
  }

  this.setAttributes(elementSpec);
};


ElementNode.prototype.applyAttributesToRealDOM = function() {
  var elementAttributes = this.getAttributes();
  var keys = Object.keys(elementAttributes);

  var realElement = this.getRealDOMElement();
  if (this.getType() === 'string') {

    // resolve String : data binding and i18n processing
    realElement.nodeValue = this.resolveRenderText(this.getText());
  } else {
    for (var i = 0; i < keys.length; i++) {

      if (keys[i] !== 'tagName') {

        // resolve String : data binding and i18n processing
        realElement.setAttribute(keys[i], this.resolveRenderText(elementAttributes[keys[i]]));
      }


    }
  }


};

ElementNode.prototype.appendChild = function(_elementNode) {
  if (this.getType() === 'string') {
    return false;
  }

  _elementNode.setParent(this);

  this.children.push(_elementNode);

  return true;
};

ElementNode.prototype.insertBefore = function(_elementNode) {
  if (this.getType() === 'string') {
    return false;
  }

  var parent = this.getParent();
  // 부모의 자식 배열에서 나를 찾는다.
  var meIndex = _.findIndex(parent.children, this);

  if (meIndex == 0) {
    parent.children.unshift(_elementNode);
  } else {
    var newParentChildren = [];
    for (var i = 0; i < parent.children.length; i++) {
      if (i == meIndex) {
        newParentChildren.push(_elementNode);
      }
      newParentChildren.push(parent.children[i]);
    }

    parent.children = newParentChildren;
  }
  _elementNode.setParent(parent);

  return true;
};

ElementNode.prototype.insertAfter = function(_elementNode) {
  if (this.getType() === 'string') {
    return false;
  }

  var parent = this.getParent();

  var meIndex = _.findIndex(parent.children, this);

  if (meIndex == parent.children.length - 1) {
    parent.children.push(_elementNode);
  } else {
    var newParentChildren = [];
    for (var i = 0; i < parent.children.length; i++) {
      newParentChildren.push(parent.children[i]);
      if (i == meIndex) {
        newParentChildren.push(_elementNode);
      }
    }

    parent.children = newParentChildren;
  }


  _elementNode.setParent(parent);

  return true;
};

//////////////////////////
// import methods
/*************
 * inspireChildren
 * ElementNode Data객체 리스트를 실제 ElementNode 객체 리스트로 변환한다.
 * @Param _childrenDataList : JSON Array
 */
ElementNode.prototype.inspireChildren = function(_childrenDataList) {
  if (typeof _childrenDataList === 'undefined' || _childrenDataList === null) return []; // object가 아니면 빈 배열을 리턴한다.
  if (typeof _childrenDataList.length !== 'number') throw new Error("element nodes is not Array.");
  var list = [];

  for (var i = 0; i < _childrenDataList.length; i++) {
    var child = this.document.newElementNode(_childrenDataList[i]);
    child.setParent(this);
    list.push(child);
  }

  return list;
};



//////////////////////
//
/********************
 * linkRealDOMofChild
 * 자신의 ElementNode에 생성된 RealDOMElement Tree를 갱신한다.
 * 자신의 자식 ElementNode의 구조가 변경되었고 자신의 하위 ElementNode중 RealElement를 가지지 않는 ElementNode가 없을 때 호출한다.
 * 자신의 자식 ElementNode에 구축된 realElement를 자신의 realElement에 자식으로 추가한다.
 * 그리고 자식의 linkRealDOMofChild 메소드를 호출하여 재귀로 동작한다.
 */
ElementNode.prototype.linkRealDOMofChild = function() {
  var self = this;

  // Real Element 를 가지고 있으면 linkRealDOMofChild 메소드를 호출하여 자신의 RealElement Tree를 갱신한다.
  if (this.hasRealDOMElement()) {

    // RealElement 는 실제 사용자에게 보여지는 HTML DOMElement
    var realDOMElement = this.getRealDOMElement();

    realDOMElement.innerHTML = '';


    // empty Type의 ElementNode는 RealElement의 내용을 다르게 갱신한다.
    if (this.getType() === 'empty') {

      // emptyType 구축
      this.linkRealDOMofChild_empty_type();
    } else {
      // empty Type이 아닌 ElementNode만 자식 재귀호출

      ////////////////////////////
      // 자식 Real DOMElement Tree를 직접 갱신하여 결과를 자신에게 연결(append)한다.
      this.children.map(function(_child) {

        // (HTML|STRING|EMPTY)TYPE 의 자식ElementNode만 RealElment를 자신에게 append한다.
        switch (_child.getType()) {
          case "html":
          case "string":
          case "empty":
            if (_child.hasRealDOMElement()) {

              // HTML DOM append
              realDOMElement.appendChild(_child.linkRealDOMofChild());
            }
            break;

        }
      });
      // 자식 RealElement 처리 완료
      ///////////////////
    }



    return realDOMElement;
  }
};

ElementNode.prototype.linkRealDOMofChild_empty_type = function() {

  var realElement = this.getRealDOMElement();
  // empty 타입은 다른 ElementNode 또는 ReactComponent 또는 Document를 참조한다.
  // 그에따른 처리..


  this.clearRefferenceInstance();
  var refTarget = this.getRefferenceTarget();
  if (refTarget !== 'none' && refTarget !== undefined && refTarget !== null) {

    switch (this.getRefferenceType()) {
      case "react":
      case "html":
      case "grid":
      case "empty":
        var refferenceElementNode = this.document.getElementNodeFromPool(this.getRefferenceTarget());


        this.setRefferenceInstance(refferenceElementNode);

        if (refferenceElementNode !== undefined) {

          realElement.appendChild(refferenceElementNode.linkRealDOMofChild());

          if (this.getRefferenceType() === 'react') {
            refferenceElementNode.renderReact();
          }
        } else {
          console.warn("참조중인 id의 노드가 존재하지 않습니다.");
        }

        break;
      case "document":

        break;
      default:
    }
  }


  return realElement;
};

ElementNode.prototype.linkRealDOMofChild_react_type = function() {
  var realElement = this.getRealDOMElement();
  console.log('react linked');
  var packageKey = this.getReactPackageKey();
  var componentKey = this.getReactComponentKey();

  // ReactComponent 를 얻어온다.
  var component = this.document.getReactTypeComponent(packageKey, componentKey);


  var React = require('react');
  var refferenceInstance = React.createElement(component.class, this.getRefferenceTargetProps() || {});

  this.setRefferenceInstance(refferenceInstance);

  React.render(refferenceInstance, realElement);

  if (typeof component.CSS !== 'undefined') {
    this.setCSS(component.CSS);
    this.document.appendReactElementNodeCSS(component.componentName, component.CSS);
  }

  return realElement;
};

ElementNode.prototype.resolveRenderText = function(_seedText) {

  // resolve String : data binding and i18n processing
  return this.document.getServiceManager().resolveString(_seedText);
};

ElementNode.prototype.renderReact = function() {
  var realElement = this.getRealDOMElement();
  console.log('react linked');
  var packageKey = this.getReactPackageKey();
  var componentKey = this.getReactComponentKey();

  // ReactComponent 를 얻어온다.
  var component = this.document.getReactTypeComponent(packageKey, componentKey);


  var React = require('react');
  var refferenceInstance = React.createElement(component.class, this.getRefferenceTargetProps() || {});



  React.render(refferenceInstance, realElement);

  if (typeof component.CSS !== 'undefined') {
    this.setCSS(component.CSS);
    this.document.appendReactElementNodeCSS(component.componentName, component.CSS);
  }
};

//////////////////////////
// export methods
ElementNode.prototype.export = function(_withoutId) {
  var exportObject = {
    id: _withoutId ? undefined : this.id,
    type: this.getType(),
    name: this.getName(),
    attributes: _.clone(this.getAttributes()),
    comment: this.getComment(),
    componentName: this.getComponentName(),
    createDate: new Date(this.createDate),
    updateDate: new Date(this.updateDate),
    inherentCSS: this.getType() !== 'empty' ? this.getCSS() : '', // empty 타입을 제외하고 모든 요소의 고유CSS를 익스포트한다.
    children: this.children.map(function(_child) {
      return _child.export(_withoutId);
    })
  };

  if (exportObject.type === 'empty') {
    exportObject.refferenceType = this.getRefferenceType();
    exportObject.refferenceTarget = this.getRefferenceTarget();
    exportObject.refferenceTargetProps = this.getRefferenceTargetProps();
  }

  if (exportObject.type === 'react') {
    exportObject.reactPackageKey = this.getReactPackageKey();
    exportObject.reactComponentKey = this.getReactComponentKey();
  }

  return exportObject;
};


module.exports = ElementNode;