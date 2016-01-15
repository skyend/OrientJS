"use strict";
import ElementNode from './ElementNode.js';
import _ from 'underscore';

class StringElementNode extends ElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps, _dynamicContext) {
    super(_environment, _elementNodeDataObject, _preInsectProps, _dynamicContext);
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
    this.setRealization(htmlDoc.createElement('span'));
  }

  realize(_realizeOptions, _complete) {
    let that = this;

    super.realize(_realizeOptions, function(_result) {
      if (_result === false) return _complete(_result);
      let realizeOptions = _realizeOptions || {};
      let textData;
      let includedTag = false;

      textData = that.getText();
      if (realizeOptions.skipResolve !== true) {
        textData = that.interpret(textData);
      }

      // text 내용에 태그가 들어 있는지 확인
      if (/\<[^\<^\>]*\>/.test(textData)) {
        includedTag = true;
      }

      // environment 에 stripStringEN 가 활성화 되어 있다면 text 를 span으로 감싸지 않고 랜더링 하며
      // text 내에 태그가 들어 있다면 span태그로 감싸서 랜더링 하도록 한다.
      if (that.environment.stripStringEN && !includedTag) {
        that.realization = that.environment.getHTMLDocument().createTextNode(textData);
      } else {
        that.createRealizationNode();
        that.realization.innerHTML = textData;

        if (that.isTextEditMode()) {
          that.realization.setAttribute('contenteditable', true);
          that.realization.focus();
        }
      }



      _complete();
    });
  }

  /*
    CreateNode
      HTMLNode를 생성한다.
  */
  createNode(_options) {
    let htmlDoc = this.environment.getHTMLDocument();
    return htmlDoc.createElement('span');
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

    // null을 반환한 ElementNode는 유효하지 않은 ElementNode로 상위 ElementNode의 자식으로 편입되지 못 한다.
    // 공백과 줄바꿈으로만 이루어진 TextNode는 필요하지 않은 요소이다.
    if (/^[\s\n]+$/.test(_textNode.nodeValue)) return null;

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