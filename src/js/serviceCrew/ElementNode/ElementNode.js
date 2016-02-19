import ElementNodeMulti from './ElementNodeMulti';
import React from 'react';
import Returns from "../../Returns.js";
import _ from 'underscore';
import Factory from './Factory.js';
import Identifier from '../../util/Identifier.js';
import ObjectExplorer from '../../util/ObjectExplorer.js';
import ObjectExtends from '../../util/ObjectExtends.js';

import DynamicContext from './DynamicContext';
import async from 'async';
import DataResolver from '../DataResolver/Resolver';

import Action from '../Action';
import ActionResult from '../ActionResult';
import ICEAPISource from '../ICEAPISource';
import events from 'events';
import ScopeNodeFactory from './ScopeNode/Factory';
import ActionStore from '../Actions/ActionStore';


// Actions Import
import '../Actions/BasicElementNodeActions';


import SA_Loader from '../StandAloneLib/Loader';
import Gelato from '../StandAloneLib/Gelato';
"use strict";


let EventEffectMatcher = /^([\w-]+)@([\w-]+)$/;

class ElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps) {
    //Object.assign(this, events.EventEmitter.prototype);
    ObjectExtends.liteExtends(this, events.EventEmitter.prototype);
    //_.extendOwn(this, Events.EventEmitter.prototype);

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

    this.nodeEvents;

    // date fields
    this.createDate;
    this.updateDate;

    // parent refference
    this.parent = null;


    this.realization = null;
    this.clonePool = []; // repeated
    this.cloned = false;
    this.backupDOM = null;
    this.clonedBackupDOMs = [];
    this.forwardDOM = null;
    this.clonedForwardDOMs = [];


    // Repeat by parent's Repeat Control
    this.isGhost = preInsectProps.isGhost || false; // 계보에 반복된 부모가 존재하는경우 자식노드의 경우 Ghost로 표시한다.
    this.isRepeated = preInsectProps.isRepeated || false; // repeat에 의해 반복된 ElementNode 플래그
    this.repeatOrder = preInsectProps.repeatOrder > -1 ? preInsectProps.repeatOrder : -1; // repeat에 의해 반복된 자신이 몇번째 반복요소인지를 나타낸다.

    this.environment = _environment;
    this.mode = 'normal';
    this.dynamicContext = null;
    // this.parentDynamicContext = _parentDynamicContext || null;
    this.defaultResolver = new DataResolver();


    // update Queue
    this.updateQueue = [];


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

  get scopeNodes() {
    return this._scopeNodes;
  }

  //
  // get parentDynamicContext() {
  //   return this._parentDynamicContext;
  // }


  // Setters
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

