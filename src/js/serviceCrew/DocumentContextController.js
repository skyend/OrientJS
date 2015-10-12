var Document = require('./Document.js');
var jsDiff = require('diff');
import LZString from '../lib/lz-string.js';
import DocumentRevisionManager from './DocumentRevisionManager.js';

var DocumentContextController = function(_document, _session, _serviceManager) {
  this.attached = false;
  this.context = null;
  this.running = false;

  this.session = _session;
  this.serviceManager = _serviceManager;

  this.superElement = null;

  // screen Mode
  this.screenSizing = 'desktop'; // desktop, tablet, mobile

  // 입력된 document가 있다면 그것을 실제 Document Object로 변환하고
  if (typeof _document !== 'undefined' && Object.keys(_document).length != 0) {

    this.document = new Document(this, _document);
  } else {

    // 없다면 새로운 Document를 생성한다.
    this.document = new Document(this);
  }



  this.revisionPointer = 0;
  this.revisionHistoryQueue = [];
  this.revisionManager = new DocumentRevisionManager();

  // test
  this.prev = this.document.export();
};

/*********
 * Attach / Pause / Resume
 *
 */
DocumentContextController.prototype.attach = function(_context, _superDOMElement) {
  this.attached = true;
  this.context = _context;
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

DocumentContextController.prototype.setScreenSizing = function(_sizing) {

  this.screenSizing = _sizing;
};

DocumentContextController.prototype.getScreenSizing = function() {
  return this.screenSizing;
}

// superElement
// superElement는 RootElementNode가 랜더링되는 지점이다.
DocumentContextController.prototype.setSuperElement = function(_domElement) {
  this.superElement = _domElement;
};


/***************
 * beginRender
 * context 의 iframeStage에 현재 Document의 내용을 랜더링한다.
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

        console.log(self.context.getWindow());
      }
    }*/

    self.context.applyScriptElement(_jsElement);

  });

  // style element block을 적용한다.
  styleElements.map(function(_styleElement) {
    self.context.applyStyleElement(_styleElement);
  });

  // rootElementNode 가 null이 아닌경우 랜더링을 수행한다.
  if (this.document.rootElementNode !== null) {
    this.rootRender();
  }

};

DocumentContextController.prototype.getReactComponentFromSession = function(_packageKey, _componentKey, _syncWindowContext) {

  return this.session.getComponentPool().getComponentFromRemote(_componentKey, _packageKey, _syncWindowContext);
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
  var realElement = this.context.getDocument().createElement(_nodeElement.getTagName());

  _nodeElement.setRealElement(realElement);
  _nodeElement.applyAttributesToRealDOM();
};

/**
 * instillRealTextElement
 * ElementNode에 TextNode 타입의 RealElement를 주입한다.
 *
 */
DocumentContextController.prototype.instillRealTextElement = function(_nodeElement) {
  var textNode = this.context.getDocument().createTextNode('');

  _nodeElement.setRealElement(textNode);
};

/**
 * instillRealEMPTYElement
 * ElementNode에 TextNode 타입의 RealElement를 주입한다.
 *
 */
DocumentContextController.prototype.instillRealEMPTYElement = function(_nodeElement) {
  var realElement = this.context.getDocument().createElement(_nodeElement.getTagName());

  _nodeElement.setRealElement(realElement);
  _nodeElement.applyAttributesToRealDOM();
};

/**
 * instillRealReactElement
 * ElementNode에 React 타입의 RealElement를 주입한다.
 *
 */
DocumentContextController.prototype.instillRealReactElement = function(_nodeElement) {
  var realElement = this.context.getDocument().createElement(_nodeElement.getTagName());

  _nodeElement.setRealElement(realElement);
  _nodeElement.applyAttributesToRealDOM();
};

/**
 * convertToStyleElements
 * Style Object 리스트를 실제 window.document 내의 Style 요소로 변환한다.
 *
 */
