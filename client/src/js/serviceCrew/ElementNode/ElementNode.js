import events from 'events';

import ElementNodeMulti from './ElementNodeMulti';
import Returns from "../../Returns.js";
import Factory from './Factory.js';
import Identifier from '../../util/Identifier.js';
import ObjectExplorer from '../../util/ObjectExplorer.js';
import ObjectExtends from '../../util/ObjectExtends.js';
import ArrayHandler from '../../util/ArrayHandler';

import DynamicContext from './DynamicContext';
import DataResolver from '../DataResolver/Resolver';

import Action from '../Action';
import ActionResult from '../ActionResult';
import ScopeNodeFactory from './ScopeNode/Factory';
import ActionStore from '../Actions/ActionStore';
import FunctionStore from '../Functions/FunctionStore';

// Actions Import
import '../Actions/BasicElementNodeActions';

// Functions Import
import '../Functions/BasicFunctions';



import Point from '../../util/Point';

"use strict";

const SIGN_BY_ELEMENTNODE = 'EN';
const EVENT_EFFECT_MATCHER = /^([\w-]+)@([\w-]+)$/;
const MAX_RENDER_SERIAL_NUMBER = 700000;

class ElementNode {
  static get SIGN_BY_ELEMENTNODE() {
    return SIGN_BY_ELEMENTNODE;
  }

