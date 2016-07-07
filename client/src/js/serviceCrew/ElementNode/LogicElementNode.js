import HTMLElementNode from './HTMLElementNode.js';
import Factory from './Factory';
"use strict";

const FINAL_TYPE_CONTEXT = 'logic';
class LogicElementNode extends HTMLElementNode {
  static get XML_NS() {
    return XML_NS;
  }

  constructor(_environment, _elementNodeDataObject, _preInjectProps, _isMaster) {
    super(_environment, _elementNodeDataObject, _preInjectProps, _isMaster);
    if (Orient.IS_LEGACY_BROWSER) {
      HTMLElementNode.call(this, _environment, _elementNodeDataObject, _preInjectProps, _isMaster);
    }
    this.type = FINAL_TYPE_CONTEXT;
  }

}



export default LogicElementNode;