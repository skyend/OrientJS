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
  constructor(_environment, _elementNodeDataObject, _preInjectProps, _isMaster) {
    super(_environment, _elementNodeDataObject, _preInjectProps, _isMaster);
    this.type = 'ref';

    this.loadedMasters = null;

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


    if (this.refTargetId)
      _domNode.setAttribute('en-ref-target-id', this.refTargetId);
  }


  constructDOMs(_options) {
    let returnHolder = super.constructDOMs(_options);
    let that = this;

    if (returnHolder.length === 0) return returnHolder;

    let targetId = _options.resolve ? this.interpret(this.refTargetId) : this.refTargetId;

    if (this.loadedTargetId === null || this.loadedTargetId !== targetId) {
      this.forwardDOM.innerHTML = '';

      this.loadComponent(targetId, function(_masterElementNodes) {
        if (!_masterElementNodes) {
          console.warn(`Fragment Load Warning. "${targetId}" was not load.`);
          return;
        }

        console.log(_masterElementNodes);
        that.masterElementNodes = _masterElementNodes;

        that.loadedTargetId = targetId;

        // that.scopeNodes.map(function(_scopeNode) {
        //   if (_scopeNode.type === 'param') {
        //     that.loadedInstance.setParam(_scopeNode.name, that.interpret(_scopeNode.plainValue));
        //   }
        // });

        // for (let i = 0; i < that.attributes.length; i++) {
        //   that.loadedInstance.setParam(_scopeNode.name, that.interpret(that.attributes[i]));
        // }

        let masterElementNode;
        for (let i = 0; i < that.masterElementNodes.length; i++) {
          masterElementNode = that.masterElementNodes[i];
          masterElementNode.setParent(that);
          masterElementNode.constructDOMs({});
          masterElementNode.attachForwardDOM(that.forwardDOM);
        }
      });
    } else {
      if (this.masterElementNodes) {
        //
        // this.scopeNodes.map(function(_scopeNode) {
        //   if (_scopeNode.type === 'param') {
        //     that.masterElementNodes.setParam(_scopeNode.name, that.interpret(_scopeNode.plainValue));
        //   }
        // });

        // for (let i = 0; i < that.attributes.length; i++) {
        //   that.loadedInstance.setParam(_scopeNode.name, that.interpret(that.attributes[i]));
        // }
        this.forwardDOM.innerHTML = '';
        let masterElementNode;
        for (let i = 0; i < this.masterElementNodes.length; i++) {
          masterElementNode = this.masterElementNodes[i];
          let prevForwardDOM = rootElementNode.getDOMNode();
          masterElementNode.constructDOMs({});
          masterElementNode.attachForwardDOM(that.forwardDOM);
        }
      }
    }


    return returnHolder;
  }

  buildByElement(_domElement) {
    super.buildByElement(_domElement, ['en-ref-target-id', 'en-']);
    let attributes = _domElement.attributes;
    let attr;

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

  loadComponent(_targetId, _complete) {
    let that = this;
    let targetIdElements = _targetId.split(':');
    let type;
    let targetId;
    // targetId -> html:aa.html or aa.html or html:aa
    if (targetIdElements.length === 2) {
      type = targetIdElements[0];
      targetId = targetIdElements[1];
    } else if (targetIdElements.length === 1) {
      targetId = targetIdElements[0];
      let matches = targetId.match(/\.(\w+)$/);
      if (matches === null) throw new Error("Invalid Target ID");
      type = matches[1];
    } else {
      throw new Error("Invalid Target ID");
    }




    if (this.environment) {
      this.environment.retriever.loadComponentSheet(targetId, function(_responseSheet) {

        let masterElementNodes = that.convertMastersByType(type, _responseSheet);

        _complete(masterElementNodes);
      });
    } else {
      Orient.HTTPRequest.request('get', targetId, {}, function(_err, _res) {
        if (_err !== null) throw new Error("fail static component loading");

        let responseText = _res.text;
        // let loadedContentType = _res.xhr.getResponseHeader('content-type');
        // let contentType_only = loadedContentType.split(';')[0];

        let masterElementNodes = that.convertMastersByType(type, responseText);

        _complete(masterElementNodes);
      });

      //throw new Error(`LoadError : Could not load Component. Need Environment(Recommend Orbit Framework).`);
    }
  }

  convertMastersByType(_type, _responseText) {
    if (_type === 'html') {
      return Factory.convertToMasterElementNodesByHTMLSheet(_responseText, this.environment);
    } else if (_type === 'json') {
      return Factory.convertToMasterElementNodesByJSONSheet(JSON.parse(_responseText), this.environment);
    } else if (_type === 'js') {
      return Factory.extractByJSModule(_responseText, this.environment);
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