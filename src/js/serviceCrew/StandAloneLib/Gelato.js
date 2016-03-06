import async from 'async';
import request from 'superagent';
import Sizzle from 'Sizzle';
import React from 'react';
//import ReactDom from 'react-dom';
import _ from 'underscore';
import accounting from 'accounting';
import Superagent from 'superagent';

import events from 'events';

import Loader from './Loader.js';
import Page from './Page';
import GelatoDocument from './GelatoDocument';
import Cookie from './Cookie';
import API from './API';
import DataResolver from '../DataResolver/Resolver';
import Identifier from '../../util/Identifier';
import ObjectExtends from '../../util/ObjectExtends.js';
import ActionResult from '../ActionResult';
import Action from '../Action';
import ActionStore from '../Actions/ActionStore';
import Shortcut from '../DataResolver/Shortcut';
import FunctionStore from '../Functions/FunctionStore';


let instance = null;

const GELATO_VERSION = eval(`\'1.0.1\'`);

/**
  Version Description
  1.0.1

**/


class Gelato {
  static one() {
    return instance;
  }

  static get VERSION() {
    return GELATO_VERSION;
  }

  get VERSION() {
    return GELATO_VERSION;
  }

  constructor() {
    //Object.assign(this, events.EventEmitter.prototype);
    //_.extendOwn(this, events.EventEmitter.prototype);
    ObjectExtends.liteExtends(this, events.EventEmitter.prototype);

    // Gelato가 둘 이상 생성되는 것을 방지 한다.
    (() => {
      if (instance !== null) throw new Error("Gelato is aleady running. Call Gelato.one() if you need to the gelato instance.");
      instance = this;
    })()

    // Gelato가 제공하는 DOM 선택자
    this.$ = Sizzle;

    this.api = new API();
    this.resolver = new DataResolver();
    // cookie 제어 객체
    this.cookie = new Cookie();

    // GelatoDocument 조작 객체
    this.GD = new GelatoDocument(document);

    // page 객체가 생성될 때 Page의 사양을 파악한다.
    this.page = new Page(document);


    this.customActions = {};

    this.helpRequest = function() {
      window.location.href = "";
    }

    this.readyGelato = false;
  }

  // 서비스를 시작함
  // 1. Grid에서 프래그먼트를 필요로 하는 요소 찾기
  startup() {
    let that = this;

    async.waterfall([
      (_cb) => {
        Loader.loadConfig((_result) => {
          console.log(_result);
          this.page.setConfig(_result);

          // 스타일은 미리 입력해두어도 서비스 동작에 무관하므로 미리 입력.
          this.page.appendPageStyles();

          this.page.appendEarlyScripts(() => {
            _cb();
          });

        })
      }, (_cb) => { // fragment attach
        this.page.buildBodyFragment();

        //this.page.buildGridNode();
        this.page.render();

        _cb();
      }, (_cb) => {
        _cb();
      }, (_cb) => {
        this.page.appendPageScripts(() => {

          that.readyGelato = true;
          that.emit("load");
        });
      }
    ]);

  }

  /* public api */
  newDataResolver() {
    return new DataResolver();
  }

  getNewID() {
    return Identifier.genUUID();
  }

  get _() {
    return _;
  }

  get react() {
    return React;
  }

  get reactDom() {
    //return ReactDom()
  }

  get jsxCompiler() {
    return null;
  }

  get currencyFormatter() {
    return accounting;
  }

  get shortcuts() {
    return Shortcut;
  }

  get request() {
    //https://visionmedia.github.io/superagent
    return Superagent;
  }

  newActionResult() {
    return new ActionResult();
  }

  set navigate(_navigateString) {
    return window.location.href = _navigateString;
  }


  getENByDOM(_domElement) {
    if (_domElement.isElementNode) return _domElement;

    return _domElement.___en || null;
  }

  // addCustomAction(_name, _actionFunc) {
  //   if (this.customActions[_name] !== undefined) throw new Error(`${name} is already exists action.`);
  //
  //   this.customActions[_name] = _actionFunc;
  // }
  //
  // getCustomAction(_name) {
  //   return this.customActions[_name];
  // }
  getConfig(_key) {
    return this.page.config[_key];
  }

  interpret(_text, _defaultDataObject) {
    return this.resolver.resolve(_text, {
      getServiceConfig: this.getConfig.bind(this),
      executeI18n: this.page.executeI18n.bind(this.page)
    }, _defaultDataObject, this);
  }

  registerAction(_name, _paramKeys, _anonymousActionFunction) {
    let actionStore = ActionStore.instance();

    actionStore.registerAction(_name, _paramKeys, _anonymousActionFunction);
  }

  registerFunction(_name, _function) {
    let functionStore = FunctionStore.instance();

    functionStore.registerFunction(_name, _function);
  }

  get actionStore() {
    return ActionStore.instance();
  }

  get functionStore() {
    return FunctionStore.instance();
  }

  // 추가 shortcut 은 랜더링 전에 추가 되어야 한다.
  // 랜더링전에 shortcut 스크립트를 추가 하는 방법이 나오지 않는 이상 이 기능은 미뤄져야 한다.
  registerShotcut(_name, _shortcutFunc) {

  }

  // 최초 랜더링이 완료 되고 지정된 script 가 모두 로딩되었을 때 _func 인자로 들어온 함수를 실행한다.
  // gelato가 ready되고 난 후에 이벤트로 등록되는 함수의 경우 즉시 실행한다.
  ready(_func) {
    if (this.readyGelato) {
      _func();
    } else {
      this.on('load', _func);
    }
  }

  // 페이지에서 사용할 자원을 미리 로딩해둔다.
  // prepare 로 등록된 자원이 있을 경우 자원이 모두 로딩되기 전에는 startup 이 지연된다.
  prepare(_target, _path) {
    // target : fragment, shared, apisource, farmsource, i18n

  }
}

export default Gelato;