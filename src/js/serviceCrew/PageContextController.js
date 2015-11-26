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
      this.page = new Page(this, _page);
    } else {
      this.page = new Page(this);
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

    console.log(this._screenSize);
  }

  getScreenSize() {
    return this._screenSize;
  }


};




export default PageContextController;