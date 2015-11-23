import HTMLElementNode from './HTMLElementNode.js';
import GridElementNode from './GridElementNode.js';
import ReactElementNode from './ReactElementNode.js';
import StringElementNode from './StringElementNode.js';
import EmptyElementNode from './EmptyElementNode.js';


class Factory {
  static takeElementNode(_elementNodeDataObject, _preInsectProps, _type, _document) {
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


    elementNode = new elementNodeCLASS(_document, elementNodeDataObject, _preInsectProps);

    return elementNode;
  }
}

export default Factory;