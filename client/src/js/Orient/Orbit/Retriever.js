import BrowserStorage from '../../util/BrowserStorage';

class Retriever {
  constructor(_orbit, _options, _extender) {
    this.orbit = _orbit;
    this.extender = _extender;

    this.dirpath_i18n = _options['relative-dir-i18n'];
    this.dirpath_apisource = _options['relative-dir-apisource'];
    this.dirpath_component = _options['relative-dir-component'];

    this.caches = {
      i18n: {},
      apisource: {},
      component: {}
    };
  }

  get loadAPISource() {
    if (this._extender) {
      if (this._extender.loadAPISource) {
        return this._extender.loadAPISource;
      }
    }

    return this._loadAPISource;
  }

  get loadAPISourceSync() {
    if (this._extender) {
      if (this._extender.loadAPISourceSync) {
        return this._extender.loadAPISourceSync;
      }
    }

    return this._loadAPISourceSync;
  }


  _loadAPISource(_loadTarget, _cb) {

    // 상대경로인가 절대경로인가 판단
    let url;
    if (/^\//.test(_loadTarget)) {
      url = _loadTarget;
    } else if (/^https?:\/\//.test(_loadTarget)) {
      // URL
      url = _loadTarget;
    } else {
      // 상대경로
      url = this.dirpath_apisource + _loadTarget;
    }

    if (this.caches.apisource[_loadTarget] !== undefined) {
      _cb(this.caches.apisource[_loadTarget], url);
      return;
    }

    // Browser LocalStorage Caching
    if (window.ORBIT_APISOURCE_CACHING) {
      let cachedSourceData = BrowserStorage.getLocal('as_' + _loadTarget);
      if (cachedSourceData) {
        _cb(cachedSourceData, url);
        return;
      }
    }

    this.orbit.HTTPRequest.request('get', url, {}, (_err, _res) => {
      if (_err !== null) return console.error(`Error : Fail api source sheet loading. <detail:${_err}> <filepath:${url}>`);

      let responseText = _res.text;

      if (window.ORBIT_APISOURCE_CACHING) {
        BrowserStorage.setLocal('as_' + _loadTarget, responseText);
      }

      // caching
      this.caches.apisource[_loadTarget] = responseText;
      _cb(this.caches.apisource[_loadTarget], url);
    });
  }

  _loadAPISourceSync(_loadTarget, _cb) {


    // 상대경로인가 절대경로인가 판단
    let url;
    if (/^\//.test(_loadTarget)) {
      url = _loadTarget;
    } else if (/^https?:\/\//.test(_loadTarget)) {
      // URL
      url = _loadTarget;
    } else {
      // 상대경로
      url = this.dirpath_apisource + _loadTarget;
    }

    if (this.caches.apisource[_loadTarget] !== undefined) {
      _cb(this.caches.apisource[_loadTarget], url);
      return;
    }


    // Browser LocalStorage Caching
    if (window.ORBIT_APISOURCE_CACHING) {
      let cachedSourceData = BrowserStorage.getLocal('as_' + _loadTarget);
      if (cachedSourceData) {
        _cb(cachedSourceData, url);
        return;
      }
    }

    this.orbit.HTTPRequest.requestSync('get', url, {}, (_err, _res) => {
      if (_err !== null) return console.error(`Error : Fail api source sheet loading. <detail:${_err}> <filepath:${url}>`);

      let responseText = _res.text;

      // caching
      this.caches.apisource[_loadTarget] = responseText;

      if (window.ORBIT_APISOURCE_CACHING) {
        BrowserStorage.setLocal('as_' + _loadTarget, responseText);
      }

      _cb(this.caches.apisource[_loadTarget], url);
    });
  }

  // 메서드 반환
  get loadComponentSheet() {
    if (this._extender) {
      if (this._extender.loadComponentSheet) {
        return this._extender.loadComponentSheet;
      }
    }

    return this._loadComponentSheet.bind(this);
  }

  get loadComponentSheetSync() {
    if (this._extender) {
      if (this._extender.loadComponentSheetSync) {
        return this._extender.loadComponentSheetSync;
      }
    }

    return this._loadComponentSheetSync.bind(this);
  }

  _getComponentURL(_loadTarget) {
    let url;

    // 상대경로인가 절대경로인가 판단
    if (/^\//.test(_loadTarget)) {
      url = _loadTarget;
    } else if (/^https?:\/\//.test(_loadTarget)) {
      // URL
      url = _loadTarget;
    } else {
      // 상대경로
      url = this.dirpath_component + _loadTarget;
    }

    return url;
  }

  _loadComponentSheet(_loadTarget, _cb) {
    if (this.caches.component[_loadTarget] !== undefined) {
      _cb(this.caches.component[_loadTarget]);
      return;
    }

    this.orbit.HTTPRequest.request('get', this._getComponentURL(_loadTarget), {}, (_err, _res) => {
      if (_err !== null) return console.error("Fail static component sheet loading <" + _err + ">");
      let responseText = _res.text;

      // caching
      this.caches.component[_loadTarget] = responseText;

      _cb(this.caches.component[_loadTarget]);
    });
  }

  _loadComponentSheetSync(_loadTarget, _cb) {
    if (this.caches.component[_loadTarget] !== undefined) {
      _cb(this.caches.component[_loadTarget]);
      return;
    }

    console.log("Load Component", _loadTarget, this.caches.component[_loadTarget]);

    let result = this.orbit.HTTPRequest.requestSync('get', this._getComponentURL(_loadTarget), {}, (_err, _res) => {
      if (_err !== null) return console.error("fail static component sheet loading <" + _err + ">");
      if (_res.statusType === 2 || _res.statusType === 3) {
        let responseText = _res.text;

        // caching
        this.caches.component[_loadTarget] = responseText;

        _cb(this.caches.component[_loadTarget]);
      } else {
        _cb(null);
      }
    });
  }

  // 메서드 반환
  get loadI18NJSONSync() {
    if (this._extender) {
      if (this._extender.loadI18NJSONSync) {
        return this._extender.loadI18NJSONSync;
      }
    }

    return this._loadI18NJSONSync;
  }

  _loadI18NJSONSync(_lang) {

    let data = this.orbit.HTTPRequest.requestSync('get', `${this.dirpath_i18n}${_lang}.json`);

    try {
      return JSON.parse(data);
    } catch (e) {
      // undefined를 반환한다.
      // i18n처리에서 undefined를 반환받으면 다음 후보 i18n 언어셋을 로딩하도록 되어 있기 때문이다.
      return undefined;
    }
  }
}

export default Retriever;