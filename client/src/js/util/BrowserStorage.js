import TypeCaster from './TypeCaster';

const ITEM_DTYPE_PREFIX = 'o_type_';
const DATA_PREFIX = 'o_data_';

class BrowserStorage {
  static setLocal(_key, _data) {
    BrowserStorage.setItem(_key, _data, 'local');
  }

  static getLocal(_key) {
    return BrowserStorage.getItem(_key, 'local');
  }

  static removeLocal(_key) {
    BrowserStorage.removeItem(_key, 'local');
  }

  static setSession(_key, _data) {
    BrowserStorage.setItem(_key, _data, 'session');
  }

  static getSession(_key) {
    return BrowserStorage.getItem(_key, 'session');
  }

  static removeSession(_key) {
    BrowserStorage.removeItem(_key, 'session');
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
      throw _e;
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