import ElementNode from './ElementNode.js';
import _ from 'underscore';
import Gelato from '../StandAloneLib/Gelato';
"use strict"

class StringElementNode extends ElementNode {
  constructor(_environment, _elementNodeDataObject, _preInsectProps, _dynamicContext) {
    super(_environment, _elementNodeDataObject, _preInsectProps, _dynamicContext);
    this.type = 'string';
    this.text;

  }

  getText() {
    return this.text;
  }

  get enableHTML() {
    return this._enableHTML;
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

  set enableHTML(_enableHTML) {
    this._enableHTML = _enableHTML;
  }

  createRealizationNode() {

    let htmlDoc;

    let gelato = Gelato.one();
    if (gelato !== null) {
      htmlDoc = gelato.page.doc;
    } else {
      htmlDoc = this.environment.getHTMLDocument();
    }

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
    let htmlDoc;

    let gelato = Gelato.one();
    if (gelato !== null) {
      htmlDoc = gelato.page.doc;
    } else {
      htmlDoc = this.environment.getHTMLDocument();
    }

    if (this.wrappingTag !== null) {
      return htmlDoc.createElement(this.wrappingTag);
    }

    return htmlDoc.createTextNode('');
  }

  applyForward() {
    if (this.wrappingTag !== null) {
      this.forwardDOM.innerHTML = this.backupDOM.innerHTML;
    } else {
      this.forwardDOM.nodeValue = this.backupDOM.nodeValue;
    }

    this.backupDOM = null;
  }

  mappingAttributes(_domNode, _options) {
    let text = _options.resolve ? this.interpret(this.getText()) : this.getText();;

    if (_domNode.nodeName === '#text') {

      _domNode.nodeValue = text;
    } else {
      _domNode.setAttribute('en-id', this.getId());
      _domNode.setAttribute('en-type', this.getType());
      if (this.getName())
        _domNode.setAttribute('en-name', this.getName());

      if (this.enableHTML) { // enableHTML default : false
        _domNode.setAttribute('en-enableHtml', '');

        _domNode.innerHTML = text;
      } else {
        _domNode.appendChild(_domNode.ownerDocument.createTextNode(text));
      }
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

  buildByElement(_stringNode) {
    this.setType('string');

    // null을 반환한 ElementNode는 유효하지 않은 ElementNode로 상위 ElementNode의 자식으로 편입되지 못 한다.
    // 공백과 줄바꿈으로만 이루어진 TextNode는 필요하지 않은 요소이다.
    if (/^[\s\n][\s\n]+$/.test(_stringNode.nodeValue)) return null;


    // #text Node가 아닌 태그가 입력되었을 떄 해당 태그명을 wrappingTag 로 입력해둔다.
    if (_stringNode.nodeName !== '#text') {
      if (_stringNode.hasAttribute('en-enableHtml')) {
        this.enableHTML = true;
      } else {
        this.enableHTML = false;
      }

      this.setText(_stringNode.innerHTML);
      this.wrappingTag = _stringNode.nodeName;
    } else {
      this.setText(_stringNode.nodeValue);
      this.wrappingTag = null;
    }
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
    this.enableHTML = _elementNodeDataObject.enableHTML || false;
    this.text = _elementNodeDataObject.text || false;
    this.wrappingTag = _elementNodeDataObject.wrappingTag || null;
  }

  export (_withoutId) {
    let result = super.export(_withoutId);
    result.text = this.getText();
    result.enableHTML = this.enableHTML;
    result.wrappingTag = this.wrappingTag;
    return result;
  }
}

export default StringElementNode;