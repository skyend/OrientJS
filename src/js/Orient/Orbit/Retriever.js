class Retriever {
  constructor(_orbit, _options, _extender) {
    this.orbit = _orbit;
    this.extender = _extender;

    this.dirpath_i18n = _options['relative-dir-i18n'];
    this.dirpath_apisource = _options['relative-dir-apisource'];
    this.dirpath_component = _options['relative-dir-component'];
  }



  loadAPISource(_name, _complete) {
    // console.log(_name, 'load APISource');
    request.get('./apisources/' + _name + '.json')
      .end(function(_err, _result) {
        // console.log(_err, _result);
        if (_err !== null) {
          console.warn(_err);
          _complete(null);
        } else {
          _complete(_result.body, _result.statusCode);
        }
      });
  }

  loadAPIFarmSource(_farmService, _class, _complete) {
    // console.log(_name, 'load APISource');
    request.get(`./apisources/farm/${_farmService}/${_class}.json`)
      .end(function(_err, _result) {
        console.log(_err, _result);
        if (_err !== null) {
          console.warn(_err);
          _complete(null);
        } else {
          _complete(_result.body, _result.statusCode);
        }
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

  _loadComponentSheet(_loadTarget, _cb) {
    let url;

    // 상대경로인가 절대경로인가 판단
    if (/^\//.test(_loadTarget)) {
      url = _loadTarget;
    } else {
      // 상대경로
      url = this.dirpath_component + _loadTarget;
    }

    // 절대경로
    this.orbit.HTTPRequest.request('get', url, {}, function(_err, _res) {
      if (_err !== null) throw new Error("fail static component loading");

      let responseText = _res.text;
      _cb(responseText);
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
      return undefined;
    }
  }
}

export default Retriever;