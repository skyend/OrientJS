import fs from 'fs';


const ENOENT = "ENOENT";

class Config {
  constructor() {
    this.fields = {};
  }

  //synchronous
  readConfig(_path) {
    try {
      let filetext = fs.readFileSync(_path, 'utf8');

      this.fields = JSON.parse(filetext);

    } catch (_e) {
      let code = _e.code;

      if (code === ENOENT) {
        agent.log.error(`NOT_FOUND_CONFIG`);
      } else if (_e instanceof SyntaxError) {
        agent.log.error("Config SyntaxError. Detail: %s", _e.message);
      } else {
        agent.log.error("UNKNOWN ERROR. Hint: %s", _e);
      }
    }
  }

  writeConfig(_path, _complete) {

  }

  getField(_key) {
    return this.fields[_key];
  }

  get absoluteDirPath() {
    return this.getField('log_absolte_dirpath');
  }

  get host() {
    return this.getField('host') || 'localhost';
  }

  get port() {
    return this.getField('port') || '3000';
  }

  get external_url() {
    return this.getField('external_url');
  }

  get dataStoreConfigSet() {
    return this.getField('data_store');
  }

  get memoryStoreConfigSet() {
    return this.getField('memory_store');
  }

  get allowSignup() {
    return this.getField('allow_signup');
  }

  get firstMemberISSuper() {
    return this.getField('first_member_is_super');
  }

  get smtp() {
    return this.getField('smtp');
  }
}

export default Config;