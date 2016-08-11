import JSCookie from 'js-cookie';

let AUTO_PATH = null;
class CookieMan {

  static setAutoPath (_path){
    AUTO_PATH = _path;
  }

  static removeAutoPath(){
    AUTO_PATH = null;
  }

  static set(_key, _data, _options){
    let options = _options || {};
    if( AUTO_PATH ){
      options.path = options.path || AUTO_PATH;
    }

    JSCookie.set(_key, _data, options);
  }

  static get(){
    return JSCookie.get.apply(JSCookie, arguments);
  }

  static remove(_key, _options){
    let options = _options || {};
    if( AUTO_PATH ){
      options.path = options.path || AUTO_PATH;
    }

    JSCookie.remove(_key, options);
  }

  static getJSON(){
    return JSCookie.getJSON.apply(JSCookie, arguments);
  }
}


export default CookieMan;
