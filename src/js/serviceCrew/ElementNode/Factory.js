import HTMLElementNode from './HTMLElementNode.js';
import GridElementNode from './GridElementNode.js';
import ReactElementNode from './ReactElementNode.js';
import StringElementNode from './StringElementNode.js';
import EmptyElementNode from './EmptyElementNode.js';


class Factory {
  static takeElementNode(_elementNodeDataObject, _preInsectProps, _type, _environment) {
    var elementNode;
    let elementNodeCLASS;
    let elementNodeDataObject = _elementNodeDataObject || {};
    let type = elementNodeDataObject.type || _type;
    console.log(_elementNodeDataObject, _type, _environment);
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
}

export default Factory;