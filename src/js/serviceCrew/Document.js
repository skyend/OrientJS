"use strict";
import HTMLElementNode from './ElementNode/HTMLElementNode.js';
import StringElementNode from './ElementNode/StringElementNode.js';
import EmptyElementNode from './ElementNode/EmptyElementNode.js';
import ReactElementNode from './ElementNode/ReactElementNode.js';
import GridElementNode from './ElementNode/GridElementNode.js';
import ElementNodeFactory from './ElementNode/Factory.js';

import _ from 'underscore';
import ObjectExplorer from '../util/ObjectExplorer.js';

class Document {

  constructor(_contextController, _documentParams, _documentDataObject) {
    //////////////
    // 필드 정의
    ////////////////////////
    // document profile
    this.documentName;
    this.documentTitle;

    // date fields
    this.documentCreate;
    this.documentUpdate;

    // elementLastId
    this.lastElementId;

    // document elements
    this.rootElementNode = null;
    this.elementNodes;
    this.pageCSS;

    // for runtime
    // 런타임중 변하는 HTML타입 컴포넌트의 CSS조각들을 중복되지 않게 모으기위함
    this.runtimeHTMLCSSRepo = {};
    this.runtimReactCSSRepo = {};
    this.contextController = _contextController;


    this.params = _documentParams || {};

    console.log('Document Map', _documentDataObject);
    //////////////////////////
    // 처리로직
    //////////////////////////
    // 이미 있는 도큐맨트를 로드한 경우 데이터를 객체에 맵핑해준다.
    if (typeof _documentDataObject !== 'undefined') {
      this.documentID = _documentDataObject._id;
      this.documentName = _documentDataObject.name;
      this.documentTitle = _documentDataObject.title;
      this.documentCreate = _documentDataObject.created;
      this.documentUpdate = _documentDataObject.updated;
      this.lastElementId = _documentDataObject.lastElementId || 0;

      this.rootElementNode = (_documentDataObject.rootElementNode !== null && _documentDataObject.rootElementNode !== undefined) ?
        this.newElementNode(_documentDataObject.rootElementNode) : null;

      this.elementNodes = this.inspireElementNodes(_documentDataObject.elementNodes, this);
      this.pageCSS = _documentDataObject.pageCSS;
      this.refScriptIdList = _documentDataObject.refScriptIdList;
      this.refStyleIdList = _documentDataObject.refStyleIdList;

    } else {
      // 새 도큐먼트가 생성된것이다.
      this.documentCreate = new Date();
      this.lastElementId = 0;
      this.elementNodes = [];
      this.rootElementNode = null;
      this.refScriptIdList = [];
      this.refStyleIdList = [];
      this.pageCSS = '';
    }
  }

  setParam(_paramNS, _data) {
    this.params[_paramNS] = _data;
  }

  ////////////////////
  // Setters
  // documentName
  setDocumentName(_documentName) {
    this.documentName = _documentName;
  }

  // documentTitle
  setDocumentTitle(_documentTitle) {
    this.documentTitle = _documentTitle;
  }

  // pageCSS
  setPageCSS(_pageCSS) {
    this.pageCSS = _pageCSS;
  }

  // type
  setType(_type) {
    this.type = _type;
  }

  // rootElementNode
  setRootElementNode(_elementNode) {
    this.rootElementNode = _elementNode;
  }

  ////////////////////
  // Getters
  getParam(_paramNS) {
    return this.params[_paramNS];
  }

  // documentID
  getDocumentID() {
    return this.documentID;
  }

  // documentName
  getDocumentName() {
    return this.documentName;
  }

  // documentTitle
  getDocumentTitle() {
    return this.documentTitle;
  }

  getDocumentCreate() {
    return this.documentCreate;
  }

  // documentTitle
  getDocumentUpdate() {
    return this.documentUpdate;
  }

  // lastElementId
  getLastElementId() {
    return this.lastElementId;
  }

  // elementNodes
  getElementNodes() {
    return this.elementNodes;
  }

  // rootElementNode
  getRootElementNode() {
    return this.rootElementNode;
  }

  // pageCSS
  getPageCSS() {
    return this.pageCSS || '';
  }

  // type
  getType() {
    return this.type;
  }

  getHTMLDocument() {
    return this.contextController.context.getDocument();
  }

  ///////////////////////
  // documentUpdate
  documentUpdated() {
    this.documentUpdate = new Date();
  }

