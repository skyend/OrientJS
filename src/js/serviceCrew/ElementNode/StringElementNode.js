"use strict";
import ElementNode from './ElementNode.js';
import _ from 'underscore';

class StringElementNode extends ElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps) {
    super(_environment, _elementNodeDataObject, _preInsectProps);
    this.type = 'string';
    this.text;

  }

  getText() {
    return this.text;
  }

  // getBoundingRect() {
  //
  //   var boundingRect;
  //   var realElement = this.getRealization();
  //
  //   if (realElement.nodeValue === '') {
  //
  //     boundingRect = {
  //       left: 0,
  //       top: 0,
  //       width: 0,
  //       height: 0
  //     }
  // 
  //   } else {
  //
  //     var range = document.createRange();
  //     range.selectNodeContents(realElement);
  //     boundingRect = range.getClientRects()[0];
  //   }
  //
  //
  //
  //   return boundingRect;
  // }

  setText(_text) {
    this.text = _text;
  }

  createRealizationNode() {

    let htmlDoc = this.environment.getHTMLDocument();
    this.realization = htmlDoc.createElement('span');
    this.realization.___en = this;
    this.realization.setAttribute('___id___', this.id);
    this.realization.setAttribute('en-type', 'string');
  }

  realize(_realizeOptions) {
    super.realize(_realizeOptions);
    this.createRealizationNode();

    let realizeOptions = _realizeOptions || {};

    if (realizeOptions.skipResolve === true) {
      this.realization.innerHTML = this.getText();
    } else {
      this.realization.innerHTML = this.interpret(this.getText());
    }

    if (this.isTextEditMode()) {
      this.realization.setAttribute('contenteditable', true);
      this.realization.focus();
    }
  }

  //
  // linkHierarchyRealizaion() {
  //   super.linkHierarchyRealizaion();
  //   //this.realization.appendChild(this.environment.findById(this.getRefferenceTarget()).getRealization());
  // }


  buildByComponent(_component) {
    super.buildByComponent(_component);

    this.setText("Text");
  }

  buildByElement(_textNode) {
    this.setType('string');
    this.setText(_textNode.nodeValue)
  }



  isTextEditMode() {
    return this.mode === 'textEdit';
  }

  changeTextEditMode() {
    this.mode = 'textEdit';
    //this.getRealization().setAttribute("contenteditable", 'true');
  }

  changeNormalMode() {
    if (this.isTextEditMode()) {
      this.setText(this.realization.innerHTML);
    }

    this.mode = 'normal';
    this.getRealization().removeAttribute("contenteditable");
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