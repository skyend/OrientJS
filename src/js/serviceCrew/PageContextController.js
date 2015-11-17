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

  attach(_context, _superDOMElement) {
    this.attached = true;
    this.context = _context;
    this.unsaved = false;
    this._superDOMElement = _superDOMElement;
    this.screenSizing = 'desktop';
    /* processing */

    this._superDOMElement.setAttribute('draggable', true);
    console.log(this._superDOMElement);

  }

  pause() {

  }

  resume() {

  }

  save() {
    let self = this;
    let pageJSON = this.page.export();

    this.serviceManager.saveDocument(this.page.getID(), pageJSON, function(_result) {
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


  setScreenSizing(_sizing) {

    this.screenSizing = _sizing;
  }

  getScreenSizing() {
    return this.screenSizing;
  }
};




export default PageContextController;