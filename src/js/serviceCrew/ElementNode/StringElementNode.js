import ElementNode from './ElementNode.js';
import _ from 'underscore';
console.log(ElementNode);
class StringElementNode extends ElementNode {
  constructor(_document, _elementNodeDataObject, _preInsectProps) {
    super(_document, _elementNodeDataObject, _preInsectProps);
    this.text;

  }

  getText() {
    return this.text;
  }

  getBoundingRect() {

    var boundingRect;
    var realElement = this.getRealization();

    if (realElement.nodeValue === '') {

      boundingRect = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      }

    } else {

      var range = document.createRange();
      range.selectNodeContents(realElement);
      boundingRect = range.getClientRects()[0];
    }



    return boundingRect;
  }

  setText(_text) {
    this.text = _text;
  }

  createRealizationNode() {

    let htmlDoc = this.document.getHTMLDocument();
    this.realization = htmlDoc.createTextNode('');
    this.realization.___en = this;
  }

  realize(_realizeOptions) {
    super.realize(_realizeOptions);
    this.createRealizationNode();

    let realizeOptions = _realizeOptions || {};

    if (realizeOptions.skipResolve === true) {
      this.realization.nodeValue = this.getText();
    } else {
      this.realization.nodeValue = this.interpret(this.getText());
    }
  }

  linkHierarchyRealizaion() {
    super.linkHierarchyRealizaion();
    this.realization.appendChild(this.document.findById(this.getRefferenceTarget()).getRealization());
  }


  buildByComponent(_component) {
    super.buildByComponent(_component);

    this.setText("Text");
    this.setTagName('text');
  }

  buildByElement(_textNode) {
    this.setType('string');
    this.setText(_textNode.nodeValue)
  }






  import (_elementNodeDataObject) {
    super.import(_elementNodeDataObject);
    this.text = _elementNodeDataObject.text;
  }

  export (_withoutId) {
    let result = super.export(_withoutId);
    result.text = this.getText();

    return result;
  }
}

export default StringElementNode;