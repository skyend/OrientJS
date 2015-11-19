import React from 'react';
import Returns from "../../Returns.js";
import _ from 'underscore';

class ElementNode {
  constructor(_document, _elementNodeDataObject, _preInsectProps) {

    // 미리 삽입된 프로퍼티
    var preInsectProps = _preInsectProps || {};

    //////////////
    // 필드 정의
    ////////////////////////

    // document profile
    this.id;
    this.type; // html / string / react / grid
    this.name; // 참고용 이름

    this.componentName;
    this.comment;


    // Element Controls
    this.controls;
    /**
    Controls {
        repeat-n: number or ${...}
    } **/

    // date fields
    this.createDate;
    this.updateDate;

    // parent refference
    this.parent = null;

    () => {
      this.realization = null;
      this.clonePool = []; // repeated
    }()


    // Repeat by parent's Repeat Control
    this.isGhost = preInsectProps.isGhost || false; // 계보에 반복된 부모가 존재하는경우 자식노드의 경우 Ghost로 표시한다.
    this.isRepeated = preInsectProps.isRepeated || false; // repeat에 의해 반복된 ElementNode 플래그
    this.repeatOrder = preInsectProps.repeatOrder || -1; // repeat에 의해 반복된 자신이 몇번째 반복요소인지를 나타낸다.

    this.document = _document;
    this.mode = 'normal';

    //////////////////////////
    // 처리로직
    //////////////////////////
    // 이미 있는 엘리먼트를 로드한 경우 데이터를 객체에 맵핑해준다.
    if (typeof _elementNodeDataObject === 'object') {
      this.import(_elementNodeDataObject);
    } else {
      // 새 엘리먼트가 생성되었다.
      this.createDate = new Date();
      this.controls = {};
      this.comment = '';
    }
  }



  ////////////////////
  // Setters
  // enid
  setId(_id) {
    this.id = _id;
  }

  // name
  setName(_name) {
    this.name = _name;
  }


  // type
  setType(_type) {
    this.type = _type;
  }


  // componentName
  setComponentName(_componentName) {
    this.componentName = _componentName;
  }

  // parent // 상위노드로 부터 호출됨
  setParent(_parentENode) {
    this.parent = _parentENode;
  }

  //  will Deprecate
  unlinkParent() {
    this.parent = null;
  }


  // control
  setControl(_controlName, _value) {
    this.controls[_controlName] = _value;
    //this.emitToParent("RequestReRenderMe");
  }

  // controls
  setControls(_controls) {
    this.controls = _controls;
  }




  // comment : 주석
  setComment(_comment) {
    this.comment = _comment;
  }







  ////////////////////
  // Getters
  // id
  getId() {
    return this.id;
  }

  // name
  getName() {
    return this.name;
  }



  // type
  getType() {
    return this.type;
  }


  // control
  getControl(_controlName) {
    return this.controls[_controlName];
  }





  // controls
  getControls() {
    return this.controls;
  }


  // componentName
  getComponentName() {
    return this.componentName;
  }

  // realElement
  getRealization() {
    return this.realElement;
  }

  // parent
  getParent() {
    return this.parent;
  }

  // css
  getCSS() {
    return this.css;
  }

  // comment : 주석
  getComment() {
    return this.comment;
  }

  getControlWithResolve(_controlName) {
    return this.interpret(this.controls[_controlName]);
  }

  getAttributeWithResolve(_attrName) {
    return this.interpret(this.attributes[_attrName]);
  }


  // realControl
  isUsingBind(_controlName) {
    return this.interpret(this.controls[_controlName]);
  }


  // isReferenced
  isReferenced() {
    return this.getParent() !== null;
  }


  realize(_realizeOptions) {
    this.clonePool = [];

    let realizeOptions = _realizeOptions || {};

    // _ghostOrder 인자 에 값을 입력함으로써 GhostPoint임을 간접적으로 전달한다.
    let isGhostizePoint = realizeOptions.ghostOrder !== undefined;
    let ghostOrder = realizeOptions.ghostOrder;

    let htmlDoc = this.document.getHTMLDocument();

    // type에 따른 DOM 생성
    if (this.getType() === 'string') {
      this.realization = htmlDoc.createTextNode('');
      this.realization.___en = this;
    } else {

      this.realization = htmlDoc.createElement(this.getTagName());
      this.realization.___en = this;
      this.realization.setAttribute('___id___', this.id);
    }

    this.modifyFromControl(realizeOptions.skipControl, realizeOptions.skipResolve, isGhostizePoint);
  }


