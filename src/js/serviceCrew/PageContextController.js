"use strict";
import Page from './Page.js';
import ContextController from './ContextController.js';
import HasElementNodeContextController from './HasElementNodeContextController.js';

class PageContextController extends HasElementNodeContextController {
  constructor(_page, _session, _serviceManager) {
    super();

    this._superDOMElement;
    this.attached = false;
    this.context = null;
    this.running = false;
    this.unsaved = false;

    this.session = _session;
    this.serviceManager = _serviceManager;

    this.superElement = null;

    // screen Mode
    this.screenSizing = 'desktop'; // desktop, tablet, mobile

    if (_page !== undefined) {
      this.subject = new Page(this, _page, _serviceManager);
    } else {
      this.subject = new Page(this, undefined, _serviceManager);
    }
  }



  setContext(_context) {
    this.context = _context;
  }

  save() {
    let self = this;
    let pageJSON = this.subject.export();

    this.serviceManager.savePage(this.subject.id, pageJSON, function(_result) {
      self.unsaved = false;
      self.context.feedSaveStateChange();
    });
  }


  updateVisual() {
    this.context.forceUpdate();
  }

  modifyCreateRootGrid() {
    this.subject.createRootGridElement();

    this.changedContent();
  }

  modifyAppendNewGrid(_targetId, _behavior) {
    this.subject.appendNewGrid(_targetId, _behavior);
    this.changedContent();
  }

  modifyAppendBeforeNewGrid(_targetId, _behavior) {
    this.subject.appendBeforeNewGrid(_targetId, _behavior);
    this.changedContent();
  }

  modifyAppendAfterNewGrid(_targetId, _behavior) {
    this.subject.appendAfterNewGrid(_targetId, _behavior);
    this.changedContent();
  }

  modifySetNewGrid(_targetId, _behavior) {
    this.subject.setNewGrid(_targetId, _behavior);
    this.changedContent();
  }

  modifyClearGridElement(_targetId) {
    this.subject.clearElementNode(_targetId);
    this.changedContent();
  }

  modifyRemoveGridElement(_targetId) {
    this.subject.removeElementNode(_targetId);
    this.changedContent();
  }

  modifyGridElementProp(_targetId, _fieldName, _value) {
    this.subject.modiftyGridElementProp(_targetId, _fieldName, _value);
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

    this.changedContent();
    this.updateVisual();
  }

  //
  // modifyGeometryRect(_targetId, _rect, _screenMode) {
  //   console.log(_rect, 'rect');
  //   this.subject.modifyGeometryRect(_targetId, _rect, _screenMode);
  //   this.changedContent();
  //   this.updateVisual();
  // }
  //
  // modifyGridProperty(_targetId, _name, _value) {
  //   this.subject.modifyGridProperty(_targetId, _name, _value);
  //   this.changedContent();
  //   this.updateVisual();
  // }

  modifyAccessPoint(_accessPoint) {
    this.subject.accessPoint = _accessPoint;
    this.changedContent();
  }

  modifyAddFragmentParamSupply() {
    this.subject.addFragmentParamSupply();
    this.changedContent();
  }

  // 추후 수정
  modifyUpdatedParamSupply() {
    // MetaBoardScene내에서 객체내부를 직접 변경하므로 현재는 changedContent 만 알려준다.
    this.changedContent();
  }

  modifyElementProperty(_elementIdorElement, _propKey, _propValue) {
    let targetElementNode = null;

    if (typeof _elementIdorElement === 'string') {
      targetElementNode = this.subject.rootGridElement.findById(_elementIdorElement);
    } else {
      targetElementNode = _elementIdorElement;
    }

    switch (_propKey) {
      case "Name":
        targetElementNode.setName(_propValue);

        break;
      case "Comment":
        targetElementNode.setComment(_propValue);

        break;
      case "tagName":
        targetElementNode.setTagName(_propValue);
        break;
      default:
        console.error("No matched property key");
    }

    this.changedContent();
  }

  modifyElementAttribute(_elementIdorElement, _attrKey, _attrValue) {
    let targetElementNode = null;

    if (typeof _elementIdorElement === 'string') {
      targetElementNode = this.subject.rootGridElement.findById(_elementIdorElement);
    } else {
      targetElementNode = _elementIdorElement;
    }

    let treeRefresh = false;

    switch (_attrKey) {
      case "class":
        targetElementNode.setAttribute("class", _attrValue);
        break;
      case "id":
        targetElementNode.setAttribute("id", _attrValue);
        break;
      default:
        targetElementNode.setAttribute(_attrKey, _attrValue);
    }

    this.changedContent();
  }

  getRootGridElement() {
    return this.subject.rootGridElement;
  }


  setScreenSizing(_sizing) {

    this.screenSizing = _sizing;
    this.subject.screenMode = _sizing;
  }

  getScreenSizing() {
    return this.screenSizing;
  }

  setScreenSize(_width, _height) {
    this._screenSize = {
      width: _width,
      height: _height
    };

    this.subject.screenSize = this._screenSize;

    console.log(this._screenSize, '---------------size');
  }

  getScreenSize() {
    return this._screenSize;
  }






};




export default PageContextController;