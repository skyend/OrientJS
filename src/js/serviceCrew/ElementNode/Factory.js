"use strict";
let HTMLElementNode = require('./HTMLElementNode.js');
let GridElementNode = require('./GridElementNode.js');
let ReactElementNode = require('./ReactElementNode.js');
let StringElementNode = require('./StringElementNode.js');
let EmptyElementNode = require('./EmptyElementNode.js');


class Factory

module.exports = {
  takeElementNode: function(_elementNodeDataObject, _preInsectProps, _type, _environment) {
    var elementNode;
    let elementNodeCLASS;
    let elementNodeDataObject = _elementNodeDataObject || {};
    let type = elementNodeDataObject.type || _type;

    if (type === 'html') elementNodeCLASS = HTMLElementNode;
    else if (type === 'string') elementNodeCLASS = StringElementNode;
    else if (type === 'empty') elementNodeCLASS = EmptyElementNode;
    else if (type === 'react') elementNodeCLASS = ReactElementNode;
    else if (type === 'grid') elementNodeCLASS = GridElementNode;
    else {
      throw new Error('unkown elementNode type');
    }


    elementNode = new elementNodeCLASS(_environment, elementNodeDataObject, _preInsectProps);

    return elementNode;
  }
};