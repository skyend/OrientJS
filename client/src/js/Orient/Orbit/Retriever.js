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

    this.orbit.HTTPRequest.request('get', url, {}, function(_err, _res) {
      if (_err !== null) return console.error(`Error : Fail api source sheet loading. <detail:${_err}> <filepath:${url}>`);

      let responseText = _res.text;
      _cb(responseText, url);
    });
  }

  // 메서드 반환
  get loadComponentSheet() {
    if (this._extender) {
      if (this._extender.loadComponentSheet) {
        return this._extender.loadComponentSheet;
      }
    }

    return this._loadComponentSheet;
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
      if (_err !== null) throw new Error("fail static component sheet loading <" + _err + ">");
      let responseText = _res.text;
      this.caches.component[_loadTarget] = responseText;
      _cb(responseText);
    });
  }

  _loadComponentSheetSync(_loadTarget, _cb) {

    try {
      let result = this.orbit.HTTPRequest.requestSync('get', this._getComponentURL(_loadTarget));

      this.caches.component[_loadTarget] = responseText;
    } catch (_e) {
      throw new Error("fail static component sheet loading <" + _e + ">");
    }
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