  ////////////////
  // removeRootElementNode
  removeRootElementNode() {
    this.setRootElementNode(null);
    this.contextController.rootRender();
  }

  ////////////////////
  /****************
   * getReactTypeComponent
   *
   */
  getReactTypeComponent(_packageKey, _componentKey, _syncWindowContext) {
    return this.contextController.getReactComponentFromSession(_packageKey, _componentKey, _syncWindowContext);
  }

  ////////////////////
  /****************
   * getMyDirector ( getContextController )
   * 자신(Document)의 ContextController를 반환한다.
   */
  getContextController() {
    return this.contextController;
  }



  modifyElementGeometry(_elementNode, _key, _value, _screenMode) {

    if (_key === 'rectangle') {
      let keys = Object.keys(_value);

      keys.map(function(_key) {
        _elementNode.setRectanglePartWithScreenMode(_key, _value[_key], _screenMode);
      });
    }

  }

  ///////////
  /******************
   * appendHTMLElementNodeCSS
   *
   */
  appendHTMLElementNodeCSS(_key, _css) {
    this.runtimeHTMLCSSRepo[_key] = _css;
  }

  ///////////
  /******************
   * appendReactElementNodeCSS
   *
   */
  appendReactElementNodeCSS(_key, _css) {
    this.runtimReactCSSRepo[_key] = _css;
  }

  /*******
   * getHTMLElementNodeCSSLines
   * 모든 저장된 HTML타입의 요소를의 CSS를 모아서 문자열로 반환한다.
   *
   */
  getHTMLElementNodeCSSLines() {
    var keys = Object.keys(this.runtimeHTMLCSSRepo);
    var lines = "/* HTML Element Type Component CSS */\n";

    for (var i = 0; i < keys.length; i++) {
      lines += "/* :" + keys[i] + " */\n";
      lines += this.runtimeHTMLCSSRepo[keys[i]] + "\n";
    }

    return lines;
  }

  /*******
   * getReactElementNodeCSSLines
   * 모든 저장된 React타입의 요소를의 CSS를 모아서 문자열로 반환한다.
   *
   */
  getReactElementNodeCSSLines() {
    var keys = Object.keys(this.runtimReactCSSRepo);
    var lines = "/* React Element Type Component CSS */\n";

    for (var i = 0; i < keys.length; i++) {
      lines += "/* :" + keys[i] + " */\n";
      lines += this.runtimReactCSSRepo[keys[i]] + "\n";
    }

    return lines;
  }


  ///////////////
  /************
   * newElementNode
   * Document의 새 elementNode를 생성 모든 ElementNode는 이 메소드를 통하여 생성해야한다.
   */
  newElementNode(_elementNodeDataObject, _preInsectProps, _type) {

    let elementNode = ElementNodeFactory.takeElementNode(_elementNodeDataObject, _preInsectProps, _type, this);

    return elementNode;
  }

  newElementNodeFromComponent(_component) {

    var newElementNode = this.newElementNode(undefined, {}, _component.elementType);
    newElementNode.buildByComponent(_component);

    return newElementNode;
  }

  findById(_elementNodeId) {

    var treeSearchResult = this.findRecursive(this.rootElementNode, function(__e) {
      return __e.id == _elementNodeId;
    });

    if (treeSearchResult) return treeSearchResult;

    for (var i = 0; i < this.elementNodes.length; i++) {
      treeSearchResult = this.findRecursive(this.elementNodes[i], function(__e) {
        return __e.id == _elementNodeId;
      });

      if (treeSearchResult) return treeSearchResult;
    }

    return false;
  }

  findRecursive(_t, _finder) {
    var result = _finder(_t);
    if (result) {
      return _t;
    } else {
      if (_t.children !== undefined) {
        for (var i = 0; i < _t.children.length; i++) {
          var recvResult = this.findRecursive(_t.children[i], _finder);
          if (recvResult) {
            return recvResult;
          }
        }
      }

    }

    return false;
  }

  ///////////
  /********
   * cloneElement
   * 요소를 복제한다
   */
  cloneElement(_elementNode) {
    var elementNodeExportObject = _elementNode.export(true);
    var newClonedElementNode = this.newElementNode(elementNodeExportObject);

    return newClonedElementNode;
  }

  // getNewElementNodeId() {
  //   return ++(this.lastElementId);
  // };

  getElementNodeFromPool(_id) {
    var index = _.findIndex(this.elementNodes, function(__elementNode) {

      return __elementNode.getId() == _id;
    });

    return this.elementNodes[index];
  }


