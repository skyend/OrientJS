import React from 'react';
import Returns from "../../Returns.js";
import _ from 'underscore';
import Factory from './Factory.js';

class ElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps) {

    // 미리 삽입된 프로퍼티
    var preInsectProps = _preInsectProps || {};

    //////////////
    // 필드 정의
    ////////////////////////

    // environment profile
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

    this.environment = _environment;
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

  getRealization() {
    return this.realization;
  }

  // will Deprecate
  // ////////////////////
  // /***************
  //  * getMyContextControllerOfDocument
  //  * 자신이 소속된 Document의 ContextController를 반환
  //  */
  // getMyContextControllerOfDocument() {
  //   return this.environment.getMyDirector();
  // }

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
  }

  // controls
  setControls(_controls) {
    this.controls = _controls;
  }

  // comment : 주석
  setComment(_comment) {
    this.comment = _comment;
  }

  realize(_realizeOptions) {

    // clonePool 은 repeat-n Control에 의해 변경되지만 control의 설정 여부와 관계없이 항상 Pool을 비운다.
    this.clonePool = [];

    let realizeOptions = _realizeOptions || {};

    // _ghostOrder 인자 에 값을 입력함으로써 GhostPoint임을 간접적으로 전달한다.
    let isGhostizePoint = realizeOptions.ghostOrder !== undefined;
    // let ghostOrder = realizeOptions.ghostOrder;

    this.modifyFromControl(realizeOptions.skipControl, realizeOptions.skipResolve, isGhostizePoint);

    console.log('Realize options', this, _realizeOptions);
  }







  // realControl
  isUsingBind(_controlName) {
    return this.interpret(this.controls[_controlName]);
  }

  // isReferenced
  isReferenced() {
    return this.getParent() !== null;
  }

  modifyFromControl(_skipControl, _skipResolve, _isGhostizePoint) {
    if (_skipControl) return;
    let repeatOption;

    // rendering 사이클에 개입되는 control 처리
    // 반복 컨트롤 처리 ghost로 실체화중이라면 반복 컨트롤 처리를 하지 않는다.
    if ((repeatOption = this.getControlWithResolve('repeat-n')) > 0 && !_isGhostizePoint) {
      console.log("_________________RESOLVE_____REPEAT_N", this.getControlWithResolve('repeat-n'), this.getControl('repeat-n'));
      this.isRepeated = true;
      this.repeatOrder = 0;

      for (let i = 0; i < repeatOption - 1; i++) {

        // clone ElementNode 생성
        let cloned = Factory.takeElementNode(this.export(), {
          isGhost: true,
          repeatOrder: i + 1,
          isRepeated: true
        }, this.getType(), this.environment);

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





  // Real DOM의 내용과 자신의 내용의 변경사항을 파악하여 자신의 내용을 업데이트 한다.
  updateSyncDOMChanged() {

    let realDOMElement = this.getRealization();

    let childNodes = realDOMElement.childNodes;

    let newChildren = [];

    for (let i = 0; i < childNodes.length; i++) {
      let realChild = childNodes[i];
      let newChildElementNode = this.extractAndRealizeElementNode(realChild);

      newChildElementNode.setParent(this);

      newChildren.push(newChildElementNode);
    }
    this.children = newChildren;
  }

  ////////
  /***********
   * updated
   * 요소가 변경되었을 때 호출한다.
   */
  updated() {
    this.updateDate = new Date();
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





  extractAndRealizeElementNode(_realization) {

    let elementNode = _realization.___en || null;

    if (_realization.nodeName === '#text') {
      if (elementNode === null) {
        elementNode = this.environment.newElementNode(undefined, {}, 'string');
      }
      elementNode.buildByElement(_realization);
    } else {
      if (elementNode === null) {
        elementNode = this.environment.newElementNode(undefined, {}, 'html');
        elementNode.buildByElement(_realization);
        // elementNode.setType('html');
        // elementNode.setTagName(_realization.nodeName);
      }

      let newChildren = [];
      //  console.log(_realElement.childNodes, 'here');

      for (var i = 0; i < _realization.childNodes.length; i++) {


        let afterRealize = this.extractAndRealizeElementNode(_realization.childNodes[i]);
        afterRealize.setParent(elementNode);

        //console.log(_realElement.childNodes[i]);

        if (afterRealize !== null) {
          newChildren.push(afterRealize);
        }
      }

      elementNode.children = newChildren;
    }

    return elementNode;
  };

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

  // 자신을 통해 부모에 삽입되므로 자신의 ElementNode Type과는 상관없이 insertBefore를 지원한다.
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

  // 자신을 통해 부모에 삽입되므로 자신의 ElementNode Type과는 상관없이 insertAfter를 지원한다.
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


    // resolve String : data binding and i18n processing

    // environment 가 있을 때 environment의 interpret를 진행
    if (this.environment !== undefined) {

      return this.environment.interpret(preResolvedText);
    } else {
      return preResolvedText;
    }
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

      // 이벤트를 듣는 부모가 없다면 이벤트를 environment로 전송한다.
      return this.environment.onEventTernel(_eventName, _eventData, __ORIGIN__ || this);
    }

    return this.parent.onEventTernel(_eventName, _eventData, __ORIGIN__ || this);


    // return this.parent.onEventTernel(_eventName, {
    //   eventName: _eventName,
    //   eventData: _eventData,
    //   origin: __ORIGIN__ || this // origin 이 입력되지 않으면 자신을 origin 으로 정한다 // orign은 이벤트를 발생시킨자로 발생된 이벤트를 부모가 처리하지 못하여 부모의 부모로 넘겨줄때 origin을 유지하기 위해 사용한다.
    // });
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