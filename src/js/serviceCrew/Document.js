"use strict";
import HTMLElementNode from './ElementNode/HTMLElementNode.js';
import StringElementNode from './ElementNode/StringElementNode.js';
import ReactElementNode from './ElementNode/ReactElementNode.js';
import GridElementNode from './ElementNode/GridElementNode.js';
import ElementNodeFactory from './ElementNode/Factory.js';

import _ from 'underscore';
import ObjectExplorer from '../util/ObjectExplorer.js';
import Factory from './ElementNode/Factory';
import async from 'async';
import Gelato from './StandAloneLib/Gelato';

class Document {

  constructor(_contextController, _documentParams, _documentDataObject, _fragmentOption) {
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
    this.rootElementNodes = [];
    this.elementNodes;
    this.pageCSS;

    // for runtime
    // 런타임중 변하는 HTML타입 컴포넌트의 CSS조각들을 중복되지 않게 모으기위함
    let fragmentOption = _fragmentOption || {};
    this.runtimeHTMLCSSRepo = {};
    this.runtimReactCSSRepo = {};
    this.contextController = _contextController;
    this.enableNavigate = fragmentOption.enableNavigate || false;
    this.screenSizing = 'desktop';
    this.params = _documentParams || {};

    console.log('Document Map', _documentDataObject);
    //////////////////////////
    // 처리로직
    //////////////////////////
    // 이미 있는 도큐맨트를 로드한 경우 데이터를 객체에 맵핑해준다.
    if (typeof _documentDataObject !== 'undefined') {
      this.id = _documentDataObject._id;
      this.documentID = _documentDataObject._id;
      this.documentName = _documentDataObject.name;
      this.documentTitle = _documentDataObject.title;
      this.documentCreate = _documentDataObject.created;
      this.documentUpdate = _documentDataObject.updated;
      this.lastElementId = _documentDataObject.lastElementId || 0;

      this.rootElementNodes = (_documentDataObject.rootElementNodes !== null && _documentDataObject.rootElementNodes !== undefined) ?
        this.newElementNode(_documentDataObject.rootElementNodes) : null;

      this.elementNodes = this.inspireElementNodes(_documentDataObject.elementNodes, this);
      this.pageCSS = _documentDataObject.pageCSS;
      this.pageScript = _documentDataObject.pageScript;
      this.refScriptIdList = _documentDataObject.refScriptIdList;
      this.refStyleIdList = _documentDataObject.refStyleIdList;
      this.customActions = _documentDataObject.customActions || {};
    } else {
      // 새 도큐먼트가 생성된것이다.
      this.documentCreate = new Date();
      this.lastElementId = 0;
      this.elementNodes = [];
      this.rootElementNodes = null;
      this.refScriptIdList = [];
      this.refStyleIdList = [];
      this.pageCSS = '';
      this.pageScript = '';
      this.customActions = {};
    }
  }

  setParam(_paramNS, _data) {
    this.params[_paramNS] = _data;
  }

