"use strict";
import React from 'react';
import Returns from "../../Returns.js";
import _ from 'underscore';
import Factory from './Factory.js';
import Identifier from '../../util/Identifier.js';
import ObjectExplorer from '../../util/ObjectExplorer.js';
import DynamicContext from './DynamicContext';
import async from 'async';
import DataResolver from '../DataResolver/Resolver';

import Events from 'events';

class ElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps, _dynamicContext) {
    Object.assign(this, Events.EventEmitter.prototype);

    // 미리 삽입된 프로퍼티
    var preInsectProps = _preInsectProps || {};

    //////////////
    // 필드 정의
    ////////////////////////

    // environment profile
    this.id;
    this.type; // html / string / react / grid / ref
    this.name; // 참고용 이름

    this.componentName;
    this.comment;


    // Element Controls
    this.controls;
    /**
    Controls {
        repeat-n: number or ${...},
        hidden: "true|false" or interpert
    } **/

    // date fields
    this.createDate;
    this.updateDate;

    // parent refference
    this.parent = null;


    this.realization = null;
    this.clonePool = []; // repeated



    // Repeat by parent's Repeat Control
    this.isGhost = preInsectProps.isGhost || false; // 계보에 반복된 부모가 존재하는경우 자식노드의 경우 Ghost로 표시한다.
    this.isRepeated = preInsectProps.isRepeated || false; // repeat에 의해 반복된 ElementNode 플래그
    this.repeatOrder = preInsectProps.repeatOrder || -1; // repeat에 의해 반복된 자신이 몇번째 반복요소인지를 나타낸다.

    this.environment = _environment;
    this.mode = 'normal';
    this.dynamicContext = _dynamicContext;
    this.defaultResolver = new DataResolver();

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

  get isDynamicContext() {
    return this._isDynamicContext;
  }

  get dynamicContextSID() {
    return this._dynamicContextSID;
  }

  get dynamicContextRID() {
    return this._dynamicContextRID
  }

  get dynamicContextNS() {
    return this._dynamicContextNS
  }

  get dynamicContextInjectParams() {
    return this._dynamicContextInjectParams;
  }

  set isDynamicContext(_isDynamicContext) {
    this._isDynamicContext = _isDynamicContext;
  }

  set dynamicContextSID(_dynamicContextSID) {
    this._dynamicContextSID = _dynamicContextSID;
  }

  set dynamicContextRID(_dynamicContextRID) {
    this._dynamicContextRID = _dynamicContextRID;
  }

  set dynamicContextNS(_dynamicContextNS) {
    this._dynamicContextNS = _dynamicContextNS;
  }

