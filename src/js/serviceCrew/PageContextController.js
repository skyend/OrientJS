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
};




export default PageContextController;