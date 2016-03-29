import fs from 'fs';

class Config {
  constructor() {
    this.fields = {};
  }

  readConfig(_path, _complete) {
    fs.readFile(_path, 'utf8', (err, data) => {
      if (err) agent.log.ctit(`NOT_FOUND_CONFIG`);
      try {
        this.fields = JSON.parse(data);
        _complete();
      } catch (_e) {
        throw _e;
        agent.log.crit("INVALID_CONFIG_FORMAT");
      }
    });
  }

  writeConfig(_path, _complete) {

  }

  getField(_key) {
    return this.fields[_key];
  }
}

export default Config;