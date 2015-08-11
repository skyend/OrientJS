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
var _ = function(domType, name, targetElement) {

  this.name = name;
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
      "y": offset.top,
      "z": null,
      "width": offset.width,
      "height": offset.height
    }
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
          node = new _(domTypes[0], ele.nodeName.toLowerCase(), ele);
          _node.childs.push(node);
        }
      }
    }
    _node.updateOffset();
  })(this);

};


module.exports = _;