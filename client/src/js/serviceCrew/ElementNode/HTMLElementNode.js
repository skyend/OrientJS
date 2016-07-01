import TagBaseElementNode from './TagBaseElementNode.js';
import Factory from './Factory.js';
// import React from 'react';
// import Sizzle from 'sizzle';
import Point from '../../util/Point';
import ObjectExtends from '../../util/ObjectExtends';

"use strict";

const REGEXP_REAL_EN_ID_SPLITTER = /@\d+$/;

const FINAL_TYPE_CONTEXT = 'html';
class HTMLElementNode extends TagBaseElementNode {
  constructor(_environment, _elementNodeDataObject, _preInjectProps, _isMaster) {
    super(_environment, _elementNodeDataObject, _preInjectProps, _isMaster);
    if ((Orient.bn === 'ie' && Orient.bv <= 10) || (Orient.bn === 'safari' && Orient.bv <= 534)) {
      TagBaseElementNode.call(this, _environment, _elementNodeDataObject, _preInjectProps, _isMaster);
    }

    this.type = FINAL_TYPE_CONTEXT;
  }


  setEnvironment(_env) {
    super.setEnvironment(_env);

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].setEnvironment(_env);
    }
  }


  // 자식이 부모에게 요청
  attachDOMChild(_idx, _mountChildDOM, _mountChild) {
    let domnode = this.getDOMNode();


    if (_idx !== null) {

      if (domnode.childNodes[_idx]) {

        domnode.insertBefore(_mountChildDOM, domnode.childNodes[_idx]);
      } else {

        domnode.appendChild(_mountChildDOM);
      }
    } else {
      // 마운트 index가 null 인 경우 직접 mount 위치를 찾아서 자식을 붙인다.

      let prevSiblingMountedIndex = 0,
        realMountIndex, nextSibling;

      let child, childDOM, ghostChildPool, ghostChild, ghostChildDOM, breakUpperLoop = false;
      for (let j = 0; j < this.children.length; j++) {
        child = this.children[j];


        if (child.isRepeater()) {
          ghostChildPool = child.clonePool;

          for (let i = 0; i < ghostChildPool.length; i++) {
            ghostChild = ghostChildPool[i];
            ghostChildDOM = ghostChild.getDOMNode();


            if (_mountChild === ghostChild) {

              if (ghostChildDOM) {
                throw new Error(`${ghostChild.id} Component is Already mounted GhostChild.`);
              } else {
                breakUpperLoop = true;
                break;
              }
            } else {
              if (ghostChildDOM) {
                prevSiblingMountedIndex++;
              }
            }
          }

          if (breakUpperLoop) break;
        } else {
          childDOM = child.getDOMNode();

          if (child === _mountChild) {
            if (childDOM) {
              throw new Error(`${child.id} Component is Already mounted Child.`);
            } else {
              break;
            }
          } else {
            if (childDOM) {
              prevSiblingMountedIndex++;
            }
          }
        }
      }

      realMountIndex = prevSiblingMountedIndex + 1;
      nextSibling = domnode.childNodes[realMountIndex];

      if (nextSibling) {
        domnode.insertBefore(_mountChildDOM, nextSibling);
      } else {
        domnode.appendChild(_mountChildDOM);
      }
    }
    // 뒤에 있으면 잡아서 appendBefore 없으면 appendChild
  }

  // 자식이 부모에게 요청
  dettachDOMChild(_child) {

    this.getDOMNode().removeChild(_child.getDOMNode());
  }

  unmountComponent(_options) {

    // 자식모두에게 unmount render
    let child, repeat_child;
    for (let i = 0; i < this.children.length; i++) {
      child = this.children[i];

      if (child.isRepeater()) {
        for (let repeat_i = 0; repeat_i < child.clonePool.length; repeat_i++) {
          repeat_child = child.clonePool[repeat_i];

          repeat_child.render(_options, true);
        }
      } else {
        child.render(_options, true);
      }
    }

    // unmount는 자식먼저 unmount를 진행한 후 자신도 진행하도록 한다.
    super.unmountComponent(_options);
  }

  mountComponent(_options, _parentCount, _mountIndex) {
    super.mountComponent(_options, _parentCount, _mountIndex);

    Orient.ON_TRACE_DEBUGGER && this.debug('render', '[html] Will render children from mount component');
    this.renderChild(_options, _parentCount);
  }

  updateComponent(_options, _parentCount, _mountIndex) {
    super.updateComponent(_options, _parentCount, _mountIndex);

    Orient.ON_TRACE_DEBUGGER && this.debug('render', '[html] Will render children from update component');
    this.renderChild(_options, _parentCount);
  }

  renderChild(_options, _parentCount) {
    if (this.isDynamicContext() && this.dynamicContextForceRenderChildren === false) {
      if (this.dynamicContext) {
        if (!this.dynamicContext.isLoaded)
          return;
      } else {
        return;
      }
    }



    let child, repeat_child;
    let count = 0;
    for (let i = 0; i < this.children.length; i++) {
      child = this.children[i];

      if (child.isRepeater()) {
        let prevRepeatLength = child.clonePool.length;
        let repeatIngredient = _options.resolve ? child.getControlWithResolve('repeat-n') : parseInt(child.getControl('repeat-n'));
        let repeatCount;

        if (repeatIngredient instanceof Array) {

          repeatCount = repeatIngredient.length;
        } else if (typeof repeatIngredient === 'number' && !isNaN(repeatIngredient)) {

          repeatCount = repeatIngredient;
          repeatIngredient = null;
        } else if (typeof repeatIngredient === 'string' && /^\d+$/.test(repeatIngredient)) {
          repeatCount = parseInt(repeatIngredient);
          repeatIngredient = null;
        } else {
          console.warn(`#${this.id} invalid repeat value[${JSON.stringify(repeatIngredient)}]. Matter Argument:[${child.getControl('repeat-n')}] ${this.DEBUG_FILE_NAME_EXPLAIN}`);
          //throw new Error(`#${this.id} invalid repeat value[${JSON.stringify(repeatIngredient)}]. Matter Argument:[${child.getControl('repeat-n')}] ${this.DEBUG_FILE_NAME_EXPLAIN}`);
        }


        // 반복자 소스 요소는 unmount 를 진행한다.
        if (child.getDOMNode()) {

          child.render({
            dontcareMissed: true
          }, true);
        }
        // let stackedExportDate = 0,
        //   stackedBuildDate = 0,
        //   stackedRenderDate = 0;
        // let date, _futureDate;

        let exported;
        for (let repeat_i = 0; repeat_i < Math.max(repeatCount, prevRepeatLength); repeat_i++) {
          if (repeat_i < repeatCount) {
            repeat_child = child.clonePool[repeat_i];

            // clonePool 인덱스에 해당하는 요소가 존재 하지 않는 경우 복제하여 clonePool에 push
            if (!repeat_child) {
              // date = new Date();
              exported = child.export(false, `@${repeat_i}`);
              // _futureDate = new Date();

              // stackedExportDate += _futureDate - date;
              // date = new Date();

              repeat_child = Factory.takeElementNode(exported, {
                isGhost: true,
                repeatOrder: repeat_i,
                repeatItem: repeatIngredient ? repeatIngredient[repeat_i] : null,
                isRepeated: true
              }, child.getType(), child.environment, null);

              // _futureDate = new Date();
              // stackedBuildDate += _futureDate - date;

              child.clonePool.push(repeat_child);
            } else {
              repeat_child.repeatItem = repeatIngredient ? repeatIngredient[repeat_i] : null;
            }

            repeat_child.parent = this;
            repeat_child.upperContainer = this;

            // date = new Date();
            count = repeat_child.render(_options, false, count);
            // _futureDate = new Date();

            // stackedRenderDate += _futureDate - date;
            count++;
          } else {
            // 현재 반복 인덱스보다 높은 요소는 unmount 진행
            //child.clonePool[repeat_i].render(_options, true);
            let willbeunmount = child.clonePool.pop();
            willbeunmount.render(_options, true);
          }

        }
        // console.log(stackedExportDate, stackedBuildDate, stackedRenderDate);
      } else {
        count = child.render(_options, false, count);
        count++;
      }

    }
  }

  applyHiddenState() {
    super.applyHiddenState();

    this.childrenIteration((_child) => {
      _child.applyHiddenState();
    });
  }

  appendChild(_elementNode) {
    if (this.getType() === 'string') {
      return false;
    }

    _elementNode.setParent(this);
    _elementNode.upperContainer = this;

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

  findById(_id, _absolute) {
    let targetSplitedId = _id.split('@');


    return this.findRecursive(function(_compareElement) {

      // _absolute 옵션이 있는 경우 ID가 완전히 일치하는 요소를 찾는다.
      if (_absolute) {
        return _compareElement.id === _id;
      }

      if (targetSplitedId.length === 1) {
        // no depth
        if (_compareElement.isGhost) {
          let splited = _compareElement.id.split('@');

          return splited[0] === _id;
        } else {

          return _compareElement.id === _id;
        }
      } else {
        // has depth

        if (_compareElement.isGhost) {
          let splited = _compareElement.id.split('@');

          for (let i = 0; i < targetSplitedId.length; i++) {
            if (splited[i]) {
              if (splited[i] !== targetSplitedId[i]) {
                return false;
              }
            }
          }

          return true;
        } else {
          return false;
        }
      }
      return false;
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
    //    console.time('Build By ElementNode[html]');

    super.buildByElement(_domElement, _absorbOriginDOM);

    // this.setType('html');

    //////////////////
    // 자식노드 재귀처리 //
    var children = [];
    var childNodes = ObjectExtends.arrayToArray(_domElement.childNodes);

    // 자식노드도 생성
    var child_ = null;
    let prevElementNode = null;
    let elementNodeBuildResult;
    for (var i = 0; i < childNodes.length; i++) {
      child_ = childNodes[i];


      // en- 으로 시작되는 태그를 ScopeNode로 취급한다.
      if (/^en:/i.test(child_.nodeName) || (child_.nodeName.toLowerCase() === 'script' && child_.getAttribute('en-scope-type') !== null)) {

        this.appendScopeNode(this.buildScopeNodeByScopeDom(child_));

        _domElement.removeChild(child_);
        continue;
      }



      var newChildElementNode;
      // comment node 는 Scope 선언자가 있는지 확인 하고 존재한다면 Scope 로 빌드

      if (child_.nodeName === '#comment') {
        let text = child_.nodeValue;

        if (/^\@scope/i.test(text)) {
          this.appendScopeNode(this.buildScopeNodeByScopeText(text));
        }

        _domElement.removeChild(child_);
        continue;
      } else if (child_.nodeName === '#text') {
        if (child_.parentNode !== null) {

          // 부모 태그가  pre 태그의 경우 공백과 탭 줄바꿈을 그대로 유지하여 랜더링 함으로 그대로 생성을 진행 하도록 한다.
          // 부모 태그가 pre 태그가 아닌 경우 text노드의 nodeValue 즉 내용이 공백과 줄바꿈 탭으로만 이루어 져 있을 경우 택스트 노드 생성을 스킵하도록 한다.
          if (child_.parentNode.nodeName.toLowerCase() === "pre") {
            if (/^[\s\n]+$/g.test(child_.nodeValue)) {
              _domElement.removeChild(child_);
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


      if (elementNodeBuildResult === null) {
        _domElement.removeChild(child_);
        continue;
      }

      newChildElementNode.prevSibling = prevElementNode;
      children.push(newChildElementNode);
      newChildElementNode.setParent(this);
      newChildElementNode.upperContainer = this;

      prevElementNode = newChildElementNode;
    }
    // 선택적 재귀끝  //
    ////////////
    this.children = children;
    //    console.timeEnd('Build By ElementNode[html]');
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
      child.upperContainer = this;

      // 이전 요소 지정
      child.prevSibling = prevChild;

      list.push(child);

      prevChild = child;
    }

    return list;
  }


  import (_elementNodeDataObject) {
    super.import(_elementNodeDataObject);

    this.children = this.inspireChildren(_elementNodeDataObject.c || []);
  }

  export (_withoutId, _idAppender, _withCompile) {
    let result = super.export(_withoutId, _idAppender, _withCompile);
    result.c = [];

    this.children.map(function(_child) {
      if (!_child.isGhost) {
        // 자식이 고스트가 아닌경우만 export한다.


        result.c.push(_withCompile ? _child.compile() : _child.export(_withoutId, _idAppender, _withCompile));
      } else {

        // 자식이 고스트이면서 반복된 요소일 떄는 export한다.
        if (!_child.isRepeated) {
          result.c.push(_withCompile ? _child.compile() : _child.export(_withoutId, _idAppender, _withCompile));
        }
      }

    });

    return result;
  }



  exportAsScript() {
    // 컴포넌트 지시자 필요
    // ref없이 컴포넌트 지시자로 지정한 객체로 component가 동작하도록

    Orient.createInstance('html', 'div', { /* etc data */ }, { /* properties */ })
    Orient.createInstance('html', 'div', {
      children: [Orient.createInstance('html', 'div'), Orient.createInstance('html', 'div')]
    })
  }
}

export default HTMLElementNode;