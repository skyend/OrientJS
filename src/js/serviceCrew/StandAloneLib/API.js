import ICEAPISource from '../ICEAPISource';
import APIFarmSource from '../APIFarmSource';
import Loader from './Loader';
import Gelato from './Gelato';

class API {
  constructor() {

  }

  request(_sourceId, _requestId, _fields, _complete) {

    if (arguments.length === 3) {
      this.requestArg3(_sourceId, _requestId, _fields);
    } else if (arguments.length === 4) {
      this.requestArg4(_sourceId, _requestId, _fields, _complete);
    }
  }

  requestArg3(_sourceId, _requestId, _complete) {
    this.getAPISource(_sourceId, function(_apiSource) {
      _apiSource.executeRequest(_requestId, {}, {}, function(_result) {
        _complete(_result);
      });
    });
  }

  requestArg4(_sourceId, _requestId, _fields, _complete) {
    this.getAPISource(_sourceId, function(_apiSource) {
      _apiSource.executeRequest(_requestId, _fields, {}, function(_result) {
        _complete(_result);
      });
    });
  }

  getAPISource(_sourceId, _complete) {
    if (/^farm/.test(_sourceId)) {
      let spliter = _sourceId.split('/')
      Loader.loadAPIFarmSource(spliter[1], spliter[2], function(_apiSource) {
        let iceHost = Gelato.one().page.apiFarmHost;

        let apiSource = new APIFarmSource(_apiSource);
        apiSource.setHost(iceHost);

        _complete(apiSource);
      });
    } else {
      Loader.loadAPISource(_sourceId, function(_apiSource) {
        let iceHost = Gelato.one().page.iceHost;

        let apiSource = new ICEAPISource(_apiSource);
        apiSource.setHost(iceHost);

        _complete(apiSource);
      });
    }
  }
}

export default API;