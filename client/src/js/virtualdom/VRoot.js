const domRootTypes = ["page", "template"];
const defaultResolution = {
  "x": 1024,
  "y": 786
};
var VNode = require('./VNode');
var _ = function(domRootType, resolutionX, resolutionY) {
  if (domRootType === undefined) {
    (function() {
      var isValid = false;
      for (var i in domRootTypes) {
        if (domRootTypes[i] === domRootType) {
          isValid = true;
          break;
        }
      }
      if (!isValid) {
        throw new Error("잘못된 Dom Root Type 입니다.");
      }

    })();
  }

  this.prop = {
    "resolution": {
      "x": resolutionX === undefined ? defaultResolution.x : resolutionX,
      "y": resolutionY === undefined ? defaultResolution.y : resolutionY
    },
    "type": domRootType
  };

  this.resource = null;
  this.dom = null;
  this.export = function() {
    return {
      "prop": this.prop,
      "resource": this.resource,
      "dom": this.dom
    }
  }
};


_.importHtmlElement = function(htmlElement, _depthArchive, _controller) {
  if (typeof htmlElement !== "object") {
    throw new Error("Object 객채가 아닙니다.");
  }

  var root = new _('page', htmlElement.offsetWidth, htmlElement.offsetHeight);
  root.dom = new VNode(_controller, 'html', htmlElement.nodeName.toLowerCase(), htmlElement, null, _depthArchive, 0, "0");
  //console.log(root);
  return root;
}
module.exports = _;