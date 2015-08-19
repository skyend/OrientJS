var ElementNode = function(_elementNodeDataObject) {
  //////////////
  // 필드 정의
  ////////////////////////

  // document profile
  this.id;
  this.type; // html / string / react / grid
  this.element;

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
    this.type = _elementNodeDataObject.type;
    this.element = _elementNodeDataObject.element;

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
// type
ElementNode.prototype.setType = function(_type) {
  this.type = _type;
};
// parent
ElementNode.prototype.setParent = function(_parentENode) {
  this.parent = _parentENode;
};
// element
ElementNode.prototype.setElement = function(_element) {
  this.element = _element;
};

// real element
ElementNode.prototype.setRealElement = function(_realElement) {
  this.realElement = _realElement;

  // string type을 제외하고 _enid_ 에 자신의 id를 입력한다.
  if (this.type !== 'string') {
    this.realElement.setAttribute('_enid_', this.id);
    this.realElement.___en = this;
  }
};



////////////////////
// Getters
// element.tagName -> getTagName()
ElementNode.prototype.getTagName = function() {
  return this.element.tagName;
};
// element.text -> getText()
ElementNode.prototype.getText = function() {
  return this.element.text;
};
// realElement
ElementNode.prototype.getRealElement = function() {
  return this.realElement;
};
// parent
ElementNode.prototype.getParent = function() {
  return this.parent;
}

////////////////////
// Exists
// realElement
ElementNode.prototype.hasRealElement = function() {
  return typeof this.realElement !== 'undefined';
};


/////////////////
/***********
 * updated
 * 요소가 변경되었을 때 호출한다.
 */
ElementNode.prototype.updated = function() {
  this.updateDate = new Date();
};


//////////////////
// build my self
/******************
 * buildByComponent
 * Component 를 이용하여 자신의 필드를 세팅한다.
 *
 */
ElementNode.prototype.buildByComponent = function(_component) {
  console.log('빌드해라', _component);
  console.log(_component);
  if (_component.elementType === 'html') {
    this.setType(_component.elementType);
    this.setElement({
      'tagName': "div",
      'class': "testIn"
    });
  }



  /// 컴포넌트를 어떻게 ElementNode로 변환할까
  // HTML같은경우와 React일경우 Grid일 경우
  // 정의 필요
};

ElementNode.prototype.appendChild = function(_elementNode) {
  _elementNode.setParent(this);

  this.children.push(_elementNode);

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
    var child = new ElementNode(_childrenDataList[i]);
    child.setParent(this);
    list.push(child);
  }

  return list;
};



//////////////////////
//
/********************
 * growupRealElementTree
 * 자신의 ElementNode에 생성된 RealElement Tree를 갱신한다.
 * 자신의 자식 ElementNode의 구조가 변경되었고 자신의 하위 ElementNode중 RealElement를 가지지 않는 ElementNode가 없을 때 호출한다.
 * 자신의 자식 ElementNode에 구축된 realElement를 자신의 realElement에 자식으로 추가한다.
 * 그리고 자식의 growupRealElementTree 메소드를 호출하여 재귀로 동작한다.
 */
ElementNode.prototype.growupRealElementTree = function() {

  // Real Element 를 가지고 있으면 growupRealElementTree 메소드를 호출하여 자신의 RealElement Tree를 갱신한다.
  if (this.hasRealElement()) {
    var rE = this.getRealElement();
    rE.innerHTML = '';

    this.children.map(function(_child) {

      if (_child.hasRealElement()) {
        rE.appendChild(_child.growupRealElementTree());
      }
    });

    return rE;
  } else {
    // 없다면 React 컴포넌트를..
    throw new Error("not found realElement");
  }
};

//////////////////////////
// export methods
ElementNode.prototype.export = function() {
  return {
    id: this.id,
    type: this.getType(),
    createDate: this.createDate,
    updateDate: this.updateDate,
    children: this.children.map(function(_child) {
      return _child.export();
    })
  }
};


module.exports = ElementNode;