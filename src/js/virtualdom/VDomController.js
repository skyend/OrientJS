var _ = function() {

  this.vroot = null;
  this.depthArchive = null;

  this.setVRoot = function(vroot) {
    this.vroot = vroot;
    //console.log(this.vroot);
  };

  this.createVRoot = function(htmlElement) {
    this.depthArchive = [];

    this.setVRoot(require('./VRoot').importHtmlElement(htmlElement, this.depthArchive, this));

    //console.log(this.depthArchive);
  };

  this.click = function(pointX, pointY) {
    var stack = [];
    var debugStack = null;
    this._exploreImpactNode(pointX, pointY, this.vroot.dom, stack, debugStack, 'Element');
    if (debugStack !== null) {
      console.log(debugStack);
    }
    return stack;

  };


  this.rayTracer = function(_screenPointX, _screenPointY) {
    var tracedDepth;
    var tracedNodes = [];

    for (var top = this.depthArchive.length - 1; top >= 0; top--) {
      var depthLives = this.depthArchive[top];
      var found = false;

      for (var i = 0; i < depthLives.length; i++) {
        var node = depthLives[i];

        if (this.checkItIsBoundary(node, _screenPointX, _screenPointY)) {
          found = true;
          tracedNodes.push(node);
        }
      }

      if (found) break;
    }

    return tracedNodes;
  };

  this.checkItIsBoundary = function(_vnode, _screenPointX, _screenPointY) {
    var rect = _vnode.element.offset;

    if ((rect.x <= _screenPointX && rect.x + rect.width >= _screenPointX) &&
      (rect.y <= _screenPointY && rect.y + rect.height >= _screenPointY)) {

      return true;
    }

    return false;
  };

  this.mouseover = function(event) {
    console.log(event);
  };

  /**
   * 충돌 Node 조회
   * @param pointerX
   * @param pointerY
   * @param vnode
   * @param stack
   * @param stackType Element,tagName,object(default)
   * @returns {*}
   */
  this._exploreImpactNode = function(pointerX, pointerY, vnode, stack, debugStack, debugStackType) {
    var impactNode = null;
    var offset = vnode.element.offset;
    if (offset.x <= pointerX && offset.y <= pointerY && pointerX <= offset.x + offset.width && pointerY <= offset.y + offset.height) {
      stack.push(vnode);
      if (debugStack !== null)
        switch (debugStackType) {
          case 'Element':
            debugStack.push(vnode.element.object);
            break;
          case 'tagName':
            debugStack.push(vnode.name);
            break;
        }

      for (var index = 0 in vnode.childs) {
        impactNode = this._exploreImpactNode(pointerX, pointerY, vnode.childs[index], stack, debugStack, debugStackType);
        if (impactNode !== null)
          break;
      }
      if (impactNode === null)
        impactNode = vnode;
    }
    return impactNode;
  }


};

module.exports = _;