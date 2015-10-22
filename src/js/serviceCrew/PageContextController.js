class PageContextController {
  constructor(_page, _session, _serviceManager) {
    this._superDOMElement;
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
    this.unsaved = false;
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