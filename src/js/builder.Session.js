/**
 * Builder,Session
 * 빌더의 Session 관리자
 *
 *
 *
 * Requires(JS) : builder.StageContext.js, builder.UI.js
 */

(function() {
  var RequestToServer = require('./util/RequestToServer.js');
  var ComponentPool = require('./builder.ComponentPool.js');
  //var ComponentSupporter = require('./builder.ComponentSupporter.js');

  var Session = function() {
    this.locale = 'ko'; // 지역화 변수
    this.componentPool = new ComponentPool(this);

  };

  Session.prototype.ready = function() {
    this.componentPool.updateMeta('/BuildingResourceStore/Meta/AvailableComponents.json');
  };

  Session.prototype.signIn = function() {
    this.username = "ion-sdp";
    this.signedIn = true;
    this.sessionKey = "a2sA6ASad1a23A2";

    return this.signedIn;
  };

  Session.prototype.getUsername = function() {
    return this.username; // 임시
  };

  Session.prototype.isSign = function() {
    return this.signedIn; // 임시
  };

  Session.prototype.getComponentPool = function() {
    return this.componentPool;
  };

  /**
   * Certified Request
   * 인증된 유저 세션을 이용하여 서버에 데이터를 요청한다.
   *
   */
  Session.prototype.certifiedRequest = function(_url, _method, _data) {
    var json = RequestToServer.sync(_url, _method || 'get', _data);

    return json;
  };

  Session.prototype.certifiedRequestJSON = function(_url, _method, _data) {
    var jsonFormatText = RequestToServer.sync(_url, _method || 'get', _data);
    var jsonObj;

    try {

      jsonObj = JSON.parse(jsonFormatText);

    } catch (e) {
      throw new Error(e);
    }

    return jsonObj;
  };

  module.exports = Session;
})();