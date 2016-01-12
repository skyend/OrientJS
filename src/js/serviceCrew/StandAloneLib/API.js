import ICEAPISource from '../ICEAPISource';
import Loader from './Loader';
import Gelato from './Gelato';

class API {
  constructor() {

  }

  request(_sourceId, _requestId, _fields, _complete) {

    if (arguments.length === 3) {
      this.requestArg3(_sourceId, _requestId, _complete);
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
    Loader.loadAPISource(_sourceId, function(_apiSource) {
      let iceHost = Gelato.one().page.iceHost;

      let apiSource = new ICEAPISource(_apiSource);
      apiSource.setHost(iceHost);

      _complete(apiSource);
    });
  }
}

export default API;