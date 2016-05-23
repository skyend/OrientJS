import SuperAgent from 'superagent';

// import JqueryForm from 'jquery-form';
// import JqueryTransportXDR from 'jquery-transport-xdr';

/*
IE9 전용 // 싱크로 동작함

//Orient.HTTPRequest.requestSync('get',  "http://52.79.106.100:38080/api/cms/category/singleDepth.json?site_id=joykolon&ctgry_gb=20&ctgry_level=A&up_ctgry_id=", {}, function(_r, _res){ console.log(_r,_res); } );

// 1. Create XDR object:
var xdr = new XDomainRequest();

// 2. Open connection with server using GET method:
xdr.open("get",  "http://52.79.106.100:38080/api/cms/category/singleDepth.json?site_id=joykolon&ctgry_gb=20&ctgry_level=A&up_ctgry_id=");

xdr.onload = function(_a,_b){ console.log('hh',arguments,_a,_b) };

// 3. Send string data to server:
xdr.send();

console.log('aa',xdr);

*/
class HTTPRequest {
  static Log(_message, _level = "log", _extras = []) {
    if (!window.DEBUG_OCCURS_HTTP_REQUEST_LOG) return;
    if (!(window.console && window.console.log && window.console.log.apply)) return;

    let logParams = ['%c' + _message, 'background: #333; color: rgb(229, 249, 78); padding:2px;'];

    switch (_level) {
      case "log":
        // groupCollapsed 는 IE11부터
        // (console.groupCollapsed || console.log).apply(console, logParams);
        // console.log.apply(console, _extras);
        // console.groupEnd && console.groupEnd();

        console.log.apply(console, logParams);
        console.log.apply(console, _extras);
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
    // let fieldKeys = Object.keys(_fields);
    //
    // let key, item;
    // for (let i = 0; i < fieldKeys.length; i++) {
    //   key = fieldKeys[i];
    //   item = _fields[key];
    //
    // }
    let url = _url;
    // if (!/^https?:\/\//.test(url)) {
    //   url = url.replace(/^\/?/, location.protocol + '//' + location.host + '/');
    // }


    if (_method === 'get') {
      SuperAgent.get(url)
        .query(_fields)
        .end(function(err, res) {
          HTTPRequest.Log(`XMLHttpRequest[GET] - Error: [${err}], URL: [${url}]\n`, 'log', [res]);

          if (err) {
            if (res) {
              _complete(err, res, res.statusCode);
            } else {
              _complete(err, null);
            }
          } else {
            _complete(null, res, res.statusCode);
          }
        });

    } else if (_method === 'post') {
      (_enctype === 'multipart/form-data' ? SuperAgent.post(url) : SuperAgent.post(url).type('form'))
      .send(_enctype === 'multipart/form-data' ? this.convertFieldsToFormData(_fields) : _fields)
        .end(function(err, res) {
          HTTPRequest.Log(`%c XMLHttpRequest[POST] - Error: ${err}, URL: ${url}\n`, "log", [res]);

          if (err) {
            if (res) {
              _complete(err, res, res.statusCode);
            } else {
              _complete(err, null);
            }
          } else {
            _complete(null, res, res.statusCode);
          }
        });
    } else {
      throw new Error(`지원하지 않는 HTTP메소드(${_method}) 입니다.`);
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
      formData.append(fieldKeys[i], _fields[fieldKeys[i]]);
    }

    return formData;
  }

  static requestSync(_method, _url, _data = {}, _complete, _enctype = 'application/x-www-form-urlencoded') {
    var self = this;

    var req, sendData, url = _url;

    // if (!/^https?:\/\//.test(url)) {
    //   url = url.replace(/^\/?/, location.protocol + '//' + location.host + '/');
    // }

    if (window.XMLHttpRequest) {
      req = new XMLHttpRequest();
    } else {
      req = new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (_method !== 'get') {
      throw new Error("동기 요청은 현재 GET Method 만을 지원합니다.");
    }

    if (_method === 'get') {
      let queryDataKeys = Object.keys(_data);
      let queries = queryDataKeys.map(function(_key) {
        return `${_key}=${_data[_key]}`;
      });


      if (url.lastIndexOf('?') !== -1) {
        url += `&${queries.join('&')}`;
      } else {
        url += `?${queries.join('&')}`;
      }
    }

    // 동기 방식 로딩
    req.open(_method, url, false);

    try {
      req.send(sendData);
      HTTPRequest.Log(`XMLHttpRequest[GET] - URL: [${url}]\n`, 'log', [req]);

      if (typeof _complete === 'function') {

        /* SuperAgent 의 Response 객체와 인터페이스를 동일하게 제공하기 위해 */
        req.statusType = Math.floor(req.status / 100);
        req.statusCode = req.status;
        req.text = req.responseText;
        try {
          req.body = JSON.parse(req.responseText);
        } catch (_e) {
          req.body = null;
        }

        _complete(null, req);
      } else {

        return req.responseText;
      }
    } catch (_e) {
      HTTPRequest.Log(`XMLHttpRequest[GET] - Error: [${_e}], URL: [${url}]\n`, 'log');

      if (typeof _complete === 'function') {
        _complete(_e, null);
      } else {
        return null;
      }
    }
  }


  static requestSync__(_method, _url, _data = {}, _complete, _enctype = 'application/x-www-form-urlencoded') {
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