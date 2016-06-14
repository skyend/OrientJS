import HTMLElementNode from './HTMLElementNode.js';
import Factory from './Factory';
"use strict";

const XML_NS = "http://www.w3.org/2000/svg";

const FINAL_TYPE_CONTEXT = 'svg';
class SVGElementNode extends HTMLElementNode {
  static get XML_NS() {
    return XML_NS;
  }

  constructor(_environment, _elementNodeDataObject, _preInjectProps, _isMaster) {
    super(_environment, _elementNodeDataObject, _preInjectProps, _isMaster);
    if (Orient.bn === 'ie' && Orient.bv <= 10) {
      HTMLElementNode.call(this, _environment, _elementNodeDataObject, _preInjectProps, _isMaster);
    }
    this.type = FINAL_TYPE_CONTEXT;
  }

  /*
    CreateNode
      HTMLNode를 생성한다.
  */
  createNode() {

    let htmlDoc;

    if (this.environment) {
      htmlDoc = this.environment.document;
    } else {
      htmlDoc = document;
    }

    return htmlDoc.createElementNS(XML_NS, this.getTagName());
  }

  mappingAttributeDirect(_dom, _name, _value) {
    _dom.setAttributeNS(null, _name, _value);
  }
}



export default SVGElementNode;