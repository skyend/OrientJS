var ElementNode = require('./ElementNode.js');

var Document = function(_documentDataObject) {
  //////////////
  // 필드 정의
  ////////////////////////
  // document profile
  this.documentName;

  // date fields
  this.documentCreate;
  this.documentUpdate;

  // elementLastId
  this.lastElementId;

  // document elements
  this.rootElementNode;
  this.elementNodes;

  // document require resources
  this.usingResources;



  //////////////////////////
  // 처리로직
  //////////////////////////
  // 이미 있는 도큐맨트를 로드한 경우 데이터를 객체에 맵핑해준다.
  if (typeof _documentDataObject === 'object') {
    this.documentName = _documentDataObject.documentName;
    this.documentCreate = _documentDataObject.documentCreate;
    this.documentUpdate = _documentDataObject.documentUpdate;
    this.lastElementId = _documentDataObject.lastElementId || 0;

    this.rootElementNode = typeof _documentDataObject.rootElementNode === 'object' ?
      this.newElementNode(_documentDataObject.rootElementNode) : this.newElementNode();

    this.elementNodes = this.inspireElementNodes(_documentDataObject.elementNodes, this);
    this.usingResources = _documentDataObject.usingResources || {};


  } else {
    // 새 도큐먼트가 생성된것이다.
    this.documentCreate = new Date();
    this.lastElementId = 0;
    this.elementNodes = [];
    this.rootElementNode = this.newElementNode();
  }
};

////////////////////
// Setters
// documentName
Document.prototype.setDocumentName = function(_documentName) {
  this.documentName = _documentName;
};


Document.prototype.getScriptResources = function() {
  return this.usingResources.js;
};

Document.prototype.getStyleResources = function() {
  return this.usingResources.style;
};

///////////////////////
// documentUpdate
Document.prototype.documentUpdated = function() {
  this.documentUpdate = new Date();
};



///////////////
/************
 * newElementNode
 * Document의 새 elementNode를 생성 모든 ElementNode는 이 메소드를 통하여 생성해야한다.
 */
Document.prototype.newElementNode = function(_elementNodeDataObject) {
  var elementNode;

  if (typeof _elementNodeDataObject !== 'undefined') {
    elementNode = new ElementNode(_elementNodeDataObject);
  } else {
    elementNode = new ElementNode();
    elementNode.setId(++(this.lastElementId));
  }

  return elementNode;
};

/////////////////
/***************
 * insertNewElementNodeFromComponent
 * @Param _insertType : 'appendChild' | 'insertBefore' | 'insertAfter'
 * @Param _component
 * @Param _toElement
 * @Return ElementNode{} : 생성된 ElementNode
 */
Document.prototype.insertNewElementNodeFromComponent = function(_insertType, _component, _toElement) {
  console.log(_toElement.___en, '내가누구게');

  var targetElementNode = _toElement.___en;

  var newElementNode = this.newElementNode();
  newElementNode.buildByComponent(_component);

  if (_insertType === 'appendChild') {
    targetElementNode.appendChild(newElementNode);



  }

  return newElementNode;
};


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
Document.prototype.export = function() {
  return {
    documentName: this.documentName,
    documentCreate: this.documentCreate,
    documentUpdate: this.documentUpdate,
    rootElementNode: this.rootElementNode.export(),
    elementNodes: this.elementNodes.map(function(_elementNode) {
      return _elementNode.export();
    }),
    usingResources: this.usingResources
  };
};


module.exports = Document;