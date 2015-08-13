/**
 *
 *
 */

/**
 *  html : html 태그 돔.
 *  component : 로직이 포함된 돔.
 */
const domTypes = ["html", "component"];
/**
 * domType에 따라 VNode 객체 생성.
 * @param domType html, component
 * @param name dom 명칭
 * @param targetElement dom 영역으로 사용할 htmlElement
 * @private
 */
var _ = function(domType, name, targetElement, _parentNode, _depthArchive, _depth, _vnodeId) {

  this.name = name;
  this.parent = _parentNode;
  this.element = {
    "object": targetElement,
    "offset": null
  };
  this.prop = {
    "type": domType,
    "default": {},
    "extension": {}
  };
  this.childs = [];

  this.updateOffset = function() {
    var offset = this.element.object.getBoundingClientRect();
    /*
     height 값이 0일경우 처리. - 차후 적용고민 필요.
     var height = offset.height;
     if (offset.height === 0) {
     for (var i in this.childs) {
     var child = this.childs[i];
     if (height < child.offset.height)
     height = child.offset.height;

     }
     }*/

    this.element.offset = {
      "x": offset.left,
      "y": offset.top + this.element.object.ownerDocument.body.scrollTop,
      /*      "left": offset.left,
            "right": offset.right,
            "top": offset.top,
            "bottom": offset.bottom,*/
      "z": null,
      "width": offset.width,
      "height": offset.height
    }

    //console.log(offset);
    //console.log("top:" + offset.top, "bottom:" + offset.bottom, "y:" + this.element.offset.y + "/");
    //console.log(this.element.object);
  };

  this.updateStyles = function() {
    var computedStyle = (this.element.object.ownerDocument.defaultView).getComputedStyle(this.element.object, null);
    //console.log(computedStyle);

    this.computedStyle = {};
    this.computedStyle.float = computedStyle.float;
    this.computedStyle.display = computedStyle.display;
  };

  this.mappingVID = function(_vnodeId) {
    this.vid = _vnodeId;
    this.element.object.setAttribute('__vid__', _vnodeId);
  };

  /**
   * Dom 데이터 익스포트
   * @returns {{name: *, element: *, childs: Array}}
   */
  this.export = function() {
    var childs = [];
    for (var i in this.childs) {
      childs.push(this.childs[i].export());
    }
    return {
      "name": this.name,
      "element": {
        "object": this.element.object,
        "offset": this.element.offset
      },
      "childs": childs
    }
  };


  (function(_node) {
    var isValid = false;
    if (domType !== undefined)
      for (var i in domType) {
        if (domTypes[i] === domType) {
          isValid = true;
          break;
        }
      }
    if (!isValid) {
      throw new Error("잘못된 Dom Type 입니다.");
    }

    // Depth Archive 등록
    if (typeof _depthArchive[_depth] !== 'object') {
      _depthArchive[_depth] = [];
    }
    _depthArchive[_depth].push(_node);


    //html 타입일 경우만 실행.
    if (domType === domTypes[0]) {
      //html주요 속성 등록.
      if (targetElement.attributes) {
        if (targetElement.attributes.getNamedItem('id') !== null)
          _node.prop.default.id = targetElement.attributes.getNamedItem('id');
        if (targetElement.attributes.getNamedItem('class') !== null)
          _node.prop.default.cssClass = targetElement.attributes.getNamedItem('class');
      }

      //html 타입일 경우만 child 노드 정보를 변환.
      if (targetElement.children) {
        var ele = null;
        var node = null;
        for (var i = 0; i < targetElement.children.length; i++) {
          ele = targetElement.children.item(i);

          node = new _(domTypes[0], ele.nodeName.toLowerCase(), ele, _node, _depthArchive, _depth + 1, _vnodeId + "/" + i);
          _node.childs.push(node);
        }
      }
    }

    _node.updateOffset();
    _node.updateStyles();
    _node.mappingVID(_vnodeId);
  })(this);

};


module.exports = _;