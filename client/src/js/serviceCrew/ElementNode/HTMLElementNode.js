import TagBaseElementNode from './TagBaseElementNode.js';
import Factory from './Factory.js';
// import React from 'react';
// import Sizzle from 'sizzle';
import Point from '../../util/Point';
import ObjectExtends from '../../util/ObjectExtends';

"use strict";

const REGEXP_REAL_EN_ID_SPLITTER = /@\d+$/;


class HTMLElementNode extends TagBaseElementNode {
  constructor(_environment, _elementNodeDataObject, _preInjectProps, _isMaster) {
    super(_environment, _elementNodeDataObject, _preInjectProps, _isMaster);
    this.type = 'html';

    // children
    this.children;
  }

  setEnvironment(_env) {
    super.setEnvironment(_env);

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].setEnvironment(_env);
    }
  }

  constructDOMs(_options) {
    let returnHolder = super.constructDOMs(_options);

    // console.log(returnHolder);
    if (this.isRepeater()) return returnHolder;
    if (returnHolder.length === 0) return returnHolder;

    // Fixed Container Processing
    let fixedContainer = this.getControlWithResolve('fixed-container');
    if (fixedContainer === 'true' || fixedContainer === true) {
      return;
    }

    // children construct
    let children = this.children;
    let length = children.length;
    let child;


    for (let i = 0; i < length; i++) {
      child = children[i];

      child.constructDOMs(_options);
      // 복구에 대한 신뢰
      if (child.isRepeater()) {
        for (let j = 0; j < child.clonePool.length; j++) {

          this.updateChild(child.clonePool[j]);
        }
      } else {

        this.updateChild(child);
      }
    }

    // 유효하지 않은 DOM트리 제거
    let childNodes = ObjectExtends.arrayToArray(this.forwardDOM.childNodes);
    let childNode;
    for (let i = 0; i < childNodes.length; i++) {
      childNode = childNodes[i];

      if (childNode.___en) {
        if (childNode.__renderstemp__ !== childNode.___en.renderSerialNumber) {
          this.forwardDOM.removeChild(childNode);
        }
      } else {
        this.forwardDOM.removeChild(childNode);
      }
    }


    return returnHolder;
  }

  updateChild(_child) {
    // let prevSibling = _child.prevSibling;
    // let nextSibling = _child.nextSibling;
    let attachedPrevSibling = _child.getAttachedPrevSibling();

    // console.log(prevSibling);
    // console.log(prevSibling ? prevSibling.id : null, _child.id);

    if (_child.isRepeater()) {
      for (let i = 0; i < _child.clonePool.length; i++) {
        this.updateChild(_child.clonePool[i]);
      }
    }

    // hidden 은 제거
    if (_child.forwardDOM === null) {
      if (_child.hiddenForwardDOM) {
        this.forwardDOM.removeChild(_child.hiddenForwardDOM);
        _child.hiddenForwardDOM = null;
        _child.isAttachedDOM = false;
      }

      return;
    }

    if (_child.isAttachedDOM === true) {
      // apply
      _child.applyForward();

    } else {
      let attachedNextSibling = _child.getAttachedNextSibling();

      if (attachedNextSibling !== null) {
        // next sibling 의 이전에 부착
        this.forwardDOM.insertBefore(_child.forwardDOM, attachedNextSibling.forwardDOM);
        _child.isAttachedDOM = true;
      } else {
        // append
        this.forwardDOM.appendChild(_child.forwardDOM);
        _child.isAttachedDOM = true;
      }

    }
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

      if (this.isRepeater()) {
        for (var i = 0; i < this.clonePool.length; i++) {
          if (typeof this.clonePool[i].findRecursive === 'function') {
            var recvResult = this.clonePool[i].findRecursive(_finder);
            if (recvResult) {
              return recvResult;
            }
          }
        }
      }

      if (this.children !== undefined) {

        for (var i = 0; i < this.children.length; i++) {
          if (typeof this.children[i].findRecursive === 'function') {
            var recvResult = this.children[i].findRecursive(_finder);
            if (recvResult) {
              return recvResult;
            }
          }
        }
      }

    }
    return false;
  }

  // findChildren(_selector) {
  //   let elements = Sizzle(_selector, this.forwardDOM);
  //   console.log(_selector, elements, this.forwardDOM);
  //
  //   return elements.map(function(_childDom) {
  //     return _childDom.___en;
  //   });
  // }

  // alias : result[Array] == this.children.map(Function)
  childrenIteration(_processFunc) {
    return this.children.map(_processFunc);
  }

  // HTML 엘리먼트 기반의 요소 기준으로 Tree를 탐색한다.
  // 탐색은 사용자가 정의 할 수 있으며 treeExplore 메소드를 호출 할 때 인자로 탐색 클로져를 넘겨준다.
  treeExplore(_explorerFunc) {
    if (_explorerFunc(this) === null)
      return;

    if (/^html|grid|ref$/.test(this.getType()))
      this.childrenIteration(function(_child) {
        if (_child.isRepeater()) {
          for (let i = 0; i < _child.clonePool.length; i++) {
            _child.clonePool[i].treeExplore(_explorerFunc);
          }
        }

        if (/^html|grid|ref$/.test(_child.getType()))
          _child.treeExplore(_explorerFunc);
        else // string type
          _explorerFunc(_child);
      });
  }

  clearRealizationChildren() {
    if (this.realization === null) return;

    while (this.realization.childNodes.length > 0) {
      this.realization.removeChild(this.realization.childNodes[0]);
    }
  }

  // buildByComponent(_component) {
  //   super.buildByComponent(_component);
  //
  //   var parsingDom = document.createElement('div');
  //   parsingDom.innerHTML = React.renderToStaticMarkup(React.createElement(_component.class));
  //
  //   this.buildByElement(parsingDom.childNodes[0]);
  //
  //   if (typeof _component.CSS !== 'undefined') {
  //     this.setCSS(_component.CSS);
  //     this.environment.appendHTMLElementNodeCSS(_component.componentName, _component.CSS);
  //   }
  // }

  /******************
   * buildByDomElement
   * DomElement 을 자신에게 매핑하여 자신을 빌드한다.
   * child는 재귀로 호출한다.
   */
  buildByElement(_domElement, _absorbOriginDOM) {
    super.buildByElement(_domElement, _absorbOriginDOM);

    // this.setType('html');

    //////////////////
    // 자식노드 재귀처리 //
    var children = [];
    var childNodes = _domElement.childNodes;

    // 자식노드도 생성
    var child_ = null;
    let prevElementNode = null;
    let elementNodeBuildResult;
    for (var i = 0; i < childNodes.length; i++) {
      child_ = childNodes[i];

      // en- 으로 시작되는 태그를 ScopeNode로 취급한다.
      if (/^en:|script/i.test(child_.nodeName)) {
        this.appendScopeNode(this.buildScopeNodeByScopeDom(child_));

        continue;
      }

      // comment node 는 무시
      if (child_.nodeName === '#comment') continue;
      var newChildElementNode;

      if (child_.nodeName === '#text') {
        if (child_.parentNode !== null) {

          // 부모 태그가  pre 태그의 경우 공백과 탭 줄바꿈을 그대로 유지하여 랜더링 함으로 그대로 생성을 진행 하도록 한다.
          // 부모 태그가 pre 태그가 아닌 경우 text노드의 nodeValue 즉 내용이 공백과 줄바꿈 탭으로만 이루어 져 있을 경우 택스트 노드 생성을 스킵하도록 한다.
          if (child_.parentNode.nodeName.toLowerCase() === "pre") {
            if (/^[\s\n]+$/g.test(child_.nodeValue)) {
              continue;
            }
          }
        }

        newChildElementNode = Factory.takeElementNode(undefined, {}, 'string', this.environment);

      } else {
        let type = Factory.checkElementNodeType(child_);

        newChildElementNode = Factory.takeElementNode(undefined, {}, type, this.environment);
      }

      elementNodeBuildResult = newChildElementNode.buildByElement(child_, _absorbOriginDOM);

      if (elementNodeBuildResult === null) continue;

      newChildElementNode.prevSibling = prevElementNode;
      children.push(newChildElementNode);
      newChildElementNode.setParent(this);

      prevElementNode = newChildElementNode;
    }
    // 선택적 재귀끝  //
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

    var preInjectProps = {
      //isRepeated: this.isRepeated,
      isGhost: this.isGhost
    }

    let elementNodeData;
    let child;
    let prevChild = null;
    for (var i = 0; i < _childrenDataList.length; i++) {

      elementNodeData = _childrenDataList[i];

      // children 에 ElementNode가 바로 입력될 수도 있다.
      if (!elementNodeData.isElementNode) {
        child = Factory.takeElementNode(elementNodeData, preInjectProps, undefined, this.environment);
      }
      child.setParent(this);

      // 이전 요소 지정
      child.prevSibling = prevChild;

      list.push(child);

      prevChild = child;
    }

    return list;
  }


  import (_elementNodeDataObject) {
    super.import(_elementNodeDataObject);

    this.children = this.inspireChildren(_elementNodeDataObject.children || []);
  }

  export (_withoutId, _idAppender) {
    let result = super.export(_withoutId, _idAppender);
    result.children = [];

    this.children.map(function(_child) {
      if (!_child.isGhost) {
        // 자식이 고스트가 아닌경우만 export한다.
        result.children.push(_child.export(_withoutId, _idAppender));
      } else {

        // 자식이 고스트이면서 반복된 요소일 떄는 export한다.
        if (!_child.isRepeated) {
          result.children.push(_child.export(_withoutId, _idAppender));
        }
      }

    });

    return result;
  }
}

export default HTMLElementNode;