  constructor(_environment, _elementNodeDataObject, _preInjectProps, _isMaster) {
    //Object.assign(this, events.EventEmitter.prototype);
    ObjectExtends.liteExtends(this, events.EventEmitter.prototype);
    //_.extendOwn(this, Events.EventEmitter.prototype);
    this[SIGN_BY_ELEMENTNODE] = SIGN_BY_ELEMENTNODE;

    // 미리 삽입된 프로퍼티
    var preInjectProps = _preInjectProps || {};

    //////////////
    // 필드 정의
    ////////////////////////

    // environment profile
    this.id;
    this.type; // html / string / ~~react~~ / ~~grid~~ / ref
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
    this.pipeEvents;

    // date fields
    this.createDate;
    this.updateDate;

    // parent refference
    this.parent = null;


    this.realization = null;
    this.clonePool = []; // repeated
    this.cloned = false;
    this.backupDOM = null;
    this.forwardDOM = null;
    this.hiddenForwardDOM = null; // hidden construct 가 되었을 때 이전에 forwardDOM을 담는다.

    // Repeat by parent's Repeat Control
    this.isGhost = preInjectProps.isGhost || false; // 계보에 반복된 부모가 존재하는경우 자식노드의 경우 Ghost로 표시한다.
    this.isRepeated = preInjectProps.isRepeated || false; // repeat에 의해 반복된 ElementNode 플래그
    this.repeatOrder = preInjectProps.repeatOrder > -1 ? preInjectProps.repeatOrder : -1; // repeat에 의해 반복된 자신이 몇번째 반복요소인지를 나타낸다.
    this.repeatItem = preInjectProps.repeatItem || undefined;

    this.properties = _preInjectProps || {};

    this._environment = _environment;
    this.mode = 'normal';
    this.dynamicContext = null;
    // this.parentDynamicContext = _parentDynamicContext || null;
    this.defaultResolver = new DataResolver();
    this.nextSibling = null;
    this.prevSibling = null;

    // update Queue
    this.updateQueue = [];

    // 상위 forwardDOM 에서 차지중인 index 범위
    // repeater 의 경우 index 거리의 차이가 있으며
    // single 의 경우 x,y 값이 동일하며
    // hidden 으로 차지 하지 않는 경우 x,y 값이 -1이 된다.
    // forwardDOM 이 화면에 랜더링 되지 않은 경우도 x,y 값이 -1을 갖는다.
    this.indexOccupyRange = new Point(-1, -1);


    this.isAttachedDOM = false;

    // ElementNode 컴포넌트의 최상위 ElementNode
    this.isMaster = _isMaster || false;

    this.renderSerialNumber = 1;

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

  get properties() {
    return this._properties;
  }

  get scopeNodes() {
    return this._scopeNodes;
  }

  get nextSibling() {
    return this._nextSibling;
  }

  get prevSibling() {
    return this._prevSibling;
  }

  get isAttachedDOM() {
    return this._isAttachedDOM;
  }

  get environment() {
    return this.__environment;
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

  set properties(_properties) {
    this._properties = _properties;
  }

  set nextSibling(_e) {
    this._nextSibling = _e;
    if (this._nextSibling) {
      this._nextSibling._prevSibling = this;
    }
  }

  set prevSibling(_e) {
    this._prevSibling = _e;

    if (this._prevSibling) {
      this._prevSibling._nextSibling = this;
    }
  }

  set isAttachedDOM(_isAttachedDOM) {
    if (_isAttachedDOM !== this._isAttachedDOM) {
      this._isAttachedDOM = _isAttachedDOM;

      if (_isAttachedDOM === true) {

        this.tryEventScope('first-rendered', {}, null);
      } else {

        //this.tryEventScope('', {}, null);
      }
    }
  }

  set _environment(_env) {
    this.__environment = _env;
  }

  setEnvironment(_env) {
    this.environment = _env;
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

  get pipeEvents() {
    return this._pipeEvents;
  }

  getPipeEvent(_name) {
    return this._pipeEvents[_name];
  }

  hasPipeEvent(_name) {
    return this._pipeEvents[_name] ? true : false;
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

  set renderSerialNumber(_renderSerialNumber) {
    this._renderSerialNumber = _renderSerialNumber;
  }

  get renderSerialNumber() {
    return this._renderSerialNumber;
  }

  increaseRenderSerialNumber() {
    this.renderSerialNumber++;

    if (this.renderSerialNumber === MAX_RENDER_SERIAL_NUMBER) this.renderSerialNumber = 0;
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
  }

  set nodeEvents(_nodeEvents) {
    this._nodeEvents = _nodeEvents;
  }

  setEvent(_name, _value) {
    this._nodeEvents[_name] = _value;
  }

  set pipeEvents(_pipeEvents) {
    this._pipeEvents = _pipeEvents;
  }

  setPipeEvent(_name, _value) {
    this._pipeEvents[_name] = _value;
  }

  // controls
  setControls(_controls) {
    this.controls = _controls;
  }

  // comment : 주석
  setComment(_comment) {
    this.comment = _comment;
  }

  // runtime parameter 로 자신이 변경할 수 없고 외부에서 주입한 값에 따라 동작을 달리한다.
  getProperty(_propKey) {
    return this.properties[_propKey];
  }

  // runtime parameter 로 자신이 변경할 수 없고 외부에서 주입한 값에 따라 동작을 달리한다.
  setProperty(_propKey, _value) {
    this.properties[_propKey] = _value;
  }

  hasProperty(_propKey) {
    return this.properties.hasOwnProperty(_propKey);
  }


  constructDOMs(_options) {
    let that = this;

    try {
      // options.linkType = options.linkType || 'downstream'; // will deprecate
      _options.resolve = _options.resolve != undefined ? _options.resolve : true;
      // options.forward = options.forward != undefined ? options.forward : true;
      _options.keepDC = _options.keepDC != undefined ? _options.keepDC : false;
    } catch (_e) {
      /**
        _options 인자는 오직 Object만 입력 되어야 한다 null, undefined, NaN 은 허용하지 않는다.
        _options 객체는 랜러링 흐름에서 단 하나만 존재 하여야 하며 랜더링 중 값이 수정되면 다음 랜더링 대상이 그 값을 상속 받을 수 있도록 한다.
      **/

      throw new Error("_options is not normal Object");
    }

    let result = this.constructDOMsInner(_options);


    return result;
  }

  getDOMNode() {
    return this.forwardDOM;
  }



  attachForwardDOM(_target) {
    _target.appendChild(this.forwardDOM);
    this.isAttachedDOM = true;

    if (this.isMaster) {
      this.tryEventScope('did-mount', {}, null);
    }
    // this.forwardDOM = this.backupDOM;
    // this.backupDOM = null;
  }

  attachForwardDOMByReplace(_parentTarget, _old) {
    _parentTarget.replaceChild(this.forwardDOM, _old);
    this.isAttachedDOM = true;

    if (this.isMaster) {
      this.tryEventScope('did-mount', {}, null);
    }
    // this.forwardDOM = this.backupDOM;
    // this.backupDOM = null;
  }

  // 자신의 이전인덱스에 있는 형제중 상위 DOM에 부착된 가장 가까운 형제를 찾는다.
  getAttachedPrevSibling() {
    if (this.prevSibling) {
      if (this.prevSibling.isAttachedDOM === true) {
        return this.prevSibling;
      } else {
        return this.prevSibling.getAttachedPrevSibling();
      }
    }

    return null;
  }

  // 자신의 다음인덱스에 있는 형제중 상위 DOM에 부착된 가장 가까운 형제를 찾는다.
  getAttachedNextSibling() {
    if (this.nextSibling) {
      if (this.nextSibling.isAttachedDOM === true) {
        return this.nextSibling;
      } else {
        return this.nextSibling.getAttachedNextSibling();
      }
    }

    return null;
  }


  reconstructDOMs() {
    this.hiddenForwardDOM = this.forwardDOM;
    this.forwardDOM = null;

    this.treeExplore(function(_child) {
      _child.forwardDOM = null;
      _child.isAttachedDOM = false;
    });
  }

  /*
      ConstructDOMsInner

      Parameters
        _options  {
              resolve: boolean , default:true // 바인딩 진행 여부
              keelDC: boolean | 'once' , default:false // true - 전체 , false - 유지하지 않음, once - 단 한번 유지된다. constructDOMs 의 대상의 dc만 유지되며 그 하위의 ElementNode의 dc는 유지되지 않는다.
            }
      Return
        true or false
  */
  constructDOMsInner(_options) {
    // hidden 일 때 false
    let returnElementNodes = []; // 현재 생성된 DOM에 대응하는 ElementNode를 반환한다.

    this.scopesResolve();


    this.debug("construct", "start", _options);

    // DC 실행
    if (this.isDynamicContext() && this.dynamicContextPassive === false) {
      if (_options.keepDC === false || _options.keepDC === undefined) {
        this.executeDynamicContext();
      } else if (_options.keepDC === 'once') {
        _options.keepDC = false;
      }
    }

    // repeat 에 따라 자신이 하나 또는 하나이상이 될 수 있다.
    if (this.isRepeater()) {
      // repeat 처리

      let i = 0;
      let repeatSource = _options.resolve ? this.getControlWithResolve('repeat-n') : this.getControl('repeat-n');
      let repeatLength;

      let repeatedElementNode;
      let newClonePool = [];

      if (typeof repeatSource === 'object') {
        if (repeatSource !== null && repeatSource !== undefined) {
          repeatLength = repeatSource.length;
        }
      } else if (typeof repeatSource === 'string') {
        repeatLength = parseInt(repeatSource);
      } else {
        repeatLength = parseInt(repeatSource);
      }

      let prevElement = this.prevSibling; // 반복 요소는 자신이 복제되어 배열로 입력되므로 자신의 이전 형제가 첫 prevElement 로 세팅된다.
      for (i = 0; i < repeatLength; i++) {

        repeatedElementNode = this.clonePool[i];

        if (repeatedElementNode === undefined) {
          repeatedElementNode = Factory.takeElementNode(this.export(false, `@${i}`), {
            isGhost: true,
            repeatOrder: i,
            repeatItem: repeatSource[i],
            isRepeated: true
          }, this.getType(), this.environment, null);

          repeatedElementNode.setParent(this.parent);

          this.bindJoinEvents(repeatedElementNode);
        }

        repeatedElementNode.repeatItem = repeatSource[i];

        repeatedElementNode.prevSibling = prevElement;

        newClonePool.push(repeatedElementNode);

        if (repeatedElementNode.constructDOMs(_options).length > 0) {
          returnElementNodes.push(repeatedElementNode);
        }

        prevElement = repeatedElementNode;
      }

      /*************/
      // 제일 마지막 Element의 nextSibling을 자신의 nextSibling으로 세팅한다.
      if (prevElement) {
        prevElement.nextSibling = this.nextSibling;
      }

      // clone pool 이 변경되는 순간
      // 남은 clone 요소의 forwardDOM 을 제거한다.
      for (let remain = i; remain < this.clonePool.length; remain++) {
        // jquery 류의 Dom 조작 라이브러리와 호환을 위해 forwardDOM이 부모에 대해 유효할 때 remove를 하도록 한다.
        if (this.parent.forwardDOM.contains(this.clonePool[remain].forwardDOM)) {
          this.parent.forwardDOM.removeChild(this.clonePool[remain].forwardDOM);
        }

        this.clonePool[remain].isAttachedDOM = false;
      }

      this.clonePool = newClonePool;
    } else {

      // hidden 처리
      if (this.getControl('hidden') !== undefined || _options.hiddenForce) {
        let hidden = _options.resolve ? this.getControlWithResolve('hidden') : this.getControl('hidden');

        if (hidden === true || hidden === 'true' || _options.hiddenForce) {

          this.debug("construct", "hidden", _options);

          this.hiddenForwardDOM = this.forwardDOM;
          this.forwardDOM = null;

          if (this.treeExplore) {
            this.treeExplore(function(_child) {
              _child.forwardDOM = null;
              _child.isAttachedDOM = false;
            });
          }

          return [];
        }
      }

      let constructedDOM = this.constructDOM(_options);

      // root 로 시작된 render는 단 한번 생성되는 DOM을 forwardDOM 으로 바로 편입 시키며
      // root 가 아닌 render에서는 생성되는 DOM을 backupDOM 으로 사용한다.
      // if (_options.root) {
      //   this.forwardDOM = constructedDOM;
      //   _options.root = false;
      // } else {
      //   this.backupDOM = constructedDOM;
      // }

      // 부모 DOM트리에 부착되어 있다면  backupDOM으로 생성한다.
      if (this.isAttachedDOM) {
        //console.log('to backup', constructedDOM);
        this.backupDOM = constructedDOM;
      } else {
        //console.log('to forward', constructedDOM);
        this.forwardDOM = constructedDOM;
      }

      returnElementNodes.push(this);
    }

    return returnElementNodes;
  }

  // 단독으로 자신의 DOM을 생성하는 메서드
  constructDOM(_options) {
    this.increaseRenderSerialNumber();

    let htmlNode = this.createNode(_options);
    htmlNode.___en = this;
    htmlNode.__renderstemp__ = this.renderSerialNumber;

    // [2] Attribute and text 매핑
    this.mappingAttributes(htmlNode, _options);

    // [3] Children Construct
    if (this.type !== 'string') {
      // Event 바인딩
      this.bindDOMEvents(_options, htmlNode);
    }

    this.debug('construct', 'created htmlNode ', htmlNode);
    return htmlNode;
  }

  isRepeater() {
    return this.getControl('repeat-n') && !this.isRepeated;
  }

  scopesResolve() {
    let sn_len = this.scopeNodes.length;
    for (let i = 0; i < sn_len; i++) {
      if (this.scopeNodes[i].type === 'value' && this.scopeNodes[i].resolveOn) {
        // resolve 되는 결과는 오직 문자열로만 값을 받아 들인다.

        //this.scopeNodes[i].plainValue = this.interpret(this.scopeNodes[i].plainValue);

        try {
          this.scopeNodes[i].shapeValue = this.interpret(this.scopeNodes[i].plainValue);
        } catch (_e) {
          console.warn(_e);
        }
      }
    }
  }

  executeDynamicContext() {
    let that = this;
    // 새로 생성

    this.debug('dc', 'Execute Dynamic Context');


    /****************************************/
    /***** Emit Event 'will-dc-request' *****/
    /****************************************/
    that.tryEventScope('will-dc-request', {
      dynamicContext: this.dynamicContext
    }, null, function done(_result) {
      if (that.checkAfterContinue(_result) === false) return;

      that.rebuildDynamicContext();

      that.debug('dc', 'Will fire');
      try {
        that.dynamicContext.fire(function(_err) {
          that.debug('dc', 'burn');

          if (_err) return this.print_console_error(`DC Loading Error.`, 'Detail: ', _err);

          that.tryEventScope('will-dc-bind', {
            dynamicContext: that.dynamicContext
          }, null, function done(_result) {
            if (that.checkAfterContinue(_result) === false) return;

            that.update({
              keepDC: 'once'
            });

            that.tryEventScope('complete-bind', {
              dynamicContext: that.dynamicContext
            }, null);

          });
        });
      } catch (_e) {
        _e.message += that.DEBUG_FILE_NAME_EXPLAIN;
        throw _e;
      }
      return;

    });
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

  bindDOMEvents(options, _dom) {
    let eventKeys = Object.keys(this.nodeEvents);
    let that = this;

    // 자신에게 설정된 모든 이벤트를 Dom에 바인딩한다.
    // dom이 지원하지않는 이벤트(elementNode 전용 이벤트일 경우는 자동으로 무시된다.)
    eventKeys.map(function(_key, _i) {

      _dom.addEventListener(_key, function(_e) {
        console.log("DOM Event fire :" + _key);

        let eventReturn;

        that.tryEventScope(_key, {
          eventKey: _key
        }, _e, function(_result) {
          if (that.checkAfterContinue(_result) === false) return;
        });

        return eventReturn;
      });
    });
  }

  bindJoinEvents(_clonedElementNode) {

    // DC이벤트는 업데이트가 일어날 때 발생한다.
    if (this.hasEvent('will-dc-request-join')) {
      _clonedElementNode.on('event-join-will-dc-request', function(_eventName, _clone, _eventResult) {
        // Todo..
      });
    }

    if (this.hasEvent('will-dc-bind-join')) {
      _clonedElementNode.on('event-join-will-dc-join', function(_eventName, _clone, _eventResult) {
        // Todo..
      });
    }

    if (this.hasEvent('complete-bind-join')) {
      _clonedElementNode.on('event-join-complete-bind', function(_eventName, _clone, _eventResult) {
        // Todo..
      });
    }
  }


  isDynamicContext() {
    if (this.dynamicContextSID !== undefined) {
      return true;
    }
    return false;
  }

  resetDynamicContext() {
    let that = this;

    this.dynamicContext = null;

    if (this.isDynamicContext()) {

      this.rebuildDynamicContext();

      this.constructDOMs({});

      this.updateChild(this);
    } else {
      throw new Error("resetDynamicContext 실패. DynamicContext 가 아닙니다. " + `EN ID: ${this.id}`);
    }

  }

  rebuildDynamicContext() {
    let newDynamicContext = new DynamicContext(this.environment, {
      sourceIDs: this.interpret(this.dynamicContextSID),
      requestIDs: this.interpret(this.dynamicContextRID),
      namespaces: this.interpret(this.dynamicContextNS),
      injectParams: this.interpret(this.dynamicContextInjectParams)
    }, this.availableDynamicContext);
    // console.log(newDynamicContext);
    this.dynamicContext = newDynamicContext;
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
        // case "react":
        //   // react type Component 는 empty type elementNode에만 드랍할 수 있다.
        //   // react type component 는 실제로 elementNode가 생성되지는 않기 때문에 배제한다.
        //   //if (targetElementNode.getType() !== 'empty') return false;
        //   break;
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
    let that = this;
    if (parent.getType() === 'string') {
      return false;
    }


    // 부모의 자식 배열에서 나를 찾는다.
    var meIndex = ArrayHandler.findIndex(parent.children, function(_child) {
      return _child === that;
    });

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
    let that = this;
    if (parent.getType() === 'string') {
      return false;
    }

    var meIndex = ArrayHandler.findIndex(parent.children, function(_child) {
      return _child === that;
    });

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

  getPropertyOfMaster(_propKey) {
    let masterElementNode = this.getMaster();

    return masterElementNode.getProperty(_propKey);
  }

  getMaster() {
    let masterElementNode = null;

    if (this.isMaster) return this;

    this.climbParents(function(_forefatherEN) {
      if (_forefatherEN.isMaster) {

        masterElementNode = _forefatherEN;
        return null;
      }
    });

    if (masterElementNode !== null) {
      return masterElementNode;
    }

    console.error(`Not found Master ElementNode.`, this);
  }

  /////////////
  // String Resolve
  interpret(_matterText, _getFeature) {
    if (_matterText === undefined) return;

    let injectGetterInterface = {
      getAttribute: this.getAttrOnTree.bind(this),
      getScope: this.getScope.bind(this),
      getNodeMeta: this.getNodeMeta.bind(this), // en@

      // extraGetterInterface
      getFeature: _getFeature, // 사용 위치별 사용가능한 데이터 제공자
      getProperty: this.getPropertyOfMaster.bind(this), // old fragmentPram
      // todo .... geo 추가
      //  getAttributeResolve: this.getAttrOnTreeWithResolve
    };

    if (this.environment) {
      injectGetterInterface.executeI18n = this.environment.forInterpret_executeI18N_func; // with Framework
      injectGetterInterface.getENVConfig = this.environment.forInterpret_config_func; // with Framework
      // injectGetterInterface.getFragmentParam = this.environment.getParam.bind(this.environment); // to Property
      // injectGetterInterface.getElementNodeById = this.environment.findById.bind(this.environment);
    }

    let solved = _matterText;
    let dc = this.availableDynamicContext;

    try {
      if (dc) {
        solved = dc.interpret(solved, injectGetterInterface, this);
        return solved;
      } else {
        return this.defaultResolver.resolve(solved, injectGetterInterface, null, this);
      }
    } catch (_e) {

      // groupCollapsed 는 IE11부터
      console.groupCollapsed(`%c<BindError> ${_e.message} ${this.DEBUG_FILE_NAME_EXPLAIN}`, 'background: rgb(255, 235, 235); color: rgb(29, 29, 29); padding: 2px; font-weight: normal;');
      console.log(`Full sentence : ${_matterText}`);
      if (_e.interpretArguments) {
        console.log('BindBlock Arguments :', _e.interpretArguments);
      }
      console.log(_e.stack);
      console.groupEnd()
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

  getRepeatItemOnTree() {
    if (this.isRepeated) {
      return this.repeatItem;
    } else {
      // 자신의 부모로부터 반복 순번을 얻음
      let repeatItem = -1;

      this.climbParents(function(_parent) {
        if (_parent.isRepeated) {
          repeatItem = _parent.repeatItem;
          return null;
        }
      });

      if (repeatItem !== -1) {
        return repeatItem;
      } else {
        return undefined;
      }
    }
  }

  getAttrOnTree(_attrName, _resolving) {
    if (typeof this.getAttribute === 'function') {
      // 먼저 자신에게서 구한다.


      if (this.hasAttribute(_attrName)) {
        var attributeValue;

        attributeValue = this.getAttribute(_attrName);

        if (attributeValue !== undefined) {
          return _resolving ? this.interpret(attributeValue) : attributeValue;
        }
      }
    }

    let parentAttribute = null;
    this.climbParents(function(_parent) {
      if (_parent.hasAttribute(_attrName)) {
        var value = _parent.getAttribute(_attrName);

        if (value !== undefined) {
          parentAttribute = _resolving ? _parent.interpret(value) : value;
          return null;
        }
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

      switch (_type) {
        case "action":
          let action = ActionStore.instance().getAction(_name);
          // 부모트리상에도 Action이 없다면 ActionStore 에서 Action을 얻는다.
          return action ? this.__actionToActionScope(action) : null;

        case "function":
          let _function = FunctionStore.instance().getFunction(_name);

          return _function ? this.__functionToFunctionScope(_function) : null;
      }

      return null;
    }

    return scope;
  }

  getMyScope(_name, _type, _withString) {

    let findIndex = ArrayHandler.findIndex(this.scopeNodes, function(_scopeNode) {
      return _scopeNode.name === _name && _scopeNode.type === _type;
    });

    return this.scopeNodes[findIndex] || null;
  }

  // 추가...
  getNodeMeta(_metaName, _resolve) {
    switch (_metaName) {
      case "repeat-n":
        return this.getRepeatNOnTree();
      case "repeat-item":
        return this.getRepeatItemOnTree();
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
        // case "react":
        //   ObjectExplorer.explore(this.attributes, function(_key, _data) {
        //     extractedBlocks = self.extractBindBlocks(_data);
        //
        //     if (extractedBlocks !== null) {
        //       extractedBlocks.map(function(_block) {
        //         bindBlockSetList.push({
        //           key: _key,
        //           binder: _block
        //         });
        //       })
        //     }
        //   }, 'attributes');
        //
        //   ObjectExplorer.explore(this.getReactComponentProps(), function(_key, _data) {
        //     extractedBlocks = self.extractBindBlocks(_data);
        //
        //     if (extractedBlocks !== null) {
        //       extractedBlocks.map(function(_block) {
        //         bindBlockSetList.push({
        //           key: _key,
        //           binder: _block
        //         });
        //       })
        //     }
        //   }, 'reactComponentProps');
        //
        //   break;
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
    let foundDupl = ArrayHandler.findIndex(this.scopeNodes, function(_compareScopeNode) {
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


  /***************************************

    Value Scope 값 사용 및 조작 메서드 군

  *****/
  setValueScopeData(_scopeName, _scopeValue) {
    let valueScope = this.getScope(_scopeName, 'value');
    if (valueScope)
      valueScope.shapeValue = _scopeValue;
    else
      throw new Error(`선언 되지 않은 변수${_scopeName} 노드(<en:value>)의 값을 변경하려 합니다. <en:value name='${_scopeName}' ...></en:value>를 선언 해 주세요.`);
  }

  // Array 타입의 ValueScope 에 _scopeValue 를 push함
  pushToValueScopeArray(_scopeName, _value) {
    let valueScope = this.getScope(_scopeName, 'value');

    if (valueScope) {
      if (valueScope.dataType === 'array') {
        let array = valueScope.shapeValue;

        array.push(_value);

        valueScope.shapeValue = array;
      } else {
        throw new Error(`Array 타입이 아닌 변수[${_scopeName}] 에 Push 연산을 하려 합니다.\n array 타입인 변수를 사용 해 주세요.`);
      }
    } else
      throw new Error(`선언 되지 않은 변수[${_scopeName}] 노드(<en:value>)의 값을 변경하려 합니다.\n <en:value name='${_scopeName}' type='array' ...></en:value>를 선언 해 주세요.`);
  }

  popToValueScopeArray(_scopeName) {
    if (valueScope) {
      if (valueScope.dataType === 'array') {
        let array = valueScope.shapeValue;

        array.pop();

        valueScope.shapeValue = array;
      } else {
        throw new Error(`Array 타입이 아닌 변수[${_scopeName}] 에 Pop 연산을 하려 합니다.\n array 타입인 변수를 사용 해 주세요.`);
      }
    } else
      throw new Error(`선언 되지 않은 변수[${_scopeName}] 노드(<en:value>)의 값을 변경하려 합니다.\n <en:value name='${_scopeName}' type='array' ...></en:value>를 선언 해 주세요.`);
  }

  // Array 타입의 ValueScope 에 _scopeValue 를 push함
  popToValueScopeArrayByValue(_scopeName, _value) {
    let valueScope = this.getScope(_scopeName, 'value');

    if (valueScope) {
      if (valueScope.dataType === 'array') {
        let array = valueScope.shapeValue;
        let newArray = [];

        for (let i = 0; i < array.length; i++) {
          if (_value !== array[i]) newArray.push(array[i]);
        }

        valueScope.shapeValue = newArray;
      } else {
        throw new Error(`Array 타입이 아닌 변수[${_scopeName}] 에 PopByValue 연산을 하려 합니다.\n array 타입인 변수를 사용 해 주세요.`);
      }
    } else
      throw new Error(`선언 되지 않은 변수[${_scopeName}] 노드(<en:value>)의 값을 변경하려 합니다.\n <en:value name='${_scopeName}' type='array' ...></en:value>를 선언 해 주세요.`);
  }

  // Array 타입의 Value Scope내용에 _scopeValue가 존재 하는지 확인 하고
  // 존재하면 true를 반환 존재하지 않으면 false 를 반환
  // 이 메서드는 Processing Scope로 제공 되어야 한다.
  isValueInArrayValueScope(_scopeName, _scopeValue) {
    let valueScope = this.getScope(_scopeName, 'value');

    if (valueScope) {
      if (valueScope.dataType === 'array') {
        let array = valueScope.shapeValue;

        for (let i = 0; i < array.length; i++) {
          if (array[i] === _value) {
            return true;
          }
        }

        return false;
      } else {
        throw new Error(`Array 타입이 아닌 변수[${_scopeName}] 에 Push 연산을 하려 합니다.\n array 타입인 변수를 사용 해 주세요.`);
      }
    } else
      throw new Error(`선언 되지 않은 변수[${_scopeName}] 노드(<en:value>)의 값을 변경하려 합니다.\n <en:value name='${_scopeName}' type='array' ...></en:value>를 선언 해 주세요.`);
  }

  /******

    Value Scope 사용 및 조작 메서드 군 끝

  ****************************************/



  /******

    Pipe

  ****************************************/

  /*
    ElementNode 를 찾는다
  */
  getElementNodeByInterpretField(_fieldValue) {
    // delegate 값에 ElementNode ID 를 입력해도 되고, 바인딩블럭을 이용해 직접 ElementNode 객체를 얻도록 코드를 입력해도 된다.
    let delegateValue = this.interpret(_fieldValue);
    let foundEN;

    // interpret 된 delegateValue 의 데이터타입이 string이면 EN ID로 간주하며
    // 그 밖의 타입일 경우 ElementNode 객체로 간주한다.
    if (typeof delegateValue === 'string') {
      foundEN = this.getMaster().findById(_fieldValue);
    } else {
      foundEN = delegateValue;
    }

    if (foundEN && foundEN[SIGN_BY_ELEMENTNODE] === SIGN_BY_ELEMENTNODE) {
      return foundEN;
    }

    throw new Error(`${foundEN} is Not ElementNode. \nSEED:'${_fieldValue}'`);
  }

  ///////////////////////////////////// End Scope Logics ////////////////////////////////////////////


  /*
  ██████  ██ ██████  ███████
  ██   ██ ██ ██   ██ ██
  ██████  ██ ██████  █████
  ██      ██ ██      ██
  ██      ██ ██      ███████
  */
  findPipeEventOwner(_pipeEventName) {
    if (this.getPipeEvent(_pipeEventName) !== undefined) {
      return this;
    }

    let owner = null;
    this.climbParents(function(_elementNode) {
      if (_elementNode.getPipeEvent(_pipeEventName) !== undefined) {
        owner = _elementNode;
        return null;
      }
    });

    return owner;
  }

  executeEventPipe(_pipeName, _pipeEventObject, _completeProcess) {
    let pipeOwner = this.findPipeEventOwner(_pipeName);

    if (pipeOwner) {
      pipeOwner.__progressPipeEvent(_pipeName, _pipeEventObject, _completeProcess);
    } else {
      console.warn(`PIPE 를 Listen하는 ElementNode를 찾을 수 없습니다. PipeName: ${_pipeName}`);
    }
  }


  /*
      ███████ ██    ██ ███████ ███    ██ ████████ ███████
      ██      ██    ██ ██      ████   ██    ██    ██
      █████   ██    ██ █████   ██ ██  ██    ██    ███████
      ██       ██  ██  ██      ██  ██ ██    ██         ██
      ███████   ████   ███████ ██   ████    ██    ███████
  */

  // 이벤트 발생지점 이후 처리를 진행 할 것인가 말 것인가를 반환
  checkAfterContinue(_result) {
    if (_result) {
      if (_result.returns) {
        if (_result.returns.continue === false) {
          return false;
        }
      }
    } else if (_result === false) {
      return false;
    }

    return true;
  }

  // 이벤트가 바인드 되어 있다면 이벤트 처리 후 nextProcedure를 실행하고
  // 이벤트가 바인드 되어 있지 않다면 바로 _nextProcedure를 실행한다.
  tryEventScope(_name, _elementNodeEvent, _originDomEvent, _nextProcedure) {
    if (this.hasEvent(_name)) {
      // event 발생


      // 이벤트 실행 후 다음 function이 있냐에 따라 다음 처리를 수행한다.
      this.__progressEvent(_name, _elementNodeEvent, _originDomEvent, function done(_result) {

        // for original of clone
        //this.emit(`event-join-${_name}`, _name, this, result);

        if (typeof _nextProcedure === 'function') _nextProcedure(_result);
      });
    } else {

      // 이벤트에 해당되는 지점에서 이벤트에 관한 처리를 진행하려 하였지만
      // 등록된 이벤트가 없으므로 Event에 대한 처리는 진행하지 않으며 _nextProcedure가 등록되어 있다면
      // _nextProcedure를 호출하여 이벤트의 다음 처리를 진행한다.
      if (typeof _nextProcedure === 'function') _nextProcedure({});
    }
  }

  /**
    _name : Event의 이름
    _elementNodeEvent : ElementNode에서 생성된 이벤트 객체
    _originDomEvent : DOM Event 객체 ( DOM 이벤트 기반의 이벤트일 경우 세팅 )
    _completeProcess : 이벤트로 인해 시작된 Task 처리가 완료 되었을 때 호출 된다. ( chain 된 이벤트의 경우 chain 상의 마지막 Task 가 실행완료 된 후 실행 )
  */
  __progressEvent(_name, _elementNodeEvent, _originDomEvent, _completeProcess) {
    let eventDesc = this.getEvent(_name);

    this.__progressEventDesc(eventDesc, _elementNodeEvent, _originDomEvent, _completeProcess);
  }

  // PIPE 이벤트
  __progressPipeEvent(_name, _elementNodeEvent, _completeProcess) {
    let eventDesc = this.getPipeEvent(_name);
    console.log('pipe 실행', _name)
    this.__progressEventDesc(eventDesc, _elementNodeEvent, null, _completeProcess);
  }

  __progressEventDesc(_desc, _elementNodeEvent, _originDomEvent, _completeProcess) {
    if (_desc === undefined) return;


    if (typeof _desc === 'function') {

      this.__executeEventAsFunction(_desc, _elementNodeEvent, _originDomEvent, _completeProcess);
    } else if (/^\{\{.+?\}\}$/.test(_desc)) {

      this.__executeEventAsInterpret(_desc, _elementNodeEvent, _originDomEvent, _completeProcess);
    } else if (_desc.match(EVENT_EFFECT_MATCHER) !== null) {

      let scope = this.interpret(`{{<< ${_desc}}}`);
      if (!scope) throw new Error(` ${_desc} Task 를 찾지 못 하였습니다.`);


      switch (scope.type) {
        case "task": // Scope 의 종류가 TaskScopeNode 인가
          return this.__executeTask(scope, _elementNodeEvent, _originDomEvent, _completeProcess);
      }

      throw new Error(`아직 지원하지 않는 eventDescription 입니다. ${_desc}`);
    } else {
      throw new Error(`아직 지원하지 않는 eventDescription 입니다. \nDescription: ${_desc}`);
    }
  }

  __executeEventAsInterpret(_desc, _elementNodeEvent, _originDomEvent, _completeProcess) {
    let enEvent = _elementNodeEvent || {};
    if (_originDomEvent) {
      enEvent.originEvent = _originDomEvent;
    }

    let interpretResult = this.interpret(_desc, function getFeature(_target) {
      switch (_target) {
        case "event":
          return enEvent;
      }
    });

    _completeProcess(interpretResult);
  }

  /*
    eventListener 로 function이 입력되어 있을 경우 이 메서드를 타게된다.
    eventListener로 입력된 function은 실행 될 때 인자로 event 객체와 _completeProcess 콜백 함수가 주입된다.
  */
  __executeEventAsFunction(_funcDesc, _elementNodeEvent, _originDomEvent, _completeProcess) {
    let enEvent = _elementNodeEvent || {};
    if (_originDomEvent) {
      enEvent.originEvent = _originDomEvent;
    }

    _funcDesc.apply(this, [enEvent, _completeProcess]);
  }

  __executeTask(_taskScope, _enEvent, _originEvent, _completeProcess, _prevActionResult, _TASK_STACK, _mandator) {


    // Task 처리 위임
    // delegate 설정이 입력되어 있고 _mandator(위임자)가 undefined 로 입력되었을 때 위임을 진행한다.
    if (_taskScope.delegate !== null && _mandator === undefined) {

      let foundEN = this.getElementNodeByInterpretField(_taskScope.delegate);

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
      taskArgMatchIndex = ArrayHandler.findIndex(taskArgs, function(_taskArg) {
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

    let executor = this; // action 에 this로 바인딩 될 action실행자.
    if (_taskScope.executor !== null) {
      let foundEN = this.getElementNodeByInterpretField(_taskScope.executor);

      executor = foundEN;
    }

    // 액션을 실행하고 결과를 콜백으로 통보 받는다.
    //action.execute(executeParamMap, this, this.forwardDOM.ownerDocument.defaultView, function(_actionResult) {
    action.execute(executeParamMap, executor, _prevActionResult, function(_actionResult) {
      let chainedTask;

      // task chain 처리
      if (_actionResult !== undefined) {
        _actionResult.origin = 'task@' + _taskScope.name;

        if (/\w+/.test(_actionResult.code)) {
          let nextTaskName = _taskScope.getChainedTaskName(_actionResult.code);

          if (/\w+/.test(nextTaskName || '')) {
            chainedTask = that.__getTask(nextTaskName);

            // code 에 대응하는 task 명이 지정되어 있지만
            // getTask 로 지정된 Task를 가져오지 못 했을 때 에러를 발생한다.
            // 비선언 에러
            if (!chainedTask) {
              throw new Error(`선언되지 않은 Task를 체인으로 지정하였습니다.\n지정된 TaskName: [${nextTaskName}], 체인을 실행시킨 Task: [${_taskScope.name}], EID:[${that.id}]`);
            }
          }
        }

        if (chainedTask)
          that.__executeTask(chainedTask, _enEvent, _originEvent, _completeProcess, _actionResult, __TASK_STACK__);
        else {
          if (typeof _completeProcess === 'function') _completeProcess(_actionResult);
        }
      }
    });
  }

  /*
           █████   ██████ ████████ ██  ██████  ███    ██        ██        ████████  █████  ███████ ██   ██
          ██   ██ ██         ██    ██ ██    ██ ████   ██        ██           ██    ██   ██ ██      ██  ██
          ███████ ██         ██    ██ ██    ██ ██ ██  ██     ████████        ██    ███████ ███████ █████
          ██   ██ ██         ██    ██ ██    ██ ██  ██ ██     ██  ██          ██    ██   ██      ██ ██  ██
          ██   ██  ██████    ██    ██  ██████  ██   ████     ██████          ██    ██   ██ ███████ ██   ██
  */

  // scope에서 먼저 action을 찾고
  __getAction(_actionName) {
    let actionScope = this.getScope(_actionName, 'action');

    if (actionScope !== null) return this.__actionScopeToAction(actionScope);

    // actionStore 에서 action가져와서 반환
    return ActionStore.instance().getAction(_actionName);
  }

  __actionScopeToAction(_actionScope) {
    let action = new Action({
      name: _actionScope.name,
      params: _actionScope.params,
      actionBody: _actionScope.actionBody
    });

    return action;
  }

  __actionToActionScope(_action) {
    let actionScopeClass = ScopeNodeFactory.getClass('action');

    return new actionScopeClass({
      name: _action.name,
      params: _action.params,
      actionBody: _action.actionBody
    });
  }

  __functionToFunctionScope(_function) {
    let functionScopeClass = ScopeNodeFactory.getClass('function');
    let functionScope = new functionScopeClass({
      name: _function.name,
      functionReturner: null
    });

    functionScope.executableFunction = _function.executableFunction;

    return functionScope;
  }

  __getTask(_taskName) {
    return this.interpret(`{{<< task@${_taskName}}}`);
  }

  // Event end

  update(_options) {
    let that = this;
    /************************************/
    /***** Emit Event 'will-update' *****/
    /************************************/
    this.tryEventScope('will-update', {}, null, function done(_result) {
      if (that.checkAfterContinue(_result) === false) return;

      that.updateForwardDOM(_options);
    });
  }

  updateForwardDOM(_options) {
    let that = this;

    this.constructDOMs(_options || {});


    if (this.parent !== null) {
      this.parent.updateChild(this);
    } else {
      if (this.backupDOM !== null)
        this.applyForward();
    }

    /***
      root 일 경우 랜더링을 통해 영역에 부착 하도록 하는 로직 필요.
      ** environment 와 elementNode 의 결합관계를 제거해야함 **
    ***/

    /***********************************/
    /***** Emit Event 'did-update' *****/
    /***********************************/
    this.tryEventScope('did-update', {}, null);
  }



  /*
      ██████  ██    ██ ██████  ██      ██  ██████      █████  ██████  ██
      ██   ██ ██    ██ ██   ██ ██      ██ ██          ██   ██ ██   ██ ██
      ██████  ██    ██ ██████  ██      ██ ██          ███████ ██████  ██
      ██      ██    ██ ██   ██ ██      ██ ██          ██   ██ ██      ██
      ██       ██████  ██████  ███████ ██  ██████     ██   ██ ██      ██
  */
  setValue(_name, _value) {
    this.setValueScopeData(_name, _value);
  }

  getValue(_name) {

    let valueScope = this.getScope(_name, 'value');

    if (valueScope)
      return valueScope.shapeValue;
    else
      throw new Error(`선언 되지 않은 변수[${_name}]를 참조합니다.`);
  }

  executeDC() {
    this.executeDynamicContext();
  }

  executeTask() {
    let taskScope = this.getScope(arguments[0], 'task');
    if (!taskScope) {
      throw new Error(`Task를 찾을 수 없습니다. "${arguments[0]}"`);
    }

    if (arguments.length === 3) {
      /*
        arguments[0] : TaskName
        arguments[1] : prevResult
        arguments[2] : completeCallback
      */

      this.__executeTask(taskScope, {}, null, arguments[2] || function() {}, arguments[1]);
    } else if (arguments.length === 2) {
      /*
        arguments[0] : TaskName
        arguments[1] : completeCallback
      */

      this.__executeTask(taskScope, {}, null, arguments[1] || function() {});
    }
  }

  executeTaskWithPrevResult(_taskName, _prevActionResult, _completeProcess) {
    let taskScope = this.getScope(_taskName, 'task');

    // if (_prevActionResult) {
    //   if (_prevActionResult.clazz !== "ActionResult") {
    //     throw new Error("직접 Task 를 실행할 때 3번째 인자로 ActionResult 객체를 입력해 주세요.");
    //   }
    // }

    this.__executeTask(taskScope, {}, null, _completeProcess, _prevActionResult);
  }

  getFunction(_functionName) {
    let functionScope = this.getScope(_functionName, 'function');
    return functionScope.executableFunction;
  }

  setEventListener(_eventName, _eventDesc) {
    this.nodeEvents[_eventName] = _eventDesc;
  }

  setPipeEventListener(_eventName, _eventDesc) {
    this.pipeEvents[_eventName] = _eventDesc;
  }


  /*
      ██████  ███████ ██████  ██    ██  ██████  ███████ ██████
      ██   ██ ██      ██   ██ ██    ██ ██       ██      ██   ██
      ██   ██ █████   ██████  ██    ██ ██   ███ █████   ██████
      ██   ██ ██      ██   ██ ██    ██ ██    ██ ██      ██   ██
      ██████  ███████ ██████   ██████   ██████  ███████ ██   ██
  */

  /**
    Keys: dc, construct, hidden
  **/
  debug(_key) {
    if (this.type !== 'string') {
      if (this.hasAttribute('trace')) {


        if (!_key && !(args.length > 0)) throw new Error("Key 와 다음 내용을 입력하지 않았습니다. log사용을 위해서는 this.log(KEY, LOG MESSAGES ... )를 사용해야 합니다.");

        let trace = this.getAttribute('trace');
        if (trace === '') {
          console.info.apply(console, arguments);
          return;
        }

        let args = [];
        args.push(this.id);
        for (let i = 1; i < arguments.length; i++) {
          args.push(arguments[i]);
        }
        args.push(this);

        // trace = dc:error,construct:warn
        let keyPair = this.getAttribute('trace').split(',');
        for (let i = 0; i < keyPair.length; i++) {
          let keyAndLevel = keyPair[i].split(':');

          if (keyAndLevel[0] === _key) {
            switch (keyAndLevel[1]) {
              case "error":
                console.error.apply(console, args);
                break;
              case "info":
                console.info.apply(console, args);
                break;
              case "warn":
                console.warn.apply(console, args);
                break;
              case "debug":
                console.debug.apply(console, args);
                break;
              case "trace":
                console.trace.apply(console, args);
                break;
              default:
                console.log.apply(console, args);
            }
          }
        }
      }
    }
  }

  debugKeyToTitle(_key) {
    switch (_key) {
      case "dc":
        return "DynamicContext";
      case "construct":
        return "DOM Construct";
      default:
        return _key;
    }
  }

  setDebuggingInfo(_key, _value) {
    this.debuggingStore = this.debuggingStore || {};
    this.debuggingStore[_key] = _value;
  }

  getDebuggingInfo(_key, _value) {
    return (this.debuggingStore || {})[_key];
  }

  get DEBUG_FILE_NAME() {
    try {
      let master = this.getMaster();
      return master.getDebuggingInfo('FILE_NAME') || location.pathname;
    } catch (_e) {
      return `Unknown or ${  location.pathname }`;
    }
  }

  get DEBUG_FILE_NAME_EXPLAIN() {
    return `<From: ${this.DEBUG_FILE_NAME}>`;
  }

  print_console_warn() {
    let modifiedArgs = ObjectExtends.union(['Warning : '], ObjectExtends.arrayToArray(arguments), [this.DEBUG_FILE_NAME_EXPLAIN]);

    console.warn.apply(console, modifiedArgs);
  }

  print_console_info() {
    let modifiedArgs = ObjectExtends.union(['Info : '], ObjectExtends.arrayToArray(arguments), [this.DEBUG_FILE_NAME_EXPLAIN]);

    console.info.apply(console, modifiedArgs);
  }

  print_console_error() {
    let modifiedArgs = ObjectExtends.union(['Error : '], ObjectExtends.arrayToArray(arguments), [this.DEBUG_FILE_NAME_EXPLAIN]);

    console.error.apply(console, modifiedArgs);
  }

  throw_new_error(_message) {
    throw new Error('Error : ' + _message + ' ' + this.DEBUG_FILE_NAME_EXPLAIN);
  }



  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /* ------------------ Event Handing Methods End --------------------------------------------------------------------------------- */
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  import (_elementNodeDataObject) {
    this.id = _elementNodeDataObject.id || Identifier.genUUID().toUpperCase();
    this.type = _elementNodeDataObject.type;
    this.name = _elementNodeDataObject.name;

    this.dynamicContextPassive = _elementNodeDataObject.dynamicContextPassive;
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
    this.pipeEvents = _elementNodeDataObject.pipeEvents || {};

    this.comment = _elementNodeDataObject.comment || '';

    this.createDate = _elementNodeDataObject.createDate;
    this.updateDate = _elementNodeDataObject.updateDate;
  }


  //////////////////////////
  // export methods
  export (_withoutId, _idAppender) {
    var exportObject = {
      id: _withoutId ? undefined : this.id + (_idAppender || ''),
      type: this.getType(),
      name: this.getName(),
      controls: ObjectExtends.clone(this.getControls()),
      scopeNodes: ObjectExtends.clone(this.scopeNodes.map(function(_scopeNode) {
        return _scopeNode.export();
      })),
      nodeEvents: ObjectExtends.clone(this.nodeEvents),
      pipeEvents: ObjectExtends.clone(this.pipeEvents),
      comment: this.getComment(),
      componentName: this.getComponentName(),
      createDate: (new Date(this.createDate)).toString(),
      updateDate: (new Date(this.updateDate)).toString(),
    };

    exportObject.dynamicContextPassive = this.dynamicContextPassive;
    exportObject.dynamicContextSID = this.dynamicContextSID;
    exportObject.dynamicContextRID = this.dynamicContextRID;
    exportObject.dynamicContextNS = this.dynamicContextNS;
    exportObject.dynamicContextInjectParams = this.dynamicContextInjectParams;

    return exportObject;
  }

  clone() {
    let exported = this.export();
    return Factory.takeElementNode(exported, undefined, exported.type, this.environment, undefined);
  }

}


export default ElementNode;