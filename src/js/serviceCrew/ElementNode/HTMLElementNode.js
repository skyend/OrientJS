import TagBaseElementNode from './TagBaseElementNode.js';
import _ from 'underscore';
import React from 'react';

class HTMLElementNode extends TagBaseElementNode {
  constructor(_document, _elementNodeDataObject, _preInsectProps) {
    super(_document, _elementNodeDataObject, _preInsectProps);
    // children
    this.children;
  }

  appendChild(_elementNode) {
    if (this.getType() === 'string') {
      return false;
    }

    _elementNode.setParent(this);

    this.children.push(_elementNode);

    return true;
  }

  linkHierarchyRealizaion() {
    let self = this;
    this.clearRealizationChildren();

    this.children.map(function(_child) {

      self.realization.appendChild(_child.realization);
      if (_child.type === 'string') return;
      _child.linkHierarchyRealizaion();

      if (_child.clonePool.length > 0) {
        _child.clonePool.map(function(_cloneChild) {
          console.log(_cloneChild);
          self.realization.appendChild(_cloneChild.realization);
          _cloneChild.linkHierarchyRealizaion();
        });
      }
    });
  }

  clearRealizationChildren() {
    if (this.realization === null) return;

    while (this.realization.childNodes.length > 0) {
      this.realization.removeChild(this.realization.childNodes[0]);
    }
  }


  buildByComponent(_component) {
    super.buildByComponent(_component);

    var parsingDom = document.createElement('div');
    parsingDom.innerHTML = React.renderToStaticMarkup(React.createElement(_component.class));

    this.buildByElement(parsingDom.childNodes[0]);

    if (typeof _component.CSS !== 'undefined') {
      this.setCSS(_component.CSS);
      this.document.appendHTMLElementNodeCSS(_component.componentName, _component.CSS);
    }
  }

  /******************
   * buildByDomElement
   * DomElement 을 자신에게 매핑하여 자신을 빌드한다.
   * child는 재귀로 호출한다.
   */
  buildByElement(_domElement) {
    this.setType('html');

    // element Attribute를 읽어서 자신에게 매핑한다.
    this.copyAllAtrributeFromDOMElement(_domElement);

    //////////////////
    // 자식노드 재귀처리 //
    var children = [];
    var childNodes = _domElement.childNodes;

    // 자식노드도 생성
    var child_ = null;
    for (var i = 0; i < childNodes.length; i++) {
      child_ = childNodes[i];

      // comment node 는 무시
      if (child_.nodeName === '#comment') continue;
      var newChildElementNode;

      if (child_.nodeName === '#text') {
        newChildElementNode = this.document.newElementNode(undefined, {}, 'string');
      } else {
        newChildElementNode = this.document.newElementNode(undefined, {}, 'html');
      }

      newChildElementNode.buildByElement(child_);

      children.push(newChildElementNode);
      newChildElementNode.setParent(this);
    }
    // 재귀끝  //
    ////////////


    this.children = children;
  }

  realize(_realizeOptions) {
    super.realize(_realizeOptions);
    let realizeOptions = _realizeOptions || {};
    console.log('realize', this);
    this.childrenRealize(realizeOptions);
  }

  childrenRealize(_realizeOptions) {
    let realizeOptions = _realizeOptions || {};

    this.children.map(function(_child) {
      _child.realize({
        skipControl: realizeOptions.skipControl,
        skipResolve: realizeOptions.skipResolve
      });
    });
  }

  export (_withoutId) {
    let result = super.export(_withoutId);
    result.children = [];

    this.children.map(function(_child) {
      if (!_child.isGhost) {
        // 자식이 고스트가 아닌경우만 export한다.
        result.children.push(_child.export(_withoutId));
      } else {

        // 자식이 고스트이면서 반복된 요소일 떄는 export한다.
        if (!_child.isRepeated) {
          result.children.push(_child.export(_withoutId));
        }
      }

    });

    return result;
  }

  import (_elementNodeDataObject) {
    super.import(_elementNodeDataObject);
    this.children = this.inspireChildren(_elementNodeDataObject.children);

  }
}

export default HTMLElementNode;