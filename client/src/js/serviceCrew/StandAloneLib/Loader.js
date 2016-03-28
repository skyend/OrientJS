import request from 'superagent';
import async from 'async';
import RequestToServer from '../../util/RequestToServer';

class ServiceResourceLoader {
  static loadConfig(_complete) {
    request.get('./config/config.json')
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

  static loadFragment(_name, _complete) {
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

  static loadSharedElementNode(_name, _complete) {
    request.get('./fragments/shared/' + _name + '.html')
      .end(function(_err, _result) {
        // console.log(_err, _result);
        //if (_err !== null) throw new Error('Fail load a shared [' + _name + ']');
        _complete(_result.text, _result.statusCode);
      });
  }

  static loadAPISource(_name, _complete) {
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

  static loadAPIFarmSource(_farmService, _class, _complete) {
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

  static loadI18NJSONSync(_lang) {

    let data = RequestToServer.sync(`./i18n/${_lang}.json`, 'get');

    try {
      return JSON.parse(data);
    } catch (e) {
      return undefined;
    }
  }

  static loadI18NJSON(_targetLangs, _complete) {
    async.eachSeries(_targetLangs, function(_next) {
      console.log(_targetLangs);
    }, function(_err) {

    });
  }
}

export default ServiceResourceLoader;