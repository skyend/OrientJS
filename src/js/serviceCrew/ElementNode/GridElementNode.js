import HTMLElementNode from './HTMLElementNode.js';


class GridElementNode extends HTMLElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps) {
    super(_environment, _elementNodeDataObject, _preInsectProps);
    this.type = 'grid';

    this._behavior; // Grid, Row, Column, Layer
  }

  get behavior() {
    return this._behavior;
  }

  set behavior(_behavior) {
    this._behavior = _behavior;
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