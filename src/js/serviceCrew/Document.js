var ElementNode = require('./ElementNode.js');
var _ = require('underscore');

var Document = function(_contextController, _documentDataObject) {
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

  // document require resources
  this.usingResources;

  // for runtime
  // 런타임중 변하는 HTML타입 컴포넌트의 CSS조각들을 중복되지 않게 모으기위함
  this.runtimeHTMLCSSRepo = {};
  this.runtimReactCSSRepo = {};
  this.contextController = _contextController;



  //////////////////////////
  // 처리로직
  //////////////////////////
  // 이미 있는 도큐맨트를 로드한 경우 데이터를 객체에 맵핑해준다.
  if (typeof _documentDataObject !== 'undefined') {
    this.documentID = _documentDataObject.documentID;
    this.documentName = _documentDataObject.documentName;
    this.documentTitle = _documentDataObject.documentTitle;
    this.documentCreate = _documentDataObject.documentCreate;
    this.documentUpdate = _documentDataObject.documentUpdate;
    this.lastElementId = _documentDataObject.lastElementId || 0;

    this.rootElementNode = typeof _documentDataObject.rootElementNode === 'object' ?
      this.newElementNode(_documentDataObject.rootElementNode) : null;

    this.elementNodes = this.inspireElementNodes(_documentDataObject.elementNodes, this);
    this.pageCSS = _documentDataObject.pageCSS;
    this.usingResources = _documentDataObject.usingResources || {};


  } else {
    // 새 도큐먼트가 생성된것이다.
    this.documentCreate = new Date();
    this.lastElementId = 0;
    this.elementNodes = [];
    this.rootElementNode = null;
    this.usingResources = {};
    this.pageCSS = '';
  }
};

////////////////////
// Setters
// documentName
Document.prototype.setDocumentName = function(_documentName) {
  this.documentName = _documentName;
};
// documentTitle
Document.prototype.setDocumentTitle = function(_documentTitle) {
  this.documentTitle = _documentTitle;
};
// pa
// pageCSS
Document.prototype.setPageCSS = function(_pageCSS) {
  this.pageCSS = _pageCSS;

  this.contextController.updatePageCSS();
};
// type
Document.prototype.setType = function(_type) {
  this.type = _type;
};
// rootElementNode
Document.prototype.setRootElementNode = function(_elementNode) {
  this.rootElementNode = _elementNode;
};
////////////////////
// Getters
// documentID
Document.prototype.getDocumentID = function() {
  return this.documentID;
};
// documentName
Document.prototype.getDocumentName = function() {
  return this.documentName;
};
// documentTitle
Document.prototype.getDocumentTitle = function() {
  return this.documentTitle;
};
Document.prototype.getDocumentCreate = function() {
  return this.documentCreate;
};
// documentTitle
Document.prototype.getDocumentUpdate = function() {
  return this.documentUpdate;
};
// lastElementId
Document.prototype.getLastElementId = function() {
  return this.lastElementId;
};
// usingResources
Document.prototype.getUsingResources = function() {
  return this.usingResources;
};
Document.prototype.getScriptResources = function() {
  return this.usingResources.js;
};
Document.prototype.getStyleResources = function() {
  return this.usingResources.style;
};
// elementNodes
Document.prototype.getElementNodes = function() {
  return this.elementNodes;
};
// rootElementNode
Document.prototype.getRootElementNode = function() {
  return this.rootElementNode;
};
// pageCSS
Document.prototype.getPageCSS = function() {
  return this.pageCSS || '';
};
// type
Document.prototype.getType = function() {
  return this.type;
};
///////////////////////
// documentUpdate
Document.prototype.documentUpdated = function() {
  this.documentUpdate = new Date();
};

////////////////
// removeRootElementNode
Document.prototype.removeRootElementNode = function() {
  this.setRootElementNode(null);
  this.contextController.rootRender();
}

////////////////////
/****************
 * getReactTypeComponent
 *
 */
Document.prototype.getReactTypeComponent = function(_packageKey, _componentKey, _syncWindowContext) {
  return this.contextController.getReactComponentFromSession(_packageKey, _componentKey, _syncWindowContext);
};

////////////////////
/****************
 * getMyDirector ( getContextController )
 * 자신(Document)의 ContextController를 반환한다.
 */
Document.prototype.getMyDirector = Document.prototype.getContextController = function() {
  return this.contextController;
};


///////////
/******************
 * appendHTMLElementNodeCSS
 *
 */
Document.prototype.appendHTMLElementNodeCSS = function(_key, _css) {
  this.runtimeHTMLCSSRepo[_key] = _css;
};

///////////
/******************
 * appendReactElementNodeCSS
 *
 */
Document.prototype.appendReactElementNodeCSS = function(_key, _css) {
  this.runtimReactCSSRepo[_key] = _css;
};

/*******
 * getHTMLElementNodeCSSLines
 * 모든 저장된 HTML타입의 요소를의 CSS를 모아서 문자열로 반환한다.
 *
 */
