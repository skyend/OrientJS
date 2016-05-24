import SuperAgent from 'superagent';
import browser from 'detect-browser';
import Classer from '../../util/Classer';


const B_NAME = browser.name;
const B_VER = parseInt(browser.version);
console.log(B_NAME, '--', B_VER);

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



if(window.XDomainRequest){
  var xdr = new XDomainRequest();

  xdr.open("get", "http://example.com/api/method");

  xdr.onprogress = function () {
    //Progress
  };

  xdr.ontimeout = function () {
    //Timeout
  };

  xdr.onerror = function () {
    //Error Occured
  };

  xdr.onload = function() {
    //success(xdr.responseText);
  }

  setTimeout(function () {
    xdr.send();
  }, 0);
}



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



  static request(_method, _url, _fields = {}, _complete, _enctype = 'application/x-www-form-urlencoded', _async = true) {
    let method = _method.toLowerCase();
    let is_multipart_post = false;
    let isSameOrigin = true; // 타 도메인 감지
    let url = _url;


    // multipart post 체크와 메소드 체크
    if (method === 'post') {
      if (enctype === 'multipart/form-data') {
        is_multipart_post = true;
      }
    } else if (method === 'get') {
      //
    } else {
      throw new Error(`지원하지 않는 HTTP메소드(${_method}) 입니다.`);
    }

    // URL 구성
    // 프로토콜이 생략되어 있는 URL이면 프로토콜과 호스트를 앞에 붙여 절대 URL로 완성한다.
    if (!/^https?:\/\//.test(url)) {
      url = url.replace(/^\/?/, location.protocol + '//' + location.host + '/');
    }

    // 크로스 도메인확인
    // URL이 현재 protocol 과 host 가 일치하는지 확인한다.
    if ((new RegExp('^' + location.protocol + '//' + location.host + '/')).test(url)) {
      isSameOrigin = true;
    } else {
      isSameOrigin = false;
    }

    // console.log('a', is_multipart_post);

    // Multipart Post
    if (is_multipart_post) {

      // post 이고 multipart/form-data의 경우
      if (B_NAME === 'ie' && B_VER <= 9) {

        /*
        ██ ███████  █████      ███    ███ ██    ██ ██   ████████ ██ ██████   █████  ██████  ████████
        ██ ██      ██   ██     ████  ████ ██    ██ ██      ██    ██ ██   ██ ██   ██ ██   ██    ██
        ██ █████    ██████     ██ ████ ██ ██    ██ ██      ██    ██ ██████  ███████ ██████     ██
        ██ ██           ██     ██  ██  ██ ██    ██ ██      ██    ██ ██      ██   ██ ██   ██    ██
        ██ ███████  █████      ██      ██  ██████  ███████ ██    ██ ██      ██   ██ ██   ██    ██
        */




        return HTTPRequest.requestMultipartPostIE9below(_url, _fields, _complete, _async);
      }

      let Request;
      if (B_NAME === 'ie' && B_VER === 10) {
        if (isSameOrigin) {
          Request = XMLHttpRequest;
        } else {
          Request = XDomainRequest;
        }
      } else {
        Request = XMLHttpRequest;
      }

      // FormData
      let req = new Request();

      let formData = HTTPRequest.convertFieldsToFormData(_fields);
      if (req.setRequestHeader)
        req.setRequestHeader("Content-type", _enctype);

      // OPEN
      req.open(method, url, _async);

      req.onload = function(_e) {

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
      };

      req.onerror = function(_e) {
        // console.log('onerror', _e);
        throw new Error(`Request Error by ${Request}`);
        // _complete(new Error(`Request Error by ${Request}`), null);
      };

      req.send(formData);
    } else if (_enctype === 'application/x-www-form-urlencoded') {
      // get / post 모두 데이터포맷은 같다
      // console.log('application/x-www-form-urlencoded');
      let Request;

      if (B_NAME === 'ie' && B_VER <= 10) {
        if (isSameOrigin) {
          Request = XMLHttpRequest;
          // console.log('>> XMLHttpRequest');
        } else {
          Request = XDomainRequest;
          // console.log('>> XDomainRequest');
        }
      } else {
        Request = XMLHttpRequest;
      }
      let req = new Request();


      // query 생성
      let queryDataKeys = Object.keys(_fields);
      let queries = queryDataKeys.map(function(_key) {
        return `${_key}=${ encodeURIComponent(_fields[_key]) }`;
      });

      let urlencodedQueries = queries.join('&');

      // Method 가 get 이면 query 들을 조합하여 URL에 더한다.
      if (method === 'get') {
        if (url.lastIndexOf('?') !== -1) {
          url += `&${urlencodedQueries}`;
        } else {
          url += `?${urlencodedQueries}`;
        }
      }

      // OPEN
      req.open(_method, url, _async);

      if (req.setRequestHeader)
        req.setRequestHeader("Content-type", _enctype);

      req.onprogress = function(_e) {
        console.log('onprogress', _e);
      };

      req.onload = function(_e) {

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

        // console.log('onload');
        // console.dir(req);
      };

      req.onerror = function(_e) {
        // console.log('onerror', _e);
        throw new Error(`Request Error by ${Request}`);
        // _complete(new Error(`Request Error by ${Request}`), null);
      };


      // SEND
      if (method === 'get') {
        req.send();
      } else {
        // post, ... others
        req.send(urlencodedQueries);
      }

      // console.log('sent');
    }
  }

  static requestMultipartPostIE9below() {

  }

  static _request(_method, _url, _fields = {}, _complete, _enctype = 'application/x-www-form-urlencoded') {
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
    HTTPRequest.request(_method, _url, _data, _complete, _enctype, false);
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