"use strict";
var Document = require('./Document.js');
var jsDiff = require('diff');
import LZString from '../lib/lz-string.js';
import DocumentRevisionManager from './DocumentRevisionManager.js';

class DocumentContextController {
  constructor(_document, _params, _serviceManager) {
    this.attached = false;
    this.context = null;
    this.running = false;
    this.unsaved = false;
    this.editMode = false;

    //this.session = _session;

    this.serviceManager = _serviceManager;

    this.superElement = null;

    // screen Mode
    this.screenSizing = 'desktop'; // desktop, tablet, mobile

    // 입력된 document가 있다면 그것을 실제 Document Object로 변환하고
    if (typeof _document !== 'undefined' && Object.keys(_document).length != 0) {

      this.document = new Document(this, _params, _document);
    } else {

      // 없다면 새로운 Document를 생성한다.
      this.document = new Document(this, {});
    }



    this.revisionPointer = 0;
    this.revisionHistoryQueue = [];
    this.revisionManager = new DocumentRevisionManager();
    this.componentCSSHolders = {};

  }





  /*********
   * Attach / Pause / Resume
   *
   */
  attach(_context, _superDOMElement) {
    this.attached = true;
    this.context = _context;
    this.setSuperElement(_superDOMElement);
    /* processing */



    this.beginRender();
  }

  pause() {
    this.running = false;

    /* processing */

  }

  resume() {
    this.running = true;

    /* processing */

  }

  save() {
    var self = this;
    var docjson = this.document.export();
    this.serviceManager.saveDocument(this.document.getDocumentID(), docjson, function(_result) {
      self.unsaved = false;
      self.context.feedSaveStateChange();
    });
  }

  changedContent() {
    if (this.unsaved) return;
    this.unsaved = true;
    this.context.feedSaveStateChange();
  }

  get isUnsaved() {
    return this.unsaved;
  }

  modifyDocumentCSS(_cssText) {
    this.document.setPageCSS(_cssText);
    this.updatePageCSS();
    this.changedContent();
  }

  modifyElementProperty(_elementIdorElement, _propKey, _propValue) {
    let targetElementNode = null;
    let parentElementNode = null;
    let treeRefresh = false;

    if (typeof _elementIdorElement === 'string') {
      targetElementNode = this.document.findById(_elementIdorElement);
    } else {
      targetElementNode = _elementIdorElement;
    }

    if (targetElementNode !== null) {
      parentElementNode = targetElementNode.getParent();
    }



    switch (_propKey) {
      case "Name":
        targetElementNode.setName(_propValue);
        treeRefresh = true;
        break;
      case "Comment":
        targetElementNode.setComment(_propValue);
        treeRefresh = true;
        break;
      case "refferenceType":
        targetElementNode.setRefferenceType(_propValue);
        treeRefresh = true;
        break;
      case "refferenceTarget":
        targetElementNode.setRefferenceTarget(_propValue);
        treeRefresh = true;
        break;
      case "reactPackageKey":
        targetElementNode.setReactPackageKey(_propValue);
        treeRefresh = true;
        break;
      case "reactComponentKey":
        targetElementNode.setReactComponentKey(_propValue);
        treeRefresh = true;
        break;
      case "reactComponentProps":
        targetElementNode.setReactComponentProps(_propValue);
        treeRefresh = true;
        break;
      case "rectangle":
        targetElementNode.transformRectByEditor(_propValue.left, _propValue.top, _propValue.width, _propValue.height);
        break;
      case "text":
        targetElementNode.setText(_propValue);
        break;
      case "tagName":
        targetElementNode.setTagName(_propValue);
        break;
      default:
        console.error("No matched property key");
    }


    if (parentElementNode !== null) {
      targetElementNode.realize();
      // RootElementNode 트리에 종속된 모든 ElementNode의 RealElement를 계층적으로 RealElement에 삽입한다.
      parentElementNode.linkHierarchyRealizaion();
    } else {
      // 상위노드가 없다면 rootElementNode 또는 ElementNodeList에 존재하는 노드일수도 있다.
      this.rootRender();
    }

    this.changedContent();
  }

