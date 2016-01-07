"use strict";
import HTMLElementNode from './HTMLElementNode.js';
import _ from 'underscore';
import SALoader from '../StandAloneLib/Loader.js';

let RefferenceType = Object.freeze({
  ElementNode: 'ElementNode',
  Fragment: 'Fragment',
  NONE: 'NONE'
});


class RefElementNode extends HTMLElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps, _dynamicContext) {
    super(_environment, _elementNodeDataObject, _preInsectProps, _dynamicContext);
    this.type = 'ref';

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

  // realize(_realizeOptions) {
  //   super.realize(_realizeOptions);
  // }

  // linkHierarchyRealizaion() {
  //   this.clearRealizationChildren();
  //
  //
  // }

  buildByElement(_domElement) {
    super.buildByElement(_domElement, ['refType', 'refTargetId']);
    this.refType = _domElement.getAttribute('refType');
    this.refTargetId = _domElement.getAttribute('refTargetId');

    this.realization = _domElement;
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

    SALoader.loadFragment(this.refTargetId, (_fragmentText) => {

      let fragment = new Fragment(this.refTargetId, _fragmentText, this.realization);
      fragment.render();

      fragment.renderRefElements(() => {
        this.rendered = true;

        _complete();
      });
    });
  }

  _sa_renderSharedElementNode(_complete) {
    SALoader.loadSharedElementNode(this.refTargetId, (_sharedElementNodeText) => {
      this.realization.innerHTML = _sharedElementNodeText;
      this.rendered = true;
      _complete();
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