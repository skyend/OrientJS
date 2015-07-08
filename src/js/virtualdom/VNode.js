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
var _=function (domType, name, targetElement) {
    if (domType === undefined) {
        (function () {
            var isValid = false;
            for (var i in domType) {
                if (domTypes[i] === domType) {
                    isValid = true;
                    break;
                }
            }
            if (!isValid) {
                throw new Error("잘못된 Dom Type 입니다.");
            }

        })();
    }
    this.name = name;
    this.element = {
        "object": targetElement,
        "offset": {
            "x": targetElement.offsetLeft,
            "y": targetElement.offsetTop,
            "z": null,
            "width": targetElement.offsetWidth,
            "height": targetElement.offsetHeight
        }
    }

    this.prop = {
        "type": domType,
        "default": {},
        "extension": {}
    }

    this.childs = [];

    //html 타입일 경우만 실행.
    if (domType === domTypes[0]) {

        //html주요 속성 등록.
        if (targetElement.attributes) {
            if (targetElement.attributes.getNamedItem('id') !== null)
                this.prop.default.id = targetElement.attributes.getNamedItem('id');
            if (targetElement.attributes.getNamedItem('class') !== null)
                this.prop.default.cssClass = targetElement.attributes.getNamedItem('class');
        }

        //document.querySelectorAll('div').item(1).attributes.getNamedItem('class

        //html 타입일 경우만 child 노드 정보를 변환.
        if (targetElement.children)
            for (var i = 0; i < targetElement.children.length; i++) {
                var ele = targetElement.children.item(i);
                this.childs.push(new _(domTypes[0], ele.nodeName.toLowerCase(), ele));
            }
    }

    /**
     * Dom 데이터 익스포트
     * @returns {{name: *, element: *, childs: Array}}
     */
    this.export = function () {
        var childs = [];
        for (var i in  this.childs) {
            childs.push(this.childs[i].export());
        }
        return {
            "name": this.name,
            "element": this.element,
            "childs": childs
        }
    }
};


module.exports = _;
