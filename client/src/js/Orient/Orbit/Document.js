// import async from 'async';
import ObjectExtends from '../../util/ObjectExtends';
import async from 'async';

const ERROR_LOAD_SCRIPT = new Error("Error : fail load script.");


class OrbitDocument {
  constructor(_window, _orbit) {
    this.orbit = _orbit;
    this.window = _window;
    this.extraLoadedScripts = [];
  }


  get window() {
    return this._window;
  }

  set window(_window) {
    this._window = _window;
  }

  get document() {
    return this._window.document;
  }

  get head() {
    return this.document.head;
  }

  get headScriptElements() {
    return this.document.head.getElementsByTagName('script');
  }

  loadExtraScript(_src, _callback) {
    this.loadReferencingElement('js', _src, _callback);
  }

  loadExtraCSS(_href, _callback) {
    this.loadReferencingElement('css', _href, _callback);
  }

  loadReferencingElement(_type, _url, _callback) {

    let extraElement;
    if (_type === 'js') {
      extraElement = this.document.createElement('script');

      extraElement.setAttribute('src', this.orbit.interpret(_url));
      extraElement.setAttribute('type', 'text/Javascript');
    } else if (_type === 'css') {
      extraElement = this.document.createElement('link');

      extraElement.setAttribute('href', this.orbit.interpret(_url));
      extraElement.setAttribute('type', 'text/css');
      extraElement.setAttribute('rel', 'stylesheet');
    } else if (_type === 'favicon') {
      extraElement = this.document.createElement('link');

      extraElement.setAttribute('href', this.orbit.interpret(_url));
      extraElement.setAttribute('rel', 'shortcut icon');
    }



    extraElement.onerror = function(_event) {
      if (typeof _callback !== 'function') return;

      _callback(ERROR_LOAD_SCRIPT);
    };
    extraElement.onload = function(_event) {
      if (typeof _callback !== 'function') return;

      _callback(null);
    };

    this.head.appendChild(extraElement);
  }

  loadExtraJSSerial(_srcList, _callback) {
    this.loadReferencingElementSerial('js', _srcList, _callback);
  }

  loadExtraCSSSerial(_hrefList, _callback) {
    this.loadReferencingElementSerial('css', _hrefList, _callback);
  }

  loadReferencingElementSerial(_type, _urlList, _callback) {
    let series = ObjectExtends.clone(_urlList);

    let that = this;
    let activeSrcList = [];
    let unloadedSrcList = [];

    async.eachSeries(series, function(_url, _callback) {
      that.loadReferencingElement(_type, _url, function(_err) {
        if (_err) {
          unloadedSrcList.push(_url);
        } else {
          activeSrcList.push(_url);
        }

        _callback();
      });
    }, function() {
      if (typeof _callback !== 'function') return;

      if (unloadedSrcList.length === 0) {
        _callback(null);
      } else {
        _callback(unloadedSrcList);
      }
    });
  }

  loadExtraJSPararllel(_srcList, _callback) {
    this.loadReferencingElementParallel('js', _srcList, _callback);
  }

  loadExtraCSSPararllel(_hrefList, _callback) {
    this.loadReferencingElementParallel('css', _hrefList, _callback);
  }

  loadReferencingElementParallel(_type, _urlList, _callback) {
    let series = ObjectExtends.clone(_urlList);

    let that = this;
    let activeSrcList = [];
    let unloadedSrcList = [];

    async.parallel(series.map(function(_url) {
      return function(_callback) {
        that.loadReferencingElement(_type, _url, function(_err) {
          if (_err) {
            unloadedSrcList.push(_url);
          } else {
            activeSrcList.push(_url);
          }

          _callback();
        });
      };
    }), function(_err, _result) {
      if (typeof _callback !== 'function') return;

      if (unloadedSrcList.length === 0) {
        _callback(null);
      } else {
        _callback(unloadedSrcList);
      }
    });
  }


  // Title
  get titleElement() {
    return this.document.head.getElementsByTagName('title')[0];
  }

  get title() {
    return this.titleElement.innerHTML;
  }

  set title(_title) {
    let titleElement = this.titleElement;
    if (!titleElement) {

      titleElement = this.document.createElement('title');
      this.head.appendChild(titleElement);
    }

    titleElement.innerHTML = _title;
  }
}

export default OrbitDocument;