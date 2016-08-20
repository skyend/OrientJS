import JSCookie from 'js-cookie';

let AUTO_PATH = null;
let AUTO_NAMESPACE = null;

class CookieMan {

  static setAutoPath (_path){
    AUTO_PATH = _path;
  }

  static removeAutoPath(){
    AUTO_PATH = null;
  }

  static setAutoNamespace(_name){
    AUTO_NAMESPACE = _name;
  }

  static removeAutoNamespace(){
    AUTO_NAMESPACE = null;
  }


  static set(_key, _data, _options){
    let options = _options || {};
    if( AUTO_PATH ){
      options.path = options.path || AUTO_PATH;
    }

    let key = _key;
    if( AUTO_NAMESPACE ){
      key += AUTO_NAMESPACE;
    }

    JSCookie.set(key, _data, options);
  }

  static get(_key){
    let key = _key;

    if( AUTO_NAMESPACE ){
      key += AUTO_NAMESPACE;
    }

    return JSCookie.get(key);
  }

  static remove(_key, _options){
    let options = _options || {};
    let key = _key;
    if( AUTO_PATH ){
      options.path = options.path || AUTO_PATH;
    }

    if( AUTO_NAMESPACE ){
      key += AUTO_NAMESPACE;
    }

    JSCookie.remove(key, options);
  }

  static getJSON(){
    return JSCookie.getJSON.apply(JSCookie, arguments);
  }
}


export default CookieMan;
