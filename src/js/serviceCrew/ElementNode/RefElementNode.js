"use strict";
import HTMLElementNode from './HTMLElementNode.js';
import _ from 'underscore';
import SALoader from '../StandAloneLib/Loader.js';
import Factory from './Factory';
import async from 'async';

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

  realize(_realizeOptions, _complete) {
    let that = this;
    super.realize(_realizeOptions, function() {
      // StandAlone 의 Environment 라면 sa 방식으로 로드한다.
      console.log(that.environment);
      if (that.environment.standAlone) {
        that._sa_renderRefferenced(function() {
          console.log('refererd lrenderd');
          _complete();
        });
      } else {
        _complete();
      }
    });
  }


  buildByElement(_domElement) {
    super.buildByElement(_domElement, ['ref-type', 'ref-target-id']);

    if (_domElement.getAttribute('ref-type') !== null)
      this.refType = _domElement.getAttribute('ref-type');

    if (_domElement.getAttribute('ref-target-id') !== null)
      this.refTargetId = _domElement.getAttribute('ref-target-id');

  }

  appendChild(_elementNode) {
    this.children = [];
    super.appendChild(_elementNode);
    this.refType = RefferenceType.ElementNode;
    this.refTargetId = _elementNode.id;

    return true;
  }

  _sa_renderRefferenced(_complete) {

    if (this.refType === 'ElementNode') {
      this._sa_renderSharedElementNode(_complete);
    } else if (this.refType === 'Fragment') {
      this._sa_renderFragment(_complete);
    }
  }

  _sa_renderFragment(_complete) {
    let that = this;
    SALoader.loadFragment(this.refTargetId, function(_fragmentText) {

      let fragment = new Fragment(that.refTargetId, _fragmentText, that.realization);
      fragment.render();

      fragment.renderRefElements(() => {
        that.rendered = true;

        _complete();
      });
    });
  }

  _sa_renderSharedElementNode(_complete) {
    let that = this;
    SALoader.loadSharedElementNode(this.refTargetId, function(_sharedElementNodeText) {
      that.realization.innerHTML = _sharedElementNodeText;
      that.rendered = true;
      let children = [];

      for (let i = 0; i < that.realization.children.length; i++) {
        let elementNode = Factory.takeElementNode(undefined, {}, 'html', that.environment, that.dynamicContext);
        elementNode.buildByElement(that.realization.children[i]);
        children.push(elementNode);
      }

      that.children = children;

      async.eachSeries(that.children, function(_child, _next) {
        _child.realize(undefined, function() {
          _next();
        })
      }, function() {
        _complete();
      })

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