var Document = require('./Document.js');

var DocumentContextController = function(_document, _session) {
  this.attached = false;
  this.directContext = null;
  this.running = false;

  this.session = _session;

  this.superElement = null;

  // 입력된 document가 있다면 그것을 실제 Document Object로 변환하고
  if (typeof _document !== 'undefined' && Object.keys(_document).length != 0) {

    this.document = new Document(this, _document);
  } else {

    // 없다면 새로운 Document를 생성한다.
    this.document = new Document(this);
  }
};

/*********
 * Attach / Pause / Resume
 *
 */
DocumentContextController.prototype.attach = function(_directContext, _superDOMElement) {
  this.attached = true;
  this.directContext = _directContext;
  this.setSuperElement(_superDOMElement);
  /* processing */

  this.beginRender();

};

DocumentContextController.prototype.pause = function() {
  this.running = false;

  /* processing */

};

DocumentContextController.prototype.resume = function() {
  this.running = true;

  /* processing */

};

// superElement
// superElement는 RootElementNode가 랜더링되는 지점이다.
DocumentContextController.prototype.setSuperElement = function(_domElement) {
  this.superElement = _domElement;
};


/***************
 * beginRender
 * DirectContext 의 iframeStage에 현재 Document의 내용을 랜더링한다.
 *
 */
DocumentContextController.prototype.beginRender = function() {
  var self = this;

  // resource convert
  var jsElements = this.convertToScriptElement(this.document.getScriptResources() || []);
  var styleElements = this.convertToStyleElements(this.document.getStyleResources() || []);

  // script element block 을 적용한다.
  jsElements.map(function(_jsElement) {

    /*
    if (_jsElement.getAttribute('src') !== undefined) {
      _jsElement.onload = function() {
        console.log('loaded', _jsElement);

        console.log(self.directContext.getWindow());
      }
    }*/

    self.directContext.applyScriptElement(_jsElement);

  });

  // style element block을 적용한다.
  styleElements.map(function(_styleElement) {
    self.directContext.applyStyleElement(_styleElement);
  });

  // rootElementNode 가 null이 아닌경우 랜더링을 수행한다.
  if (this.document.rootElementNode !== null) {
    this.rootRender();
  }

};

DocumentContextController.prototype.getReactComponentFromSession = function(_packageKey, _componentKey) {

  return this.session.getComponentPool().getComponentFromRemote(_componentKey, _packageKey);
};

DocumentContextController.prototype.rootRender = function() {

  if (this.document.rootElementNode !== null) {

    // rootElementNode부터 시작하여 Tree구조의 자식노드들의 RealElement를 생성한다.
    this.constructToRealElement(this.document.rootElementNode);

    // RootElementNode 트리에 종속된 모든 ElementNode의 RealElement를 계층적으로 RealElement에 삽입한다.
    var rootRealElement = this.document.rootElementNode.growupRealDOMElementTree();

    // rootRealElement 를 superElement로 지정된 DOMElement에 랜더링한다.
    this.attachRootRealElementToSuperElement();

    this.updateRenderCSS();
  } else {
    this.clearSuperElement();
  }

};

DocumentContextController.prototype.attachRootRealElementToSuperElement = function() {

  // rootRealElement 를 지정된 superElement에 랜더링한다.
  this.superElement.appendChild(this.document.rootElementNode.getRealDOMElement());
};

DocumentContextController.prototype.clearSuperElement = function() {

  this.superElement.innerHTML = '';
};

/**
 * constructToRealElement
 * ElementNode에 RealElement를 재귀로 세팅한다.
 *
 */
DocumentContextController.prototype.constructToRealElement = function(_nodeElement) {
  var self = this;

  if (_nodeElement.type === "html") {
    this.instillRealHTMLElement(_nodeElement);

    if (typeof _nodeElement.children === 'object') {
      _nodeElement.children.map(function(__childNodeElement) {
        self.constructToRealElement(__childNodeElement);
      });
    }
  } else if (_nodeElement.type === 'string') {
    this.instillRealTextElement(_nodeElement);
  } else if (_nodeElement.type === 'empty') {
    this.instillRealEMPTYElement(_nodeElement);
  } else if (_nodeElement.type === 'react') {
    this.instillRealReactElement(_nodeElement);
  }
};

/**
 * instillRealHTMLElement
 * ElementNode에 HTML 타입의 RealElement를 주입한다.
 *
 */
DocumentContextController.prototype.instillRealHTMLElement = function(_nodeElement) {

  var element = this.directContext.getDocument().createElement(_nodeElement.getTagName());
  var elementAttributes = _nodeElement.getAttributes();
  var keys = Object.keys(elementAttributes);
  for (var i = 0; i < keys.length; i++) {
    element.setAttribute(keys[i], elementAttributes[keys[i]]);
  }

  _nodeElement.setRealElement(element);
};

/**
 * instillRealTextElement
 * ElementNode에 TextNode 타입의 RealElement를 주입한다.
 *
 */
DocumentContextController.prototype.instillRealTextElement = function(_nodeElement) {

  var textNode = this.directContext.getDocument().createTextNode(_nodeElement.getText());
  _nodeElement.setRealElement(textNode);
};

/**
 * instillRealEMPTYElement
 * ElementNode에 TextNode 타입의 RealElement를 주입한다.
 *
 */
DocumentContextController.prototype.instillRealEMPTYElement = function(_nodeElement) {
  var refferenceElementNode = this.document.getElementNodeFromPool(_nodeElement.getRefferenceTarget());

  if (refferenceElementNode !== undefined) {
    this.constructToRealElement(refferenceElementNode);
  }

};

