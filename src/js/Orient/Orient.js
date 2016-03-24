import ElementNodeFactory from '../serviceCrew/ElementNode/Factory';
import HTTPRequest from './common/HTTPRequest';

import ElementNode from '../serviceCrew/ElementNode/ElementNode';
import HTMLElementNode from '../serviceCrew/ElementNode/HTMLElementNode';
import RefElementNode from '../serviceCrew/ElementNode/RefElementNode';
import SVGElementNode from '../serviceCrew/ElementNode/SVGElementNode';
import StringElementNode from '../serviceCrew/ElementNode/StringElementNode';
import TagBaseElementNode from '../serviceCrew/ElementNode/TagBaseElementNode';

import ObjectExtends from '../util/ObjectExtends';


class Neutron {
  constructor() {

  }

  static buildElement(_elementNodeObject) {

  }

  static get HTTPRequest() {
    return HTTPRequest;
  }

  //
  /*
    buildComponentByElement(_domElement, [_props, [_env]])
      HTML DOMElement를 바로 빌드하여 컴포넌트를 생성한다.
    Parameters:
      _domElement : DOMElement
      _props : property
      _env : Environment
    Return
      Built ElementNode{}
  */
  static buildComponentByElement(_domElement, _props = {}, _env = null) {
    let masterType = ElementNodeFactory.checkElementNodeType(_domElement);
    console.log(_env);
    // build
    // 랜더링 전에 Env 세팅
    let masterElementNode = ElementNodeFactory.takeElementNode(undefined, _props, masterType, _env, true);
    masterElementNode.buildByElement(_domElement);

    return masterElementNode;
  }

  static renderVirtual(_elementNode) {
    _elementNode.constructDOMs({});
  }

  static mount(_elementNode, _targetDOMElement) {
    _targetDOMElement.attachForwardDOM(_elementNode);
  }

  static mountByReplace(_elementNode, _targetDOMElement) {
    let parentDOMElement = _targetDOMElement.parentNode;
    //parentDOMElement.replaceChild()
    _elementNode.attachForwardDOMByReplace(parentDOMElement, _targetDOMElement);
  }

  // render = renderVirtual + mount
  static render(_elementNode, _targetDOMElement) {
    this.renderVirtual(_elementNode);
    this.mount(_elementNode, _targetDOMElement);
  }

  // replaceRender = renderVirtual + mountByReplace
  static replaceRender(_elementNode, _targetDOMElement) {
    this.renderVirtual(_elementNode);
    this.mountByReplace(_elementNode, _targetDOMElement);
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

  static get ElementNodeFactory() {
    return Factory;
  }
}

export default window.Orient = Neutron;