  modifyReactElementProperty(_elementIdorElement, _propKey, _propValue) {
    let targetElementNode = null;
    let parentElementNode = null;
    let treeRefresh = false;

    if (typeof _elementIdorElement === 'string') {
      targetElementNode = this.document.findById(_elementIdorElement);
    } else {
      targetElementNode = _elementIdorElement;
    }

    if (targetElementNode !== null) {
      parentElementNode = targetElementNode.getParent();
    }


    targetElementNode.setReactComponentProp(_propKey, _propValue);

    if (parentElementNode !== null) {
      targetElementNode.realize();
      // RootElementNode 트리에 종속된 모든 ElementNode의 RealElement를 계층적으로 RealElement에 삽입한다.
      parentElementNode.linkHierarchyRealizaion();
    } else {
      // 상위노드가 없다면 rootElementNode 또는 ElementNodeList에 존재하는 노드일수도 있다.
      this.rootRender();
    }

    this.changedContent();
  }

  modifyElementAttribute(_elementIdorElement, _attrKey, _attrValue) {
    let targetElementNode = null;
    let parentElementNode = null;

    if (typeof _elementIdorElement === 'string') {
      targetElementNode = this.document.findById(_elementIdorElement);
    } else {
      targetElementNode = _elementIdorElement;
    }

    if (targetElementNode !== null) {
      parentElementNode = targetElementNode.getParent();
    }

    let treeRefresh = false;

    switch (_attrKey) {
      case "tagName":
        targetElementNode.setAttribute("tagName", _attrValue);
        treeRefresh = true;
        break;
      case "class":
        targetElementNode.setAttribute("class", _attrValue);
        break;
      case "id":
        targetElementNode.setAttribute("id", _attrValue);
        break;
      default:
        targetElementNode.setAttribute(_attrKey, _attrValue);
    }

    if (!treeRefresh) {
      targetElementNode.mappingAttributes();
    } else {
      if (parentElementNode !== null) {
        targetElementNode.realize();
        // RootElementNode 트리에 종속된 모든 ElementNode의 RealElement를 계층적으로 RealElement에 삽입한다.
        parentElementNode.linkHierarchyRealizaion();
      } else {
        // 상위노드가 없다면 rootElementNode 또는 ElementNodeList에 존재하는 노드일수도 있다.
        this.rootRender();
      }
    }

    this.changedContent();
  }

  modifyElementControl(_elementIdorElement, _controlKey, _controlValue) {
    let targetElementNode = null;
    let parentElementNode = null;

    if (typeof _elementIdorElement === 'string') {
      targetElementNode = this.document.findById(_elementIdorElement);
    } else {
      targetElementNode = _elementIdorElement;
    }

    if (targetElementNode !== null) {
      parentElementNode = targetElementNode.getParent();
    }

    switch (_controlKey) {
      case "repeat-n":
        targetElementNode.setControl("repeat-n", _controlValue);
        break;
      default:
    }

    this.rootRender();
    this.changedContent();
  }

