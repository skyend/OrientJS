"use strict";
import HTMLElementNode from './HTMLElementNode.js';
import Document from '../Document.js';
import _ from 'underscore';

class GridElementNode extends HTMLElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps, _dynamicContext) {
    super(_environment, _elementNodeDataObject, _preInsectProps, _dynamicContext);
    this.type = 'grid';

    this.screenSize = {
      width: undefined,
      height: undefined
    };

    // 에디팅 중 임시로 상자의 넓이가 감소되어야 하는 수치
    // 옵션박스와 테두리 선을 포함한다.
    this._temporaryDecrementRectSize = {
      width: 0,
      height: 0
    }

    //this._behavior; // Grid, Row, Column, Layer
    this._followingFragment;

    this._loadedFollowingFragmentObject = null;
    this._fragmentAnalysisResult = null;
  }


  get screenSize() {
    return this._screenSize;
  }

  get temporaryDecrementRectSize() {
    return this._temporaryDecrementRectSize;
  }

  get followingFragment() {
    return this._followingFragment;
  }

  get loadedFollowingFragmentObject() {
    return this._loadedFollowingFragmentObject;
  }

  get fragmentAnalysisResult() {
    return this._fragmentAnalysisResult;
  }

  set screenSize(_screenSize) {

    this._screenSize = _screenSize;
  }

  set temporaryDecrementRectSize(_rect) {
    this._temporaryDecrementRectSize.width += _rect.width;
    this._temporaryDecrementRectSize.height += _rect.height;
  }

  set followingFragment(_followingFragment) {
    this._followingFragment = _followingFragment;
  }

  set loadedFollowingFragmentObject(_loadedFollowingFragmentObject) {
    this._loadedFollowingFragmentObject = _loadedFollowingFragmentObject;
  }

  set fragmentAnalysisResult(_fragmentAnalysisResult) {
    this._fragmentAnalysisResult = _fragmentAnalysisResult;
  }

  mappingAttributes(_domNode, _options) {
    super.mappingAttributes(_domNode, _options);

    if (this.followingFragment)
      _domNode.setAttribute('en-ref-fragment', this.followingFragment);
  }

  childrenConstructAndLink(_options, _htmlNode, _complete) {

    if (_.isString(this.followingFragment) && this.loadedFollowingFragmentObject === null) {
      let that = this;
      this.environment.loadFragment(this.followingFragment, function(_err, _fragment) {
        that.loadedFollowingFragmentObject = _fragment;
        console.log(_fragment);
        that.children = _fragment.rootElementNodes;
        that.childrenConstructAndLink(_options, _htmlNode, _complete);
        // _fragment.constructDOMChildren(_options, function(_elementNodeList) {
        //   console.log(_doms);
        //   that.children = _doms;
        //
        //   _complete();
        // });
      });
    } else {
      super.childrenConstructAndLink(_options, _htmlNode, _complete);
    }
  }

  realize(_realizeOptions, _complete) {
    let that = this;
    super.realize(_realizeOptions, function(_result) {
      if (_result === false) return _complete(_result);

      console.log(that.realization, that.environment, that.environment.screenMode);
      let containerSize = that.calcContainerSize(that.environment.screenMode);
      //this.realization.style.width = containerSize.width;
      //this.realization.style.height = containerSize.height;
      if (that.behavior === 'row') {

      } else if (that.behavior === 'column') {
        that.realization.style.float = 'left';

      }

      //this.realization.style.backgroundColor = 'rgba(' + [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 0.5].join(',') + ')';
      that.realization.setAttribute("en-behavior", that.behavior);

      if (that.followingFragment !== null) {
        that.realization.setAttribute('en-ref-fragment', that.followingFragment);

        that.environment.getFragment(that.followingFragment, function(_fragmentContextController) {
          that.setFragmentCC(_fragmentContextController);
          that.fragmentRender(_realizeOptions, function() {

            _complete()
          });
        });
      } else {
        _complete();
      }
    });
  }

  linkHierarchyRealizaion() {
    super.linkHierarchyRealizaion();

    if (this.behavior === 'row') {
      // 마지막에 clear블록을 삽입하여 float:left CSS 속성을 가진 Column들의 높이를 적용한다.
      let clearBlock = document.createElement('div');
      clearBlock.style.clear = 'both';
      //clearBlock.style.content = " ";
      clearBlock.style.display = "block";

      this.realization.appendChild(clearBlock);
    }
  }

  setFragmentCC(_fragmentContextController) {
    this.fragmentContextController = _fragmentContextController;
    console.log(this.fragmentContextController);
  }

  fragmentRender(_realizeOptions, _complete) {
    this.realization.innerHTML = '';
    this.realization.setAttribute('en-ref-fragment', this.fragmentContextController.subject.documentName);

    this.fragmentContextController.attach(this.environment.fragmentContext);
    this.fragmentContextController.setSuperElement(this.realization);
    this.fragmentContextController.beginRender(_realizeOptions, function() {
      _complete();
    });
  }

  resetTemporaryDecrementRectSize() {
    this._temporaryDecrementRectSize = {
      width: 0,
      height: 0
    };
  }

  // 자식의 사이즈와 무관하게 자신의 사이즈를 계산한다.
  // 자신의 사이즈가 단위가 px 과 같은 고정값일 경우 자신의 Rectangle을 가져와 반환하며
  // 자신의 사이즈가 단위가 % 와 같은 상대값일 경우 부모의 ContainerSize를 기반으로 계산한다.
  calcContainerSize(_screenMode) {
    // let currentRect = this.getCurrentRectangle();
    // let widthUnit = this.getCriterionFromQuantity(currentRect.width);
    // let heightUnit = this.getCriterionFromQuantity(currentRect.height);
    let width = this.calcContainerPart('width', _screenMode);
    let height = this.calcContainerPart('height', _screenMode);




    //console.log('calcContainerSize {temporaryDecrementRectSize}', this.temporaryDecrementRectSize);
    return {
      width: width,
      height: height
    };
  }

  analysisFriendAutoPart(_part, _screenMode) {
    let self = this;
    let autoCount = 1; // include me
    let upperSize = this.getUpperContainerPart(_part, _screenMode);
    let parent = this.getParent();
    let remainSize = upperSize;

    if (parent !== null) {
      parent.childrenIteration(function(_child) {
        let rect;
        if (_screenMode === undefined) {
          rect = _child.getCurrentRectangle();
        } else {
          rect = _child.getRectangleByScreenMode(_screenMode);
        }

        if (_child !== self) {
          if (rect[_part] === 'auto') {
            autoCount++;
          } else {
            remainSize -= _child.calcContainerPart(_part, _screenMode);
          }
        }
      });

      return remainSize / autoCount;
    } else {
      return upperSize;
    }
  }

  calcContainerPart(_part, _screenMode) {
    let currentRect;
    if (_screenMode === undefined) {
      currentRect = this.getCurrentRectangle();
    } else {
      currentRect = this.getRectangleByScreenMode(_screenMode);
    }
    let valueUnit = this.getCriterionFromQuantity(currentRect[_part]);
    //console.log('calcContainerPart currentRect[' + _part + '] valueUnit', currentRect[_part], valueUnit);

    if (valueUnit === 'auto') {
      // 부모로부터 정보를 얻어야 함
      if (this.behavior === 'row' && _part === 'width') {
        return this.getUpperContainerPart(_part, _screenMode);
      } else if (this.behavior === 'column' && _part === 'height') {
        return this.getUpperContainerPart(_part, _screenMode);
      } else if (this.behavior === 'layer') {
        return this.getUpperContainerPart(_part, _screenMode);
      }

      return this.analysisFriendAutoPart(_part, _screenMode);
    } else if (valueUnit === 'px') {
      return parseInt(currentRect[_part]);
    } else if (valueUnit === '%') {
      let value = parseInt(currentRect[_part]);

      let upperContainerPartValue = this.getUpperContainerPart(_part, _screenMode);
      // % 연산
      // 1200 의 10% == 120
      // 1200 의 20% == 240
      // 1200 의 30% == 360

      //console.log(_part, ' calc : ', currentRect[_part], ' result: ', (value / 100) * upperContainerPartValue);
      return (value / 100) * upperContainerPartValue;
    }

    //throw new Error("Not supported unit[" + valueUnit + "]");
    return currentRect[_part];
  }

  getUpperContainerPart(_part, _screenMode) {
    let parent = this.getParent();
    if (parent !== null) {
      return parent.calcContainerPart(_part, _screenMode);
    } else {
      return this.screenSize[_part];
    }
  }

  // 자식들의 사이즈를 고려하여 자신이 가져야 할 최소 크기를 계산한다.
  calcRequiredContainerSize() {
    let currentRect = this.getCurrentRectangle();
    let designedWidth = currentRect.width;
    let designedHeight = currentRect.height;
    let sumWidth = 0;
    let sumHeight = 0;



    let childSize;
    this.childrenIteration(function(_child) {
      childSize = _child.calcRequiredContainerSize();

      sumWidth += childSize.width;
      sumHeight += childSize.height;
    });

    return {
      width: Math.max(sumWidth, this.calcWidthSize(currentRect.width)),
      height: Math.max(sumHeight, this.calcHeightSize(currentRect.height))
    };
  }

  loadFollowingFragmentObject(_complete) {
    console.log("load followingFragment Object");
    this.loadedFollowingFragmentObject = null;

    if (this.followingFragment !== null) {

      let self = this;


      let fragment = this.environment.serviceManager.getDocument(this.followingFragment, function(_fragment) {

        self.loadedFollowingFragmentObject = _fragment.document;
        _complete(_fragment.document);
      });
    }
  }

  calcWidthSize(_width) {
    // 부모의 width를 얻어 clacQuantity를 계산한다.
    // root의 경우 screen을 _containerQuantity로 사용한다.

  }

  calcHeightSize(_height) {

  }

  // 량을 계산한다. % 와 auto px 모든 단위의 량을 자신을 감싸는 컨테이너에 상대적으로 량을 계산해낸다.
  // px 와 auto 는 container량의 영향을 받지않는다.
  calcQuantity(_quantity, _containerQuantity) {

    // auto는 부모 _containerQuantity에서 자신과 같은 레벨의 요소들이 소모하고 남은 값을 나눠 가진다.
    if (_quantity === 'auto') {
      return 0;
    } else if (/^[\d\.]+px$/.test(_quantity)) {

      return parseInt(_quantity);
    } else if (/^[\d\.]+%$/.test(_quantity)) {
      // percent processing

      return 0;
    }
  }

  // 량 변수의 처리기준이 되는 Unit을 반환한다.
  // return "auto" | "px" | "%"
  getCriterionFromQuantity(_quantityValue) {
    if (_quantityValue === 'auto') {
      return 'auto';
    } else {
      let unit = _quantityValue.replace(/^[\d\.]+/, '');

      if (unit === 'px') {
        return unit;
      } else if (unit === '%') {
        return unit;
      } else {
        return unit;
        //throw new Error("Not supported Quantity Unit[" + unit + "]");
      }
    }
  }

  isLayerContainer() {
    if (this.children.length > 0) {
      if (this.children[0].behavior === 'layer') {
        return true;
      }
    }
    return false;
  }


  remove() {
    this.getParent().detachChild(this);
  }

  clearInside() {
    this.followingFragment = null;
    this.children = [];
  }

  analysisFollowingFragmentData() {
    let analysisResult = Document.analysisData(this.loadedFollowingFragmentObject);
    this.fragmentAnalysisResult = analysisResult;
  }

  isPreparedAllBindRules() {
    let self = this;
    let usingNSs = Object.keys(this.fragmentAnalysisResult);
    let prepared = true;

    let nsResult = usingNSs.map(function(_ns) {
      let result = self.environment.checkPrepareParamSupply(_ns);

      console.log(result);
      if (result !== true) {
        prepared = false;
      }

      return {
        ns: _ns,
        result: result
      };
    });

    console.log('프패', prepared);

    return prepared;
    //console.log('check bind rule', this.environment, this.fragmentAnalysisResult);
  }

  buildByElement(_domElement, _ignoreAttrFields) {
    let ignoreAttrFields = _.union([], _ignoreAttrFields || ['en-ref-fragment']);

    super.buildByElement(_domElement, ignoreAttrFields);

    if (_domElement.getAttribute('en-ref-fragment') !== null)
      this.followingFragment = _domElement.getAttribute('en-ref-fragment');
  }

  import (_elementNodeDataObject) {
    super.import(_elementNodeDataObject);
    this.followingFragment = _elementNodeDataObject.followingFragment || null;
  }

  export (_withoutId) {
    let result = super.export(_withoutId);
    result.followingFragment = this.followingFragment;

    return result;
  }
}

export default GridElementNode;