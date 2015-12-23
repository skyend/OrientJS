"use strict";
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

  setPageTitle(_title) {
    let titleElement = this.window.document.querySelector('title');
    if (titleElement === null) {
      titleElement = this.window.document.createElement('title');
      this.window.document.head.appendChild(titleElement);
    }
    titleElement.innerHTML = _title;
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

  rendering(_screenSize, _blockClick) {
    let self = this;

    this.setPageTitle(this.page.displayTitle);

    // this.window.onunload = function(_e) {
    //   return self.pageUnload(_e);
    // }
    //
    //
    // this.window.addEventListener('beforeunload', function(event) {
    //   alert('I am the 1st one.');
    //   event.preventDefault();
    //   return false;
    // });
    //
    // this.window.addEventListener('unload', function(event) {
    //   alert('I am the 3rd one.');
    //   event.preventDefault();
    //   return false;
    // });
    //
    // function pageLoaded() {
    //   alert("load event handler called.");
    // }
    //
    // function pageUnloaded() {
    //   alert("unload event handler called.");
    // }
    //
    // this.window.addEventListener("load", pageLoaded, false);
    // this.window.addEventListener("unload", pageUnloaded, false);

    // this.window.onbeforeunload = function(_e) {
    //   console.log("On Before unload", _e);
    //   return false;
    // }

    console.log("A rendering");
    this.page.prepareParams(function() {
      console.log("B rendering");
      self.window.document.body.innerHTML = '';

      self.page.screenSize = _screenSize;
      self.page.screenMode = 'desktop';

      self.page.setHTMLDocument(self.window.document);
      self.page.rootGridElement.realize({
        clickBlock: _blockClick || false
      });
      self.page.rootGridElement.linkHierarchyRealizaion();
      self.window.document.body.style.margin = 0;
      self.window.document.body.appendChild(self.page.rootGridElement.realization);

      // if (_blockClick) {
      //   console.log("Block Click");
      //   let elements = self.window.document.body.querySelectorAll('*');
      //   console.log(elements);
      //   for (let i = 0; i < elements.length; i++) {
      //     elements[i].onclick = function(_e) {
      //       _e.preventDefault();
      //     };
      //   }
      // }

    });


  }


  pageUnload(_e) {
    alert("Move");
    _e.preventDefault();
    _e.stopPropagation();
    console.log(_e, 'page unload');
    return false;
  }
}

export default Viewer;