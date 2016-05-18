"use strict";
var Document = require('./Document.js');
import async from 'async';
import _ from 'underscore';

import LazyTimer from '../util/LazyTimer.js';

// import DocumentRevisionManager from './DocumentRevisionManager.js';
import HasElementNodeContextController from './HasElementNodeContextController.js';

class DocumentContextController extends HasElementNodeContextController {
  constructor(_document, _params, _serviceManager, _fragmentOption) {
    super();
    HasElementNodeContextController.call(this);

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

      this.subject = new Document(this, _params, _document, _fragmentOption);
    } else {

      // 없다면 새로운 Document를 생성한다.
      this.subject = new Document(this, {}, undefined, _fragmentOption);
    }



    this.revisionPointer = 0;
    this.revisionHistoryQueue = [];
    this.revisionManager = new DocumentRevisionManager();
    this.componentCSSHolders = {};
    this.lazyTimer = new LazyTimer();
  }

  /*********
   * Attach / Pause / Resume
   *
   */
  attach(_context, _superDOMElement) {
    this.attached = true;
    this.context = _context;
  }

  save() {
    var self = this;
    var docjson = this.subject.export();
    this.serviceManager.saveDocument(this.subject.getDocumentID(), docjson, function(_result) {
      self.unsaved = false;
      self.context.feedSaveStateChange();
    });
  }

  changedContent() {
    super.changedContent();
    this.supplySampleBindingParams();
  }

  supplySampleBindingParams() {
    let nsSet = this.subject.getAllBinderNSSet();
    let that = this;

    nsSet.forEach(function(_ns) {
      // fragment에 param이 undefined 라면 요청을 진행하여 fragment에 공급한다.
      if (that.subject.getParam(_ns) !== undefined) return;
      let apiSourceNT_Tid = _ns.split('-')[0];
      let requestName = _ns.split('-')[1];

      that.serviceManager.getApiSourceListWithInterface(function(_result) {
        let index = _.findIndex(_result, {
          nt_tid: apiSourceNT_Tid
        });

        if (index === -1) return console.warn(apiSourceNT_Tid + " tid 를 가지는 ICE API Source 리소스가 서비스에 존재하지 않습니다.");

        let apiSource = _result[index];
        let requestIndex = _.findIndex(apiSource.requests, {
          name: requestName
        });

        if (requestIndex === -1) return console.warn(requestName + " 라는 이름의 요청이 " + apiSource.title + " ICEAPISource 상에 존재하지 않습니다.");
        let request = apiSource.requests[requestIndex];
        apiSource.executeTestRequest(request.id, function(_result) {
          console.log('setParam', _result);
          // Param 을 입력하고
          that.subject.setParam(_ns, _result);
          console.log(that.subject);
          // 랜더링을 리프레시 한다.
          that.context.renderRefresh();
        });

      });

    });
  }

  modifyDocumentCSS(_cssText) {
    this.subject.setPageCSS(_cssText);
    this.changedContent();

    this.updatePageCSS();
  }

  modifyDocumentScript(_scriptText) {
    this.subject.setPageScript(_scriptText);
    this.changedContent();

    let self = this;
    this.lazyTimer.set("refresh", 1000, function() {
      self.context.renderRefresh();
    });
  }

  modifyElementProperty(_elementIdorElement, _propKey, _propValue) {
    let targetElementNode = null;
    let parentElementNode = null;
    let treeRefresh = false;

    if (typeof _elementIdorElement === 'string') {
      targetElementNode = this.subject.findById(_elementIdorElement);
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
      case "refType":
        targetElementNode.refType = _propValue;
        break;
      case "refTargetId":
        targetElementNode.refTargetId = _propValue;
        break;
      default:
        console.error("No matched property key");
    }


    if (parentElementNode !== null) {
      targetElementNode.realize(function() {
        // RootElementNode 트리에 종속된 모든 ElementNode의 RealElement를 계층적으로 RealElement에 삽입한다.
        parentElementNode.linkHierarchyRealizaion();
      });
    } else {
      // 상위노드가 없다면 rootElementNode 또는 ElementNodeList에 존재하는 노드일수도 있다.
      this.context.renderRefresh();
    }

    this.changedContent();
  }

  modifyReactElementProperty(_elementIdorElement, _propKey, _propValue) {
    let targetElementNode = null;
    let parentElementNode = null;
    let treeRefresh = false;

    if (typeof _elementIdorElement === 'string') {
      targetElementNode = this.subject.findById(_elementIdorElement);
    } else {
      targetElementNode = _elementIdorElement;
    }

    if (targetElementNode !== null) {
      parentElementNode = targetElementNode.getParent();
    }


    targetElementNode.setReactComponentProp(_propKey, _propValue);

    if (parentElementNode !== null) {
      targetElementNode.realize(function() {
        // RootElementNode 트리에 종속된 모든 ElementNode의 RealElement를 계층적으로 RealElement에 삽입한다.
        parentElementNode.linkHierarchyRealizaion();
      });
    } else {
      // 상위노드가 없다면 rootElementNode 또는 ElementNodeList에 존재하는 노드일수도 있다.
      this.context.renderRefresh();
    }

    this.changedContent();
  }

  modifyElementAttribute(_elementIdorElement, _attrKey, _attrValue) {
    let targetElementNode = null;
    let parentElementNode = null;

    if (typeof _elementIdorElement === 'string') {
      targetElementNode = this.subject.findById(_elementIdorElement);
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
        targetElementNode.realize(function() {
          // RootElementNode 트리에 종속된 모든 ElementNode의 RealElement를 계층적으로 RealElement에 삽입한다.
          parentElementNode.linkHierarchyRealizaion();
        });
      } else {
        // 상위노드가 없다면 rootElementNode 또는 ElementNodeList에 존재하는 노드일수도 있다.
        this.context.renderRefresh();
      }
    }

    this.changedContent();
  }

  modifyElementControl(_elementIdorElement, _controlKey, _controlValue) {
    let targetElementNode = null;
    let parentElementNode = null;

    if (typeof _elementIdorElement === 'string') {
      targetElementNode = this.subject.findById(_elementIdorElement);
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

    this.context.renderRefresh();
    this.changedContent();
  }

  modifyElementGeometry(_elementIdorElement, _key, _value, _screenMode) {

    // 타겟 노드와 타겟노드의 부모 노느 찾기
    let targetElementNode = null;
    let parentElementNode = null;

    if (typeof _elementIdorElement === 'string') {
      targetElementNode = this.subject.findById(_elementIdorElement);
    } else {
      targetElementNode = _elementIdorElement;
    }

    if (targetElementNode !== null) {
      parentElementNode = targetElementNode.getParent();
    }

    // 편집
    this.subject.modifyElementGeometry(targetElementNode, _key, _value, _screenMode);

    // 화면 업데이트
    if (parentElementNode !== null) {

      parentElementNode.children.map((_childElementNode) => {
        _childElementNode.realize(function() {
          // RootElementNode 트리에 종속된 모든 ElementNode의 RealElement를 계층적으로 RealElement에 삽입한다.
          parentElementNode.linkHierarchyRealizaion();
        });
      });

    } else {
      // 상위노드가 없다면 rootElementNode 또는 ElementNodeList에 존재하는 노드일수도 있다.
      this.context.renderRefresh();
    }

    this.changedContent();
  }

  modifyElementTree(_elementIdorElement, _action, _object) {
    let targetElementNode = null;
    let parentElementNode = null;

    if (typeof _elementIdorElement === 'string') {
      targetElementNode = this.subject.findById(_elementIdorElement);
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
          this.subject.rootElementNode = null;
        }

        break;
      case "appendComponent":
        returns = (() => {
          let newElementNode = this.convertToElementNodeFromComponent(_object);
          if (targetElementNode === null) {
            this.subject.setRootElementNode(newElementNode);
          } else {
            this.subject.insertElementNode("appendChild", newElementNode, targetElementNode);
          }
        }).apply(this);
        break;
      case "insertBeforeComponent":
        returns = (() => {
          let newElementNode = this.convertToElementNodeFromComponent(_object);
          this.subject.insertElementNode("insertBefore", newElementNode, targetElementNode);
        }).apply(this);
        break;
      case "insertAfterComponent":
        returns = (() => {
          let newElementNode = this.convertToElementNodeFromComponent(_object);
          this.subject.insertElementNode("insertAfter", newElementNode, targetElementNode);
        }).apply(this);
        break;
      case "cloneAndInsertAfter":
        returns = (() => {
          let clonedElementNode = this.subject.cloneElement(targetElementNode);
          this.subject.insertElementNode("insertAfter", clonedElementNode, targetElementNode);
        }).apply(this);
        break;
      case "pasteIn":
        returns = (() => {
          var newElementNode = this.subject.newElementNode(_object);
          this.subject.insertElementNode("appendChild", newElementNode, targetElementNode);
        }).apply(this);
        break;
      case "default":
        console.error('What the');
    }

    console.log('modified Tree', returns);

    if (returns) {

    }

    if (parentElementNode !== null) {

      parentElementNode.children.map((_childElementNode) => {
        _childElementNode.realize(function() {
          parentElementNode.linkHierarchyRealizaion();
        });
      });

      // RootElementNode 트리에 종속된 모든 ElementNode의 RealElement를 계층적으로 RealElement에 삽입한다.
    } else {
      // 상위노드가 없다면 rootElementNode 또는 ElementNodeList에 존재하는 노드일수도 있다.
      this.context.renderRefresh();
    }

    this.changedContent();
  }

  leaveTextEditMode(_elementNode) {
    let that = this;
    this.editMode = false;
    _elementNode.changeNormalMode();
    this.rerenderingElementNode(_elementNode, undefined, function() {
      that.changedContent();
    });

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
    }, function() {

    });
  }

  isTextEditMode() {
    return this.editMode;
  }




  convertToElementNodeFromComponent(_component) {
    return this.subject.newElementNodeFromComponent(_component);
  }

  setScreenSizing(_sizing) {

    this.screenSizing = _sizing;

    this.subject.setScreenSizing(_sizing);
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
  beginRender(_realizeOptions, _complete) {
    var self = this;

    this.convertToStyleElements(this.subject.refStyleIdList || [], function(_styleElements) {

      _styleElements.push(self.getPageCSSElement());

      // style element block을 적용한다.
      _styleElements.map(function(_styleElement) {
        self.context.applyStyleElement(_styleElement);
      });
    });

    // rootElementNode 가 null이 아닌경우 랜더링을 수행한다.
    if (this.subject.rootElementNode !== null) {
      this.rootRender(_realizeOptions, function() {
        _complete();
      });
    } else {
      _complete();
    }

    // resource convert
    this.convertToScriptElements(this.subject.refScriptIdList || [], function(_scriptElements) {
      _scriptElements.push(self.getPageScriptElement());

      // script element block을 적용한다.
      async.eachSeries(_scriptElements, function iterator(_element, _next) {

        self.context.applyScriptElement(_element);

        if (_element.getAttribute('src')) {
          _element.onload = function() {
            _next();
          }
        } else {
          _next();
        }

      }, function done() {

      });
    });

    //console.log(this.subject.rootElementNode);
  }

  rootRender(_realizeOptions, _complete) {
    this.rerenderingElementNode(this.subject.rootElementNode, _realizeOptions, function() {
      _complete();
    });
  }

  rerenderingElementNode(_elementNode, _realizeOptions, _complete) {
    let that = this;
    let realizeOptions = _realizeOptions || {};
    console.log('rerenderingElementNode !!');
    if (_elementNode === null) {
      this.clearSuperElement();
      return;
    }

    let parentElementNode = _elementNode.getParent();

    _elementNode.realize(realizeOptions, function() {
      _complete();

      if (parentElementNode !== null) {

        parentElementNode.linkHierarchyRealizaion();

      } else {
        that.clearSuperElement();
        _elementNode.linkHierarchyRealizaion();

        console.log('슈퍼 엘리멑느', that.superElement);
        that.superElement.appendChild(_elementNode.realization);
      }

      if (realizeOptions.clickBlock) {
        let elements = that.superElement.querySelectorAll('*');
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


    });


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

  getPageCSSElement() {
    var baseWindow = this.context.getWindow();
    var styleElement = baseWindow.document.createElement('style');
    styleElement.setAttribute("id", 'fragment-css');

    // 변경된 css반영
    styleElement.innerHTML = this.subject.interpret(this.subject.getPageCSS() || '') + this.extractComponentsStyleSheet();

    return styleElement;
  }

  updatePageCSS() {
    var baseWindow = this.context.getWindow();
    let styleElement = baseWindow.document.getElementById('fragment-css');
    styleElement.innerHTML = this.subject.interpret(this.subject.getPageCSS() || '') + this.extractComponentsStyleSheet();
  }

  getPageScriptElement() {
    var baseWindow = this.context.getWindow();
    var scriptElement = baseWindow.document.createElement('script');
    scriptElement.setAttribute("fragment-script", '');

    // 변경된 css반영
    scriptElement.innerHTML = this.subject.interpret(this.subject.getPageScript() || '');

    return scriptElement;
  }



  attachRootRealElementToSuperElement() {

    // rootRealElement 를 지정된 superElement에 랜더링한다.
    this.superElement.appendChild(this.subject.rootElementNode.getRealization());
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

        element.innerHTML = self.subject.interpret(style);

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
        element.innerHTML = self.subject.interpret(script);
        //linkE.setAttribute('href', url);
      } else {
        element.setAttribute('src', _scriptId);
      }

      return element;
    });

    _complete(scriptElements);
  }

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
    return this.subject.rootElementNode === null;
  }


  testSave() {
    console.log(JSON.stringify(this.subject.export()));
  }


}


export default DocumentContextController;