  modifyElementTree(_elementIdorElement, _action, _object) {
    let targetElementNode = null;
    let parentElementNode = null;

    if (typeof _elementIdorElement === 'string') {
      targetElementNode = this.document.findById(_elementIdorElement);
    } else {
      targetElementNode = _elementIdorElement;
    }

    if (targetElementNode !== null) {
      parentElementNode = targetElementNode.getParent();
    }


    let returns;

    switch (_action) {
      case "remove":
        if (parentElementNode !== null) {
          returns = parentElementNode.detachChild(targetElementNode);
        } else {
          this.document.rootElementNode = null;
        }

        break;
      case "appendComponent":
        returns = () => {
          let newElementNode = this.convertToElementNodeFromComponent(_object);
          if (targetElementNode === null) {
            this.document.setRootElementNode(newElementNode);
          } else {
            this.document.insertElementNode("appendChild", newElementNode, targetElementNode);
          }
        }.apply(this);
        break;
      case "insertBeforeComponent":
        returns = () => {
          let newElementNode = this.convertToElementNodeFromComponent(_object);
          this.document.insertElementNode("insertBefore", newElementNode, targetElementNode);
        }.apply(this);
        break;
      case "insertAfterComponent":
        returns = () => {
          let newElementNode = this.convertToElementNodeFromComponent(_object);
          this.document.insertElementNode("insertAfter", newElementNode, targetElementNode);
        }.apply(this);
        break;
      case "cloneAndInsertAfter":
        returns = () => {
          let clonedElementNode = this.document.cloneElement(targetElementNode);
          this.document.insertElementNode("insertAfter", clonedElementNode, targetElementNode);
        }.apply(this);
        break;
      case "pasteIn":
        returns = () => {
          var newElementNode = this.document.newElementNode(_object);
          this.document.insertElementNode("appendChild", newElementNode, targetElementNode);
        }.apply(this);
        break;
      case "default":
        console.error('What the');
    }

    console.log('modified Tree', returns);

    if (returns) {

    }

    if (parentElementNode !== null) {

      parentElementNode.children.map((_childElementNode) => {
        _childElementNode.realize();
      });

      // RootElementNode 트리에 종속된 모든 ElementNode의 RealElement를 계층적으로 RealElement에 삽입한다.
      parentElementNode.linkHierarchyRealizaion();

    } else {
      // 상위노드가 없다면 rootElementNode 또는 ElementNodeList에 존재하는 노드일수도 있다.
      this.rootRender();
    }

    this.changedContent();
  }

  leaveTextEditMode(_elementNode) {
    this.editMode = false;
    _elementNode.changeNormalMode();
    this.rerenderingElementNode(_elementNode);
    this.changedContent();
  }

  enterTextEditMode(_elementNode /*, _changeNotice*/ ) {
    this.editMode = true;
    _elementNode.changeTextEditMode(
      /*function(_text) {
            _changeNotice(_text);
          }*/
    );
    this.rerenderingElementNode(_elementNode, {
      skipControl: true,
      skipResolve: true
    });
  }

  isTextEditMode() {
    return this.editMode;
  }




  convertToElementNodeFromComponent(_component) {
    return this.document.newElementNodeFromComponent(_component);
  }

  setScreenSizing(_sizing) {

    this.screenSizing = _sizing;
  }

  getScreenSizing() {
    return this.screenSizing;
  }

  // superElement
  // superElement는 RootElementNode가 랜더링되는 지점이다.
  setSuperElement(_domElement) {
    this.superElement = _domElement;
  }


  /***************
   * beginRender
   * context 의 iframeStage에 현재 Document의 내용을 랜더링한다.
   *
   */
  beginRender(_realizeOptions) {
    var self = this;


    // resource convert
    this.convertToScriptElements(this.document.refScriptIdList || [], function(_scriptElements) {
      // script element block을 적용한다.
      _scriptElements.map(function(_scriptElement) {
        self.context.applyScriptElement(_scriptElement);
      });
    });

    this.convertToStyleElements(this.document.refStyleIdList || [], function(_styleElements) {
      // style element block을 적용한다.
      _styleElements.map(function(_styleElement) {
        self.context.applyStyleElement(_styleElement);
      });
    });

    // // script element block 을 적용한다.
    // jsElements.map(function(_jsElement) {
    //
    //   /*
    //   if (_jsElement.getAttribute('src') !== undefined) {
    //     _jsElement.onload = function() {
    //       console.log('loaded', _jsElement);
    //
    //       console.log(self.context.getWindow());
    //     }
    //   }*/
    //
    //   self.context.applyScriptElement(_jsElement);
    //
    // });



    // rootElementNode 가 null이 아닌경우 랜더링을 수행한다.
    if (this.document.rootElementNode !== null) {
      this.rootRender(_realizeOptions);
    }

    //console.log(this.document.rootElementNode);
  }

