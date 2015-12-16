/**
 * Builder,Session
 * 빌더의 Session 관리자
 *
 *
 *
 * Requires(JS) : builder.StageContext.js, builder.UI.js
 */


var RequestToServer = require('./util/RequestToServer.js');
var ComponentPool = require('./builder.ComponentPool.js');
let Cookie = require('js-cookie');

//var ComponentSupporter = require('./builder.ComponentSupporter.js');

var Session = function() {
  this.signed = false;
  this.locale = 'ko'; // 지역화 변수

  // 컴포넌트풀을 Session에서 분리예정 다이어그램에서 제외
  this.componentPool = new ComponentPool(this);
  this.componentPool.updateMeta('/BuildingResourceStore/Meta/AvailableComponents.json');

  this.readCookie();
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

Session.prototype.readCookie = function() {
  this.authorityToken = Cookie.get('at') || undefined;
  this.authorizedDate = Cookie.get('ad') || undefined;
};

Session.prototype.authorize = function(_token, _date) {
  this.authorityToken = _token;
  this.authorizedDate = _date;

  Cookie.set('at', this.authorityToken);
  Cookie.set('ad', this.authorizedDate);
};


Session.prototype.deauthorize = function(_token, _date) {
  this.authorityToken = undefined;
  this.authorizedDate = undefined;

  Cookie.remove('at');
  Cookie.remove('ad');
};

Session.prototype.isAuthorized = function() {
  if (this.authorityToken !== undefined) {
    return true;
  }

  return false;
}

Session.prototype.getAuthorityToken = function() {
  return this.authorityToken;
};

module.exports = Session;