  set dynamicContextInjectParams(_dynamicContextInjectParams) {
    this._dynamicContextInjectParams = _dynamicContextInjectParams;
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

  setRealization(_realization) {
    this.realization = _realization;
    this.realization.___en = this;

    this.realization.setAttribute('en-id', this.getId());
    this.realization.setAttribute('en-type', this.type);
  }

  /*
    constructDOM
    Parameters
      0. _options {
          linkType: 'upstream' | 'downstream', default: 'downstream'
          // upstream 스스로 부모에게 링크 ,downstream 자식만을 링크
          // replacedNode = parentNode.replaceChild(newChild, oldChild);

          resolve: boolean , default:true // 바인딩 진행 여부
          forward: boolean , default:true // true면 생성된 dom을 자신의 forwardDOM 필드에 입력하고 false면 자신의 backupDOM 필드에 입력한다.
        }
      1. _complete Callback
    Returns by arguments of Callback
      0. DOMNode or NULL
  */
  constructDOM(_options, _complete) { // Controls : Hidden, Repeat-n
    // [
    //  [0] Before Controls
    //  [1] Node 생성
    //  [2] Attribute and text 매핑
    //  [3] Children Construct & Link
    //  [4] Children Link
    //  [5] After Controls
    // ]

    // Before Control
    // * hidden
    let that = this;
    let options = _options || {};
    options.linkType = options.linkType || 'downstream';
    options.resolve = options.resolve != undefined ? options.resolve : true;
    options.forward = options.forward != undefined ? options.forward : true;

    // [0] Before Controls
    if (this.getControlWithResolve('hidden') === 'true') {
      _complete(null);
    }

    // [1] Node 생성
    let htmlNode = this.createNode(options);
    if (options.forward) {
      this.forwardDOM = htmlNode;
    } else {
      this.backupDOM = htmlNode;
    }
    htmlNode.___en = this;

    //console.log(this, htmlNode);
    // [2] Attribute and text 매핑
    this.mappingAttributes(htmlNode, options);

    // [3] Children Construct
    if (this.type !== 'string') {
      this.childrenConstructAndLink(options, htmlNode, function() {
        _complete(htmlNode);
      }); // children 은 HTML의 자식돔트리도 포함 되지만 ReactType의 ReactElement도 포함된다.
    } else {
      _complete(htmlNode);
    }
  }

  /*
    각 ElementType Class 에서 메소드를 구현하여야 한다.

    CreateNode
      HTMLElement 또는 TextNode 를 생성한다.

    return DOMNode
  */
  createNode(options) {
    throw new Error("Implement this method on ElementNode[" + this.getType() + "]");
  }

  /*
    각 ElementType Class 에서 메소드를 구현하여야 한다.

    MappingAttributes
      인자로 들어온 DOMNode에 Attribute 또는 nodeValue(text) 를 입력한다.
    return Nothing
  */
  mappingAttributes(htmlNode, options) {
    throw new Error("Implement this method on ElementNode[" + this.getType() + "]");
  }

  /*
    각 ElementType Class 에서 메소드를 구현하여야 한다.

    ChildrenConstructAndLink
      String Element를 제외한 모든 ElementNode Type에 대해서 자식을 생성하고 링크한다.
      repeatN Control 옵션에 따라서 복제를 수행하여 완료한다.
  */
  childrenConstructAndLink(_options, _complete) {
    throw new Error("Implement this method on ElementNode[" + this.getType() + "]");
  }

  realize(_realizeOptions, _complete) {
    if (this.getControlWithResolve('hidden') === 'true') {
      console.log('hidden element', this);
      return _complete(false);
    }

    // clonePool 은 repeat-n Control에 의해 변경되지만 control의 설정 여부와 관계없이 항상 Pool을 비운다.
    this.clonePool = [];

    let realizeOptions = _realizeOptions || {};

    // _ghostOrder 인자 에 값을 입력함으로써 GhostPoint임을 간접적으로 전달한다.
    let isGhostizePoint = realizeOptions.ghostOrder !== undefined;
    // let ghostOrder = realizeOptions.ghostOrder;

    this.modifyFromControl(realizeOptions.skipControl, realizeOptions.skipResolve, isGhostizePoint, function() {
      _complete();
    });

    //console.log('Realize options', this, _realizeOptions);
  }

  // 번외 처리
  linkHierarchyRealizaion() {
    if (this.dynamicContext && this.isDynamicContextOwner) {
      if (this.dynamicContext.isLoading) {
        //let computedStyle = window.getComputedStyle(this.realization);

        //console.log(computedStyle.getPropertyValue('position'));
        //if (computedStyle.getPropertyValue('position') === "static") {
        //console.log('this static');
        this.realization.setAttribute('fix-placeholder', '');
        //}

        let placeholder = this.environment.getHTMLDocument().createElement('div');

        placeholder.setAttribute('is-dynamic-context-placeholder', '');

        placeholder.innerHTML = '<i class="fa fa-spin fa-sun-o"/>';

        this.realization.appendChild(placeholder);
      }
    }
  }


  buildDynamicContext() {
    let that = this;
    this.isDynamicContextOwner = true;
    let newDynamicContext;
    let makeNew = false;

    if (this.isDynamicContext !== 'true') throw new Error("this is not DynamicContext!");

    // 현재 다이나믹 컨텍스트가 입력되어 있다면
    if (this.dynamicContext) {

      // 현재 다이나믹컨텍스트의 메타 정보가 자신이 가지고 있는 메타정보와 같은지 비교하고 하나라도 다른 정보가 존재한다면
      // 부모로 부터 입력된 다이나믹컨텍스트이므로
      if ((this.dynamicContext.sourceIDs !== this.dynamicContextSID || this.dynamicContext.requestIDs !== this.dynamicContextRID) || this.dynamicContext.namespaces !== this.dynamicContextNS) {
        // 자신이 가진 메타정보로 다이나믹컨텍스트를 생성하고 이전에 가지고 있던 다이나믹컨텍스트를 자신의 다이나믹컨텍스트의 부모로 입력한다.
        makeNew = true;
      }
    } else {
      makeNew = true;
      // 새 다이나믹 컨텍스트 생성
    }

    if (makeNew) {
      this.dynamicContext = new DynamicContext(this.environment, this.dynamicContext, {
        sourceIDs: this.dynamicContextSID,
        requestIDs: this.dynamicContextRID,
        namespaces: this.dynamicContextNS,
        injectParams: this.dynamicContextInjectParams
      });

      this.dynamicContext.on("begin-load", function() {
        that.emit('link-me');
      });

      this.dynamicContext.on("complete-load", function() {
        console.log('loaded');
        that.realize(undefined, function() {
          that.emit('link-me');
        })
      });
    }
  }




  getBoundingRect() {

    var boundingRect = null;
    var realElement = this.getRealization();

    if (realElement !== null)
      boundingRect = realElement.getBoundingClientRect();

    return boundingRect;
  }

  // realControl
  isUsingBind(_controlName) {
    return this.interpret(this.controls[_controlName]);
  }

  // isReferenced
  isReferenced() {
    return this.getParent() !== null;
  }

  modifyFromControl(_skipControl, _skipResolve, _isGhostizePoint, _complete) {
    if (_skipControl) return _complete();
    let repeatOption;
    let that = this;
    // rendering 사이클에 개입되는 control 처리
    // 반복 컨트롤 처리 ghost로 실체화중이라면 반복 컨트롤 처리를 하지 않는다.
    if ((repeatOption = this.getControlWithResolve('repeat-n')) > 0 && !_isGhostizePoint) {
      this.isRepeated = true;
      this.repeatOrder = 0;

      async.eachSeries(_.range(repeatOption - 1), function iterator(_i, _next) {
        // clone ElementNode 생성
        let cloned = Factory.takeElementNode(that.export(), {
          isGhost: true,
          repeatOrder: _i + 1,
          isRepeated: true
        }, that.getType(), that.environment, that.dynamicContext);

        cloned.setParent(that.getParent());

        // clone ElementNode realize
        cloned.realize({
          ghostOrder: _i + 1,
          skipControl: _skipControl,
          skipResolve: _skipResolve
        }, function() {

          that.clonePool.push(cloned);
          _next();
        });
      }, function done() {
        _complete();
      });

    } else {
      if (this.clonePool.length > 0) {
        this.clonePool = [];

      }
      _complete();
    }
  }





  // Real DOM의 내용과 자신의 내용의 변경사항을 파악하여 자신의 내용을 업데이트 한다.
  updateSyncDOMChanged() {

    let realDOMElement = this.getRealization();

    let childNodes = realDOMElement.children;

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
    // this.setType(elementNodeType);
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

      if (elementNode.getType() === 'string') {
        elementNode.setText(_realization.innerHTML);
      } else {
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
    }

    return elementNode;
  }


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


  getParentList() {
    let current = this;
    let parentList = [];

    while (current.parent !== null) {
      parentList.unshift(current.parent);
      current = current.parent;
    }

    return parentList;
  }

  climbParents(_climber) {
    let current = this;

    while (current.parent !== null) {
      if (_climber(current.parent) === null) {
        break;
      }

      current = current.parent;
    }
  }

  /////////////
  // String Resolve
  interpret(_matterText) {
    if (_matterText === undefined) return;

    let text = _matterText;

    text = this.preInterpretOnTree(text);

    if (this.dynamicContext) {
      return this.dynamicContext.interpret(text);
    } else {
      return this.defaultResolver.resolve(text);
    }
  }

  // 전처리
  // ElementNode상의 가능한 인터프리팅을 진행한다.
  preInterpretOnTree(_matterText) {
    let that = this;
    let text = _matterText;

    var WhatThings = /\*\(([\w-]+)\:?([\w-_\.]+)?\)/g;

    text = text.replace(WhatThings, function(_match, _mean, _submean) {
      //console.log('repeat-n', _match, _mean, _submean, _matterText);
      if (_mean === 'repeat-n') {
        console.log('get repeat-n');
        return that.getRepeatNOnTree();
      } else if (_mean === 'attr') {
        return that.getAttrOnTree(_submean);
      }
    });

    return text;
  }

  getRepeatNOnTree() {
    if (this.isRepeated) {
      return this.repeatOrder;
    } else {
      // 자신의 부모로부터 반복 순번을 얻음
      let repeatNumber = -1;

      this.climbParents(function(_parent) {
        if (_parent.isRepeated) {
          repeatNumber = _parent.repeatOrder;
          return null;
        }
      });

      if (repeatNumber !== -1) {
        return repeatNumber;
      } else {
        return undefined;
      }
    }
  }

  getAttrOnTree(_attrName) {

    if (_.isFunction(this.getAttribute)) {
      // 먼저 자신에게서 구한다.
      var attributeValue = this.getAttribute(_attrName);

      if (attributeValue !== undefined) {
        return self.interpret(attributeValue);
      }
    }

    let parentAttribute = null;
    this.climbParents(function(_parent) {
      var value = _parent.getAttribute(_attrName);

      if (value !== undefined) {
        parentAttribute = _parent.interpret(value);
        return null;
      }
    });

    if (parentAttribute !== null) {
      return parentAttribute;
    } else {
      return '`' + _attrName + '`is null';
    }

  }

  // 모든 ElementNode type 의 Interpret작업이 필요한 항목들을 감지한다.
  // bindBlockSetList를 반환함.
  detectInterpret() {
    let bindBlockSetList = [];
    let self = this;

    let extractedBlocks;
    ObjectExplorer.explore(this.controls, function(_key, _data) {
      extractedBlocks = self.extractBindBlocks(_data);

      if (extractedBlocks !== null) {
        extractedBlocks.map(function(_block) {
          bindBlockSetList.push({
            key: _key,
            binder: _block
          });
        })
      }
    }, 'controls');

    switch (this.getType()) {
      case "string":
        extractedBlocks = self.extractBindBlocks(this.getText());

        if (extractedBlocks !== null) {
          extractedBlocks.map(function(_block) {
            bindBlockSetList.push({
              key: 'text',
              binder: _block
            });
          })
        }
        break;
      case "react":
        ObjectExplorer.explore(this.attributes, function(_key, _data) {
          extractedBlocks = self.extractBindBlocks(_data);

          if (extractedBlocks !== null) {
            extractedBlocks.map(function(_block) {
              bindBlockSetList.push({
                key: _key,
                binder: _block
              });
            })
          }
        }, 'attributes');

        ObjectExplorer.explore(this.getReactComponentProps(), function(_key, _data) {
          extractedBlocks = self.extractBindBlocks(_data);

          if (extractedBlocks !== null) {
            extractedBlocks.map(function(_block) {
              bindBlockSetList.push({
                key: _key,
                binder: _block
              });
            })
          }
        }, 'reactComponentProps');

        break;
      case "ref":
      case "grid":
      case "html":
        ObjectExplorer.explore(this.attributes, function(_key, _data) {
          extractedBlocks = self.extractBindBlocks(_data);

          if (extractedBlocks !== null) {
            extractedBlocks.map(function(_block) {
              bindBlockSetList.push({
                key: _key,
                binder: _block
              });
            })
          }
        }, 'attributes');
        break;
    }

    if (bindBlockSetList.length > 0) {
      return bindBlockSetList;
    } else {
      return undefined;
    }
  }

  // ${*XXXX}형식의 문자열을 감지하여 리스트로 반환한다.
  // 감지된 문자열이 없으면 null을 반환한다.
  extractBindBlocks(_string) {
    let bindBlocks = [];

    let matched = _string.match(/\$\{\*[^\{^\}]+\}/g);

    return matched;
  }





  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /* ------------------ Event Handing Methods ------------------------------------------------------------------------------------- */
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 동기 이벤트 핸들링
  // Base Method
  // onEventTernel(_eventName, _eventData, __ORIGIN__) {
  //   var eventName = _eventName;
  //   var eventData = _eventData;
  //   //var origin = _eventData.origin;
  //
  //   var eventCatcherKey = "onEC_" + eventName;
  //
  //
  //   var result = this[eventCatcherKey](eventData, __ORIGIN__);
  //
  //   if (result === false) {
  //
  //     // 결과 타입이 boolean이고 값이 false 일 때 부모로 이벤트를 넘겨준다.
  //     return this.emitToParent(eventName, eventData, __ORIGIN__);
  //   } else {
  //     // false 가 아니라면 이벤트 처리 결과를 반환한다.
  //     return result;
  //   }
  // }
  //
  // // Base Method
  // emitToParent(_eventName, _eventData, __ORIGIN__) {
  //   if (this.parent === null) {
  //
  //     // 이벤트를 듣는 부모가 없다면 이벤트를 environment로 전송한다.
  //     return this.environment.onEventTernel(_eventName, _eventData, __ORIGIN__ || this);
  //   }
  //
  //   return this.parent.onEventTernel(_eventName, _eventData, __ORIGIN__ || this);
  //
  //
  //   // return this.parent.onEventTernel(_eventName, {
  //   //   eventName: _eventName,
  //   //   eventData: _eventData,
  //   //   origin: __ORIGIN__ || this // origin 이 입력되지 않으면 자신을 origin 으로 정한다 // orign은 이벤트를 발생시킨자로 발생된 이벤트를 부모가 처리하지 못하여 부모의 부모로 넘겨줄때 origin을 유지하기 위해 사용한다.
  //   // });
  // }
  //
  // onEC_GetRepeatN(_eventData, _origin) {
  //   if (this.isRepeated) {
  //     return this.repeatOrder;
  //   } else {
  //     return false;
  //   }
  // }
  //
  //
  // onEC_GetResolvedAttribute(_eventData, _origin) {
  //
  //   var value = this.getAttribute(_eventData.attr);
  //   if (value !== undefined) {
  //     return this.interpret(value);
  //   }
  //
  //   return false;
  // }


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /* ------------------ Event Handing Methods End --------------------------------------------------------------------------------- */
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  import (_elementNodeDataObject) {
    this.id = _elementNodeDataObject.id || Identifier.genUUID();
    this.type = _elementNodeDataObject.type;
    this.name = _elementNodeDataObject.name;

    this.isDynamicContext = _elementNodeDataObject.isDynamicContext;
    this.dynamicContextSID = _elementNodeDataObject.dynamicContextSID;
    this.dynamicContextRID = _elementNodeDataObject.dynamicContextRID;
    this.dynamicContextNS = _elementNodeDataObject.dynamicContextNS;
    this.dynamicContextInjectParams = _elementNodeDataObject.dynamicContextInjectParams;

    this.componentName = _elementNodeDataObject.componentName;

    this.controls = _elementNodeDataObject.controls || {
      'repeat-n': '',
      'hidden': ''
    };

    this.comment = _elementNodeDataObject.comment || '';

    this.createDate = _elementNodeDataObject.createDate;
    this.updateDate = _elementNodeDataObject.updateDate;

    if (this.isDynamicContext === 'true')
      this.buildDynamicContext();
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

    exportObject.isDynamicContext = this.isDynamicContext;
    exportObject.dynamicContextSID = this.dynamicContextSID;
    exportObject.dynamicContextRID = this.dynamicContextRID;
    exportObject.dynamicContextNS = this.dynamicContextNS;
    exportObject.dynamicContextInjectParams = this.dynamicContextInjectParams;

    return exportObject;
  }

}


export default ElementNode;