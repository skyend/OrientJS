import ElementNode from '../ElementNode.js';

class EmptyElementNode extends ElementNode {
  constructor(_document, _elementNodeDataObject, _preInsectProps) {
    super(_document, _elementNodeDataObject, _preInsectProps);

    this.refferenceType; // react | document | ...
    this.refferenceTarget; // reactComponent{ _componentKey, _packageKey }
    this.refferenceTargetProps; // {...}
  }
}

export default EmptyElementNode;