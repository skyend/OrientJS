import HTMLElementNode from './HTMLElementNode.js';
import _ from 'underscore';
import SALoader from '../StandAloneLib/Loader.js';
import Factory from './Factory';
import async from 'async';
import SA_Fragment from '../StandAloneLib/Fragment'
import Gelato from '../StandAloneLib/Gelato';
"use strict";

let RefferenceType = Object.freeze({
  ElementNode: 'ElementNode',
  Fragment: 'Fragment',
  NONE: 'NONE'
});


class RefElementNode extends HTMLElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps, _dynamicContext) {
    super(_environment, _elementNodeDataObject, _preInsectProps, _dynamicContext);
    this.type = 'ref';

    this.loadedInstance = null;
    this.loadedRefs = false;
  }

  get refType() {
    return this._refType;
  }

  get refTargetId() {
    return this._refTargetId;
  }

  set refType(_refType) {
    this._refType = _refType;
  }

  set refTargetId(_refTargetId) {
    this._refTargetId = _refTargetId;
  }

  mappingAttributes(_domNode, _options) {
    super.mappingAttributes(_domNode, _options);

    if (this.refType)
      _domNode.setAttribute('en-ref-type', this.refType);

    if (this.refTargetId)
      _domNode.setAttribute('en-ref-target-id', this.refTargetId);
  }

  childrenConstructAndLink(_options, _htmlNode, _complete) {
    let that = this;

    // super.childrenConstructAndLink(_options, _htmlNode, function() {

    if (_.isString(that.refTargetId)) {
      if (that.loadedRefs == false) {
        that.loadRefferenced(function(_resultObject) {
          that.loadedRefs = true;
          that.loadedInstance = _resultObject;

          console.log('loaded', _resultObject);
          that.childrenConstructAndLink(_options, _htmlNode, function() {
            _complete();
          });
        });

      } else { // load 완료시

        if (that.refType === 'Fragment' && this.loadedInstance !== null) {

          // 상위 environment 지정
          that.loadedInstance.upperEnvironment = that.environment;

          console.log('params', this.scopeNodes);

          this.scopeNodes.map(function(_scopeNode) {
            if (_scopeNode.type === 'param') {
              console.log(_scopeNode.value);
              that.loadedInstance.setParam(_scopeNode.name, that.interpret(_scopeNode.plainValue));
            }
          });


          that.loadedInstance.constructDOMChildren(_options, function(_domList) {
            _htmlNode.innerHTML = '';

            // parent 삽입
            that.loadedInstance.rootElementNodes.map(function(_rootElementNode) {
              _rootElementNode.setParent(that);
            });

            _domList.map(function(_dom) {
              _htmlNode.appendChild(_dom);
            });

            _complete([]);
          });

        } else if (that.refType === 'ElementNode') {
          that.loadedInstance.map(function(_elementNode) {
            _elementNode.setParent(that);
          });

          that.children = that.loadedInstance;

          _htmlNode.innerHTML = '';
          super.childrenConstructAndLink(_options, _htmlNode, _complete);
        }
      }
    } else {
      _complete([]);
    }
  }


  buildByElement(_domElement) {
    super.buildByElement(_domElement, ['en-ref-type', 'en-ref-target-id', 'en-']);
    let attributes = _domElement.attributes;
    let attr;

    if (_domElement.getAttribute('en-ref-type') !== null)
      this.refType = _domElement.getAttribute('en-ref-type');

    if (_domElement.getAttribute('en-ref-target-id') !== null)
      this.refTargetId = _domElement.getAttribute('en-ref-target-id');

    // for (let i = 0; i < attributes.length; i++) {
    //   attr = attributes[i];
    //
    // }


  }

  appendChild(_elementNode) {
    this.children = [];
    super.appendChild(_elementNode);
    this.refType = RefferenceType.ElementNode;
    this.refTargetId = _elementNode.id;

    return true;
  }

  loadRefferenced(_complete) {
    if (Gelato.one() !== null) {
      this._sa_loadRefferenced(_complete);
    } else {
      console.error("not implemented");
    }
  }

  _sa_loadRefferenced(_complete) {

    if (this.refType === 'ElementNode') {
      this._sa_loadSharedElementNode(_complete);
    } else if (this.refType === 'Fragment') {
      //this._sa_loadFragment(_complete);

      this.environment.highestEnvironment.loadFragment(this.refTargetId, function(_err, _fragment) {
        _complete(_fragment);
      });

    }
  }

  _sa_loadFragment(_complete) {
    let that = this;
    let refTargetId = this.interpret(this.refTargetId);

    SALoader.loadFragment(refTargetId, function(_fragmentText) {

      let fragment = new SA_Fragment(refTargetId, _fragmentText, that.realization);

      fragment.buildElementNode(that.environment);

      _complete(fragment);
    });
  }

  _sa_loadSharedElementNode(_complete) {
    let that = this;
    let parseContainer = document.createElement('div');
    let refTargetId = this.interpret(this.refTargetId);

    SALoader.loadSharedElementNode(refTargetId, function(_sharedElementNodeText) {
      parseContainer.innerHTML = _sharedElementNodeText;

      let children = [];

      for (let i = 0; i < parseContainer.children.length; i++) {
        let elementNode = Factory.takeElementNode(undefined, {}, 'html', that.environment, that.dynamicContext);
        elementNode.buildByElement(parseContainer.children[i]);
        children.push(elementNode);
      }

      _complete(children);
    });
  }

  import (_elementNodeDataObject) {
    let result = super.import(_elementNodeDataObject);
    this.refType = RefferenceType[_elementNodeDataObject.refType || 'NONE'];
    this.refTargetId = _elementNodeDataObject.refTargetId;
    return result;
  }

  export (_withoutId) {
    let result = super.export(_withoutId);
    result.refType = RefferenceType[this.refType || 'NONE'];
    result.refTargetId = this.refTargetId;
    return result;
  }
}

export default RefElementNode;