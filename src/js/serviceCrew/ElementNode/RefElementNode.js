"use strict";
import TagBaseElementNode from './TagBaseElementNode.js';
import _ from 'underscore';

class RefElementNode extends TagBaseElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps) {
    super(_environment, _elementNodeDataObject, _preInsectProps);
    this.type = 'ref';

  }

  import (_elementNodeDataObject) {
    let result = super.import(_elementNodeDataObject);
    return result;
  }

  export (_withoutId) {
    let result = super.export(_withoutId);
    return result;
  }
}

export default RefElementNode;