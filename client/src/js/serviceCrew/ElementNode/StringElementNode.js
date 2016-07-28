import ElementNode from './ElementNode.js';
"use strict"

const HTML_ESCAPE_SPECIALS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};


const HTML_ESCAPE_SPECIALS_REVERSE = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>'
};

const HTML_UNESCAPER_REGEXP = /((?:\&amp\;)|(?:\&lt\;)|(?:\&gt\;))/g;


const FINAL_TYPE_CONTEXT = 'string';
class StringElementNode extends ElementNode {
  constructor(_environment, _elementNodeDataObject, _preInjectProps, _isMaster) {
    super(_environment, _elementNodeDataObject, _preInjectProps, _isMaster);
    if (Orient.IS_LEGACY_BROWSER) {
      ElementNode.call(this, _environment, _elementNodeDataObject, _preInjectProps, _isMaster);
    }
    this.type = FINAL_TYPE_CONTEXT;
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


  /*
    CreateNode
      HTMLNode를 생성한다.
  */
  createNode(_options, _text = '') {
    let htmlDoc;

    if (this.environment) {
      htmlDoc = this.environment.document;
    } else {
      htmlDoc = document;
    }

    if (this.wrappingTag !== null) {
      let element = htmlDoc.createElement(this.wrappingTag);
      element.innerHTML = _text;
      return element;
    }

    return htmlDoc.createTextNode(_text);
  }

  applyForward() {
    if (this.wrappingTag !== null) {
      this.forwardDOM.innerHTML = this.backupDOM.innerHTML;
    } else {

      this.forwardDOM.nodeValue = this.backupDOM.nodeValue;
    }

    this.forwardDOM.__renderstemp__ = this.renderSerialNumber;
    //this.backupDOM = null;
  }

  mappingAttributes(_domNode, _options, _mountIndex) {
    let text = _options.resolve ? this.interpret(this.getText()) : this.getText();


    if (_domNode.nodeName === '#text') {
      try{

        _domNode.nodeValue = text || '';
      } catch(_e){
        console.warn(`TextNode Modify Error : ${_e.message} Argument:${JSON.stringify(text)} ${this.DEBUG_FILE_NAME_EXPLAIN}`);
        // this.unmountComponent();
        // this.mountComponent(_options,_mountIndex);
      }
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



  buildByComponent(_component) {
    super.buildByComponent(_component);

    this.setText("Text");
  }

  buildByElement(_stringNode, _absorbOriginDOM) {
    this.setType('string');

    // for Debug
    this.sourceElement = _stringNode;
    if (_absorbOriginDOM === true) {
      this.forwardDOM = _stringNode;
      this.forwardDOM.___en = this;
      this.isAttachedDOM = true;
    }

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

      this.setText(_stringNode.innerHTML.replace(HTML_UNESCAPER_REGEXP, function(_total, _1) {
        return HTML_ESCAPE_SPECIALS_REVERSE[_1];
      }));

      this.wrappingTag = _stringNode.nodeName;
    } else {
      this.setText(_stringNode.nodeValue);
      this.wrappingTag = null;
    }
  }

  unescapeHTMLSpecialChars(_html) {

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
    this.enableHTML = _elementNodeDataObject.enhtml || false;
    this.text = _elementNodeDataObject.text || false;
    this.wrappingTag = _elementNodeDataObject.wrtag || null;
  }

  export (_withoutId, _idAppender, _withCompile) {
    let result = super.export(_withoutId, _idAppender, _withCompile);
    result.text = this.getText();
    result.enhtml = this.enableHTML;
    result.wrtag = this.wrappingTag;
    return result;
  }
}

export default StringElementNode;
