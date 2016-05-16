import Identifier from '../../util/Identifier';


var instance = null;

class Console {
  constructor() {
    this.tagCount = 0;

    this.extraDictionary = {};
  }

  static instance() {
    if (instance === null) {
      instance = new Console();
    }

    return instance;
  }

  static logWithExtra(_message, _level = "log", _extras = []) {
    if (!window.DEBUG_OCCURS_HTTP_REQUEST_LOG) return;

    let logParams = ['%c' + _message, 'background: #333; color: rgb(229, 249, 78); padding:2px;'];

    switch (_level) {
      case "log":
        // groupCollapsed 는 IE11부터
        console.log.apply(console, logParams);
        console.log.apply(console, _extras);

        break;
      case "info":
        console.info.apply(console, logParams);
        break;
      case "warn":
        console.warn.apply(console, logParams);
        break;
      case "error":
        console.error.apply(console, logParams);
        break;
    }
  }

  getNewTag() {
    this.tagCount = this.tagCount + 1;

    return Identifier.numberTo64Hash(this.tagCount);
  }
}

export default Console;