/***
 * 데이터를 가져오고 저장하는 클래스
 *
 */

import RedisDriver from './MemoryStore/Redis.js';

class MemoryStore {
  constructor(_config) {
    this.config = _config;

    if (this.config.target.toLowerCase() === 'redis') {
      this.driver = new RedisDriver(this.config);
    }
  }

  connect(_complete) {
    this.driver.connect(function() {

    });
  }

  get driver() {
    return this._driver;
  }

  set driver(_driver) {
    this._driver = _driver;
  }
}

export default MemoryStore;