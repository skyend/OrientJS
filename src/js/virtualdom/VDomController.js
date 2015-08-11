var _ = function() {

  this.vroot = null;

  this.setVRoot = function(vroot) {
    this.vroot = vroot;
    console.log(this.vroot);
  };

  this.createVRoot = function(htmlElement) {
    this.setVRoot(require('./VRoot').importHtmlElement(htmlElement));
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