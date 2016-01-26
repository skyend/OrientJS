import Gelato from './Gelato';

class GelatoDocument {
  constructor(_document) {
    this.document = _document;
  }

  appendStyleLink(_url, _loaded) {
    let styleElement = this.document.createElement("link");
    styleElement.setAttribute('rel', 'stylesheet');
    styleElement.setAttribute('type', 'text/css');
    styleElement.setAttribute('href', _url);

    if (typeof _loaded === 'function') {
      styleElement.onload = _loaded;
    }

    this.document.head.appendChild(styleElement);
  }

  appendScriptLink(_url, _loaded) {
    let scriptElement = this.document.createElement("script");
    scriptElement.setAttribute('rel', 'javascript');
    scriptElement.setAttribute('type', 'text/javascript');
    scriptElement.setAttribute('src', _url);

    if (typeof _loaded === 'function') {
      scriptElement.onload = _loaded;
    }

    this.document.head.appendChild(scriptElement);
  }

  exploreBody(_exploreFunc) {
    this.exploreElement(this.document.body, _exploreFunc);
  }

  exploreElement(_startElement, _exploreFunc) {
    recv(_startElement);

    function recv(_element) {
      if (_exploreFunc(_element) === null) return; // null 이 반환되면 자식탐색을 중단한다.

      for (let i = 0; i < _element.children.length; i++) {
        recv(_element.children[i]);
      }
    }
  }
}

export default GelatoDocument;