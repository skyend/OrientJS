// import async from 'async';
import ObjectExtends from '../../util/ObjectExtends';
import ArrayHandler from '../../util/ArrayHandler';

import async from 'async';

const ERROR_LOAD_SCRIPT = new Error("Error : fail load script.");


class OrbitDocument {
  constructor(_window, _orbit) {
    this.orbit = _orbit;
    this.window = _window;


    this.requestedResources = [];
    this.responsedResources = [];
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
    let type = _type;
    let extraElement;
    let interpretedUrl = this.orbit.interpret(_url);

    // 결과가 null 이면 무시한다.
    if (interpretedUrl === null) {
      return _callback(null, null);
    }

    if (!type) {
      if (/\.js(\?[^\.]*)?$/i.test(interpretedUrl)) {
        type = 'js';
      } else if (/\.css(\?[^\.]*)?$/i.test(interpretedUrl)) {
        type = 'css';
      } else {
        throw new Error("알 수 없는 type 입니다.");
      }
    }

    /**
      중복 체크
    */

    // 응답리스트에 존재 하는지 체크 후 존재한다면 바로 _callback 실행 후 메서드 종료
    let foundCompleteIndex = ArrayHandler.findIndex(this.responsedResources, (_obj) => {
      return _obj.url === interpretedUrl;
    });

    if (foundCompleteIndex > -1) {
      if (typeof _callback === 'function') return _callback(null);
    }


    // 요청리스트에 존재 하는지 체크 후 존재한다면 extraElement만 가져와 입력 후 아래에서 이벤트를 추가하도록 유도
    let foundrequestedRIndex = ArrayHandler.findIndex(this.requestedResources, (_obj) => {
      return _obj.url === interpretedUrl;
    });

    if (foundrequestedRIndex > -1) {
      extraElement = this.requestedResources[foundrequestedRIndex].element;
    }

    if (!extraElement) {
      if (type === 'js') {
        extraElement = this.document.createElement('script');

        extraElement.setAttribute('src', interpretedUrl);
        extraElement.setAttribute('type', 'text/Javascript');
      } else if (type === 'css') {
        extraElement = this.document.createElement('link');

        extraElement.setAttribute('href', interpretedUrl);
        extraElement.setAttribute('type', 'text/css');
        extraElement.setAttribute('rel', 'stylesheet');
      } else if (type === 'favicon') {
        extraElement = this.document.createElement('link');

        extraElement.setAttribute('href', interpretedUrl);
        extraElement.setAttribute('rel', 'shortcut icon');
      } else {
        throw new Error(`${type} is not support referencing element type.`);
      }
    }

    var failCallback = (_event) => {
      extraElement.removeEventListener('load', completeCallback);
      extraElement.removeEventListener('error', failCallback);

      // 요청된 리소스 리스트에 입력된 상태가 아니었을 때 응답 항목으로 추가한다.
      if (foundrequestedRIndex === -1) {
        this.responsedResources.push({
          url: interpretedUrl,
          element: extraElement,
          error: _event
        });
      }

      if (typeof _callback === 'function') _callback(ERROR_LOAD_SCRIPT, null);
    };

    var completeCallback = (_event) => {
      extraElement.removeEventListener('load', completeCallback);
      extraElement.removeEventListener('error', failCallback);

      // 요청된 리소스 리스트에 입력된 상태가 아니었을 때 응답 항목으로 추가한다.
      if (foundrequestedRIndex === -1) {
        this.responsedResources.push({
          url: interpretedUrl,
          element: extraElement
        });
      }


      if (typeof _callback === 'function') _callback(null, _event);
    };

    extraElement.addEventListener('error', failCallback);

    extraElement.addEventListener('load', completeCallback);





    // 요청된 리소스 리스트에 입력
    this.requestedResources.push({
      url: interpretedUrl,
      element: extraElement
    });


    // 요청된 리소스가 아닐 경우에만 추가
    if (foundrequestedRIndex === -1) {
      this.head.appendChild(extraElement);
    }
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