  setParams(_params) {
    this.params = _params;
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

  // pageScript
  setPageScript(_pageScript) {
    this.pageScript = _pageScript;
  }

  // type
  setType(_type) {
    this.type = _type;
  }

  // rootElementNodes
  setrootElementNodes(_elementNode) {
    this.rootElementNodes = _elementNode;
  }


  setScreenSizing(_sizing) {
    this.screenSizing = _sizing;
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

  // rootElementNodes
  getrootElementNodes() {
    return this.rootElementNodes;
  }

  // pageCSS
  getPageCSS() {
    return this.pageCSS || '';
  }

  // pageScript
  getPageScript() {
    return this.pageScript;
  }

  // type
  getType() {
    return this.type;
  }

  getHTMLDocument() {
    return this.contextController.context.getDocument();
  }

  getScreenSizing() {
    return this.screenSizing;
  }

  ///////////////////////
  // documentUpdate
  documentUpdated() {
    this.documentUpdate = new Date();
  }

  ////////////////
  // removerootElementNodes
  removerootElementNodes() {
    this.setrootElementNodes(null);
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

  constructDOMChildren(_options, _complete) {
    let domChildren = [];

    async.eachSeries(this.rootElementNodes, function(_rootElementNode, _next) {
        _rootElementNode.constructDOMs(_options,
          function(_domList) {
            _domList.map(function(_dom) {
              if (_dom !== null) {
                domChildren.push(_dom);
              }
            });
            _next();
          })
      },
      function(_err) {
        _complete(domChildren);
      });
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

    var treeSearchResult = this.findRecursive(this.rootElementNodes, function(__e) {
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

  // ToDo...
  getCustomAction(_name) {

    if (this.customActions[_name] !== undefined) {
      return this.customActions[_name];
    }

    let gelato = Gelato.one();

    if (gelato !== null) {
      return gelato.getCustomAction(_name);
    }

    return null;
  }

  // analysisNeedBind() {
  //   console.log('analysis -', this.export());
  //
  //
  //
  //
  // }

  // elementNodeAnalysisBlockSetList 를 반환함
  detectElementBinders() {
    let elementNodeAnalysisBlockSetList = [];


    if (this.rootElementNodes !== null) {
      this.rootElementNodes.treeExplore(function(_elementNode) {
        let bindBlockSetList = _elementNode.detectInterpret();

        if (bindBlockSetList !== undefined) {

          elementNodeAnalysisBlockSetList.push({
            id: _elementNode.getId(),
            bindBlockSetList: bindBlockSetList
          });
        }
      });
    }

    return elementNodeAnalysisBlockSetList;
  }

  getAllBinderNSSet() {
    let elementBinderSet = this.detectElementBinders();

    let nsSet = new Set();

    elementBinderSet.map(function(_elementNodeAnalysis) {

      _elementNodeAnalysis.bindBlockSetList.map(function(_blockSet) {

        // 바인더에 네임스페이스를 추출하여 nsSet에 보관한다.
        let extractNS = _blockSet.binder.replace(/^\$\{\*([^\/]+)(\/.*)?}$/, '$1');
        nsSet.add(extractNS);
      });
    });

    return nsSet;
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
  //
  //   var eventCatcherKey = "onElementEvent_" + eventName;
  //
  //   if (typeof this[eventCatcherKey] !== 'function') {
  //     console.warn("Document 는 " + eventName + " ElementNode 이벤트를 처리 할 수 없습니다. \n처리자(" + eventCatcherKey + ")가 존재하지 않음.");
  //     return;
  //   }
  //
  //   // 처리 시작
  //   var result = this[eventCatcherKey](eventData, __ORIGIN__);
  //
  //   return result;
  // }

  buildByFragmentHTML(_fragmentHTML) {
    this.rootElementNodes = [];
    let domContainer = document.createElement('div');
    domContainer.innerHTML = _fragmentHTML;

    for (let i = 0; i < domContainer.children.length; i++) {
      let elementNode = Factory.takeElementNode(undefined, undefined, 'html', this, undefined);
      elementNode.buildByElement(domContainer.children[i]);
      this.rootElementNodes.push(elementNode);
    }

    domContainer.remove();
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
      //_id: this.id,
      name: this.getDocumentName(),
      title: this.getDocumentTitle(),
      //created: this.getDocumentCreate(),
      updated: this.getDocumentUpdate(),
      lastElementId: this.getLastElementId(),
      rootElementNodes: this.rootElementNodes.map(function(_rootElementNode) {
        return _rootElementNode.export();
      }),
      elementNodes: this.elementNodes.map(function(_elementNode) {
        return _elementNode.export();
      }),
      pageCSS: this.getPageCSS(),
      pageScript: this.getPageScript(),
      refStyleIdList: this.refStyleIdList,
      refScriptIdList: this.refScriptIdList,

      customActions: this.customActions
    }
  }
}

// Static Method
Document.analysisData = function(_data) {
  // ${ } *()
  //console.log('도큐먼트가 분석한다', _data);

  let analysisResult = {};

  ObjectExplorer.explore(_data, function(_fieldData) {

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