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
  }

  set window(_window) {
    this._window = _window;
  }



  initialize(_page) {
    this.page = _page;
  }

  attach(_window) {
    this.window = _window;
    //this.window.document.body.innerHTML = "Hello";
    this.page.screenSize = {
      width: this.window.innerWidth,
      height: this.window.innerHeight
    };

    this.page.setHTMLDocument(this.window.document);
    this.page.rootGridElement.realize();
    this.page.rootGridElement.linkHierarchyRealizaion();

    this.window.document.body.appendChild(this.page.rootGridElement.realization);
  }
}

export default Viewer;