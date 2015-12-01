class Viewer {
  constructor(_serviceManager) {
    this.serviceManager = _serviceManager;
  }

  get page() {
    return this._page;
  }

  get window() {
    return this._window;
  }

  set page(_page) {
    this._page = _page;
    this._page.fragmentContext = this;
  }

  set window(_window) {
    this._window = _window;
  }

  getWindow() {
    return this.window;
  }

  getDocument() {
    return this.window.document;
  }

  applyStyleElement(_styleElement) {
    console.log('applyStyleElement');
    console.log(_styleElement);

    this.window.document.head.appendChild(_styleElement);
  }

  applyScriptElement(_scriptElement) {
    console.log('applyScriptElement');
    console.log(_scriptElement);
    this.window.document.head.appendChild(_scriptElement);
  }

  attach(_window) {
    this.window = _window;
    //this.window.document.body.innerHTML = "Hello";
  }

  rendering(_screenSize) {
    this.window.document.body.innerHTML = '';

    this.page.screenSize = _screenSize;

    this.page.setHTMLDocument(this.window.document);
    this.page.rootGridElement.realize();
    this.page.rootGridElement.linkHierarchyRealizaion();
    this.window.document.body.style.margin = 0;
    this.window.document.body.appendChild(this.page.rootGridElement.realization);
  }
}

export default Viewer;