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


    // id가 제대로 부여되어 있지 않으면 새로운 id를 부여한다.
    if (!/^\d+$/.test(elementNode.getId())) {
      elementNode.setId(this.getNewElementNodeId());
    }

    return elementNode;
  }
}

export default Factory;