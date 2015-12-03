import TagBaseElementNode from './TagBaseElementNode.js';
import React from 'react';
import _ from 'underscore';

class ReactElementNode extends TagBaseElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps) {
    super(_environment, _elementNodeDataObject, _preInsectProps);
    this.type = 'react';

    /* React Type */
    this.reactPackageKey;
    this.reactComponentKey;
    this.reactComponentProps;

    this.loadedComponent = null;
    console.log(this, 'react create');
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

  getReactComponentProp(_propKey) {
    return this.reactComponentProps[_propKey];
  }

  getReactComponentProps() {
    return this.reactComponentProps;
  }

  getReactComponentPropsWithResolve(_propKey) {
    let self = this;
    let resolvedProps = {};
    let props = this.getReactComponentProps();
    let propKeys = Object.keys(props);

    propKeys.map(function(_key) {


      resolvedProps[_key] = self.interpret(props[_key]);
      console.log('리졸브---', _key, resolvedProps[_key]);
    });

    return resolvedProps;
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

  // componentKey
  setReactComponentProp(_propKey, _propValue) {
    this.reactComponentProps[_propKey] = _propValue;
  }

  // React Element
  setReactElement(_reactElement) {
    this.reactElement = _reactElement;
  }

  // ReactTypeComponent
  setReactTypeComponent(_component) {
    this.reactTypeComponent = _component;
  }

  linkHierarchyRealizaion() {
    //React.render(React.createElement(this.loadedComponent.class), this.realization)
  }

  realize(_realizeOptions) {
    super.realize(_realizeOptions);
    let realizeOptions = _realizeOptions || {};

    if (realizeOptions.skipControl !== true) {
      let packageKey = this.getReactPackageKey();
      let componentKey = this.getReactComponentKey();
      let component = this.environment.contextController.serviceManager.app.session.getComponentPool().getComponentFromRemote(componentKey, packageKey);

      this.loadedComponent = component;
      //console.log('Loaded Component', this.loadedComponent.CSS);

      this.environment.contextController.applyComponentCSS(packageKey + '/' + componentKey, this.loadedComponent.CSS);

      console.log('바인딩 ', this.getReactComponentPropsWithResolve());

      React.render(React.createElement(this.loadedComponent.class, this.getReactComponentPropsWithResolve()), this.realization)
    }
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
    result.reactComponentProps = _.clone(this.getReactComponentProps());
    return result;
  }

  import (_elementNodeDataObject) {
    let result = super.import(_elementNodeDataObject);

    this.reactPackageKey = _elementNodeDataObject.reactPackageKey;
    this.reactComponentKey = _elementNodeDataObject.reactComponentKey;
    this.reactComponentProps = _elementNodeDataObject.reactComponentProps || {};

    return result;
  }
}

export default ReactElementNode;