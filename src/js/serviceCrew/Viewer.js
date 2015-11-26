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
  }
}

export default Viewer;