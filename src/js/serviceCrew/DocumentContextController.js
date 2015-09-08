var Document = require('./Document.js');

var DocumentContextController = function(_document, _session, _serviceManager) {
  this.attached = false;
  this.directContext = null;
  this.running = false;

  this.session = _session;
  this.serviceManager = _serviceManager;

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
  this.attached = true;
  this.directContext = _directContext;
  this.context = _context;
  this.setSuperElement(_superDOMElement);
  /* processing */


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
  console.log(this.document);
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


};

DocumentContextController.prototype.rootRender = function() {

  if (this.document.rootElementNode !== null) {

    // rootElementNode부터 시작하여 Tree구조의 자식노드들의 RealElement를 생성한다.
    this.constructToRealElement(this.document.rootElementNode);

    // RootElementNode 트리에 종속된 모든 ElementNode의 RealElement를 계층적으로 RealElement에 삽입한다.
    var rootRealElement = this.document.rootElementNode.linkRealDOMofChild();

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

  _nodeElement.preProcessingMeBeforeRender();

  if (_nodeElement.type === "html") {
    this.instillRealHTMLElement(_nodeElement);

    // 자식도 재귀호출로 처리
    if (typeof _nodeElement.children === 'object') {
      _nodeElement.children.map(function(__childNodeElement) {
        self.constructToRealElement(__childNodeElement);
      });
    }
  } else if (_nodeElement.type === 'string') {
    this.instillRealTextElement(_nodeElement);
  } else if (_nodeElement.type === 'empty') {
    this.instillRealEMPTYElement(_nodeElement);

    // 참조중인 ElementNode도 함께 생성
    var refEleNode = _nodeElement.getRefferencingElementNode();
    if (refEleNode !== undefined) {
      this.constructToRealElement(refEleNode);
    }
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
  var realElement = this.directContext.getDocument().createElement(_nodeElement.getTagName());

  _nodeElement.setRealElement(realElement);
  _nodeElement.applyAttributesToRealDOM();
};

/**
 * instillRealTextElement
 * ElementNode에 TextNode 타입의 RealElement를 주입한다.
 *
 */
DocumentContextController.prototype.instillRealTextElement = function(_nodeElement) {
  var textNode = this.directContext.getDocument().createTextNode('');

  _nodeElement.setRealElement(textNode);
};

/**
 * instillRealEMPTYElement
 * ElementNode에 TextNode 타입의 RealElement를 주입한다.
 *
 */
DocumentContextController.prototype.instillRealEMPTYElement = function(_nodeElement) {
  var realElement = this.directContext.getDocument().createElement(_nodeElement.getTagName());

  _nodeElement.setRealElement(realElement);
  _nodeElement.applyAttributesToRealDOM();
};

/**
 * instillRealReactElement
 * ElementNode에 React 타입의 RealElement를 주입한다.
 *
 */
DocumentContextController.prototype.instillRealReactElement = function(_nodeElement) {
  var realElement = this.directContext.getDocument().createElement(_nodeElement.getTagName());

  _nodeElement.setRealElement(realElement);
  _nodeElement.applyAttributesToRealDOM();
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

        // resolve String : data binding and i18n processing
        scriptE.innerHTML = this.resolveRenderText(__scriptObject.script);
      }

      return scriptE;
    }
  });
};

DocumentContextController.prototype.resolveRenderText = function(_seedText) {
  // resolve String : data binding and i18n processing
  return this.serviceManager.resolveString(_seedText);
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


DocumentContextController.prototype.testSave = function() {
  console.log(JSON.stringify(this.document.export()));
};


module.exports = DocumentContextController;