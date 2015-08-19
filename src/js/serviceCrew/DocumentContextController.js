var Document = require('./Document.js');

var DocumentContextController = function(_document) {
  this.attached = false;
  this.directContext = null;
  this.running = false;

  // 입력된 document가 있다면 그것을 실제 Document Object로 변환하고
  if (typeof _document !== 'undefined') {

    this.document = new Document(_document);
  } else {

    // 없다면 새로운 Document를 생성한다.
    this.document = new Document();
  }

  console.log('document created', this.document);

};

/*********
 * Attach / Pause / Resume
 *
 */

DocumentContextController.prototype.attach = function(_directContext) {
  this.attached = true;
  this.directContext = _directContext;

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

/***************
 * beginRender
 * DirectContext 의 iframeStage에 현재 Document의 내용을 랜더링한다.
 *
 */
DocumentContextController.prototype.beginRender = function() {
  console.log(this.document.rootElementNode, 'render');
  var self = this;

  // resource convert
  var jsElements = this.convertToScriptElement(this.document.getScriptResources());
  var styleElements = this.convertToStyleElements(this.document.getStyleResources());

  // script element block 을 적용한다.
  jsElements.map(function(_jsElement) {
    self.directContext.applyScriptElement(_jsElement);
  });

  // style element block을 적용한다.
  styleElements.map(function(_styleElement) {
    self.directContext.applyStyleElement(_styleElement);
  });

  // rootElementNode부터 시작하여 Tree구조의 자식노드들의 RealElement를 생성한다.
  this.constructToRealElement(this.document.rootElementNode);

  // RootElementNode 트리에 종속된 모든 ElementNode의 RealElement를 계층적으로 RealElement에 삽입한다.
  var rootRealElement = this.document.rootElementNode.growupRealElementTree();

  // rootRealElement 를 directContext에 랜더링한다.
  this.directContext.appendElementToBody(rootRealElement);
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
  var element;

  element = this.directContext.getIFrameStageInnerDoc().createElement(_nodeElement.getTagName());
  element.setAttribute('class', _nodeElement.element.class);

  _nodeElement.setRealElement(element);
};

/**
 * instillRealTextElement
 * ElementNode에 TextNode 타입의 RealElement를 주입한다.
 *
 */
DocumentContextController.prototype.instillRealTextElement = function(_nodeElement) {

  var textNode = this.directContext.getIFrameStageInnerDoc().createTextNode(_nodeElement.getText());
  _nodeElement.setRealElement(textNode);
};

/**
 * instillRealReactElement
 * ElementNode에 React 타입의 RealElement를 주입한다.
 *
 */
DocumentContextController.prototype.instillRealReactElement = function(_nodeElement) {

  ////// TOTOTOTOTO DODODODODO
  console.warn("React RealElement 주입방식 정의 안됨.");

};

/**
 * convertToStyleElements
 * Style Object 리스트를 실제 window.document 내의 Style 요소로 변환한다.
 *
 */
DocumentContextController.prototype.convertToStyleElements = function(_styleObjects) {
  var baseWindow = this.directContext.getIFrameStageInnerWindow();

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
  var baseWindow = this.directContext.getIFrameStageInnerWindow();

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
}

DocumentContextController.prototype.insertNewElementNodeFromComponent = function(_insertType, _component, _toElement) {
  var changedElementNode = this.document.insertNewElementNodeFromComponent(_insertType, _component, _toElement);
  var parent = changedElementNode.getParent();

  this.constructToRealElement(changedElementNode);

  parent.growupRealElementTree();
};


module.exports = DocumentContextController;