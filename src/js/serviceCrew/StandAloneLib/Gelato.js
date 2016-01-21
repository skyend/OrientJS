import async from 'async';
import request from 'superagent';
import Sizzle from 'Sizzle';
import Loader from './Loader.js';
import Page from './Page';
import GelatoDocument from './GelatoDocument';
import Cookie from './Cookie';
import API from './API';
import DataResolver from '../DataResolver/Resolver';
import React from 'react';
import ReactDom from 'react-dom';
import _ from 'underscore';
import accounting from 'accounting';
import Superagent from 'superagent';
import Identifier from '../../util/Identifier';

import ActionResult from '../ActionResult';
import Action from '../Action';

let instance = null;

class Gelato {
  static one() {
    return instance;
  }

  constructor() {
    // Gelato가 둘 이상 생성되는 것을 방지 한다.
    (() => {
      if (instance !== null) throw new Error("Gelato is aleady running. Call Gelato.one() if you need to the gelato instance.");
      instance = this;
    })()

    // Gelato가 제공하는 DOM 선택자
    this.$ = Sizzle;

    // GelatoDocument 조작 객체
    this.GD = new GelatoDocument(document);
    // cookie 제어 객체
    this.cookie = new Cookie();
    // page 객체가 생성될 때 Page의 사양을 파악한다.
    this.page = new Page(document);
    this.api = new API();
    this.resolver = new DataResolver();

    this.customActions = {};

    this.helpRequest = function() {
      window.location.href = "";
    }


    this.addCustomAction('completeA', function(_complete, _string) {
      console.log('completeA ' + _string);
    });
  }

  // 서비스를 시작함
  // 1. Grid에서 프래그먼트를 필요로 하는 요소 찾기
  startup() {

    async.waterfall([
      (_cb) => {
        Loader.loadConfig((_result) => {
          console.log(_result);
          this.page.setConfig(_result);
          _cb();
        })
      }, (_cb) => { // fragment attach
        this.page.buildGridNode();
        this.page.render(function() {
          _cb();
        });
        // let fragmentFollowingGrids = this.page.analysisFragmentFollowing();
        //
        // // gridElement 에 Fragment 를 채운다.
        // this.page.fillAllFragmentOfGridElement(fragmentFollowingGrids, () => {
        //   console.log("Attached All Fragments");
        //   _cb();
        // });
      }, (_cb) => {
        // 다이나믹 컨텍스트 찾기.
        //this.page.processingAllDynamicContextInstances();
        _cb();

      }, (_cb) => {
        this.page.appendPageScripts(() => {

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
    return ReactDom()
  }

  get jsxCompiler() {
    return null;
  }

  get currencyFormatter() {
    return accounting;
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


  en(_domElement) {
    if (_domElement.isElementNode) return _domElement;

    return _domElement.___en || null;
  }

  addCustomAction(_name, _actionFunc) {
    if (this.customActions[_name] !== undefined) throw new Error(`${name} is already exists action.`);

    this.customActions[_name] = _actionFunc;
  }

  getCustomAction(_name) {
    return this.customActions[_name];
  }
}

export default Gelato;