/**
 * instillRealReactElement
 * ElementNode에 React 타입의 RealElement를 주입한다.
 *
 */
DocumentContextController.prototype.instillRealReactElement = function(_nodeElement) {

  var element = this.directContext.getDocument().createElement(_nodeElement.getTagName());
  var elementAttributes = _nodeElement.getAttributes();
  var keys = Object.keys(elementAttributes);
  for (var i = 0; i < keys.length; i++) {
    element.setAttribute(keys[i], elementAttributes[keys[i]]);
  }

  _nodeElement.setRealElement(element);
};

/**
 * convertToStyleElements
 * Style Object 리스트를 실제 window.document 내의 Style 요소로 변환한다.
 *
 */
DocumentContextController.prototype.convertToStyleElements = function(_styleObjects) {
  var baseWindow = this.directContext.getWindow();

  return _styleObjects.map(function(_styleObject) {
    if (_styleObject.ext === 'css') {
      if (typeof _styleObject.url !== 'undefined') {
        var linkE = baseWindow.document.createElement('link');
        linkE.setAttribute('type', 'text/css');
        linkE.setAttribute('rel', 'stylesheet');
        linkE.setAttribute('href', _styleObject.url);

        return linkE;
      } else {
        var styleE = baseWindow.document.createElement('style');
        linkE.setAttribute('type', 'text/css');
        linkE.innerHTML = _styleObject.css;

        return styleE;
      }
    }
  });
};

/**
 * convertToScriptElement
 * script Object 리스트를 실제 window.document 내의 script 요소로 변환한다.
 *
 */
DocumentContextController.prototype.convertToScriptElement = function(_scriptObjects) {
  var baseWindow = this.directContext.getWindow();

  return _scriptObjects.map(function(__scriptObject) {
    if (__scriptObject.ext === 'js') {
      var scriptE = baseWindow.document.createElement('script');

      scriptE.setAttribute('type', 'text/javascript');

      if (typeof __scriptObject.url !== 'undefined') {
        scriptE.setAttribute('src', __scriptObject.url);
      } else {
        scriptE.innerHTML = __scriptObject.script;
      }

      return scriptE;
    }
  });
};

/********
 * updateHTMLTypeElementNodeCSS
 * ElementNodeCSS를 랜더링 중인 화면에 적용한다.
 *
 */
DocumentContextController.prototype.updateHTMLTypeElementNodeCSS = function(_css) {

  // 현재 생성되어 있는 스타일블럭이 없다면 생성
  if (typeof this.htmlTypeElementNodeStyleBlock === 'undefined') {
    var baseWindow = this.directContext.getWindow();
    var styleBlock = baseWindow.document.createElement('style');
    this.directContext.applyStyleElement(styleBlock);

    this.htmlTypeElementNodeStyleBlock = styleBlock;
  }
  // 변경된 css반영
  this.htmlTypeElementNodeStyleBlock.innerHTML = _css;

};

/********
 * updateHTMLTypeElementNodeCSS
 * ElementNodeCSS를 랜더링 중인 화면에 적용한다.
 *
 */
DocumentContextController.prototype.updatePageCSS = function() {

  // 현재 생성되어 있는 스타일블럭이 없다면 생성
  if (typeof this.pageCSSBlock === 'undefined') {
    var baseWindow = this.directContext.getWindow();
    var styleBlock = baseWindow.document.createElement('style');
    this.directContext.applyStyleElement(styleBlock);

    this.pageCSSBlock = styleBlock;
  }

  // 변경된 css반영
  this.pageCSSBlock.innerHTML = this.document.getPageCSS();

};


DocumentContextController.prototype.updateRenderCSS = function() {
  // document에서 HTMLType, ReactType ElementNode의 종합 css를 얻어온다.
  this.updateHTMLTypeElementNodeCSS(this.document.getHTMLElementNodeCSSLines() + this.document.getReactElementNodeCSSLines());
  this.updatePageCSS();
};

DocumentContextController.prototype.isDropableToRoot = function() {
  return this.document.rootElementNode === null;
};


/****
 * insertNewElementNodeFromComponent
 * Component를 ElementNode로 변환하여 ElementNode에 추가하고
 * 변경된 ElementNode를 다시 빌드하여 화면에 표시한다.
 * @Param _insertType : "appendChild" | 'insertBefore' | 'insertAfter'
 * @Param _component : ComponentModule // ComponentPool로 부터 공급받은 컴포넌트 모듈
 * @Param _toElement : DOMElement // 기준이 되는 DomElement
 */
DocumentContextController.prototype.insertNewElementNodeFromComponent = function(_insertType, _component, _toElement) {
  // var newElementNode = this.document.insertNewElementNodeFromComponent(_insertType, _component, _toElement);
  //
  //
  // // null 이라면 삽입실패로 false를 반환한다.
  // if (newElementNode === null) return false;
  //
  // // 부모가 null이면
  // if (newElementNode.getParent() === null) {
  // z
  //   // 부모가 null이고 elementNodes pool의 길이가 0이라면 root로 삽입된것으로 루트를 랜더링한다.
  //   if (this.document.getElementNodes().length == 0) {
  //     this.rootRender();
  //   }
  //
  // } else {
  //   var parent = newElementNode.getParent();
  //
  //   this.constructToRealElement(newElementNode);
  //
  //   parent.growupRealDOMElementTree();
  //
  //   this.updateRenderCSS();
  // }

  return true;
};



DocumentContextController.prototype.testSave = function() {
  console.log(JSON.stringify(this.document.export()));
};


module.exports = DocumentContextController;