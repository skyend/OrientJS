"use strict";
import TagBaseElementNode from './TagBaseElementNode.js';
import React from 'react';
//import ReactComponentErrorBox from '../jsx/ReactComponentErrorBox.jsx';
import _ from 'underscore';

class ReactElementNode extends TagBaseElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps, _dynamicContext) {
    super(_environment, _elementNodeDataObject, _preInsectProps, _dynamicContext);
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

  realize(_realizeOptions, _complete) {
    let that = this;

    super.realize(_realizeOptions, function() {
      let realizeOptions = _realizeOptions || {};

      if (that.getReactPackageKey())
        that.realization.setAttribute('en-react-package-key', that.getReactPackageKey())
      if (that.getReactComponentKey())
        that.realization.setAttribute('en-react-component-key', that.getReactComponentKey())
      if (that.getReactComponentProps())
        that.realization.setAttribute('en-react-component-props', JSON.stringify(that.getReactComponentProps()))


      if (realizeOptions.skipControl !== true) {


        let packageKey = that.getReactPackageKey();
        let componentKey = that.getReactComponentKey();

        let component;
        console.log("REact realize ", packageKey, componentKey);
        if (packageKey === 'CUSTOM') {
          // 커스텀은 Gelateria서버에서 로드하는 컴포넌트로 내장 컴포넌트와는 다르게 동작을 구성하였다.
          // 추후에 컴포넌트 시스템을 다시 설계해야한다.
          console.log(that.environment.contextController.serviceManager);
          component = that.environment.contextController.serviceManager.app.session.getComponentPool().getComponentFromRemote(componentKey, packageKey, undefined, function(_result) {
            that.loadedComponent = _result;

            console.log("여기", _result);
            let reactProperties = that.getReactComponentPropsWithResolve();
            let reactElement = React.createElement(_result.class, reactProperties);

            let reactComponent = React.render(reactElement, that.realization);

            that.environment.contextController.applyComponentCSS(packageKey + '/' + componentKey, _result.CSS);


            // self.setRealization(reactComponent.getDOMNode());
            // self.parent.linkHierarchyRealizaion();

            _complete();
          });

          return;
        } else {

          component = that.environment.contextController.serviceManager.app.session.getComponentPool().getComponentFromRemote(componentKey, packageKey);
        }


        that.loadedComponent = component;
        //console.log('Loaded Component', this.loadedComponent.CSS);



        console.log('바인딩 ', that.getReactComponentPropsWithResolve());

        let reactElement;
        let reactProperties = that.getReactComponentPropsWithResolve();
        reactElement = React.createElement(that.loadedComponent.class, reactProperties);

        try {

          React.render(reactElement, that.realization);

          this.environment.contextController.applyComponentCSS(packageKey + '/' + componentKey, that.loadedComponent.CSS);

        } catch (_e) {
          let maybe = undefined;
          let expectedProblemProps = [];
          let propStruct = that.loadedComponent.propStruct;

          if (propStruct !== undefined) {
            let propKeys = Object.keys(propStruct);

            propKeys.map(function(_key) {
              if (propStruct[_key].require == true) {
                console.log(reactProperties);
                if (typeof reactProperties[_key] === 'string' && /`Error:/.test(reactProperties[_key])) {
                  expectedProblemProps.push(_key);
                }
              }
            });

          }

          // React.render(React.createElement(ReactComponentErrorBox, {
          //   componentKey: componentKey,
          //   packageKey: packageKey,
          //   error: _e,
          //   maybe: "Expect [" + expectedProblemProps.join(',') + '] property have any problems.',
          //   width: "100%",
          //   height: "100%"
          // }), this.realization);
        }


        that.mappingNavigateChildren();

        _complete();
      }
    });
  }

  mappingNavigateChildren() {

    let children = this.realization.querySelectorAll("*");
    let self = this;

    for (let i = 0; i < children.length; i++) {
      let child = children[i];

      // navigate
      if (child.getAttribute('data-navigate') !== null && child.getAttribute('data-navigate') !== undefined) {
        let navigate = child.getAttribute('data-navigate');

        child.onclick = function(_e) {
          console.log("React click");
          _e.preventDefault();
          if (self.environment.enableNavigate) {
            self.navigateHandling(navigate);
          }
        };
      }
    }
  }

  buildByComponent(_component) {
    super.buildByComponent(_component);

    this.setTagName('div');
    this.setReactPackageKey(_component.packageKey);
    this.setReactComponentKey(_component.componentKey);
  }

  buildByElement(_domElement, _ignoreAttrFields) {
    super.buildByElement(_domElement, ['en-react-package-key', 'en-react-component-key', 'en-react-component-props']);

    if (_domElement.getAttribute('en-react-package-key') !== null)
      this.setReactPackageKey(_domElement.getAttribute('en-react-package-key'));

    if (_domElement.getAttribute('en-react-component-key') !== null)
      this.setReactComponentKey('repeat-n', _domElement.getAttribute('en-react-component-key'));

    if (_domElement.getAttribute('en-react-component-props') !== null) {
      let propsString = _domElement.getAttribute('en-react-component-props');
      try {
        this.setReactComponentProps(JSON.parse(propsString));
      } catch (e) {}
    }
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