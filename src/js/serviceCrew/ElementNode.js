var React = require('react');
var _ = require('underscore');

var ElementNode = function(_document, _elementNodeDataObject) {
  //////////////
  // 필드 정의
  ////////////////////////

  // document profile
  this.id;
  this.type; // html / string / react / grid
  this.attributes;
  this.componentName;

  // refference
  this.refferenceType; // react | document | ...
  this.refferenceTarget; // reactComponent{ _componentKey, _packageKey }
  this.refferenceTargetProps; // {...}

  this.setRefferenceInstance;

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
    this.attributes = _elementNodeDataObject.attributes;
    this.componentName = _elementNodeDataObject.componentName;
    this.refferenceType = _elementNodeDataObject.refferenceType;
    this.refferenceTarget = _elementNodeDataObject.refferenceTarget;

    this.createDate = _elementNodeDataObject.createDate;
    this.updateDate = _elementNodeDataObject.updateDate;
    this.children = this.inspireChildren(_elementNodeDataObject.children);

  } else {
    // 새 엘리먼트가 생성되었다.
    this.createDate = new Date();
    this.attributes = {};
    this.children = [];

  }
};

////////////////////
// Setters
// id
ElementNode.prototype.setId = function(_id) {
  this.id = _id;
};
// type
ElementNode.prototype.setType = function(_type) {
  this.type = _type;
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
};
// parent
ElementNode.prototype.setParent = function(_parentENode) {
  this.parent = _parentENode;
};
// attribute
ElementNode.prototype.setAttributes = function(_attributes) {
  this.attributes = _attributes;
};
// css
ElementNode.prototype.setCSS = function(_css) {
  this.css = _css;
};
// ReactTypeComponent
ElementNode.prototype.setReactTypeComponent = function(_component) {
  this.reactTypeComponent = _component;
}

// real element
ElementNode.prototype.setRealElement = function(_realElement) {

  // 새 realElement 를 삽입하기전에 이전에 있던 realElement를 제거한다.
  // 제거하지 않으면 참조를 잃어버려 컨트롤할수없다.
  if (this.realElement !== null) {
    this.realElement.remove();
    this.realElement = null;
  }

  this.realElement = _realElement;

  // string type을 제외하고 _enid_ 에 자신의 id를 입력한다.
  if (this.type !== 'string') {
    this.realElement.setAttribute('_enid_', this.id);
    this.realElement.___en = this;

    // RealElement에 ElementNode를 가져올 수 있는 메소드 매핑
    this.realElement.getElementNode = function() {
      return this.___en;
    };
  }
};



////////////////////
// Getters
// element.tagName -> getTagName()
ElementNode.prototype.getTagName = function() {
  return this.attributes.tagName;
};
// element.text -> getText()
ElementNode.prototype.getText = function() {
  return this.attributes.text;
};
// type
ElementNode.prototype.getType = function() {
  return this.type;
};
// Element Spec
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
  return this.refferenceTargetProps
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
// ReactTypeComponent
ElementNode.prototype.getReactTypeComponent = function() {
  return this.reactTypeComponent;
}


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

  console.log(targetElementNode.getRealDOMElement());

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
  console.log('빌드해라', _component);

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

  } else if (elementNodeType === 'grid') {
    // Todo
  } else if (elementNodeType === 'react') {
    // React타입은 ElementNode가 생성되지 않는다.
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

  // element 업데이트
  this.updateElement(_domElement);

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
  }
  // 재귀끝  //
  ////////////


  this.children = children;
};

ElementNode.prototype.updateElement = function(_domElement) {
  var elementSpec = {
    'tagName': _domElement.nodeName.toLowerCase(),
  };

  // __vid__ attribute를 제외하고 요소의 모든 attribute를 카피한다.
  var attributes = _domElement.attributes;
  for (var i = 0; i < attributes.length; i++) {
    if (attributes[i].name === '__vid__') continue;
    elementSpec[attributes[i].name] = attributes[i].nodeValue;
  }


  this.setAttributes(elementSpec);
};

ElementNode.prototype.applyDOMElement = function(_domElement) {


};

ElementNode.prototype.appendChild = function(_elementNode) {
  _elementNode.setParent(this);

  this.children.push(_elementNode);
};

ElementNode.prototype.insertBefore = function(_elementNode) {
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
};

ElementNode.prototype.insertAfter = function(_elementNode) {
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
 * growupRealDOMElementTree
 * 자신의 ElementNode에 생성된 RealDOMElement Tree를 갱신한다.
 * 자신의 자식 ElementNode의 구조가 변경되었고 자신의 하위 ElementNode중 RealElement를 가지지 않는 ElementNode가 없을 때 호출한다.
 * 자신의 자식 ElementNode에 구축된 realElement를 자신의 realElement에 자식으로 추가한다.
 * 그리고 자식의 growupRealElementTree 메소드를 호출하여 재귀로 동작한다.
 */
ElementNode.prototype.growupRealDOMElementTree = function() {
  var self = this;

  // Real Element 를 가지고 있으면 growupRealElementTree 메소드를 호출하여 자신의 RealElement Tree를 갱신한다.
  if (this.hasRealDOMElement()) {

    // RealElement 는 실제 사용자에게 보여지는 HTML DOMElement
    var realDOMElement = this.getRealDOMElement();

    realDOMElement.innerHTML = '';


    // empty Type의 ElementNode는 RealElement의 내용을 다르게 갱신한다.
    if (this.getType() === 'empty') {

      // emptyType 구축
      this.growupEmptyTypeRealDOMElement();
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
              realDOMElement.appendChild(_child.growupRealDOMElementTree());
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

ElementNode.prototype.growupEmptyTypeRealDOMElement = function() {
  var realElement = this.getRealDOMElement();
  // empty 타입은 다른 ElementNode 또는 ReactComponent 또는 Document를 참조한다.
  // 그에따른 처리..

  var refType = this.getRefferenceType();

  if (refType === 'react') {
    var refTarget = this.getRefferenceTarget();

    var packageKey = refTarget.packageKey;
    var componentKey = refTarget.componentKey;

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
  }


};

//////////////////////////
// export methods
ElementNode.prototype.export = function() {
  var exportObject = {
    id: this.id,
    type: this.getType(),
    attributes: this.getAttributes(),
    componentName: this.getComponentName(),
    createDate: this.createDate,
    updateDate: this.updateDate,
    children: this.children.map(function(_child) {
      return _child.export();
    })
  };

  if (exportObject.type === 'empty') {
    exportObject.refferenceType = this.getRefferenceType();
    exportObject.refferenceTarget = this.getRefferenceTarget();
    exportObject.refferenceTargetProps = this.getRefferenceTargetProps();
  }

  return exportObject;
};


module.exports = ElementNode;