  rerenderingElementNode(_elementNode, _realizeOptions) {
    let realizeOptions = _realizeOptions || {};

    if (_elementNode === null) {
      this.clearSuperElement();
      return;
    }

    let parentElementNode = _elementNode.getParent();

    _elementNode.realize(realizeOptions);

    if (parentElementNode !== null) {

      parentElementNode.linkHierarchyRealizaion();

    } else {
      this.clearSuperElement();
      _elementNode.linkHierarchyRealizaion();
      this.superElement.appendChild(_elementNode.realization);
    }

    if (realizeOptions.clickBlock) {
      let elements = this.superElement.querySelectorAll('*');
      let elementNavigateAttr;

      for (let i = 0; i < elements.length; i++) {
        elementNavigateAttr = elements[i].getAttribute("data-navigate");

        if (elementNavigateAttr === undefined || elementNavigateAttr === null) {
          elements[i].onclick = function(_e) {
            _e.preventDefault();
          };
        }
      }
    }



  }

  rootRender(_realizeOptions) {

    this.updateRenderCSS();
    this.rerenderingElementNode(this.document.rootElementNode, _realizeOptions);
  }

  applyComponentCSS(_cssIdentifier, _cssText) {
    this.componentCSSHolders[_cssIdentifier] = _cssText;

    this.updatePageCSS();
  }

  extractComponentsStyleSheet() {
    let cssLines = '\n';
    let heldCSSKeys = Object.keys(this.componentCSSHolders);

    for (let i = 0; i < heldCSSKeys.length; i++) {
      let key = heldCSSKeys[i];
      cssLines += '/*Component :'
      cssLines += key;
      cssLines += '*/\n';
      cssLines += this.componentCSSHolders[key];
    }

    return cssLines;
  }

  /********
   * updateHTMLTypeElementNodeCSS
   * ElementNodeCSS를 랜더링 중인 화면에 적용한다.
   *
   */
  updatePageCSS() {

    // 현재 생성되어 있는 스타일블럭이 없다면 생성
    if (typeof this.pageCSSBlock === 'undefined') {
      var baseWindow = this.context.getWindow();
      var styleBlock = baseWindow.document.createElement('style');
      this.context.applyStyleElement(styleBlock);
      this.pageCSSBlock = styleBlock;
    }


    // 변경된 css반영
    this.pageCSSBlock.innerHTML = this.document.interpret(this.document.getPageCSS()) + this.extractComponentsStyleSheet();

  }

  updateRenderCSS() {
    // document에서 HTMLType, ReactType ElementNode의 종합 css를 얻어온다.
    //this.updateHTMLTypeElementNodeCSS(this.document.getHTMLElementNodeCSSLines() + this.document.getReactElementNodeCSSLines());
    this.updatePageCSS();
  }

  getReactComponentFromSession(_packageKey, _componentKey, _syncWindowContext) {

    return this.session.getComponentPool().getComponentFromRemote(_componentKey, _packageKey, _syncWindowContext);
  }

  attachRootRealElementToSuperElement() {

    // rootRealElement 를 지정된 superElement에 랜더링한다.
    this.superElement.appendChild(this.document.rootElementNode.getRealization());
  }

  clearSuperElement() {
    // new
    while (this.superElement.childNodes.length > 0) {
      this.superElement.removeChild(this.superElement.childNodes[0]);
    }
  }

