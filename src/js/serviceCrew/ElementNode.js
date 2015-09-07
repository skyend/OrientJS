var React = require('react');
var Returns = require("../Returns.js");

var _ = require('underscore');

var ElementNode = function(_document, _elementNodeDataObject, _preInsectProps) {
  if (_preInsectProps !== undefined) {
    console.log(this, _elementNodeDataObject);
  }
  // 미리 삽입된 프로퍼티
  var preInsectProps = _preInsectProps || {};

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

  // Element Controls
  this.controls;
  /**
  Controls {
      repeat-n: number or ${...}
  }

   **/

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
  this.refferenceInstance = null;

  // Repeat by parent's Repeat Control
  this.isGhost = preInsectProps.isGhost || false; // 계보에 반복된 부모가 존재하는경우 자식노드의 경우 Ghost로 표시한다.
  this.isRepeated = preInsectProps.isRepeated || false; // repeat에 의해 반복된 ElementNode 플래그
  this.repeatOrder = preInsectProps.repeatOrder || -1; // repeat에 의해 반복된 자신이 몇번째 반복요소인지를 나타낸다.

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

    this.controls = _elementNodeDataObject.controls || {};

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
    this.controls = {};
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
  this.setAttribute('id', _id);
};
// tagName
ElementNode.prototype.setTagName = function(_tagName) {
  this.setAttribute('tagName', _tagName);
};
// classes
ElementNode.prototype.setClasses = function(_classes) {
  this.setAttribute('class', _classes);
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

// parent // 상위노드로 부터 호출됨
ElementNode.prototype.setParent = function(_parentENode) {
  this.parent = _parentENode;
};
ElementNode.prototype.unlinkParent = function() {
  this.parent = null;
};
// attribute
ElementNode.prototype.setAttribute = function(_name, _value) {
  this.attributes[_name] = _value;
  this.updatedAttribute(_name);
};
// attributes
ElementNode.prototype.setAttributes = function(_attributes) {
  this.attributes = _attributes;
};

// control
ElementNode.prototype.setControl = function(_controlName, _value) {
  this.controls[_controlName] = _value;
  this.emitToParent("RequestReRenderMe");
};
// controls
ElementNode.prototype.setControls = function(_controls) {
  this.controls = _controls;
};

// css
ElementNode.prototype.setCSS = function(_css) {
  this.css = _css;
};
// Inline Style
ElementNode.prototype.setInlineStyle = function(_style) {
  this.setAttribute('style', _style);
};
// text
ElementNode.prototype.setText = function(_text) {
  this.setAttribute('text', _text);
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
  return this.getAttribute('tagName');
};
// id
ElementNode.prototype.getIdAtrribute = function() {
  return this.getAttribute('id');
};
// classes
ElementNode.prototype.getClasses = function() {
  return this.getAttribute('class');
};
// text
ElementNode.prototype.getText = function() {
  return this.getAttribute('text');
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

// control
ElementNode.prototype.getControl = function(_controlName) {
  return this.controls[_controlName];
};
// controls
ElementNode.prototype.getControls = function() {
  return this.controls;
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
  return this.getAttribute('style');
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


ElementNode.prototype.isDropableComponent = function(_dropType) {
  var criterionElementNode;
  var returns = new Returns();

  switch (_dropType) {
    case "appendChild":
      criterionElementNode = this;
      break;
    case "insertBefore":
    case "insertAfter":
      if (this.getParent() === null) {

        returns.setReasonCode('has_not_parent');
        returns.setResult(false);
        return returns;
      } else {
        criterionElementNode = this.getParent();
      }
      break;
  }


  if (criterionElementNode.isGhost) {
    returns.setReasonCode("is_ghost");
    returns.setResult(false);
    return returns;
  }

  returns.setResult(true);
  return returns;
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
  var parent = this.getParent();

  if (parent.getType() === 'string') {
    return false;
  }


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
  var parent = this.getParent();

  if (parent.getType() === 'string') {
    return false;
  }

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

  var preInsectProps = {
    //isRepeated: this.isRepeated,
    isGhost: this.isGhost
  };

  for (var i = 0; i < _childrenDataList.length; i++) {
    var child = this.document.newElementNode(_childrenDataList[i], preInsectProps);
    child.setParent(this);
    list.push(child);
  }

  return list;
};


///////////
// 랜더링 프로세스 전( 자신의 RealElement가 생성되기 전 )에 처리할 Controls 속성
ElementNode.prototype.preProcessingMeBeforeRender = function() {
  var self = this;

  if (!this.isGhost) {
    var refreshChildren = [];
    for (var i = 0; i < this.children.length; i++) {
      if (!this.children[i].isGhost) {
        refreshChildren.push(this.children[i]);
      }
    }

    this.children = refreshChildren;
  }





  this.children.map(function(_child) {

    if (/^\d+$/.test(_child.controls['repeat-n'])) {
      for (var i = _child.controls['repeat-n']; i > 0; i--) {
        var exportMe = _child.export();
        var preInsectProps = {
          isRepeated: true,
          isGhost: true,
          repeatOrder: i
        };

        exportMe.id = exportMe.id + "_" + i;

        var mirrorElement = new ElementNode(_child.document, exportMe, preInsectProps);

        _child.insertAfter(mirrorElement);
      }

      _child.repeatOrder = 0;
      _child.isRepeated = true;
    }
  });


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
          case "string":
          case "html":
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

    if (this.getType() === 'string') {
      // resolve String : data binding and i18n processing
      realDOMElement.nodeValue = this.resolveRenderText(this.getText());
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


////////////
//
ElementNode.prototype.updatedAttribute = function(_attrKey) {
  if (this.isRepeated) {
    this.emitToParent("RequestReRenderMe");
  } else {
    this.emitToParent("UpdatedAttribute", {
      attrKey: _attrKey
    });
  }
};

/////////////
// String Resolve
ElementNode.prototype.resolveRenderText = function(_seedText) {
  var self = this;

  var preResolvedText = _seedText.replace(/\*\(([\w\.\-\:]+)\)/g, function(_tested, _firstMatch) {
    return self.preResolving(_firstMatch);
  });

  // this.emitToParent("Test", {
  //   text: _seedText
  // });

  // resolve String : data binding and i18n processing
  return this.document.getServiceManager().resolveString(preResolvedText);
};

ElementNode.prototype.preResolving = function(_resolveKey) {
  var self = this;
  var WhatThings = /^(\w+):([\w-\.]+)$/;

  if (WhatThings.test(_resolveKey)) {

    return _resolveKey.replace(WhatThings, function(_tested, _namespace, _want) {
      if (_namespace === 'attr') {
        var attributeValue = self.getAttribute(_want);

        return attributeValue !== undefined ? self.resolveRenderText(attributeValue) : self.emitToParent("GetResolvedAttribute", {
          attr: _want
        });
      }
    });
  }

  switch (_resolveKey) {
    case "repeat-n":
      // 자신이 반복자이면 자신의 repeatOrder를 반환하고 자신이 반복자가 아니라면 부모로부터 얻는다.
      if (this.isRepeated) {
        return this.repeatOrder;
      } else {
        // 자신의 부모로부터 반복 순번을 얻음
        return this.emitToParent("GetRepeatN");
      }
      break;
  }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* ------------------ Event Handing Methods ------------------------------------------------------------------------------------- */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 동기 이벤트 핸들링
// Base Method
ElementNode.prototype.onEventTernel = function(_eventName, _eventData, __ORIGIN__) {
  var eventName = _eventName;
  var eventData = _eventData;
  //var origin = _eventData.origin;

  var eventCatcherKey = "onEC_" + eventName;


  var result = this[eventCatcherKey](eventData, __ORIGIN__);

  if (result === false) {

    // 결과 타입이 boolean이고 값이 false 일 때 부모로 이벤트를 넘겨준다.
    return this.emitToParent(eventName, eventData, __ORIGIN__);
  } else {
    // false 가 아니라면 이벤트 처리 결과를 반환한다.
    return result;
  }
};
// Base Method
ElementNode.prototype.emitToParent = function(_eventName, _eventData, __ORIGIN__) {
  if (this.parent === null) {

    // 이벤트를 듣는 부모가 없다면 이벤트를 document로 전송한다.
    return this.document.onEventTernel(_eventName, _eventData, __ORIGIN__ || this);
  }

  return this.parent.onEventTernel(_eventName, _eventData, __ORIGIN__ || this);


  // return this.parent.onEventTernel(_eventName, {
  //   eventName: _eventName,
  //   eventData: _eventData,
  //   origin: __ORIGIN__ || this // origin 이 입력되지 않으면 자신을 origin 으로 정한다 // orign은 이벤트를 발생시킨자로 발생된 이벤트를 부모가 처리하지 못하여 부모의 부모로 넘겨줄때 origin을 유지하기 위해 사용한다.
  // });
};
////
// 이벤트 사용
// var result = this.emitToParent("Test", {
//   text: _seedText
// });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 자식의 attribute변경을 감시한다.
ElementNode.prototype.onEC_UpdatedAttribute = function(_eventData, _origin) {
  console.log(this.getControls(), '여길거쳐야지');

  // 자신이 반복자로 지정되어있을 경우 자신을 다시 랜더링한다.
  if (this.getControl('repeat-n') !== undefined) {
    console.log('repeat');
    // 자신을 다시 랜더링해달라고 요청
    this.emitToParent("RequestReRenderMe");
    return true;
  }

  if (this.getParent() === null) {
    // 자신이 최상위 부모라면 더이상 이벤트 터널통과를 중단.
    return true;
  }


  // 위의 해당사항이 없다면 이벤트터널을 계속 통과하도록 false반환.
  return false;
};

// 자식이 자신을 다시 랜더링해달라고 요청했을 때
// 자식의 요청을 받은 부모가 반복자로 지정되어 있으면 반복되어 랜더링된 요소들을 함께 갱신하기 위해 Event를 자신의 선에서 다시 발생시킨다.
// 반복자의 자손중 반복자가 또 있는 경우
ElementNode.prototype.onEC_RequestReRenderMe = function(_eventData, _origin) {

  // 자신이 반복자로 지정되어있을 경우 자신을 다시 랜더링한다.
  if (this.getControl('repeat-n') !== undefined) {

    // 자신을 다시 랜더링해달라고 요청
    this.emitToParent("RequestReRenderMe");
    return true;
  }

  // 위의 해당사항이 없다면 이벤트터널을 계속 통과하도록 false반환.
  return false;
};

ElementNode.prototype.onEC_GetRepeatN = function(_eventData, _origin) {
  if (this.isRepeated) {
    return this.repeatOrder;
  } else {
    return false;
  }
};

ElementNode.prototype.onEC_GetResolvedAttribute = function(_eventData, _origin) {

  var value = this.getAttribute(_eventData.attr);
  if (value !== undefined) {
    return this.resolveRenderText(value);
  }

  return false;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* ------------------ Event Handing Methods End --------------------------------------------------------------------------------- */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////
// export methods
ElementNode.prototype.export = function(_withoutId) {
  var exportObject = {
    id: _withoutId ? undefined : this.id,
    type: this.getType(),
    name: this.getName(),
    attributes: _.clone(this.getAttributes()),
    controls: this.getControls(),
    comment: this.getComment(),
    componentName: this.getComponentName(),
    createDate: new Date(this.createDate),
    updateDate: new Date(this.updateDate),
    inherentCSS: this.getType() !== 'empty' ? this.getCSS() : '', // empty 타입을 제외하고 모든 요소의 고유CSS를 익스포트한다.
    children: []
  };

  this.children.map(function(_child) {


    if (!_child.isGhost) {
      // 자식이 고스트가 아닌경우만 export한다.
      exportObject.children.push(_child.export(_withoutId));
    } else {

      // 자식이 고스트이면서 반복된 요소일 떄는 export한다.
      if (!_child.isRepeated) {
        exportObject.children.push(_child.export(_withoutId));
      }
    }

  });

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