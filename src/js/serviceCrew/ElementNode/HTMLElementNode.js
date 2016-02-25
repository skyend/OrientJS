import TagBaseElementNode from './TagBaseElementNode.js';
import Factory from './Factory.js';
import _ from 'underscore';
import React from 'react';
import async from 'async';
import Sizzle from 'sizzle';

"use strict";

class HTMLElementNode extends TagBaseElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps, _dynamicContext) {
    super(_environment, _elementNodeDataObject, _preInsectProps, _dynamicContext);
    this.type = 'html';

    // children
    this.children;
  }



  childrenConstructAndLink(_options, _htmlNode, _complete, _doLink) {
    let doLink = _doLink === undefined ? true : _doLink;

    let that = this;
    async.eachSeries(this.children, function iterator(_child, _next) {

        _child.constructDOMs(_options,
          function(_domList) {
            if (doLink) {
              _domList.map(function(_dom) {
                _htmlNode.appendChild(_dom);
              });
            }

            _next();
          });

      },
      function done() {
        _complete();
      });
  }

  //
  forwardMe(_childElementNode) {
    console.log('forward');
    console.log(this);
    let that = this;
    let lastDOM;

    this.forwardDOM.innerHTML = '';
    this.childrenIteration(function(_elementNode) {

      _elementNode.getForwardDOMs().map(function(_dom) {
        that.forwardDOM.appendChild(_dom);
      });
    });
  }

  applyAllChildren() {
    let children = this.children;
    let childrenLen = children.length;

    console.log('applyAllChildren');
    for (let i = 0; i < childrenLen; i++) {

      this.applyChild(children[i]);
    }
  }

  applyMe(_targetChildElementNode) {
    this.applyChild(_targetChildElementNode);
  }

  applyChild(_targetChildElementNode) {
    console.log(this.forwardDOM, this.forwardDOM.childNodes);
    // 실제 childNodes 로 조작대상의 범위를 확인 한 후 apply / append / remove 를 실행하고 하위 자식에 대해서도 동일한 작업이 수행 되도록 한다.
    let childNodes = this.forwardDOM.childNodes;
    let targetId = _targetChildElementNode.id;
    let targetChildIndex = -1;
    let beforeRangeIndex = -1; // 조작대상 ElementNode 범위의 전 요소의 인덱스
    let afterRangeIndex = -2; // 조작대상 ElementNode 범위의 다음 요소의 인덱스
    /*
      ElementNode 범위로 지칭하는 것은 하나의 ElementNode가 clone(repeat-n 영향) 으로 인해 2이상의 수로 늘어 날 수 있기 때문이다.
        예 ) 1 2 (3) [ 4 5 6 7 ] (8) 9 : Child Node List
          * (3)         : beforeRangeIndex
          * [ 4 ... 7 ] : 조작대상 요소 범위
          * (8)         : afterRangeIndex
    */

    /*
      조작 계획
        이미 존재하는 요소의 경우 변경된 attribute만 apply 하고
        모자라는 요소는 추가로 삽입한다.
        조작이 완료되는 시점또는 조작이 시작되는 시점에 남는 afterRangeIndex보다 조작완료된 인덱스의 크기가 작을 경우 남은 요소를 remove한다.
        apply 되는 요소는 자식 요소에 대해 apply 작업을 수행한다.
    */

    // dirty check 불필요

    let child;
    let passThroughTarget = false; // 불필요한 변수일 수 도 있음. 목표 대상에 도달 했을 때 처리가 완료 될 예정이므로
    console.log(this.children.length);
    for (let i = 0; i < this.children.length; i++) {
      child = this.children[i];

      if (_targetChildElementNode.id.split('@')[0] === child.id.split('@')[0]) {
        let targetForwardDOMs = _targetChildElementNode.getForwardDOMs();
        let targetBackupDOMs = _targetChildElementNode.getBackupDOMs();
        let maxLength = Math.max(targetForwardDOMs.length, targetBackupDOMs.length);
        let newClonedForwardDoms = [];
        console.log('target child', child, child.id);
        console.log('backupdom', targetBackupDOMs);
        console.log('forwarddom', targetForwardDOMs);
        /*
          beforeRangeIndex 값이 -1 이면 forwardDOM에 새 요소를 등록 해야 할 때 appendChild를 수행하고
                                   이 아니면 해당 index의 다음요소를 기준으로 처리한다.

          removeChild,
          appendChild,
          insertAfter
          insertBefore
        */
        console.log('found ', i, beforeRangeIndex, targetForwardDOMs, targetBackupDOMs, prevDom, child.id, maxLength);

        let prevDom = beforeRangeIndex == -1 ? null : childNodes[beforeRangeIndex]; // 이전 요소 , 시작은 beforeRangeIndex에 해당하는 요소가 된다.
        for (let j = 0; j < maxLength; j++) {

          if (targetForwardDOMs[j] !== undefined && targetBackupDOMs[j] !== undefined) {
            // apply 처리
            targetForwardDOMs[j].___en.applyForward();

            prevDom = targetForwardDOMs[j];

            newClonedForwardDoms.push(targetForwardDOMs[j]);

            console.log('apply ', targetForwardDOMs[j].___en.id);

            if (typeof targetForwardDOMs[j].___en.applyAllChildren === 'function')
              targetForwardDOMs[j].___en.applyAllChildren();

          } else if (targetForwardDOMs[j] !== undefined && targetBackupDOMs[j] === undefined) {
            // removeChild 처리
            console.log('remove ', j, targetForwardDOMs[j], targetForwardDOMs[j].___en.id);

            this.forwardDOM.removeChild(targetForwardDOMs[j]);
          } else if (targetForwardDOMs[j] === undefined && targetBackupDOMs[j] !== undefined) {
            // append 처리

            if (prevDom) {
              let nextNode = prevDom.nextSibling;

              // 다음 노드가 없을 경우 appendCHild 를 수행한다.
              if (nextNode !== null) {
                this.forwardDOM.insertBefore(targetBackupDOMs[j], nextNode);
              } else {
                this.forwardDOM.appendChild(targetBackupDOMs[j]);
              }
            } else {

              if (childNodes[0] !== undefined) {
                this.forwardDOM.insertBefore(targetBackupDOMs[j], childNodes[0]);
              } else {
                this.forwardDOM.appendChild(targetBackupDOMs[j]);
              }
            }

            newClonedForwardDoms.push(targetBackupDOMs[j]);

            prevDom = targetBackupDOMs[j];
            targetBackupDOMs[j].___en.forwardDOM = targetBackupDOMs[j].___en.backupDOM;
            //targetBackupDOMs[j].___en.backupDOM = null;
            console.log('appended ', j, targetBackupDOMs[j], targetBackupDOMs[j].___en, targetBackupDOMs[j].___en.id);

            if (typeof targetBackupDOMs[j].___en.applyAllChildren === 'function')
              targetBackupDOMs[j].___en.applyAllChildren();
          }
        }

        if (_targetChildElementNode.cloned) {
          _targetChildElementNode.clonedForwardDOMs = newClonedForwardDoms;
        }
        break;
      } else {
        beforeRangeIndex += child.getForwardDOMs().length;
      }
    }
  }


  appendChild(_elementNode) {
    if (this.getType() === 'string') {
      return false;
    }

    _elementNode.setParent(this);

    this.setChildListeners(_elementNode);

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

        if (this.children[i].cloned) {
          for (var j = 0; j < this.children[i].clonePool.length; j++) {
            var recvResult = this.children[i].clonePool[j].findRecursive(_finder);
            if (recvResult) {
              return recvResult;
            }
          }
        } else {
          var recvResult = this.children[i].findRecursive(_finder);

          if (recvResult) {
            return recvResult;
          }
        }
      }
    }
    return false;
  }

  findChildren(_selector) {
    let elements = Sizzle(_selector, this.forwardDOM);
    console.log(_selector, elements, this.forwardDOM);

    return elements.map(function(_childDom) {
      return _childDom.___en;
    });
  }

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
  buildByElement(_domElement, _ignoreAttrFields) {
    let ignoreAttrFields = _.union([], _ignoreAttrFields || []);
    super.buildByElement(_domElement, ignoreAttrFields);

    // this.setType('html');

    //////////////////
    // 자식노드 재귀처리 //
    var children = [];
    var childNodes = _domElement.childNodes;

    // 자식노드도 생성
    var child_ = null;
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

        newChildElementNode = Factory.takeElementNode(undefined, {}, 'string', this.environment, this.dynamicContext);
      } else {

        newChildElementNode = Factory.takeElementNode(undefined, {}, child_.getAttribute('en-type') || 'html', this.environment, this.dynamicContext);
      }

      if (newChildElementNode.buildByElement(child_) === null) continue;

      this.setChildListeners(newChildElementNode);

      children.push(newChildElementNode);
      newChildElementNode.setParent(this);
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

  setChildListeners(_child) {
    let that = this;
    _child.on('link-me', function() {
      console.log('linking');
      that.linkHierarchyRealizaion();
    })
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
      child = Factory.takeElementNode(elementNodeData, preInsectProps, undefined, this.environment, this.dynamicContext);
      child.setParent(this);

      list.push(child);

      this.setChildListeners(child);
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