import JSCookie from 'js-cookie';

class Cookie {
  constructor() {

  }

  desc() {
    return document.cookie;
  }

  set(_key, _value, _options) {
    JSCookie.set(_key, _value, _options);
  }

  get(_key) {

    return JSCookie.get(_key);
  }

  getWithJSON(_key) {
    let cookieValue = JSCookie.get(_key);
    try {
      return JSON.parse(cookieValue);
    } catch (e) {
      return cookieValue;
    }
  }

  remove(_key, _options) {
    JSCookie.remove(_key, _options);
  }
}

export default Cookie;