  getServiceManager() {
    return this.contextController.serviceManager;
  }

  /////////////////
  /***************
   * insertElementNode
   * @Param _insertType : 'appendChild' | 'insertBefore' | 'insertAfter'
   * @Param _elementNode
   * @Param _baseElementNode
   * @Return ElementNode{} : 생성된 ElementNode
   */
  insertElementNode(_insertType, _elementNode, _baseElementNode) {

    if (_insertType === 'appendChild') {

      // Empty Type의 ElementNode에 appendChild를 하려고 할때 ElementNode를 따로 저장하고 드롭 대상 ElementNode에 참조를 설정한다.
      if (_baseElementNode.getType() === 'empty') {
        // Empty Type Element의 참조 Type을 새로운 ElementNode로 동일하게 설정하고
        // 해당 요소의 Id를 참조 Target으로 설정한다.
        _baseElementNode.setRefferenceType(_elementNode.getType());
        _baseElementNode.setRefferenceTarget(_elementNode.getId());
        this.elementNodes.push(_elementNode);
      } else {
        _baseElementNode.appendChild(_elementNode);
      }
    } else if (_insertType === 'insertBefore') {
      if (_baseElementNode.getParent() === null) return null;

      _baseElementNode.insertBefore(_elementNode);
    } else if (_insertType === 'insertAfter') {
      if (_baseElementNode.getParent() === null) return null;

      _baseElementNode.insertAfter(_elementNode);
    }

    return _elementNode;
  }


  /********
   * Interpret
   *  텍스트를 분석하여 특정 패턴으로 제작된 문자열을 추출하고 해당 문자열 내의 내용을 해석하여 패턴과 해석결과를 치환 한다.
   * ${url:...} / ${field:... } / ${title:...}
   */
  interpret(_text) {
    var self = this;


    // 바인딩 문자열 단 하나만 있을 때는 replace를 하지 않고
    // 객체를 보존하여 반환하도록 한다.
    if (/^\$\{.*?\}$/.test(_text)) {
      let matched = _text.match(/(\${(.*?)})/);

      let signString = matched[2];

      return this.valueResolve(signString);
    } else {
      let valuesResolved = _text.replace(/(\${(.*?)})/g, function(_matched, _matched2, _signString) {
        return self.valueResolve(_signString);
      });

      return valuesResolved.replace(/(%{.*?})/g, function(_matched) {
        return self.processingFormularBlock(_matched);
      });
    }
  }

