/***
 * 데이터를 가져오고 저장하는 클래스
 *
 */

import MongoDBDriver from './DataStore/MongoDB.js';

class DataStore {
  constructor(_config) {
    this.config = _config;

    if (this.config.target.toLowerCase() === 'mongodb') {
      this.driver = new MongoDBDriver(this.config);
    }
  }

  connect(_complete) {
    this.driver.connect(function() {

    });

    console.log(this.config);
  }

  get driver() {
    return this._driver;
  }

  set driver(_driver) {
    this._driver = _driver;
  }

  getRecord(_recordId, _conditions, _filter, _callback) {

  }

  deleteRecord(_conditions, _callback) {

  }

  saveRecord(_conditions, _record, _callback) {

  }

  updateRecord(_conditions, _record, _callback) {

  }
}

export default DataStore;