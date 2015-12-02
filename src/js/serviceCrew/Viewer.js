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
    //this._window.location.search = window.location.search;
    console.log(window.location.search);
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
    let self = this;

    this.page.prepareParams(function() {
      self.window.document.body.innerHTML = '';

      self.page.screenSize = _screenSize;

      self.page.setHTMLDocument(self.window.document);
      self.page.rootGridElement.realize();
      self.page.rootGridElement.linkHierarchyRealizaion();
      self.window.document.body.style.margin = 0;
      self.window.document.body.appendChild(self.page.rootGridElement.realization);
    });


  }
}

export default Viewer;