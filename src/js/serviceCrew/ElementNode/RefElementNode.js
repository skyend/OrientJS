"use strict";
import HTMLElementNode from './HTMLElementNode.js';
import _ from 'underscore';
import SALoader from '../StandAloneLib/Loader.js';
import Factory from './Factory';
import async from 'async';
import SA_Fragment from '../StandAloneLib/Fragment'
import Gelato from '../StandAloneLib/Gelato';

let RefferenceType = Object.freeze({
  ElementNode: 'ElementNode',
  Fragment: 'Fragment',
  NONE: 'NONE'
});


class RefElementNode extends HTMLElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps, _dynamicContext) {
    super(_environment, _elementNodeDataObject, _preInsectProps, _dynamicContext);
    this.type = 'ref';

    this.refInstance = null;
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
    super.childrenConstructAndLink(_options, _htmlNode, function() {

      if (_.isString(that.refTargetId) && that.loadedRefs === false) {

        that.loadRefferenced(function(_resultObject) {
          that.loadedRefs = true;

          // 로드한 객체의 ElementNode Children을 자신의 Children 목록에 삽입한다.
          if (that.refType === 'Fragment') {
            _resultObject.rootElementNodes.map(function(_rootElementNode) {
              _rootElementNode.setParent(that);
            });

            that.children = _resultObject.rootElementNodes;
          } else if (that.refType === 'ElementNode') {
            _resultObject.map(function(_elementNode) {
              _elementNode.setParent(that);
            });

            that.children = _resultObject;
          }

          that.childrenConstructAndLink(_options, _htmlNode, _complete);
        });
      } else {
        _complete([]);
      }
    });
  }


  realize(_realizeOptions, _complete) {
    let that = this;
    super.realize(_realizeOptions, function(_result) {
      if (_result === false) return _complete(_result);
      // StandAlone 의 Environment 라면 sa 방식으로 로드한다.

      if (that.environment.standAlone) {
        that._sa_renderRefferenced(function() {

          _complete();
        });
      } else {
        _complete();
      }
    });
  }


  buildByElement(_domElement) {
    super.buildByElement(_domElement, ['en-ref-type', 'en-ref-target-id']);

    if (_domElement.getAttribute('en-ref-type') !== null)
      this.refType = _domElement.getAttribute('en-ref-type');

    if (_domElement.getAttribute('en-ref-target-id') !== null)
      this.refTargetId = _domElement.getAttribute('en-ref-target-id');

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
      this._sa_loadFragment(_complete);
    }
  }

  _sa_loadFragment(_complete) {
    let that = this;
    let refTargetId = this.interpret(this.refTargetId);

    SALoader.loadFragment(refTargetId, function(_fragmentText) {

      let fragment = new SA_Fragment(refTargetId, _fragmentText, that.realization);

      fragment.buildElementNode();

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