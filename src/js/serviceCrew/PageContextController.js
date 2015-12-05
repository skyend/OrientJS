import Page from './Page.js';

class PageContextController {
  constructor(_page, _session, _serviceManager) {
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
      this.page = new Page(this, _page, _serviceManager);
    } else {
      this.page = new Page(this, undefined, _serviceManager);
    }
  }



  setContext(_context) {
    this.context = _context;
  }

  pause() {

  }

  resume() {

  }

  save() {
    let self = this;
    let pageJSON = this.page.export();

    this.serviceManager.savePage(this.page.id, pageJSON, function(_result) {
      self.unsaved = false;
      self.context.feedSaveStateChange();
    });
  }

  changedContent() {
    if (this.unsaved) return;
    this.unsaved = true;
    this.context.feedSaveStateChange();
  }

  updateVisual() {
    this.context.forceUpdate();
  }

  modifyCreateRootGrid() {
    this.page.createRootGridElement();

    this.changedContent();
  }

  modifyAppendNewGrid(_targetId, _behavior) {
    this.page.appendNewGrid(_targetId, _behavior);
    this.changedContent();
  }

  modifyAppendBeforeNewGrid(_targetId, _behavior) {
    this.page.appendBeforeNewGrid(_targetId, _behavior);
    this.changedContent();
  }

  modifyAppendAfterNewGrid(_targetId, _behavior) {
    this.page.appendAfterNewGrid(_targetId, _behavior);
    this.changedContent();
  }

  modifySetNewGrid(_targetId, _behavior) {
    this.page.setNewGrid(_targetId, _behavior);
    this.changedContent();
  }

  modifyClearGridElement(_targetId) {
    this.page.clearElementNode(_targetId);
    this.changedContent();
  }

  modifyRemoveGridElement(_targetId) {
    this.page.removeElementNode(_targetId);
    this.changedContent();
  }

  modifyGridElementProp(_targetId, _fieldName, _value) {
    this.page.modiftyGridElementProp(_targetId, _fieldName, _value);
    this.changedContent();
  }

  modifyGridRect(_targetId, _rect) {
    console.log(_rect, 'rect');
    this.page.modifyGridRect(_targetId, _rect);
    this.changedContent();
    this.updateVisual();
  }

  modifyGridProperty(_targetId, _name, _value) {
    this.page.modifyGridProperty(_targetId, _name, _value);
    this.changedContent();
    this.updateVisual();
  }

  modifyAccessPoint(_accessPoint) {
    this.page.accessPoint = _accessPoint;
    this.changedContent();
  }

  modifyAddFragmentParamSupply() {
    this.page.addFragmentParamSupply();
    this.changedContent();
  }

  // 추후 수정
  modifyUpdatedParamSupply() {
    // MetaBoardScene내에서 객체내부를 직접 변경하므로 현재는 changedContent 만 알려준다.
    this.changedContent();
  }

  modifyElementProperty(_elementIdorElement, _propKey, _propValue) {
    let targetElementNode = null;

    if (typeof _elementIdorElement === 'number') {
      targetElementNode = this.page.rootGridElement.findById(_elementIdorElement);
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

    if (typeof _elementIdorElement === 'number') {
      targetElementNode = this.page.rootGridElement.findById(_elementIdorElement);
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
    return this.page.rootGridElement;
  }

  get isUnsaved() {
    return this.unsaved;
  }


  setScreenSizing(_sizing) {

    this.screenSizing = _sizing;
  }

  getScreenSizing() {
    return this.screenSizing;
  }

  setScreenSize(_width, _height) {
    this._screenSize = {
      width: _width,
      height: _height
    };

    this.page.screenSize = this._screenSize;

    console.log(this._screenSize, '---------------size');
  }

  getScreenSize() {
    return this._screenSize;
  }






};




export default PageContextController;