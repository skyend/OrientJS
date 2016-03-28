import SuperAgent from 'superagent';

class HTTPRequest {
  static request(_method, _url, _fields = {}, _complete, _enctype = 'application/x-www-form-urlencoded') {
    if (_method === 'get') {
      SuperAgent.get(_url)
        .query(_fields)
        .end(function(err, res) {

          _complete(err || null, res || null);
        });

    } else if (_method === 'post') {
      SuperAgent.post(_url)
        .type('form')
        .send(_enctype === 'multipart/form-data' ? this.convertFieldsToFormData(_fields) : _fields)
        .end(function(err, res) {

          _complete(err || null, res || null);
        });
    }
  }

  // IE10+
  static convertFieldsToFormData(_fields) {
    if (_fields instanceof FormData) {
      console.warn("FormData 를 FormData로 변환하려 합니다. 이 변환시도는 무시되며 그대로 FormData를 사용합니다.");
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
      //console.error(req);
      //throw new Error("could not load iCafe Node Scheme Specification");

      return undefined;
    }
  }

}

export default HTTPRequest;