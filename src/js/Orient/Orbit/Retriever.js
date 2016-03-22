class Retriever {
  constructor(_orbit, _options, _extender) {
    this.orbit = _orbit;
    this.extender = _extender;

    this.dirpath_i18n = _options['relative-dir-i18n'];
    this.dirpath_apisource = _options['relative-dir-apisource'];
    this.dirpath_component = _options['relative-dir-component'];
  }


  loadFragment(_name, _complete) {
    request.get('./fragments/' + _name + '.html')
      .end(function(_err, _result) {
        // console.log(_err, _result);
        if (_err !== null) {
          console.warn(_err);
          _complete(null);
        } else {
          _complete(_result.text, _result.statusCode);
        }
      });
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