  set scopeNodes(_scopeNodes) {
    this._scopeNodes = _scopeNodes;
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

  get nodeEvents() {
    return this._nodeEvents;
  }

  getEvent(_name) {
    return this._nodeEvents[_name];
  }

  hasEvent(_name) {
    return this._nodeEvents[_name] ? true : false;
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

  set nodeEvents(_nodeEvents) {
    this._nodeEvents = _nodeEvents;
  }

  setEvent(_name, _value) {
    this._nodeEvents[_name] = _value;
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
          remaining
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
    let that = this;
    this.cloned = false; // clone 여부 플래그 construct시 매번 초기화 한다.

    // resolve 대상 scope의 resolve를 진행한다.
    this.scopesResolve();

    // hidden control 에 어떤 값이 입력되어 있을경우 hidden control이 바인딩 된 것이다.
    let isHiddenBind = this.getControl('hidden') !== undefined ? true : false;

    // [0] Before Controls
    if (isHiddenBind && (this.getControlWithResolve('hidden') === 'true' || this.getControlWithResolve('hidden') === true)) {

      this.hiddenConstruct(function() {
        _complete([]);
      });
    } else {
      // hidden control 에 값이 바인딩 되어 있고 forwardDOM이 null 로 지정되어 있을 경우 현재 블럭에 들어 선 것은
      // hidden 이 해제되어 랜더링 될 것을 의미한다. 그럴 경우 will-show 이벤트를 발생시킨다.
      if (isHiddenBind) {
        if (this.forwardDOM === null) {
          if (this.hasEvent('will-show')) {
            that.__progressEvent('will-show', {}, null, function done(_actionResult) {});
          }
        }
      }

      // Before Control
      // * hidden

      let options = _options || {};
      options.linkType = options.linkType || 'downstream'; // will deprecate
      options.resolve = options.resolve != undefined ? options.resolve : true;
      options.forward = options.forward != undefined ? options.forward : true;
      options.keepDC = options.keepDC != undefined ? options.keepDC : false;

      // DynamicContext
      if (options.keepDC == false) {
        let isBuiltDC = this.buildDynamicContext(); // dynamicContext 생성 호출  // 생성여부에 따라 true 또는 false 를 반환한다.

        // dc 가 생성되고 정해진 api을 실행한다.
        if (isBuiltDC) {

          if (this.hasEvent('will-dc-request')) {

            /****************************************/
            /***** Emit Event 'will-dc-request' *****/
            /****************************************/
            that.__progressEvent('will-dc-request', {
              dynamicContext: this.dynamicContext
            }, null, function done(_actionResult) {

              if (_actionResult && _actionResult.returns) {
                this.executeDynamicContext(options);
              }
            });
          } else {
            this.executeDynamicContext(options);
          }
        }
      } else if (options.keepDC === 'once') { // 한번 캐치 후 false 로 옵션 변경
        options.keepDC = false;
      }

      let repeatNumber = this.getControlWithResolve('repeat-n');

      // 하나이상의 요소를 생성하여 반환한다.
      // 반복인자가 유효하고 반복요소가 아닌 요소에 한해서 자신을 여러개 복제 하여 반환한다.
      if (/^\d+$/.test(repeatNumber) && !this.isRepeated) {
        this.multipleConstruct(repeatNumber, options, _complete);
      } else {
        this.singleConstruct(options, _complete);
      }
    }
  }

  hiddenConstruct(_complete) {
    let that = this;

    // 이전에 forwardDOM 이 존재 했을 경우
    // 이번 hide는 not hide 에서 hide로 상태가 변경되는 경우로 will hide를 발생시킨다.
    if (this.forwardDOM !== null) {

      if (this.hasEvent('will-hide')) {

        /**********************************/
        /***** Emit Event 'will-hide' *****/
        /**********************************/
        that.__progressEvent('will-hide', {}, null, function done() {
          that.forwardDOM = null;
          _complete();
        });
      } else {
        this.forwardDOM = null;
        _complete();
      }
    } else {

      this.forwardDOM = null;
      _complete();
    }
  }

  scopesResolve() {
    let sn_len = this.scopeNodes.length;
    for (let i = 0; i < sn_len; i++) {
      if (this.scopeNodes[i].type === 'value' && this.scopeNodes[i].resolveOn) {
        this.scopeNodes[i].shapeValue = this.interpret(this.scopeNodes[i].plainValue);
      }
    }
  }

  executeDynamicContext(_options) {
    let that = this;
    // 새로 생성

    this.dynamicContext.ready(function(_err) {

      if (_err === null) {

        that.dynamicContext.dataLoad(function(_err) {
          console.log('dataLoad', that.dynamicContext.apisources, that.dynamicContext);

          that.constructDOMs({
            forward: true,
            keepDC: 'once'
          }, function(_domList) {
            that.parent.forwardMe(that);

            /**************************************/
            /***** Emit Event 'complete-bind' *****/
            /**************************************/
            that.__progressEvent('complete-bind', {
              dynamicContext: that.dynamicContext
            }, null, function done() {});

          });
        });
      } else {
        console.warn("Todo Error Handling");
      }
    });

  }

  multipleConstruct(_repeatNumber, _options, _complete) {
    let that = this;
    let repeatedDomList = [];
    let clonedElementNodeList = [];
    let elementNode;
    let exportObject;

    this.cloned = true;

    async.eachSeries(_.range(parseInt(_repeatNumber)), function iterator(_i, _next) {
        exportObject = that.export();
        exportObject.id = exportObject.id + '@' + _i; // repeat-counting

        elementNode = that.clonePool[_i];

        if (elementNode === undefined) {
          elementNode = Factory.takeElementNode(exportObject, {
            isGhost: true,
            repeatOrder: _i,
            isRepeated: true
          }, that.getType(), that.environment, null);
          elementNode.setParent(that.parent);
        }

        clonedElementNodeList.push(elementNode);
        elementNode.constructDOMs(_options, function(_domList) {
          _domList.map(function(_dom) {
            repeatedDomList.push(_dom);
          });

          _next();
        });
      },
      function done(_err) {
        that.clonePool = clonedElementNodeList;

        if (_options.forward) {
          that.clonedForwardDOMs = repeatedDomList;
        } else {
          that.clonedBackupDOMs = repeatedDomList;
        }

        _complete(repeatedDomList);
      })
  }

  singleConstruct(_options, _complete) {

    // 하나의 요소만 생성하여 반환한다.
    // [1] Node 생성
    let htmlNode = this.createNode(_options);
    if (_options.forward) {
      this.forwardDOM = htmlNode;
    } else {
      this.backupDOM = htmlNode;
    }
    htmlNode.___en = this;

    //console.log(this, htmlNode);

    // [2] Attribute and text 매핑
    this.mappingAttributes(htmlNode, _options);

    // [3] Children Construct
    if (this.type !== 'string') {
      // Event 바인딩
      this.bindDOMEvents(_options, htmlNode);

      // backupDOM 으로 생성 될 때는 자식을 Link 하지 않는다.
      this.childrenConstructAndLink(_options, htmlNode, function() {
        _complete([htmlNode]);
      }, _options.forward ? true : false); // children 은 HTML의 자식돔트리도 포함 되지만 ReactType의 ReactElement도 포함된다.
    } else {
      _complete([htmlNode]);
    }
  }



  /*
    getForwardDOMs
     생성된 forwardDOM 리스트를 반환한다.
     clone 요소라면 clonePool의 DOM리스트를 반환한다.
  */
  getForwardDOMs() {
    if (this.cloned) {
      return this.clonedForwardDOMs;
      // return this.clonePool.map(function(_clonedElementNode) {
      //   return _clonedElementNode.forwardDOM;
      // });
    } else {
      return this.forwardDOM ? [this.forwardDOM] : [];
    }
  }

  getBackupDOMs() {
    if (this.cloned) {
      return this.clonedBackupDOMs;
      // return this.clonePool.map(function(_clonedElementNode) {
      //   return _clonedElementNode.forwardDOM;
      // });
    } else {
      return this.backupDOM ? [this.backupDOM] : [];
    }
  }


  // 자신의 backupDOM 을 forwardDOM에 반영한다.
  // TagBaseElementNode 와 StringElementNode 에서 오버라이드한다.
  applyForward() { // Done
    throw new Error('오버라이드 해야됨');
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

  bindDOMEvents(options, _dom) {
    let eventKeys = Object.keys(this.nodeEvents);
    let that = this;

    // 자신에게 설정된 모든 이벤트를 Dom에 바인딩한다.
    // dom이 지원하지않는 이벤트(elementNode 전용 이벤트일 경우는 자동으로 무시된다.)
    eventKeys.map(function(_key, _i) {
      _dom.addEventListener(_key, function(_e) {
        let preventDefault = true;
        let stopPropagation = true;
        let eventReturn;

        that.__progressEvent(_key, {
          eventKey: _key
        }, _e, function(_actionResult) {
          if (_actionResult) {
            eventReturn = _actionResult.returns;
          }
        });

        // preventDefault 와 stopPropagation 은 action으로 제어 하도록 한다.
        // 기본적으로 비활성화
        // if (preventDefault) _e.preventDefault();
        // if (stopPropagation) _e.stopPropagation();

        return eventReturn;
      });
    });
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

  getRootEnvironment() {

  }

  /////////////
  // String Resolve
  interpret(_matterText, _getFeature) {
    if (_matterText === undefined) return;

    let injectGetterInterface = {
      getAttribute: this.getAttrOnTree.bind(this),
      getScope: this.getScope.bind(this),
      getNodeMeta: this.getNodeMeta.bind(this),
      getFragmentParam: this.environment.getParam.bind(this.environment),

      // extraGetterInterface
      getFeature: _getFeature, // 사용 위치별 사용가능한 데이터 제공자
      getServiceConfig: this.environment.getServiceConfig.bind(this.environment),
      executeI18n: this.environment.executeI18n.bind(this.environment)
        // todo .... geo 추가
        //  getAttributeResolve: this.getAttrOnTreeWithResolve
    };

    let solved = _matterText;
    let dc = this.availableDynamicContext;

    if (dc) {
      solved = dc.interpret(solved, injectGetterInterface, this);
      return solved;
    } else {
      return this.defaultResolver.resolve(solved, injectGetterInterface, null, this);
    }
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

  getAttrOnTree(_attrName, _resolving) {
    if (_.isFunction(this.getAttribute)) {
      // 먼저 자신에게서 구한다.
      var attributeValue = this.getAttribute(_attrName);

      if (attributeValue !== undefined) {

        return _resolving ? this.interpret(attributeValue) : attributeValue;
      }
    }

    let parentAttribute = null;
    this.climbParents(function(_parent) {
      var value = _parent.getAttribute(_attrName);

      if (value !== undefined) {
        parentAttribute = _resolving ? _parent.interpret(value) : value;
        return null;
      }
    });

    if (parentAttribute !== null) {
      return parentAttribute;
    } else {
      return '`' + _attrName + '`is null';
    }
  }

  getScope(_name, _type, _withString) {
    let scope = this.getMyScope(_name, _type, _withString);

    if (scope === null) {
      if (this.parent !== null) return this.parent.getScope(_name, _type, _withString);
      return null;
    }

    return scope;
  }

  getMyScope(_name, _type, _withString) {

    let findIndex = _.findIndex(this.scopeNodes, function(_scopeNode) {
      return _scopeNode.name === _name && _scopeNode.type === _type;
    });

    return this.scopeNodes[findIndex] || null;
  }

  // 추가...
  getNodeMeta(_metaName, _resolve) {
    switch (_metaName) {
      case "repeat-n":
        return this.getRepeatNOnTree();
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


  ////////////////////////////////////////// Scope Logics ///////////////////////////////////////////

  // Done
  buildScopeNodeByScopeDom(_scopeDom) {
    let scopeDomNodeName = _scopeDom.nodeName;
    let scopeType;

    let matches = String(_scopeDom.nodeName).match(/^en:(\w+)$/i);

    if (matches === null) {
      // SCRIPT 블럭
      if (_scopeDom.nodeName === 'SCRIPT') {
        scopeType = _scopeDom.getAttribute("en-scope-type").toLowerCase();
      }
    } else {
      scopeType = matches[1].toLowerCase();
    }



    let ScopeNodeClass = ScopeNodeFactory.getClass(scopeType);
    let scopeNodeInstance = ScopeNodeClass.CreateByScopeDom(_scopeDom);

    return scopeNodeInstance;
  }

  // Done
  appendScopeNode(_scopeNode) {
    // 이미 존재하는 ScopeNode를 미리 찾아 중복을 체크한다.
    // 중복을 판별하는 필드는 type 과 name 이 사용된다.
    // 같은 타입간에 중복 name 은 사용이 불가능 하다.
    let foundDupl = _.findIndex(this.scopeNodes, function(_compareScopeNode) {
      return _compareScopeNode.type === _scopeNode.type && _compareScopeNode.name === _scopeNode.name;
    });

    // foundDupl 값이 -1 이 아니면 이미 존재하는 ScopeNode로 에러를 발생시킨다.
    if (foundDupl != -1) {
      throw new Error("이미 존재하는 ScopeNode 입니다. ScopeNode 는 같은 태그내에서 name 이 중복 될 수 없습니다. \n" + JSON.stringify(_scopeNode.export()));
    }

    this.scopeNodes.push(_scopeNode);
  }

  // ToDo... how? . uh
  updateScopeNode(_scopeNode) {

  }

  ///////////////////////////////////// End Scope Logics ////////////////////////////////////////////
  /**
    _name : Event의 이름
    _elementNodeEvent : ElementNode에서 생성된 이벤트 객체
    _originDomEvent : DOM Event 객체 ( DOM 이벤트 기반의 이벤트일 경우 세팅 )
    _completeProcess : 이벤트로 인해 시작된 Task 처리가 완료 되었을 때 호출 된다. ( chain 된 이벤트의 경우 chain 상의 마지막 Task 가 실행완료 된 후 실행 )

  */
  __progressEvent(_name, _elementNodeEvent, _originDomEvent, _completeProcess) {
    let eventDesc = this.getEvent(_name);
    if (eventDesc === undefined) return;

    if (eventDesc.match(EventEffectMatcher) !== null) {
      let scope = this.interpret(`{{<< ${eventDesc}}}`);
      if (!scope) throw new Error(` ${eventDesc} Task 를 찾지 못 하였습니다.`);

      switch (scope.constructor.name) {
        case "TaskScopeNode": // Scope 의 종류가 TaskScopeNode 인가
          return this.__executeTask(scope, _elementNodeEvent, _originDomEvent, _completeProcess);
      }

      throw new Error(`아직 지원하지 않는 eventDescription 입니다. ${eventDesc}`);
    } else {
      throw new Error(`아직 지원하지 않는 eventDescription 입니다. \nDescription: ${eventDesc}`);
    }
  }

  __executeTask(_taskScope, _enEvent, _originEvent, _completeProcess, _prevActionResult, _TASK_STACK, _mandator) {

    // Task 처리 위임
    // delegate 설정이 입력되어 있고 _mandator(위임자)가 undefined 로 입력되었을 때 위임을 진행한다.
    if (_taskScope.delegate !== null && _mandator === undefined) {

      // delegate 값에 ElementNode ID 를 입력해도 되고, 바인딩블럭을 이용해 직접 ElementNode 객체를 얻도록 코드를 입력해도 된다.
      let delegateValue = this.interpret(_taskScope.delegate);
      let foundEN;

      // interpret 된 delegateValue 의 데이터타입이 string이면 EN ID로 간주하며
      // 그 밖의 타입일 경우 ElementNode 객체로 간주한다.
      if (typeof delegateValue === 'string') {
        foundEN = this.environment.findById(_taskScope.delegate);
      } else {
        foundEN = delegateValue;
      }

      if (foundEN) {
        // 마지막 인자로 위임명령자(mandator, 자신)을 입력한다.
        foundEN.__executeTask(_taskScope, _enEvent, _originEvent, _completeProcess, _prevActionResult, _TASK_STACK, this);
      } else {
        throw new Error(`Not found Task delegate target[${_taskScope.delegate}].`);
      }

      return true;
    }

    let __TASK_STACK__ = _TASK_STACK || [];
    let that = this;
    let actionName = _taskScope.action;
    let action = this.__getAction(actionName);
    let executeParamMap = {}; // {paramName : inject Param Datas, ...}
    let taskArgs = _taskScope.args;
    let taskArgMatchIndex;
    let enEvent = _enEvent || {};
    if (_originEvent) {
      enEvent.originEvent = _originEvent;
    }

    if (!action) throw new Error(`${actionName} Action을 찾지 못 하였습니다.`);

    // action 이 필요로 하는 param에 값을 입력하기 위해
    // task 의 argument 리스트의 값을가져와 입력한다.
    // action 이 필요로 하지만 task 의 argument로 입력되지 않은 param 에는 undefined 를 입력한다.
    action.params.map(function(_paramKey) {
      taskArgMatchIndex = _.findIndex(taskArgs, function(_taskArg) {
        return _paramKey.toLowerCase() === _taskArg.name.toLowerCase();
      });

      if (taskArgMatchIndex != -1) {
        // executeParamMap[_paramKey] = that.interpret(taskArgs[taskArgMatchIndex].value, _prevActionResult, enEvent);

        // 하나의 태스크에는 한번의 위임만 일어날 수 있으며
        // 위임이 일어나고 위임된 Task 를 위임자가 처음 실행 할 때 인자값에 대한 바인딩은 위임을 명령한요소로 부터 진행한다.
        // interpret 를 처리 할 요소를 결정한다. _mandator(위임자, 위임명령자)가 입력되어 있을 경우 위임자로 부터 interpret를 진행하며
        // 위임자가 지정되지 않았을 때 자신으로 interpret 를 진행한다.
        executeParamMap[_paramKey] = (_mandator || that).interpret(taskArgs[taskArgMatchIndex].value,
          function getFeature(_target) {
            switch (_target) {
              case "event":
                return enEvent;
              case "prev-result":
                return _prevActionResult;
            }
          });

      } else {
        executeParamMap[_paramKey] = undefined;
      }
    });

    // _enEvent, domEvent와 이전 액션의 수행결과를 삽입
    executeParamMap['_event'] = _enEvent;
    executeParamMap['_originEvent'] = _originEvent;
    executeParamMap['_prevResult'] = _prevActionResult;

    // __TASK_STACK__.push({
    //   task: _taskScope,
    //   action: action,
    //   arguments: executeParamMap
    // });

    __TASK_STACK__.push(`${_taskScope.name}@${_taskScope.action}`, {
      task: _taskScope,
      action: action,
      paramMap: executeParamMap
    });

    if (_taskScope.trace) {
      console.warn(`TASK TRACE : ${_taskScope.name}@${_taskScope.action}`, __TASK_STACK__);
    }

    // 액션을 실행하고 결과를 콜백으로 통보 받는다.
    action.execute(executeParamMap, this, function(_actionResult) {
      let chainedTask;

      // task chain 처리
      if (_actionResult !== undefined) {
        if (_actionResult.taskChain) {

          chainedTask = that.__getTask(_actionResult.taskChain);

          if (!chainedTask) throw new Error(`${_actionResult.taskChain} Task 를 찾지 못 하였습니다.`);
        } else if (/\w+/.test(_actionResult.code)) {
          let nextTaskName = _taskScope.getChainedTaskName(_actionResult.code);

          chainedTask = that.__getTask(nextTaskName);
        }

        if (chainedTask)
          that.__executeTask(chainedTask, _enEvent, _originEvent, _completeProcess, _actionResult, __TASK_STACK__);
        else {
          _completeProcess(_actionResult);
        }
      }
    });
  }

  // scope에서 먼저 action을 찾고
  __getAction(_actionName) {
    let actionScope = this.getScope(_actionName, 'action');

    if (actionScope !== null) return this.__actionScopeToAction(actionScope);

    // actionStore 에서 action가져와서 반환
    return ActionStore.instance().getAction(_actionName);
  }

  __actionScopeToAction(_actionScope) {
    let action = new Action({
      params: _actionScope.params,
      actionBody: _actionScope.actionBody
    });

    return action;
  }

  __getTask(_taskName) {
    return this.interpret(`{{<< task@${_taskName}}}`);
  }

  // Event end



  refresh(_complete) {
    let that = this;

    if (this.hasEvent("will-refresh")) {

      /*************************************/
      /***** Emit Event 'will-refresh' *****/
      /*************************************/
      this.__progressEvent('will-refresh', {}, null, function done(_actionResult) {
        if (_actionResult.returns !== false) {
          that.refreshForwardDOM(function(_doms) {
            _complete(_doms);
          });
        }
      });
    } else {
      that.refreshForwardDOM(function(_doms) {
        _complete(_doms);
      });
    }
  }

  refreshForwardDOM(_complete) {
    let that = this;
    this.constructDOMs({}, function(_doms) {

      that.parent.forwardMe(that);

      _complete(_doms);

      if (that.hasEvent("did-refresh")) {

        /************************************/
        /***** Emit Event 'did-refresh' *****/
        /************************************/
        this.__progressEvent('did-refresh', {}, null, function done(_actionResult) {});
      }
    });
  }


  update(_complete) {
    let that = this;

    if (this.hasEvent('will-update')) {
      /************************************/
      /***** Emit Event 'will-update' *****/
      /************************************/
      this.__progressEvent('will-update', {}, null, function done(_actionResult) {
        if (_actionResult.returns !== false) {
          that.updateForwardDOM(function(_doms) {
            _complete(_doms);
          });
        }
      });
    } else {
      this.updateForwardDOM(function(_doms) {
        _complete(_doms);
      });
    }
  }

  updateForwardDOM(_complete) {
    let that = this;

    this.constructDOMs({
      forward: false
    }, function(_doms) {

      that.parent.applyMe(that);

      _complete(_doms);

      if (that.hasEvent("did-update")) {

        /************************************/
        /***** Emit Event 'will-update' *****/
        /************************************/
        this.__progressEvent('did-update', {}, null, function done(_actionResult) {});
      }
    });
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

    this.dynamicContextSID = _elementNodeDataObject.dynamicContextSID;
    this.dynamicContextRID = _elementNodeDataObject.dynamicContextRID;
    this.dynamicContextNS = _elementNodeDataObject.dynamicContextNS;
    this.dynamicContextInjectParams = _elementNodeDataObject.dynamicContextInjectParams;

    this.componentName = _elementNodeDataObject.componentName;

    this.controls = _elementNodeDataObject.controls || {
      'repeat-n': '',
      'hidden': ''
    };

    this.scopeNodes = _elementNodeDataObject.scopeNodes ? _elementNodeDataObject.scopeNodes.map(function(_scopeNodeObject) {
      return new(ScopeNodeFactory.getClass(_scopeNodeObject.type))(_scopeNodeObject);
    }) : [];

    this.nodeEvents = _elementNodeDataObject.nodeEvents || {};

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
      scopeNodes: _.clone(this.scopeNodes.map(function(_scopeNode) {
        return _scopeNode.export();
      })),
      nodeEvents: _.clone(this.nodeEvents),
      comment: this.getComment(),
      componentName: this.getComponentName(),
      createDate: (new Date(this.createDate)).toString(),
      updateDate: (new Date(this.updateDate)).toString(),
    }

    exportObject.dynamicContextSID = this.dynamicContextSID;
    exportObject.dynamicContextRID = this.dynamicContextRID;
    exportObject.dynamicContextNS = this.dynamicContextNS;
    exportObject.dynamicContextInjectParams = this.dynamicContextInjectParams;

    return exportObject;
  }

}


export default ElementNode;