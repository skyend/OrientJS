import HTMLElementNode from './HTMLElementNode.js';
// import GridElementNode from './GridElementNode.js';
// import ReactElementNode from './ReactElementNode.js';
import StringElementNode from './StringElementNode.js';
import RefElementNode from './RefElementNode.js';
"use strict";

class Factory {
  static takeElementNode(_elementNodeDataObject, _preInjectProps, _type, _environment, _isMaster) {
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
    // else if (type === 'react') elementNodeCLASS = ReactElementNode;
    //else if (type === 'grid') elementNodeCLASS = GridElementNode;
    else {
      // 감지된 plugin에서 새로 정의된 ElementNode가 있는지 확인한다.
      throw new Error(`unkown elementNode type ${type}`);
    }


    elementNode = new elementNodeCLASS(_environment, elementNodeDataObject, _preInjectProps, _isMaster);

    return elementNode;
  }

  static checkElementNodeType(_domElement) {
    let tagNodeName = _domElement.nodeName;

    if (tagNodeName === '#text') {
      return 'string';
    } else if (tagNodeName === '#comment') {
      // pass
    } else {
      let typeAttribute = _domElement.getAttribute('en-type');

      // typeAttribute가 입력되지않았다면 html로 간주한다.
      if (typeAttribute === null) {
        return 'html';
      } else if (/^html|string|ref$/.test(typeAttribute)) {
        return typeAttribute;
      } else {

        // plugin으로 지원하는 ElementNode가 있는지 확인한다.
        if (null) { // 감지된 plugin에서 지원하지 않을경우
          throw new Error(`${typeAttribute} 지원하지 않는 ElementNode 타입입니다.`)
        }
      }
    }
  }
}

export default Factory;