  modifyFromControl(_skipControl, _skipResolve, _isGhostizePoint) {
    if (_skipControl) return;
    let repeatOption;

    // rendering 사이클에 개입되는 control 처리
    // 반복 컨트롤 처리 ghost로 실체화중이라면 반복 컨트롤 처리를 하지 않는다.
    if ((repeatOption = this.getControlWithResolve('repeat-n')) > 0 && !_isGhostizePoint) {

      this.isRepeated = true;
      this.repeatOrder = 0;

      for (let i = 0; i < repeatOption - 1; i++) {
        // clone ElementNode 생성
        let cloned = new ElementNode(this.document, this.export(), {
          isGhost: true,
          repeatOrder: i + 1,
          isRepeated: true
        });

        cloned.setParent(this.getParent());

        // clone ElementNode realize
        cloned.realize({
          ghostOrder: i + 1,
          skipControl: _skipControl,
          skipResolve: _skipResolve
        });

        this.clonePool.push(cloned);
      }
    } else {
      if (this.clonePool.length > 0) {
        this.clonePool = [];
      }
    }
  }


  getRealization() {
    return this.realization;
  }


  // Real DOM의 내용과 자신의 내용의 변경사항을 파악하여 자신의 내용을 업데이트 한다.
  updateSyncDOMChanged() {

    let realDOMElement = this.getRealization();

    let childNodes = realDOMElement.childNodes;

    let newChildren = [];

    for (let i = 0; i < childNodes.length; i++) {
      let realChild = childNodes[i];
      let newChildElementNode = this.document.extractAndRealizeElementNode(realChild);

      newChildElementNode.setParent(this);

      newChildren.push(newChildElementNode);
    }
    this.children = newChildren;
  }

  ////////////////////
  // Exists
  // Deprecated
  // hasRealDOMElement() {
  //   return typeof this.realElement !== 'undefined';
  // }


  ////////////////////
  /***************
   * getMyContextControllerOfDocument
   * 자신이 소속된 Document의 ContextController를 반환
   */
  getMyContextControllerOfDocument() {
    return this.document.getMyDirector();
  }


  /////////////////
  /***********
   * updated
   * 요소가 변경되었을 때 호출한다.
   */
  updated() {
    this.updateDate = new Date();
  }


  /**************
   * dettachMeFromParent
   * 부모의 Children 리스트에서 자신을 제거한다.
   * 하지만 사라지지는 않는다.
   */
  dettachMeFromParent() {

    var parent = this.getParent();

    // 부모 ElementNode가 존재한다면.
    if (parent !== null) {
      // 부모에게 detach요청
      parent.detachChild(this);
    } else {
      // 부모 ElementNode가 존재하지 않는다면 자신이 Document의 RootElementNode이거나 ElementNodes 리스트에 존재하는 노드이므로
      // 다르게 처리해준다.

      // RootElement일 경우
      if (this.document.getRootElementNode() === this) {
        this.document.removeRootElementNode();
      } else {
        //  ElementNodes 리스트에 존재하는 노드(참조용노드)
        // 추후 구현


      }
    }

    return this;
  }


  /**************
   * dettachChild
   * 자신의 Children에서 하나의 child를 제거한다.
   */
  detachChild(_child) {
    var children = this.children;
    var newChildList = [];

    for (var i = 0; i < children.length; i++) {
      var child = children[i];

      if (child != _child) {
        newChildList.push(child);
      }
    }

    this.children = newChildList;
  }



  /********
   * checkDropableComponent
   * 현재 ElementNode에 다른 component가 드랍될 수 있는지 체크
   */
  checkDropableComponentWithDirection(_component, _direction) {

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
        //if (targetElementNode.getType() !== 'empty') return false;
        break;
    }

