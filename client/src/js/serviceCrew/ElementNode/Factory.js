import HTMLElementNode from './HTMLElementNode.js';
import SVGElementNode from './SVGElementNode.js';
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
    else if (type === 'svg') elementNodeCLASS = SVGElementNode;
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
      return 'comment';
    } else {
      let typeAttribute = _domElement.getAttribute('en-type');

      // type 이 지정되지 않았다면 유추하여 type을 알아내야 한다.
      if (typeAttribute === null) {

        // namespaceURI가 입력되어 있다면 SVG태그의 가능성이 있다.
        if (_domElement.namespaceURI) {

          // namespaceURI 가 SVG의 XML_NS와 같으면 svg 타입으로 반환한다.
          if (_domElement.namespaceURI === SVGElementNode.XML_NS) return 'svg';
        }

        return 'html';
      } else if (/^html|string|ref|svg$/.test(typeAttribute)) {
        return typeAttribute;
      } else {

        // plugin으로 지원하는 ElementNode가 있는지 확인한다.
        if (null) { // 감지된 plugin에서 지원하지 않을경우
          throw new Error(`${typeAttribute} 지원하지 않는 ElementNode 타입입니다.`)
        }
      }
    }
  }

  // HTML 텍스트를 ElementNode 컴포넌트로 변환한다.
  static convertToMasterElementNodesByHTMLSheet(_htmlText, _props, _env) {
    console.log(_props);

    console.time('Fill html container');
    let realizeContainer = document.createElement('div');
    realizeContainer.innerHTML = _htmlText;
    console.timeEnd('Fill html container');

    let masterElementNodes = [];
    let type;
    let masterElementNode;
    let elementNodeBuildResult;
    for (let i = 0; i < realizeContainer.childNodes.length; i++) {
      type = Factory.checkElementNodeType(realizeContainer.childNodes[i]);
      if (type === 'comment') continue;

      masterElementNode = Factory.takeElementNode(undefined, _props, type, _env, true);
      console.time('Build from html container');
      elementNodeBuildResult = masterElementNode.buildByElement(realizeContainer.childNodes[i]);
      console.timeEnd('Build from html container');
      if (elementNodeBuildResult === null) continue;

      masterElementNodes.push(masterElementNode);
    }

    return masterElementNodes;
  }

  static convertToMasterElementNodesByJSONSheet(_jsonObject, _props, _env) {

    if (_jsonObject instanceof Array) {
      return _jsonObject.map(function(_elementNodeO) {
        return Factory.takeElementNode(_elementNodeO, _props, _elementNodeO.type, _env, true);
      });
    } else {
      return [Factory.takeElementNode(_jsonObject, _props, _jsonObject.type, _env, true)];
    }
  }

  /*
    ███████ ██   ██ ████████ ███████ ███    ██ ██████   █████  ██████  ██      ███████      ██████ ██       █████  ███████ ███████     ███████ ██   ██ ██████   ██████  ██████  ████████
    ██       ██ ██     ██    ██      ████   ██ ██   ██ ██   ██ ██   ██ ██      ██          ██      ██      ██   ██ ██      ██          ██       ██ ██  ██   ██ ██    ██ ██   ██    ██
    █████     ███      ██    █████   ██ ██  ██ ██   ██ ███████ ██████  ██      █████       ██      ██      ███████ ███████ ███████     █████     ███   ██████  ██    ██ ██████     ██
    ██       ██ ██     ██    ██      ██  ██ ██ ██   ██ ██   ██ ██   ██ ██      ██          ██      ██      ██   ██      ██      ██     ██       ██ ██  ██      ██    ██ ██   ██    ██
    ███████ ██   ██    ██    ███████ ██   ████ ██████  ██   ██ ██████  ███████ ███████      ██████ ███████ ██   ██ ███████ ███████     ███████ ██   ██ ██       ██████  ██   ██    ██
  */

  static get ElementNode() {
    return ElementNode;
  }

  static get HTMLElementNode() {
    return HTMLElementNode;
  }

  static get RefElementNode() {
    return RefElementNode;
  }

  static get TagBaseElementNode() {
    return TagBaseElementNode;
  }

  static get StringElementNode() {
    return StringElementNode;
  }
}

export default Factory;