DocumentContextController.prototype.convertToStyleElements = function(_styleObjects) {
  var baseWindow = this.context.getWindow();

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
  var baseWindow = this.context.getWindow();

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

DocumentContextController.prototype.existsUndoHistory = function() {

  if (this.revisionManager.present === null) {
    return false;
  } else {
    if (this.revisionManager.present === this.revisionManager.rootRevision && !this.revisionManager.present.isExecuted) {
      return false;
    }
  }

  return true;
};

DocumentContextController.prototype.existsRedoHistory = function() {
  if (this.revisionManager.present === null) {
    return false;
  } else {
    if (this.revisionManager.present === this.revisionManager.lastRevision && this.revisionManager.present.isExecuted) {
      return false;
    }
  }
  return true;
};

// Undo
DocumentContextController.prototype.gotoPast = function() {
  var present = this.revisionManager.present;

  if (present === null) return false;

  // 현재 리비전이 실행된 상태라면 이전으로 돌아가기 위해 before 필드를 사용하여 복구를 한다.
  if (present.isExecuted) {
    var targetElementNode = present.elementNode;
    var before = present.before;

    // 실제적인 복구 메소드 호출
    this.applyRevision(present, "backward");
    present.undo(); // 언두됨으로 상태를 변경한다.
  } else {
    // 현재 리비전이 언두 된 상태라면 이전 리비전이 있는지 확인 후 이전으로 리비전을 옮겨간 후
    // 이 메소드(gotoPast)를 한번더 호출한다.
    if (present.prev !== null) {
      this.revisionManager.moveToBack();
      return this.gotoPast();
    } else {
      return false;
    }
  }

  return true;
};

// Redo
DocumentContextController.prototype.gotoFuture = function() {
  var present = this.revisionManager.present;

  if (present === null) return false;

  if (present.isExecuted) {

    if (present.next !== null) {
      this.revisionManager.moveToFore();
      return this.gotoFuture();
    } else {
      return false;
    }
  } else {
    var targetElementNode = present.elementNode;
    var after = present.after;

    this.applyRevision(present, 'forward');
    present.executed(); // 실행됨으로 상태를 변경한다.
  }
  return true;
};

DocumentContextController.prototype.applyRevision = function(_revision, _direction) {
  var importSource;

  if (_direction === 'forward') {

    // forward 에는 after 필드를 사용하고
    importSource = _revision.after;
    //console.log('redo', importSource, _revision);
  } else {

    // backward에는 before필드를 사용한다.
    importSource = _revision.before;
    //console.log('undo', importSource, _revision);
  }

  var targetId = _revision.elementNode.id;
  var baseDoc = _revision.elementNode.document;
  var liveElementNode = baseDoc.findById(targetId);

  if (liveElementNode === false) throw new Error("링크중인 ElementNode를 찾을 수 없음.");

  liveElementNode.import(importSource);
  this.rootRender();
  this.context.updatedHistory();
};

DocumentContextController.prototype.snapshot = function(_elementNode, _present, _past, _type) {
  // var compressedDoc = LZString.compress(JSON.stringify(this.document.export()));
  // console.log(compressedDoc.length);
  //
  // var compressedDiff = jsDiff.diffChars(this.prev, compressedDoc);
  // console.log(compressedDiff);
  // // 압축결과 diff
  // this.prev = compressedDoc;
  //
  // return;
  var nodePresent = _present;
  var presentRevision;

  // // 현재 리비전이 플러시된 상태라면
  // // 이것은 리비전을 이동하여 플러시된 리비전으로 이동 했을 때 해당 리비전에 덮어씌어지는것을 방지하기 위함이다.
  // if (this.revisionManager.present.isFlushed) {
  //   // 한번더 플러시를 진행하여 새로운 리비전을 생성한다.
  //   this.revisionManager.flushRevision();
  // }

  if (_type === 'diff') {
    var presentContinuationRevision;
    var diff = jsDiff.diffChars(JSON.stringify(_past), JSON.stringify(_present));

    presentRevision = {
      elementNode: _elementNode, // 실제 ElementNode 의 참조를 저장
      before: _past,
      after: _present,
      type: 'all'
    };

    // //var presentRevision = this.revisionManager.present;
    // // 현재에 연속되는중인 리비전
    // presentContinuationRevision = this.revisionManager.present;
    // //var presentContinuationChangeLog = presentContinuationRevision.changeLog;
    //
    // if (_elementNode.id == presentContinuationRevision.elementNode.id) {
    //   var presentContinuationChangeLog = presentContinuationRevision.changeLog;
    //   if ()
    // }



  } else if (_type === 'all') {

    presentRevision = {
      elementNode: _elementNode, // 실제 ElementNode 의 참조를 저장
      before: _past,
      after: _present,
      type: 'all'
    };
    //console.log(_past, _present);
    this.revisionManager.appendNewRevision(presentRevision);

    //
    // this.revisionManager.writeHistory(presentChangeLog);
    // this.revisionManager.flushRevision();
  }

  this.context.updatedHistory();
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
    var baseWindow = this.context.getWindow();
    var styleBlock = baseWindow.document.createElement('style');
    this.context.applyStyleElement(styleBlock);

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
    var baseWindow = this.context.getWindow();
    var styleBlock = baseWindow.document.createElement('style');
    this.context.applyStyleElement(styleBlock);

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

DocumentContextController.prototype.save = function() {
  var docjson = this.document.export();
  this.serviceManager.saveDocument(this.document.getDocumentID(), docjson, function(_result) {

  });
};



module.exports = DocumentContextController;