  valueResolve(_sign) {
    let self = this;
    var sampleResourceMap = {
      image01: 'http://html5up.net/uploads/demos/strongly-typed/images/pic01.jpg',
      image02: 'http://html5up.net/uploads/demos/strongly-typed/images/pic02.jpg',
      image03: 'http://html5up.net/uploads/demos/strongly-typed/images/pic03.jpg',
      image04: 'http://html5up.net/uploads/demos/strongly-typed/images/pic04.jpg',
      image05: 'http://html5up.net/uploads/demos/strongly-typed/images/pic05.jpg',
      image06: 'http://html5up.net/uploads/demos/strongly-typed/images/pic06.jpg',
      image07: 'http://html5up.net/uploads/demos/strongly-typed/images/pic07.jpg'
    }

    if (/^(\*?)([^:^*]*)$/.test(_sign)) {
      let matched = _sign.match(/^(\*?)(.*)$/);
      let firstMark = matched[1];
      let refValue = matched[2];


      if (firstMark === '*') {

        let splited = refValue.split(/\//);
        let ns = splited.shift();
        let detail = splited.length > 0 ? splited.join('/') : undefined;

        let param = self.getParam(ns);
        if (param === undefined) {
          return '`Error: No Param NS: ' + ns + '`';
        }
        //console.log(detail, param, splited, _refValue);
        ///css/contents-retrieve-by-name/custom?serviceId=56755571b88a6c2ffd90e8e9
        if (detail !== undefined) {
          return ObjectExplorer.getValueByKeyPath(param, detail) || '`Error: No Param ' + detail + ' in ' + ns + '`';
        } else {
          return param;
        }
      }

      return '`Error: Interpret Error`';
    } else if (/^\w+:.*$/.test(_sign)) {
      let matches = _sign.match(/^(\w+):(.*)$/);
      let kind = matches[1];
      let target = matches[2];
      //console.log(matches);
      if (kind === 'script') {
        let url = this.contextController.serviceManager.getScriptURLByName(target);

        return url;
      } else if (kind === 'style') {
        let url = this.contextController.serviceManager.getStyleURLByName(target);

        return url;
      } else if (kind === 'image') {
        let url = this.contextController.serviceManager.getImageURLByName(target);

        return url;
      } else if (kind === 'static') {
        let url = this.contextController.serviceManager.getImageStaticByName(target);

        return url;
      }
    }
    return '`Error: Interpret Syntax Error`';
  }



  processingFormularBlock(_blockString) {

    //console.log('processingFormularBlock');
    //console.log(_blockString);


    return _blockString;
  }


  // analysisNeedBind() {
  //   console.log('analysis -', this.export());
  //
  //
  //
  //
  // }



  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /* ------------------ Event Handing Methods ------------------------------------------------------------------------------------- */
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 동기 이벤트 핸들링
  // Base Method
  onEventTernel(_eventName, _eventData, __ORIGIN__) {
    var eventName = _eventName;
    var eventData = _eventData;

    var eventCatcherKey = "onElementEvent_" + eventName;

    if (typeof this[eventCatcherKey] !== 'function') {
      console.warn("Document 는 " + eventName + " ElementNode 이벤트를 처리 할 수 없습니다. \n처리자(" + eventCatcherKey + ")가 존재하지 않음.");
      return;
    }

    // 처리 시작
    var result = this[eventCatcherKey](eventData, __ORIGIN__);

    return result;
  }


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /* ------------------ Event Handing Methods End --------------------------------------------------------------------------------- */
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  //////////////////////////
  // import methods
  /*************
   * inspireElementNodes
   * ElementNode Data객체 리스트를 실제 ElementNode 객체 리스트로 변환한다.
   * @Param _elementNodeDataList : JSON Array
   */
  inspireElementNodes(_elementNodeDataList) {
    if (typeof _elementNodeDataList === 'undefined' || _elementNodeDataList === null) return []; // object가 아니면 빈 배열을 리턴한다.
    if (typeof _elementNodeDataList.length !== 'number') throw new Error("element nodes is not Array.");
    var list = [];

    for (var i = 0; i < _elementNodeDataList.length; i++) {
      list.push(this.newElementNode(_elementNodeDataList[i]));
    }

    return list;
  }

  //////////////////////////
  // export methods
  export (_withoutElementNodes) {
    return {
      //_id: this.getDocumentID(),
      name: this.getDocumentName(),
      title: this.getDocumentTitle(),
      //created: this.getDocumentCreate(),
      updated: this.getDocumentUpdate(),
      lastElementId: this.getLastElementId(),
      rootElementNode: (this.rootElementNode !== null ? this.rootElementNode.export() : null),
      elementNodes: this.elementNodes.map(function(_elementNode) {
        return _elementNode.export();
      }),
      pageCSS: this.getPageCSS(),
      refStyleIdList: this.refStyleIdList,
      refScriptIdList: this.refScriptIdList
    }
  }
}


function objectExplore(_object, _explorer) {
  let oType = typeof _object;

  if (oType === 'undefined') {
    return;
  } else if (oType === 'number') {
    _explorer(_object);
  } else if (oType === 'boolean') {
    _explorer(_object);
  } else if (oType === 'string') {
    _explorer(_object);
  } else if (oType === 'object') {
    if (_object === null) {
      return;
    } else if (_object.length !== undefined && typeof _object.length === 'number') {
      let item;
      for (let i = 0; i < _object.length; i++) {
        item = _object[i];

        objectExplore(item, _explorer);
      }
    } else {
      let keys = Object.keys(_object);
      let key;
      for (let i = 0; i < keys.length; i++) {
        key = keys[i];

        objectExplore(_object[key], _explorer);
      }
    }
  }
}

// Static Method
Document.analysisData = function(_data) {
  // ${ } *()
  //console.log('도큐먼트가 분석한다', _data);

  let analysisResult = {};

  objectExplore(_data, function(_fieldData) {

    // find Bind
    if (/\$\{\*.+?(\/.+?)?\}/.test(_fieldData)) {
      //console.log("find bind", _fieldData);

      let matches = _fieldData.match(/\$\{\*(.+?)(\/(.+?))?\}/);
      let ns = matches[1];
      let detailPath = matches[3];

      //console.log('Matches', ns, detailPath);

      if (analysisResult[ns] === undefined) {
        analysisResult[ns] = [];
      }

      analysisResult[ns].push(detailPath);
    }
  });

  return analysisResult;
}

module.exports = Document;