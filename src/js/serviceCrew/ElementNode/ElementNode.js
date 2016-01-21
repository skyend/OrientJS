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
  constructor(_environment, _elementNodeDataObject, _preInsectProps) {
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
    this.backupDOM = null;
    this.forwardDOM = null;


    // Repeat by parent's Repeat Control
    this.isGhost = preInsectProps.isGhost || false; // 계보에 반복된 부모가 존재하는경우 자식노드의 경우 Ghost로 표시한다.
    this.isRepeated = preInsectProps.isRepeated || false; // repeat에 의해 반복된 ElementNode 플래그
    this.repeatOrder = preInsectProps.repeatOrder || -1; // repeat에 의해 반복된 자신이 몇번째 반복요소인지를 나타낸다.

    this.environment = _environment;
    this.mode = 'normal';
    this.dynamicContext = null;
    // this.parentDynamicContext = _parentDynamicContext || null;
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

  get isElementNode() {
    return true;
  }

  // Getters
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

  get dynamicContext() {
    return this._dynamicContext;
  }

  // 상위로 탐색하면서 사용가능한 dynamicContext를 확인한다.
  get availableDynamicContext() {
    if (this.dynamicContext !== null) return this.dynamicContext;
    else {
      // dynamicContext를 찾을 때 까지 부모에게 요청 할 것이다.
      // like climbParents
      if (this.parent === null) return null;
      return this.parent.availableDynamicContext;
    }
  }

  //
  // get parentDynamicContext() {
  //   return this._parentDynamicContext;
  // }


  // Setters
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

  set dynamicContext(_dynamicContext) {
    this._dynamicContext = _dynamicContext;
  }

  //
  // set parentDynamicContext(_parentDynamicContext) {
  //   this._parentDynamicContext = _parentDynamicContext;
  // }

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
          keelDC: boolean | 'once' , default:false // true - 전체 , false - 유지하지 않음, once - 단 한번 유지된다. constructDOMs 의 대상의 dc만 유지되며 그 하위의 ElementNode의 dc는 유지되지 않는다.
        }
      1. _complete Callback
    Returns by arguments of Callback
      0. DOMNode or NULL
  */
  constructDOMs(_options, _complete) { // Controls : Hidden, Repeat-n
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
    options.keepDC = options.keepDC != undefined ? options.keepDC : false;

    if (options.keepDC == false) {
      // 새로 생성
      let isBuiltDC = this.buildDynamicContext(); // dynamicContext 생성 호출  // 생성여부에 따라 true 또는 false 를 반환한다.

      // dc 가 생성되고 정해진 api을 실행한다.
      if (isBuiltDC) {

        this.dynamicContext.ready(function(_err) {
          if (_err !== null) {

            that.dynamicContext.dataLoad(function(_err) {
              that.constructDOMs({
                forward: true,
                keepDC: 'once'
              }, function(_domList) {
                //console.log(that.forwardDOM, that);
                that.parent.forwardMe(that);

                // that.parent.forwardDOM.replaceChild(_domList[0], that.forwardDOM);

                // if (that.parent.forwardDOM !== null)
                //   that.parent.forwardDOM.replaceChild(_domList[0], that.forwardDOM);
                // else if (that.parent.backupDOM !== null)
                //   that.parent.backupDOM.replaceChild(_domList[0], that.backupDOM);

                //console.log(that.parent.forwardDOM, that.forwardDOM);
                //console.log(that.parent.backupDOM, that.backupDOM);
                //that.forwardBackupDOMAll();
              });
            });
          }
        });
      }
    } else if (options.keepDC === 'once') { // 한번 캐치 후 false 로 옵션 변경

      options.keepDC = false;
    }

    // [0] Before Controls
    if (this.getControlWithResolve('hidden') === 'true') {
      _complete([]);
      return;
    }

    let childRepeatNumber = this.getControlWithResolve('repeat-n');

    // 하나이상의 요소를 생성하여 반환한다.
    // 반복인자가 유효하고 반복요소가 아닌 요소에 한해서 자신을 여러개 복제 하여 반환한다.
    if (/^\d+$/.test(childRepeatNumber) && !this.isRepeated) {
      let repeatedDomList = [];
      let clonedElementNodeList = [];
      let exported = that.export();
      let elementNode;

      //console.log("repeat"); // 안나옴
      async.eachSeries(_.range(parseInt(childRepeatNumber)), function iterator(_i, _next) {
          elementNode = Factory.takeElementNode(_.clone(exported), {
            isGhost: true,
            repeatOrder: _i,
            isRepeated: true
          }, that.getType(), that.environment, null);
          elementNode.setParent(that.parent);

          clonedElementNodeList.push(elementNode);
          elementNode.constructDOMs(options, function(_domList) {
            _domList.map(function(_dom) {
              repeatedDomList.push(_dom);
            });

            _next();
          });
        },
        function done(_err) {
          that.clonePool = clonedElementNodeList;
          _complete(repeatedDomList);
        })

      return;
    }

    // 하나의 요소만 생성하여 반환한다.
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
        _complete([htmlNode]);
      }); // children 은 HTML의 자식돔트리도 포함 되지만 ReactType의 ReactElement도 포함된다.
    } else {
      _complete([htmlNode]);
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


  // backupDOM 을 forwardDOM으로 옮긴다.
  forwardBackupDOMAllVirtual() {
    if (_.isFunction(this.treeExplore)) {
      this.treeExplore(function(_elementNode) {
        //_elementNode.parent.forwardDOM.replaceChild(_elementNode.backupDOM, _elementNode.forwardDOM);
        _elementNode.forwardBackupDOMVirtual();
      });
    }
  }

  forwardBackupDOMVirtual() {
    if (this.backupDOM !== null) {
      this.forwardDOM = this.backupDOM;
      this.backupDOM = null;
    }
  }

  buildDynamicContext() {
    let that = this;
    this.dynamicContext = null;

    // sourceID가 undefined 가 아니면 dynamicContext 생성하고 자신의 dynamicContext 필드에 대입한다.
    if (this.dynamicContextSID !== undefined) {

      let newDynamicContext = new DynamicContext(this.environment, {
        sourceIDs: this.interpret(this.dynamicContextSID),
        requestIDs: this.interpret(this.dynamicContextRID),
        namespaces: this.interpret(this.dynamicContextNS),
        injectParams: this.interpret(this.dynamicContextInjectParams)
      }, this.availableDynamicContext);
      // console.log(newDynamicContext);
      this.dynamicContext = newDynamicContext;
      //console.log(this.dynamicContext.sourceIDs);
      return true;
    }
    // else {
    //   // dynamicContext 생성 조건(입력된 sourceID 값이 존재해야함)이 맞지 않으면 부모 dynamicContext 를 자신에게 대입한다.
    //   this.dynamicContext = this.parentDynamicContext;
    // }

    return false;
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
    let dc = this.availableDynamicContext;

    if (dc) {
      let solvedText = dc.interpret(text);
      //console.log(this.dynamicContext, this);

      return solvedText;
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
        // console.log('get repeat-n');
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