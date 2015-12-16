import TagBaseElementNode from './TagBaseElementNode.js';
import Factory from './Factory.js';
import _ from 'underscore';
import React from 'react';

class HTMLElementNode extends TagBaseElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps) {
    super(_environment, _elementNodeDataObject, _preInsectProps);
    this.type = 'html';

    // children
    this.children;
  }

  realize(_realizeOptions) {
    super.realize(_realizeOptions);
    let realizeOptions = _realizeOptions || {};

    this.childrenRealize(realizeOptions);
  }

  childrenRealize(_realizeOptions) {

    this.children.map(function(_child) {
      _child.realize(_realizeOptions);
    });
  }

  linkHierarchyRealizaion() {
    let self = this;
    this.clearRealizationChildren();

    this.children.map(function(_child) {

      self.realization.appendChild(_child.realization);

      if (/^(html|react|empty|grid)$/.test(_child.type)) _child.linkHierarchyRealizaion();

      if (_child.clonePool.length > 0) {
        _child.clonePool.map(function(_cloneChild) {

          self.realization.appendChild(_cloneChild.realization);

          if (_cloneChild.type === 'html') _cloneChild.linkHierarchyRealizaion();
        });
      }
    });
  }

  hookingLink() {
    let realization = this.realization;

  }


  appendChild(_elementNode) {
    if (this.getType() === 'string') {
      return false;
    }

    _elementNode.setParent(this);

    this.children.push(_elementNode);

    return true;
  }

  // 기존자식리스트들을 버리고 하나의 자식만 추가한다.
  setOneChild(_elementNode) {
    if (this.getType() === 'string') {
      return false;
    }

    _elementNode.setParent(this);

    this.children = [_elementNode];

    return true;
  }

  /**************
   * dettachChild
   * 자신의 Children에서 하나의 child를 제거한다.
   */
  detachChild(_child) {
    var children = this.children;
    var newChildList = [];

    for (var i = 0; i < children.length; i++) {
      var child = children[i];

      if (child != _child) {
        newChildList.push(child);
      }
    }

    this.children = newChildList;
  }

  findById(_id) {
    return this.findRecursive(function(_compareElement) {
      return _compareElement.id == _id;
    });
  }

  findRecursive(_finder) {
    var result = _finder(this);
    if (result) {
      return this;
    } else {
      for (var i = 0; i < this.children.length; i++) {
        var recvResult = this.children[i].findRecursive(_finder);

        if (recvResult) {
          return recvResult;
        }
      }
    }
    return false;
  }

  // alias : result[Array] == this.children.map(Function)
  childrenIteration(_processFunc) {
    return this.children.map(_processFunc);
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
      this.environment.appendHTMLElementNodeCSS(_component.componentName, _component.CSS);
    }
  }

  /******************
   * buildByDomElement
   * DomElement 을 자신에게 매핑하여 자신을 빌드한다.
   * child는 재귀로 호출한다.
   */
  buildByElement(_domElement) {
    super.buildByElement(_domElement);

    this.setType('html');

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
        newChildElementNode = Factory.takeElementNode(undefined, {}, 'string', this.environment);
      } else {
        newChildElementNode = Factory.takeElementNode(undefined, {}, 'html', this.environment);
      }

      newChildElementNode.buildByElement(child_);

      children.push(newChildElementNode);
      newChildElementNode.setParent(this);
    }
    // 재귀끝  //
    ////////////


    this.children = children;
  }

  // 해당 _child를 제일 마지막 인덱스로 이동시킨다.
  childBringToBackIndex(_targetChild) {
    let sortedArray = [];
    let targetIndex;
    // _child의 인덱스 찾기
    this.childrenIteration(function(_child, _i) {
      if (_targetChild === _child) {
        targetIndex = _i;
      }
    });

    let cursor = targetIndex;
    for (let i = 0; i < this.children.length; i++) {
      let child = this.children[i];
      if (i != targetIndex) {
        sortedArray.push(child);
      }
    }

    sortedArray.push(this.children[targetIndex]);
    this.children = sortedArray;
    console.log("Index :", targetIndex);
  }

  //////////////////////////
  // import methods
  /*************
   * inspireChildren
   * ElementNode Data객체 리스트를 실제 ElementNode 객체 리스트로 변환한다.
   * @Param _childrenDataList : JSON Array
   */
  inspireChildren(_childrenDataList) {
    if (typeof _childrenDataList === 'undefined' || _childrenDataList === null) return []; // object가 아니면 빈 배열을 리턴한다.
    if (typeof _childrenDataList.length !== 'number') throw new Error("element child nodes is not Array.");
    var list = [];

    var preInsectProps = {
      //isRepeated: this.isRepeated,
      isGhost: this.isGhost
    }

    let elementNodeData;
    let child;
    for (var i = 0; i < _childrenDataList.length; i++) {
      elementNodeData = _childrenDataList[i];
      child = Factory.takeElementNode(elementNodeData, preInsectProps, undefined, this.environment);
      child.setParent(this);
      list.push(child);
    }

    return list;
  }


  import (_elementNodeDataObject) {
    super.import(_elementNodeDataObject);
    this.children = this.inspireChildren(_elementNodeDataObject.children);

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
}

export default HTMLElementNode;