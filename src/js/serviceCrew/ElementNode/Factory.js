import HTMLElementNode from './HTMLElementNode.js';
import GridElementNode from './GridElementNode.js';
import ReactElementNode from './ReactElementNode.js';
import StringElementNode from './StringElementNode.js';
import RefElementNode from './RefElementNode.js';
"use strict";

class Factory {
  static takeElementNode(_elementNodeDataObject, _preInjectProps, _type, _environment, _dynamicContext) {
    var elementNode;
    let elementNodeCLASS;
    let elementNodeDataObject = _elementNodeDataObject || {};
    let type = elementNodeDataObject.type || _type;
    //console.log(_elementNodeDataObject, _type, _environment);
    //console.log(_elementNodeDataObject);
    if (type === 'html') elementNodeCLASS = HTMLElementNode;
    else if (type === 'string') elementNodeCLASS = StringElementNode;
    //else if (type === 'empty') elementNodeCLASS = EmptyElementNode;
    else if (type === 'ref') elementNodeCLASS = RefElementNode;
    else if (type === 'react') elementNodeCLASS = ReactElementNode;
    else if (type === 'grid') elementNodeCLASS = GridElementNode;
    else {
      throw new Error(`unkown elementNode type ${type}`);
    }


    elementNode = new elementNodeCLASS(_environment, elementNodeDataObject, _preInjectProps, _dynamicContext);

    return elementNode;
  }
}

export default Factory;
