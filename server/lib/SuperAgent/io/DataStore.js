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
    } else if ( this.config.target.toLowerCase() === 'mysql' ) {
      this.driver = new MysqlDriver()
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
}

export default DataStore;
