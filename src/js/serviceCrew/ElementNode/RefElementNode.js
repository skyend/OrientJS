import HTMLElementNode from './HTMLElementNode.js';
import _ from 'underscore';
import SALoader from '../StandAloneLib/Loader.js';
import Factory from './Factory';
import async from 'async';
import SA_Fragment from '../StandAloneLib/Fragment'
import Gelato from '../StandAloneLib/Gelato';

import ActionStore from '../Actions/ActionStore';

// Actions Import
import '../Actions/RefElementNodeActions';

"use strict";

let RefferenceType = Object.freeze({
  ElementNode: 'ElementNode',
  Fragment: 'Fragment',
  NONE: 'NONE'
});


class RefElementNode extends HTMLElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps, _isMaster) {
    super(_environment, _elementNodeDataObject, _preInsectProps, _isMaster);
    this.type = 'ref';

    this.loadedInstance = null;
    this.loadedRefs = false;

    this.loadedTargetId = null;
  }

  get refference() {

  }

  get refType() {
    return this._refType;
  }

  get refTargetId() {
    return this._refTargetId;
  }

  set refType(_refType) {
    // refType 은 런타임에 변경 될 수 없다.

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


  constructDOMs(_options) {
    let returnHolder = super.constructDOMs(_options);
    let that = this;

    if (returnHolder.length === 0) return returnHolder;


    if (this.refType === 'Fragment') {
      let targetId = _options.resolve ? this.interpret(this.refTargetId) : this.refTargetId;

      if (this.loadedTargetId === null || this.loadedTargetId !== targetId) {
        this.forwardDOM.innerHTML = '';

        this.loadRefferenced(function(_resultObject) {
          if (!_resultObject) {
            console.warn(`Fragment Load Warning. "${targetId}" was not load.`);
            return;
          }

          that.loadedTargetId = targetId;
          that.loadedInstance = _resultObject;
          that.loadedInstance.upperEnvironment = that.environment;

          that.scopeNodes.map(function(_scopeNode) {
            if (_scopeNode.type === 'param') {
              that.loadedInstance.setParam(_scopeNode.name, that.interpret(_scopeNode.plainValue));
            }
          });

          // for (let i = 0; i < that.attributes.length; i++) {
          //   that.loadedInstance.setParam(_scopeNode.name, that.interpret(that.attributes[i]));
          // }

          let rootElementNode;
          for (let i = 0; i < that.loadedInstance.rootElementNodes.length; i++) {
            rootElementNode = that.loadedInstance.rootElementNodes[i];
            rootElementNode.setParent(that);
            rootElementNode.constructDOMs({});
            rootElementNode.render(that.forwardDOM);
          }
        });
      } else {
        if (this.loadedInstance) {

          this.scopeNodes.map(function(_scopeNode) {
            if (_scopeNode.type === 'param') {
              that.loadedInstance.setParam(_scopeNode.name, that.interpret(_scopeNode.plainValue));
            }
          });

          // for (let i = 0; i < that.attributes.length; i++) {
          //   that.loadedInstance.setParam(_scopeNode.name, that.interpret(that.attributes[i]));
          // }
          this.forwardDOM.innerHTML = '';
          let rootElementNode;
          for (let i = 0; i < this.loadedInstance.rootElementNodes.length; i++) {
            rootElementNode = this.loadedInstance.rootElementNodes[i];
            let prevForwardDOM = rootElementNode.getDOMNode();
            rootElementNode.constructDOMs({});
            rootElementNode.render(that.forwardDOM);
            console.log(that.backupDOM);
          }
        }
      }
    }

    return returnHolder;
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
    let refTargetId = this.interpret(this.refTargetId);
    console.log("ref target id ", refTargetId);
    if (this.refType === 'ElementNode') {
      this._sa_loadSharedElementNode(_complete);
    } else if (this.refType === 'Fragment') {
      //this._sa_loadFragment(_complete);

      this.environment.highestEnvironment.loadFragment(refTargetId, function(_err, _fragment) {
        _complete(_fragment);
      });

    }
  }

  resetRefInstance() {
    this.loadedRefs = false;
    this.loadedInstance = null;
  }

  import (_elementNodeDataObject) {
    let result = super.import(_elementNodeDataObject);
    this.refDesc = RefferenceType[_elementNodeDataObject.refDesc] || null;
    this.refType = RefferenceType[_elementNodeDataObject.refType || 'NONE'];
    this.refTargetId = _elementNodeDataObject.refTargetId;
    return result;
  }

  export (_withoutId) {
    let result = super.export(_withoutId);
    result.ref = this.refDesc || null;
    result.refType = RefferenceType[this.refType || 'NONE'];
    result.refTargetId = this.refTargetId;
    return result;
  }
}

export default RefElementNode;