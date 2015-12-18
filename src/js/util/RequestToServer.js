/**
 * RequestToServer
 * 서버에 Ajax요청을 도와주는 오브젝트 동기적요청을 지원한다.
 *
 */

(function() {
  module.exports = {
    sync: function(_url, _method, _data) {
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
        throw new Error("could not load iCafe Node Scheme Specification");
      }
    }
  }
})();