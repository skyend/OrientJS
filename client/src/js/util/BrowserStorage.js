import TypeCaster from './TypeCaster';

const ITEM_DTYPE_PREFIX = 'o_type_';
const DATA_PREFIX = 'o_data_';

// if( window.localStorage ){
//   var nativeSetItem = localStorage.setItem;
//   window.localStorage.setItem = function(_key, _data){
//     try {
//       return nativeSetItem.apply(localStorage, [_key, _data]);
//     } catch(_e){
//
//       if( _e instanceof DOMException ){
//         if( _e.code === DOMException.QUOTA_EXCEEDED_ERR ){
//           console.warn(`localStorage 에 [${_key}]에 대한 데이터를 저장 할 수 없습니다. 스토리지가 가득 찼거나, 사용 할 수 없는 환경입니다. 또는 private 브라우징이 아닌지 확인 하십시오.`);
//         }
//       }
//
//       if( window.BROWSER_STORAGE_OFF_SET_EXCEPTION !== true ){
//         throw _e;
//       }
//     }
//   }
// }
//
// if( window.sessionStorage ){
//   var nativeSetItem = sessionStorage.setItem;
//   window.sessionStorage.setItem = function(_key, _data){
//     try {
//       return nativeSetItem.apply(sessionStorage, [_key, _data]);
//     } catch(_e){
//
//       if( _e instanceof DOMException ){
//         if( _e.code === DOMException.QUOTA_EXCEEDED_ERR ){
//           console.warn(`sessionStorage 에 [${_key}]에 대한 데이터를 저장 할 수 없습니다. 스토리지가 가득 찼거나, 사용 할 수 없는 환경입니다. 또는 private 브라우징이 아닌지 확인 하십시오.`);
//         }
//       }
//
//       if( window.BROWSER_STORAGE_OFF_SET_EXCEPTION !== true ){
//         throw _e;
//       }
//     }
//   }
//
//
// }


class BrowserStorage {
  static setLocal(_key, _data) {
    try{

      BrowserStorage.setItem(_key, _data, 'local');
    } catch(_e){
      console.warn('Fail set. LocalStorage 를 사용 할 수 없습니다.', _e);
    }
  }

  static getLocal(_key) {
    try{

      return BrowserStorage.getItem(_key, 'local');
    } catch(_e){
      console.warn('Fail read. LocalStorage 를 사용 할 수 없습니다.', _e);
    }
  }

  static removeLocal(_key) {
    try{

      BrowserStorage.removeItem(_key, 'local');
    } catch(_e){
      console.warn('Fail remove. LocalStorage 를 사용 할 수 없습니다.', _e);
    }
  }

  static setSession(_key, _data) {
    try{

      BrowserStorage.setItem(_key, _data, 'session');
    } catch(_e){
      console.warn('Fail set. SessionStorage 를 사용 할 수 없습니다.', _e);
    }
  }

  static getSession(_key) {
    try{

      return BrowserStorage.getItem(_key, 'session');
    } catch(_e){

      console.warn('Fail read. SessionStorage 를 사용 할 수 없습니다.', _e);
    }
  }

  static removeSession(_key) {
    try{

      BrowserStorage.removeItem(_key, 'session');
    } catch(_e){

      console.warn('Fail remove. SessionStorage 를 사용 할 수 없습니다.', _e);
    }
  }



  static setItem(_key, _data, _storage) {
    let storage = BrowserStorage.storage(_storage);
    // let dataType = typeof _data;
    let key = _key;
    let stringData = JSON.stringify(_data);

    try {
      storage.setItem(key, stringData);
    } catch (_e) {
      storage.removeItem(key);
    }
  }

  static getItem(_key, _storage) {
    let storage = BrowserStorage.storage(_storage);
    let key = _key;

    let stringItem = storage.getItem(key);

    if (stringItem) {
      return JSON.parse(stringItem);
    } else {
      return null;
    }
  }

  static removeItem(_key, _storage) {
    let storage = BrowserStorage.storage(_storage);
    let key = _key;
    storage.removeItem(_key);
  }

  static storage(_storageType) {
    if (_storageType === 'session') {
      return sessionStorage;
    } else if (_storageType === 'local') {
      return localStorage;
    }
  }


  static getTypeOfItem(_itemKey, _storageType) {
    let storage = BrowserStorage.storage(_storage);

    return storage.getItem(`${ITEM_DTYPE_PREFIX}_${_itemKey}`);
  }

  static setTypeOfItem(_itemKey, _type, _source) {
    let storage = BrowserStorage.storage(_storage);

    storage.set(`${ITEM_DTYPE_PREFIX}_${_itemKey}`, _type);
  }
}
window.BrowserStorage = BrowserStorage;
export default BrowserStorage;