Document.prototype.getHTMLElementNodeCSSLines = function() {
  var keys = Object.keys(this.runtimeHTMLCSSRepo);
  var lines = "/* HTML Element Type Component CSS */\n";

  for (var i = 0; i < keys.length; i++) {
    lines += "/* :" + keys[i] + " */\n";
    lines += this.runtimeHTMLCSSRepo[keys[i]] + "\n";
  }

  return lines;
};

/*******
 * getReactElementNodeCSSLines
 * 모든 저장된 React타입의 요소를의 CSS를 모아서 문자열로 반환한다.
 *
 */
Document.prototype.getReactElementNodeCSSLines = function() {
  var keys = Object.keys(this.runtimReactCSSRepo);
  var lines = "/* React Element Type Component CSS */\n";

  for (var i = 0; i < keys.length; i++) {
    lines += "/* :" + keys[i] + " */\n";
    lines += this.runtimReactCSSRepo[keys[i]] + "\n";
  }

  return lines;
};


///////////////
/************
 * newElementNode
 * Document의 새 elementNode를 생성 모든 ElementNode는 이 메소드를 통하여 생성해야한다.
 */
Document.prototype.newElementNode = function(_elementNodeDataObject, _preInsectProps) {
  var elementNode;

  if (typeof _elementNodeDataObject !== 'undefined') {
    elementNode = new ElementNode(this, _elementNodeDataObject, _preInsectProps);

    // id가 제대로 부여되어 있지 않으면 새로운 id를 부여한다.
    if (!/^\d+$/.test(elementNode.getId())) {
      elementNode.setId(this.getNewElementNodeId());
    }
  } else {
    elementNode = new ElementNode(this);
    elementNode.setId(this.getNewElementNodeId());
  }

  return elementNode;
};

Document.prototype.newElementNodeFromComponent = function(_component) {
  var newElementNode = this.newElementNode();
  newElementNode.buildByComponent(_component);

  return newElementNode;
};

Document.prototype.findById = function(_elementNodeId) {

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
};

Document.prototype.findRecursive = function(_t, _finder) {
  var result = _finder(_t);
  if (result) {
    return _t;
  } else {
    for (var i = 0; i < _t.children.length; i++) {
      var recvResult = this.findRecursive(_t.children[i], _finder);
      if (recvResult) {
        return recvResult;
      }
    }
  }

  return false;
};

///////////
/********
 * cloneElement
 * 요소를 복제한다
 */
Document.prototype.cloneElement = function(_elementNode) {
  var elementNodeExportObject = _elementNode.export(true);
  var newClonedElementNode = this.newElementNode(elementNodeExportObject);

  return newClonedElementNode;
};

Document.prototype.getNewElementNodeId = function() {
  return ++(this.lastElementId);
};

Document.prototype.getElementNodeFromPool = function(_id) {
  var index = _.findIndex(this.elementNodes, function(__elementNode) {

    return __elementNode.getId() == _id;
  });

  return this.elementNodes[index];
};


Document.prototype.getServiceManager = function() {
  return this.contextController.serviceManager;
};

/////////////////
/***************
 * insertElementNode
 * @Param _insertType : 'appendChild' | 'insertBefore' | 'insertAfter'
 * @Param _elementNode
 * @Param _baseElementNode
 * @Return ElementNode{} : 생성된 ElementNode
 */
Document.prototype.insertElementNode = function(_insertType, _elementNode, _baseElementNode) {

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
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* ------------------ Event Handing Methods ------------------------------------------------------------------------------------- */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 동기 이벤트 핸들링
// Base Method
Document.prototype.onEventTernel = function(_eventName, _eventData, __ORIGIN__) {
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
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

Document.prototype.onElementEvent_RequestReRenderMe = function(_eventData, _origin) {
  this.contextController.rootRender();
  return false;
};

Document.prototype.onElementEvent_Snapshot = function(_eventData, _origin) {
  console.log('snapshot');
  this.contextController.snapshot(_origin, _eventData.present, _eventData.past, _eventData.type);
  return false;
};



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
Document.prototype.inspireElementNodes = function(_elementNodeDataList) {
  if (typeof _elementNodeDataList === 'undefined' || _elementNodeDataList === null) return []; // object가 아니면 빈 배열을 리턴한다.
  if (typeof _elementNodeDataList.length !== 'number') throw new Error("element nodes is not Array.");
  var list = [];

  for (var i = 0; i < _elementNodeDataList.length; i++) {
    list.push(this.newElementNode(_elementNodeDataList[i]));
  }

  return list;
};

//////////////////////////
// export methods
Document.prototype.export = function(_withoutElementNodes) {
  return {
    documentID: this.getDocumentID(),
    documentName: this.getDocumentName(),
    documentTitle: this.getDocumentTitle(),
    documentCreate: this.getDocumentCreate(),
    documentUpdate: this.getDocumentUpdate(),
    lastElementId: this.getLastElementId(),
    rootElementNode: (this.rootElementNode !== null ? this.rootElementNode.export() : null),
    elementNodes: this.elementNodes.map(function(_elementNode) {
      return _elementNode.export();
    }),
    pageCSS: this.getPageCSS(),
    usingResources: this.getUsingResources()
  };
};


module.exports = Document;