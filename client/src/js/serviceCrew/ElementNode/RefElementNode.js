import HTMLElementNode from './HTMLElementNode.js';

import Factory from './Factory';

import ActionStore from '../Actions/ActionStore';

// Actions Import
import '../Actions/RefElementNodeActions';

"use strict";


const REGEXP_REF_TARGET_MEAN = /^\[([\w\d-_]+)\](.+)$/;

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


    // if (this.refTargetId)
    //   _domNode.setAttribute('en-ref-target-id', this.refTargetId);
  }


  constructDOMs(_options) {
    let returnHolder = super.constructDOMs(_options);
    let that = this;

    if (returnHolder.length === 0) return returnHolder;

    let targetId = _options.resolve ? this.interpret(this.refTargetId) : this.refTargetId;


    if (!targetId) {
      this.print_console_error("Reference target is '" + targetId + "' from string '" + this.refTargetId + "' ");
    }

    if (this.loadedTargetId === null || this.loadedTargetId !== targetId) {

      that.tryEventScope('ref-will-mount', {

      }, null, (_result) => {
        this.loadComponent(targetId, (_masterElementNodes) => {

          this.forwardDOM.innerHTML = '';

          if (!_masterElementNodes) {
            console.warn(`Fragment Load Warning. "${targetId}" was not load.`);
            return;
          }

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

            for (let i = 0; i < that.attributes.length; i++) {
              masterElementNode.setProperty(that.attributes[i].name, that.interpret(that.attributes[i].variable));
            }

            masterElementNode.setDebuggingInfo('FILE_NAME', targetId);

            masterElementNode.setParent(that);
            masterElementNode.constructDOMs({});
            masterElementNode.attachForwardDOM(that.forwardDOM);
          }
        });


        that.tryEventScope('ref-did-mount', {

        }, null, (_result) => {

        });
      });

    } else {
      if (this.masterElementNodes) {
        //
        // this.scopeNodes.map(function(_scopeNode) {
        //   if (_scopeNode.type === 'param') {
        //     that.masterElementNodes.setParam(_scopeNode.name, that.interpret(_scopeNode.plainValue));
        //   }
        // });
        console.log(this.masterElementNodes);


        let masterElementNode;
        for (let i = 0; i < this.masterElementNodes.length; i++) {
          masterElementNode = this.masterElementNodes[i];

          for (let i = 0; i < this.attributes.length; i++) {
            masterElementNode.setProperty(this.attributes[i].name, this.interpret(this.attributes[i].variable));
          }
          //
          // let prevForwardDOM = masterElementNode.getDOMNode();
          masterElementNode.update();
          //masterElementNode.attachForwardDOM(that.forwardDOM);
        }
      }
    }


    return returnHolder;
  }

  buildByElement(_domElement, _absorbOriginDOM) {
    super.buildByElement(_domElement, _absorbOriginDOM);

    let attributes = _domElement.attributes;
    let attr;

    if (_domElement.getAttribute('en-ref-target-id') !== null)
      this.refTargetId = _domElement.getAttribute('en-ref-target-id');

    if (_domElement.getAttribute('en-ref-sync') !== null)
      this.refSync = _domElement.getAttribute('en-ref-sync') || true;

    if (_domElement.getAttribute('en-event-ref-will-mount') !== null) // Did Mount
      this.setEvent('ref-will-mount', _domElement.getAttribute('en-event-ref-will-mount'));

    if (_domElement.getAttribute('en-event-ref-did-mount') !== null) // Did Mount
      this.setEvent('ref-did-mount', _domElement.getAttribute('en-event-ref-did-mount'));
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
    let matchedTargetId = _targetId.match(REGEXP_REF_TARGET_MEAN);
    let type;
    let targetId;
    // targetId -> [html]aa.html or aa.html or [html]aa
    if (matchedTargetId !== null) {
      type = matchedTargetId[1];
      targetId = matchedTargetId[2];
    } else {
      targetId = _targetId;
      let matches = targetId.match(/\.(\w+)$/);
      if (matches === null) return this.print_console_error(`'${targetId}' is Invalid Target ID.`);
      type = matches[1];
    }


    if (this.environment) {
      this.environment.retriever[this.refSync ? 'loadComponentSheetSync' : 'loadComponentSheet'](targetId, function(_responseSheet) {

        let masterElementNodes = that.convertMastersByType(type, undefined, _responseSheet);

        _complete(masterElementNodes);
      });
    } else {
      Orient.HTTPRequest[this.refSync ? 'requestSync' : 'request']('get', targetId, {}, function(_err, _res) {
        if (_err !== null) throw new Error("fail static component loading");

        let responseText = _res.text;
        // let loadedContentType = _res.xhr.getResponseHeader('content-type');
        // let contentType_only = loadedContentType.split(';')[0];

        let masterElementNodes = that.convertMastersByType(type, undefined, responseText);

        _complete(masterElementNodes);
      });

      //throw new Error(`LoadError : Could not load Component. Need Environment(Recommend Orbit Framework).`);
    }
  }

  convertMastersByType(_type, _props = {}, _responseText) {
    if (_type === 'html') {
      return Factory.convertToMasterElementNodesByHTMLSheet(_responseText, _props, this.environment);
    } else if (_type === 'json') {
      return Factory.convertToMasterElementNodesByJSONSheet(JSON.parse(_responseText), _props, this.environment);
    } else if (_type === 'js') {
      // return Factory.extractByJSModule(_responseText, this.environment);
    }
  }

  resetRefInstance() {
    this.loadedRefs = false;
    this.loadedInstance = null;
  }

  import (_elementNodeDataObject) {
    let result = super.import(_elementNodeDataObject);
    this.refTargetId = _elementNodeDataObject.refTargetId;
    this.refSync = _elementNodeDataObject.refSync || false;
    return result;
  }

  export (_withoutId) {
    let result = super.export(_withoutId);
    result.refTargetId = this.refTargetId;
    result.refSync = this.refSync;
    return result;
  }
}

export default RefElementNode;