    return true;
  }


  //////////////////
  // build my self
  /******************
   * buildByComponent
   * Component 를 이용하여 자신의 필드를 세팅한다.
   *
   */
  buildByComponent(_component) {
    //console.log('빌드해라', _component);
    var elementNodeType = _component.elementType;
    this.setType(elementNodeType);
  }




  // /******************
  //  * buildByDomElement
  //  * DomElement 을 자신에게 매핑하여 자신을 빌드한다.
  //  * child는 재귀로 호출한다.
  //  */
  // buildByDomElement(_domElement) {
  //
  //   // TextNode 의 경우 단순한 빌딩
  //   if (_domElement.nodeName === '#text') {
  //     this.setType('string');
  //     this.setAttributes({
  //       'tagName': 'text',
  //       'text': _domElement.nodeValue
  //     });
  //
  //     return;
  //   }
  //
  //   // TextNode가 아닌경우
  //   this.setType('html');
  //
  //   // element Attribute를 읽어서 자신에게 매핑한다.
  //   this.copyAllAtrributeFromDOMElement(_domElement);
  //
  //   //////////////////
  //   // 자식노드 재귀처리 //
  //   var children = [];
  //   var childNodes = _domElement.childNodes;
  //
  //   // 자식노드도 생성
  //   var child_ = null;
  //   for (var i = 0; i < childNodes.length; i++) {
  //     child_ = childNodes[i];
  //
  //     // comment node 는 무시
  //     if (child_.nodeName === '#comment') continue;
  //
  //     // 새 자식용 ElementNode 생성
  //     var newChildElementNode = this.document.newElementNode();
  //     newChildElementNode.buildByDomElement(child_);
  //
  //     children.push(newChildElementNode);
  //
  //     newChildElementNode.setParent(this);
  //   }
  //   // 재귀끝  //
  //   ////////////
  //
  //
  //   this.children = children;
  // }


  copyAllAtrributeFromDOMElement(_domElement) {
    var elementSpec = {
      'tagName': _domElement.nodeName.toLowerCase(),
    }


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
  }


  // .deprecated
  // applyAttributesToRealDOM(_escapeResolve) {
  //
  //   //console.log("Do you think i must escape resolving?", _escapeResolve);
  //
  //   var realElement = this.getRealization();
  //   if (this.getType() === 'string') {
  //     // resolve String : data binding and i18n processing
  //     //console.log(this.getText());
  //     realElement.nodeValue = _escapeResolve ? this.getText() : this.interpret(this.getText());
  //
  //   } else {
  //     var currentRect = this.getCurrentRectangle();
  //     var elementAttributes = this.getAttributes();
  //     var keys = Object.keys(elementAttributes);
  //
  //     for (var i = 0; i < keys.length; i++) {
  //
  //       if (keys[i] !== 'tagName') {
  //         // resolve String : data binding and i18n processing
  //         realElement.setAttribute(keys[i], _escapeResolve ? elementAttributes[keys[i]] : this.interpret(elementAttributes[keys[i]]));
  //       }
  //     }
  //
  //
  //     if (/^\d+/.test(currentRect.left)) {
  //       realElement.style.left = currentRect.left;
  //     }
  //
  //     if (/^\d+/.test(currentRect.top)) {
  //       realElement.style.top = currentRect.top;
  //     }
  //
  //     if (/^\d+/.test(currentRect.width)) {
  //       realElement.style.width = currentRect.width;
  //     }
  //
  //     if (/^\d+/.test(currentRect.height)) {
  //       realElement.style.height = currentRect.height;
  //     }
  //
  //     if (this.isTextEditMode()) {
  //       realElement.setAttribute('contenteditable', true);
  //     }
  //   }
  // }




  isDropableComponent(_dropType) {
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
  }


  insertBefore(_elementNode) {
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
  }


  insertAfter(_elementNode) {
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
  }


  //////////////////////////
  // import methods
  /*************
   * inspireChildren
   * ElementNode Data객체 리스트를 실제 ElementNode 객체 리스트로 변환한다.
   * @Param _childrenDataList : JSON Array
   */
  inspireChildren(_childrenDataList) {
    if (typeof _childrenDataList === 'undefined' || _childrenDataList === null) return []; // object가 아니면 빈 배열을 리턴한다.
    if (typeof _childrenDataList.length !== 'number') throw new Error("element nodes is not Array.");
    var list = [];

    var preInsectProps = {
      //isRepeated: this.isRepeated,
      isGhost: this.isGhost
    }

    let elementNodeData;
    let child;
    for (var i = 0; i < _childrenDataList.length; i++) {
      elementNodeData = _childrenDataList[i];
      child = this.document.newElementNode(elementNodeData, preInsectProps);
      child.setParent(this);
      list.push(child);
    }

    return list;
  }

  //////////////////////
  //
  /********************
   * linkRealDOMofChild( Deprecated )
   * 자신의 ElementNode에 생성된 RealDOMElement Tree를 갱신한다.
   * 자신의 자식 ElementNode의 구조가 변경되었고 자신의 하위 ElementNode중 RealElement를 가지지 않는 ElementNode가 없을 때 호출한다.
   * 자신의 자식 ElementNode에 구축된 realElement를 자신의 realElement에 자식으로 추가한다.
   * 그리고 자식의 linkRealDOMofChild 메소드를 호출하여 재귀로 동작한다.
   */
  // linkRealDOMofChild() {
  //   var self = this;
  //
  //   // Real Element 를 가지고 있으면 linkRealDOMofChild 메소드를 호출하여 자신의 RealElement Tree를 갱신한다.
  //   if (this.hasRealDOMElement()) {
  //
  //     // RealElement 는 실제 사용자에게 보여지는 HTML DOMElement
  //     var realDOMElement = this.getRealization();
  //
  //     realDOMElement.innerHTML = '';
  //     var elementNodeType = this.getType();
  //
  //     switch (elementNodeType) {
  //       case "string":
  //         //realDOMElement.nodeValue = this.interpret(this.getText());
  //         break;
  //       case "html":
  //         break;
  //       case "react":
  //         this.linkRealDOMofChild_react_type();
  //         break;
  //       case "empty":
  //         // emptyType 구축
  //         this.linkRealDOMofChild_empty_type();
  //         break;
  //       default:
  //
  //     }
  //
  //
  //     if (this.getType() !== 'empty') {
  //       ////////////////////////////
  //       // 자식 Real DOMElement Tree를 직접 갱신하여 결과를 자신에게 연결(append)한다.
  //       this.children.map(function(_child) {
  //
  //         // (HTML|STRING|EMPTY)TYPE 의 자식ElementNode만 RealElment를 자신에게 append한다.
  //         switch (_child.getType()) {
  //           case "string":
  //           case "html":
  //           case "react":
  //           case "empty":
  //             if (_child.hasRealDOMElement()) {
  //
  //               // HTML DOM append
  //               realDOMElement.appendChild(_child.linkRealDOMofChild());
  //             }
  //             break;
  //
  //         }
  //
  //
  //       });
  //       // 자식 RealElement 처리 완료
  //       ///////////////////
  //     }
  //
  //
  //     return realDOMElement;
  //   }
  // }

  // Deprecated
  // linkRealDOMofChild_empty_type() {
  //
  //   var realElement = this.getRealization();
  //   // empty 타입은 다른 ElementNode 또는 ReactComponent 또는 Document를 참조한다.
  //   // 그에따른 처리..
  //
  //
  //   this.clearRefferenceInstance();
  //   var refTarget = this.getRefferenceTarget();
  //   if (refTarget !== 'none' && refTarget !== undefined && refTarget !== null) {
  //
  //     switch (this.getRefferenceType()) {
  //       case "react":
  //       case "html":
  //       case "grid":
  //       case "empty":
  //         var refferenceElementNode = this.document.getElementNodeFromPool(this.getRefferenceTarget());
  //
  //
  //         this.setRefferenceInstance(refferenceElementNode);
  //
  //         if (refferenceElementNode !== undefined) {
  //
  //           realElement.appendChild(refferenceElementNode.linkRealDOMofChild());
  //
  //           // if (this.getRefferenceType() === 'react') {
  //           //   refferenceElementNode.renderReact();
  //           // }
  //         } else {
  //           console.warn("참조중인 id의 노드가 존재하지 않습니다.");
  //         }
  //
  //         break;
  //       case "document":
  //
  //         break;
  //       default:
  //     }
  //   }
  //
  //
  //   return realElement;
  // }

  // Deprecated
  // linkRealDOMofChild_react_type() {
  //   var realElement = this.getRealization();
  //
  //   var packageKey = this.getReactPackageKey();
  //   var componentKey = this.getReactComponentKey();
  //
  //   // ReactComponent 를 얻어온다.
  //   var component = this.document.getReactTypeComponent(packageKey, componentKey, realElement.ownerDocument.defaultView);
  //
  //   //console.log(realElement.ownerDocument.defaultView, realElement.ownerDocument, 'aa');
  //
  //
  //   var React = require('react');
  //   var reactElementInstance = React.createElement(component.class, this.getRefferenceTargetProps() || {});
  //
  //   this.setReactElement(reactElementInstance);
  //
  //   React.render(reactElementInstance, realElement);
  //
  //   if (typeof component.CSS !== 'undefined') {
  //     this.setCSS(component.CSS);
  //     this.document.appendReactElementNodeCSS(component.componentName, component.CSS);
  //   }
  //
  //   return realElement;
  // }

  // Deprecated
  // renderReact() {
  //   var realElement = this.getRealization();
  //
  //   var packageKey = this.getReactPackageKey();
  //   var componentKey = this.getReactComponentKey();
  //
  //   // ReactComponent 를 얻어온다.
  //   var component = this.document.getReactTypeComponent(packageKey, componentKey);
  //
  //
  //   var React = require('react');
  //   var refferenceInstance = React.createElement(component.class, this.getRefferenceTargetProps() || {});
  //
  //
  //   React.render(refferenceInstance, realElement);
  //
  //   if (typeof component.CSS !== 'undefined') {
  //     this.setCSS(component.CSS);
  //     this.document.appendReactElementNodeCSS(component.componentName, component.CSS);
  //   }
  // }









  executeSnapshot(_type) {
    //var presentRevision = this.export();
    //  console.log(presentRevision);
    this.emitToParent("Snapshot", {
      present: this.export(),
      past: this.pastRevision,
      type: _type || 'diff'
    });

    this.pastRevision = this.export();
  }



  /////////////
  // String Resolve
  interpret(_seedText) {
    var self = this;

    var preResolvedText = (_seedText + "").replace(/\*\(([\w\.\-\:]+)\)/g, function(_tested, _firstMatch) {
      return self.pretreatment(_firstMatch);
    });

    // this.emitToParent("Test", {
    //   text: _seedText
    // });

    // resolve String : data binding and i18n processing
    return this.document.interpret(preResolvedText);
  }

  // 전처리
  pretreatment(_resolveKey) {
    var self = this;
    var WhatThings = /^(\w+):([\w-\.]+)$/;

    if (WhatThings.test(_resolveKey)) {

      return _resolveKey.replace(WhatThings, function(_tested, _namespace, _want) {
        if (_namespace === 'attr') {
          var attributeValue = self.getAttribute(_want);

          return attributeValue !== undefined ? self.interpret(attributeValue) : self.emitToParent("GetResolvedAttribute", {
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
  }



  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /* ------------------ Event Handing Methods ------------------------------------------------------------------------------------- */
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 동기 이벤트 핸들링
  // Base Method
  onEventTernel(_eventName, _eventData, __ORIGIN__) {
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
  }

  // Base Method
  emitToParent(_eventName, _eventData, __ORIGIN__) {
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
  }

  ////
  // 이벤트 사용
  // var result = this.emitToParent("Test", {
  //   text: _seedText
  // });

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // 자식의 attribute변경을 감시한다.
  onEC_UpdatedAttribute(_eventData, _origin) {

    // 자신이 반복자로 지정되어있을 경우 자신을 다시 랜더링한다.
    if (this.getControl('repeat-n') !== undefined) {

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
  }


  // 자식이 자신을 다시 랜더링해달라고 요청했을 때
  // 자식의 요청을 받은 부모가 반복자로 지정되어 있으면 반복되어 랜더링된 요소들을 함께 갱신하기 위해 Event를 자신의 선에서 다시 발생시킨다.
  // 반복자의 자손중 반복자가 또 있는 경우
  onEC_RequestReRenderMe(_eventData, _origin) {

    // 자신이 반복자로 지정되어있을 경우 자신을 다시 랜더링한다.
    if (this.getControl('repeat-n') !== undefined) {

      // 자신을 다시 랜더링해달라고 요청
      this.emitToParent("RequestReRenderMe");
      return true;
    }

    // 위의 해당사항이 없다면 이벤트터널을 계속 통과하도록 false반환.
    return false;
  }


  onEC_GetRepeatN(_eventData, _origin) {
    if (this.isRepeated) {
      return this.repeatOrder;
    } else {
      return false;
    }
  }


  onEC_GetResolvedAttribute(_eventData, _origin) {

    var value = this.getAttribute(_eventData.attr);
    if (value !== undefined) {
      return this.interpret(value);
    }

    return false;
  }


  onEC_Snapshot(_eventData, _origin) {
    return false;
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /* ------------------ Event Handing Methods End --------------------------------------------------------------------------------- */
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  import (_elementNodeDataObject) {
    this.id = _elementNodeDataObject.id;
    this.type = _elementNodeDataObject.type;
    this.name = _elementNodeDataObject.name;

    this.componentName = _elementNodeDataObject.componentName;

    this.controls = _elementNodeDataObject.controls || {};

    this.comment = _elementNodeDataObject.comment || '';

    this.createDate = _elementNodeDataObject.createDate;
    this.updateDate = _elementNodeDataObject.updateDate;
  }


  //////////////////////////
  // export methods
  export (_withoutId) {
    var exportObject = {
      id: _withoutId ? undefined : this.id,
      type: this.getType(),
      name: this.getName(),
      controls: _.clone(this.getControls()),
      comment: this.getComment(),
      componentName: this.getComponentName(),
      createDate: (new Date(this.createDate)).toString(),
      updateDate: (new Date(this.updateDate)).toString(),
    }

    return exportObject;
  }

}


export default ElementNode;