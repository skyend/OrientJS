var ElementNode = function(_elementNodeDataObject) {
  //////////////
  // 필드 정의
  ////////////////////////

  // document profile
  this.id;

  // date fields
  this.createDate;
  this.updateDate;

  // children
  this.children;

  // parent refference
  this.parent;

  //////////////////////////
  // 처리로직
  //////////////////////////
  // 이미 있는 엘리먼트를 로드한 경우 데이터를 객체에 맵핑해준다.
  if (typeof _elementNodeDataObject === 'object') {
    this.id = _elementNodeDataObject.id;
    this.createDate = _elementNodeDataObject.createDate;
    this.updateDate = _elementNodeDataObject.updateDate;
    this.children = this.inspireChildren(_elementNodeDataObject.children);

  } else {
    // 새 엘리먼트가 생성되었다.
    this.createDate = new Date();
    this.children = [];
  }
};

////////////////////
// Setters
// id
ElementNode.prototype.setId = function(_id) {
  this.id = _id;
};

// parent
ElementNode.prototype.setParent = function(_parentENode) {
  this.parent = _parentENode;
};

/////////////////
/***********
 * updated
 * 요소가 변경되었을 때 호출한다.
 */
ElementNode.prototype.updated = function() {
  this.updateDate = new Date();
};

//////////////////////////
// import methods
/*************
 * inspireChildren
 * ElementNode Data객체 리스트를 실제 ElementNode 객체 리스트로 변환한다.
 * @Param _childrenDataList : JSON Array
 */
ElementNode.prototype.inspireChildren = function(_childrenDataList) {
  if (typeof _childrenDataList === 'undefined' || _childrenDataList === null) return []; // object가 아니면 빈 배열을 리턴한다.
  if (typeof _childrenDataList.length !== 'number') throw new Error("element nodes is not Array.");
  var list = [];

  for (var i = 0; i < _childrenDataList.length; i++) {
    list.push(new ElementNode(_childrenDataList[i]));
  }

  return list;
};

//////////////////////////
// export methods
ElementNode.prototype.export = function() {
  return {
    id: this.id,
    createDate: this.createDate,
    updateDate: this.updateDate,
    children: this.children.map(function(_child) {
      return _child.export();
    })
  }
};


module.exports = ElementNode;