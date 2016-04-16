import SuperAgent from 'superagent';

class HTTPRequest {
  static Log(_message, _level = "log", _extras = []) {
    if (!window.DEBUG_OCCURS_HTTP_REQUEST_LOG) return;

    let logParams = ['%c' + _message, 'background: #333; color: rgb(229, 249, 78); padding:2px;'];

    switch (_level) {
      case "log":
        // groupCollapsed 는 IE11부터
        (console.groupCollapsed || console.log).apply(console, logParams);
        console.log.apply(console, _extras);
        console.groupEnd && console.groupEnd();
        break;
      case "info":
        console.info.apply(console, logParams);
        break;
      case "warn":
        console.warn.apply(console, logParams);
        break;
      case "error":
        console.error.apply(console, logParams);
        break;
    }
  }

  static request(_method, _url, _fields = {}, _complete, _enctype = 'application/x-www-form-urlencoded') {
    if (_method === 'get') {
      SuperAgent.get(_url)
        .query(_fields)
        .end(function(err, res) {
          HTTPRequest.Log(`XMLHttpRequest[GET] - Error: [${err}], URL: [${_url}]\n`, 'log', [res]);

          _complete(err || null, res || null);
        });

    } else if (_method === 'post') {
      SuperAgent.post(_url)
        .type('form')
        .send(_enctype === 'multipart/form-data' ? this.convertFieldsToFormData(_fields) : _fields)
        .end(function(err, res) {
          HTTPRequest.Log(`%c XMLHttpRequest[POST] - Error: ${err}, URL: ${_url}\n`, "log", [res]);

          _complete(err || null, res || null);
        });
    }
  }

  // IE10+
  static convertFieldsToFormData(_fields) {
    if (_fields instanceof FormData) {
      HTTPRequest.Log("FormData 를 FormData로 변환하려 합니다. 이 변환시도는 무시되며 그대로 FormData를 사용합니다.", 'warn');
      return _fields;
    }

    let formData = new FormData();
    let fieldKeys = Object.keys(_fields);

    for (let i = 0; i < fieldKeys.length; i++) {
      formData.append(_key, _fields[fieldKeys[i]]);
    }

    return formData;
  }

  static requestSync(_method, _url, _data) {
    var self = this;

    var req;
    if (window.XMLHttpRequest) {
      req = new XMLHttpRequest();
    } else {
      req = new ActiveXObject("Microsoft.XMLHTTP");
    }

    // 동기 방식 로딩
    req.open(_method, _url, false);
    req.send();

    if (req.status == 200) {
      return req.responseText;
    } else {

      return undefined;
    }
  }


  static requestSync__(_method, _url, _data, _complete, _enctype = 'application/x-www-form-urlencoded') {
    var self = this;

    var req;
    if (window.XMLHttpRequest) {
      req = new XMLHttpRequest();
    } else {
      req = new ActiveXObject("Microsoft.XMLHTTP");
    }

    // 동기 방식 로딩
    req.open(_method, _url, false);
    if (_method !== 'get') {
      req.setRequestHeader("Content-type", _enctype);
      req.send();
    } else {
      req.send();
    }

    console.log(req);
    let statusType = Math.floor(req.status / 100);

    // 1xx, 2xx, 3xx
    if (statusType < 4) {

      if (typeof _complete === 'function') {
        _complete(err || null, res || null);
      } else {
        return req.responseText;
      }
    } else {
      // 4xx, 5xx


      if (typeof _complete === 'function') {
        _complete({
          status: req.status,
          statusCode: req.status,
          statusType: statusType,
          text: req.responseText,
          type: type
        }, null);
      } else {
        return req.responseText;
      }

      return undefined;
    }
  }

}

export default HTTPRequest;