  /**
   * convertToStyleElements
   * Style Object 리스트를 실제 window.document 내의 Style 요소로 변환한다.
   *
   */
  convertToStyleElements(_styleIdList, _complete) {
    var baseWindow = this.context.getWindow();
    let self = this;
    let styleElements = _styleIdList.map(function(_styleId) {
      let url = self.serviceManager.getStyleURLById(_styleId);

      let element;


      if (url !== null) {
        element = baseWindow.document.createElement('style');
        let style = self.serviceManager.getStyleContents(_styleId);

        element.innerHTML = self.document.interpret(style);

        //linkE.setAttribute('href', url);
      } else {
        element = baseWindow.document.createElement('link');
        element.setAttribute('href', _styleId);
      }

      element.setAttribute('type', 'text/css');
      element.setAttribute('rel', 'stylesheet');

      return element;
    });

    _complete(styleElements);
  }

  /**
   * convertToScriptElement
   * script Object 리스트를 실제 window.document 내의 script 요소로 변환한다.
   *
   */
  convertToScriptElements(_scriptIdList, _complete) {
    var baseWindow = this.context.getWindow();
    let self = this;
    let scriptElements = _scriptIdList.map(function(_scriptId) {
      let url = self.serviceManager.getScriptURLById(_scriptId);

      let element = baseWindow.document.createElement('script');;

      element.setAttribute('type', 'text/javascript');
      element.setAttribute('rel', 'javascript');

      if (url !== null) {
        let script = self.serviceManager.getScriptContents(_scriptId);
        element.innerHTML = self.document.interpret(script);
        //linkE.setAttribute('href', url);
      } else {
        element.setAttribute('src', _scriptId);
      }

      return element;
    });

    _complete(scriptElements);
  }

  // convertToScriptElement(_scriptIdList) {
  //   var baseWindow = this.context.getWindow();
  //
  //   return _scriptObjects.map(function(__scriptObject) {
  //     if (__scriptObject.ext === 'js') {
  //       var scriptE = baseWindow.document.createElement('script');
  //
  //       scriptE.setAttribute('type', 'text/javascript');
  //
  //       if (typeof __scriptObject.url !== 'undefined') {
  //         scriptE.setAttribute('src', __scriptObject.url);
  //       } else {
  //
  //         // resolve String : data binding and i18n processing
  //         scriptE.innerHTML = this.resolveRenderText(__scriptObject.script);
  //       }
  //
  //       return scriptE;
  //     }
  //   });
  // }

  existsUndoHistory() {

    if (this.revisionManager.present === null) {
      return false;
    } else {
      if (this.revisionManager.present === this.revisionManager.rootRevision && !this.revisionManager.present.isExecuted) {
        return false;
      }
    }

    return true;
  }

  existsRedoHistory() {
    if (this.revisionManager.present === null) {
      return false;
    } else {
      if (this.revisionManager.present === this.revisionManager.lastRevision && this.revisionManager.present.isExecuted) {
        return false;
      }
    }
    return true;
  }

  // Undo
  gotoPast() {
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
  }

  // Redo
  gotoFuture() {
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
  }

  applyRevision(_revision, _direction) {
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
  }

  snapshot(_elementNode, _present, _past, _type) {
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
  }

  // resolveRenderText(_seedText) {
  //   // resolve String : data binding and i18n processing
  //   return this.serviceManager.resolveString(_seedText);
  // }

  /********
   * updateHTMLTypeElementNodeCSS
   * ElementNodeCSS를 랜더링 중인 화면에 적용한다.
   *
   */
  updateHTMLTypeElementNodeCSS(_css) {

    // 현재 생성되어 있는 스타일블럭이 없다면 생성
    if (typeof this.htmlTypeElementNodeStyleBlock === 'undefined') {
      var baseWindow = this.context.getWindow();
      var styleBlock = baseWindow.document.createElement('style');
      this.context.applyStyleElement(styleBlock);

      this.htmlTypeElementNodeStyleBlock = styleBlock;
    }
    // 변경된 css반영
    this.htmlTypeElementNodeStyleBlock.innerHTML = _css;

  }



  isDropableToRoot() {
    return this.document.rootElementNode === null;
  }


  testSave() {
    console.log(JSON.stringify(this.document.export()));
  }


}


export default DocumentContextController;