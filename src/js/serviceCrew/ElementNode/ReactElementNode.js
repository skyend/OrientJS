import TagBaseElementNode from './TagBaseElementNode.js';
import _ from 'underscore';

class ReactElementNode extends TagBaseElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps) {
    super(_environment, _elementNodeDataObject, _preInsectProps);
    this.type = 'react';

    /* React Type */
    this.reactPackageKey;
    this.reactComponentKey;
    this.reactComponentProps;
  }

  // packageKey
  getReactPackageKey() {
    return this.reactPackageKey;
  }

  // ReactTypeComponent
  getReactTypeComponent() {
    return this.reactTypeComponent;
  }

  // componentKey
  getReactComponentKey() {
    return this.reactComponentKey;
  }

  // React Element
  getReactElement() {
    return this.reactElement;
  }

  // packageKey
  setReactPackageKey(_reactPackageKey) {
    this.reactPackageKey = _reactPackageKey;
  }

  // componentKey
  setReactComponentKey(_reactComponentKey) {
    this.reactComponentKey = _reactComponentKey;
  }

  // componentKey
  setReactComponentProps(_reactComponentProps) {
    this.reactComponentProps = _reactComponentProps;
  }

  // React Element
  setReactElement(_reactElement) {
    this.reactElement = _reactElement;
  }

  // ReactTypeComponent
  setReactTypeComponent(_component) {
    this.reactTypeComponent = _component;
  }

  buildByComponent(_component) {
    super.buildByComponent(_component);

    this.setTagName('div');
    this.setReactPackageKey(_component.packageKey);
    this.setReactComponentKey(_component.componentKey);
  }

  export (_withoutId) {
    let result = super.export(_withoutId);
    result.reactPackageKey = this.getReactPackageKey();
    result.reactComponentKey = this.getReactComponentKey();

    return result;
  }

  import (_elementNodeDataObject) {
    let result = super.import(_elementNodeDataObject);

    this.reactPackageKey = _elementNodeDataObject.reactPackageKey;
    this.reactComponentKey = _elementNodeDataObject.reactComponentKey;
    this.reactComponentProps = _elementNodeDataObject.reactComponentProps;

    return result;
  }
}

export default ReactElementNode;