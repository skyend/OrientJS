import HTMLElementNode from './HTMLElementNode.js';


class GridElementNode extends HTMLElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps) {
    super(_environment, _elementNodeDataObject, _preInsectProps);
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

    this._behavior; // Grid, Row, Column, Layer
  }

  get behavior() {
    return this._behavior;
  }

  get screenSize() {
    return this._screenSize;
  }

  get temporaryDecrementRectSize() {
    return this._temporaryDecrementRectSize;
  }

  set behavior(_behavior) {
    this._behavior = _behavior;
  }

  set screenSize(_screenSize) {

    this._screenSize = _screenSize;
    console.log(this._screenSize, this);
  }

  set temporaryDecrementRectSize(_rect) {
    this._temporaryDecrementRectSize.width += _rect.width;
    this._temporaryDecrementRectSize.height += _rect.height;
  }


  resetTemporaryDecrementRectSize() {
    this._temporaryDecrementRectSize = {
      width: 0,
      height: 0
    };
  }


  calcContainerSize() {
    console.log(this.getCurrentRectangle());
    let requiredWidth = 0; // 필요한 최소 넓이
    let requiredHeight = 0; // 필요한 최소 높이

    this.childrenIteration(function(_child) {
      console.log(_child.calcContainerSize());
    });

    console.log('calcContainerSize {temporaryDecrementRectSize}', this.temporaryDecrementRectSize);
    return {
      requiredWidth: requiredWidth,
      requiredHeight: requiredHeight
    };
  }

  calcParentSize() {

  }



  import (_elementNodeDataObject) {
    super.import(_elementNodeDataObject);
    this.behavior = _elementNodeDataObject.behavior;

  }

  export (_withoutId) {
    let result = super.export(_withoutId);
    result.behavior = this.behavior;

    return result;
  }
}

export default GridElementNode;