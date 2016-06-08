import ObjectExtends from '../../util/ObjectExtends';
import Events from 'events';
import HTTPRequest from '../common/HTTPRequest';

const SUPER_LANGUAGE_DEFAULT = 'en';

const DEFAULT_I18N_PATH = '/i18n/';
const DEFAULT_API_SOURCE_PATH = '/api/';
const DEFAULT_COMPONENT_PATH = '/component/';

class Config {
  constructor(_inlineConfig, _orbit) {
    ObjectExtends.liteExtends(this, Events.EventEmitter.prototype);
    this.orbit = _orbit;

    if (_inlineConfig) {
      this.import(_inlineConfig);
    }
  }

  set LANGUAGE_DEFAULT(_langSetName) {
    this._LANGUAGE_DEFAULT = _langSetName;

    this.emit('update');
  }

  get LANGUAGE_DEFAULT() {
    return this._LANGUAGE_DEFAULT || SUPER_LANGUAGE_DEFAULT;
  }

  set DIR_I18N(_DIR_I18N) {
    this._DIR_I18N = _DIR_I18N;

    this.emit('update');
  }

  get DIR_I18N() {
    return this._DIR_I18N || DEFAULT_I18N_PATH;
  }

  set DIR_API_SOURCE(_DIR_API_SOURCE) {
    this._DIR_API_SOURCE = _DIR_API_SOURCE;

    this.emit('update');
  }

  get DIR_API_SOURCE() {
    return this._DIR_API_SOURCE || DEFAULT_API_SOURCE_PATH;
  }

  set DIR_COMPONENT(_DIR_COMPONENT) {
    this._DIR_COMPONENT = _DIR_COMPONENT;

    this.emit('update');
  }

  get DIR_COMPONENT() {
    return this._DIR_COMPONENT || DEFAULT_COMPONENT_PATH;
  }

  set LANGUAGE_DECIDER(_LANGUAGE_DECIDER) {
    this._LANGUAGE_DECIDER = _LANGUAGE_DECIDER;

    this.emit('update');
  }

  get LANGUAGE_DECIDER() {
    return this._LANGUAGE_DECIDER;
  }

  set LAZY_SCRIPTS(_LAZY_SCRIPTS) {
    this.LAZY_SCRIPTS = _LAZY_SCRIPTS;

    this.emit('update');
  }

  get LAZY_SCRIPTS() { // paths
    return this._LAZY_SCRIPTS || [];
  }

  set EARLY_SCRIPTS(_EARLY_SCRIPTS) {
    this._EARLY_SCRIPTS = _EARLY_SCRIPTS;


    this.emit('update');
  }

  get EARLY_SCRIPTS() { // paths
    return this._EARLY_SCRIPTS || [];
  }

  set STYLES(_STYLES) {
    this._STYLES = _STYLES;

    this.emit('update');
  }

  get STYLES() { // paths
    return this._STYLES || [];
  }

  set MODE(_MODE) {
    this._MODE = _MODE;

    this.emit('update');
  }

  get MODE() {
    return this._MODE;
  }

  set INIT_FUNCTION_SPLITED(_ia) {
    this._INIT_FUNCTION_SPLITED = _ia;
  }

  get INIT_FUNCTION_SPLITED() {
    return this._INIT_FUNCTION_SPLITED;
  }

  set INIT_FUNCTION(_if) {
    this._INIT_FUNCTION = _if;
  }

  get INIT_FUNCTION() {
    return this._INIT_FUNCTION;
  }

  set GLOBAL_SCRIPTS(_GLOBAL_SCRIPTS) {
    this._GLOBAL_SCRIPTS = _GLOBAL_SCRIPTS;
  }

  get GLOBAL_SCRIPTS() {
    return this._GLOBAL_SCRIPTS;
  }

  get_INIT_FUNCTION() {
    if (!(this.INIT_FUNCTION_SPLITED instanceof Array)) throw new Error(`config : INIT_FUNCTION_SPLITED is not Array.`);

    let joinedFunctionString = 'return ' + this.INIT_FUNCTION_SPLITED.join('\n');

    let funcExtractor = new Function(joinedFunctionString);
    let extractedFunction = funcExtractor();

    if (typeof extractedFunction !== 'function') {
      throw new Error(`config : INIT_FUNCTION_SPLITED was wrote invalid. start >> function(_orbit,_callback){`);
    }

    let bindedFunction = extractedFunction.bind(this);

    return bindedFunction;
  }

  //
  set configObject(_configO) {
    this._configObject = _configO;
  }

  get configObject() {
    return this._configObject || {};
  }


  get ORIENT_SUSPENDIBLE_ELEMENTNODE_INTERPRET() {
    return this.ORIENT_SUSPENDIBLE_ELEMENTNODE_INTERPRET;
  }

  set ORIENT_SUSPENDIBLE_ELEMENTNODE_INTERPRET(_flag) {
    this.ORIENT_SUSPENDIBLE_ELEMENTNODE_INTERPRET = _flag;
    window.ORIENT_SUSPENDIBLE_ELEMENTNODE_INTERPRET = _flag;
  }


  // 외부 config 파일을 사용할 때 이 메서드를 사용한다.
  retrieveConfig(_configURL, _complete) {
    // 1. 로딩
    // 2. import
    let that = this;
    let configFileType = _configURL.replace(/.*?\.(\w+)$/, '$1');


    HTTPRequest.request('get', _configURL, {}, (_err, _res) => {
      let importObject;

      if (_res !== null) {
        if (configFileType === 'json') {

          importObject = _res.json;
        } else if (configFileType === 'js') {
          let configExtractor = new Function('var CONFIG; \n' + _res.responseText + '\n return CONFIG;');

          importObject = configExtractor.apply(this);
        }

        that.import(importObject);

        that.emit('update');

        that.orbit.orbitDocument.loadExtraJSSerial(this.GLOBAL_SCRIPTS || [], () => {

          if (this.INIT_FUNCTION_SPLITED) {
            let initFunc = this.get_INIT_FUNCTION();

            initFunc(this.orbit, function() {

              _complete();
            });
          } else if (this.INIT_FUNCTION) {
            this.INIT_FUNCTION.apply(this, [this.orbit, function() {
              _complete();
            }]);
          } else {
            _complete();
          }
        });

      } else {
        throw new Error(`Fail load config. ${_err}`);
      }
    });
  }

  // Config 에 입력된 필드값을 가져온다.
  getField(_name) {
    let fieldValue = undefined;

    // 대상 field값이 string type 이 아니라면 그대로 반환하며 string타입 이라면 바인딩처리하여 반환한다.
    if (this[_name]) {
      fieldValue = this[_name];
    } else {
      if (this.configObject) {
        if (this.configObject[_name]) {
          fieldValue = this.configObject[_name];
        }
      }
    }

    if (fieldValue === undefined) console.warn(`찾을 수 없는 config 필드[${_name}] 입니다.`);

    switch (typeof fieldValue) {
      case "string":
        return this.orbit.interpret(fieldValue);
      case "object":
        return ObjectExtends.clone(fieldValue, true, (_value) => {

          if (typeof _value === 'string') {
            return this.orbit.interpret(_value);
          }

          return _value;
        });
      default:
        return fieldValue;
    }

    // if (this[_name]) {
    //   if (typeof this[_name] === 'string') {
    //     return this.orbit.interpret(this[_name]);
    //   } else {
    //     return this[_name];
    //   }
    // } else {
    //   if (this.configObject) {
    //     if (typeof this.configObject[_name] === 'string') {
    //       return this.orbit.interpret(this.configObject[_name]);
    //     } else {
    //       return this.configObject[_name];
    //     }
    //   }
    // }
  }

  setExtraField(_name, _value) {
    this.configObject[_name] = _value;
  }

  import (_config) {
    this._LANGUAGE_DEFAULT = _config['LANGUAGE_DEFAULT'];
    this._LANGUAGE_DECIDER = _config['LANGUAGE_DECIDER'];
    this._LAZY_SCRIPTS = _config['LAZY_SCRIPTS'];
    this._EARLY_SCRIPTS = _config['EARLY_SCRIPTS'];
    this._STYLES = _config['STYLES'];

    this._DIR_I18N = _config['DIR_I18N'];
    this._DIR_COMPONENT = _config['DIR_COMPONENT'];
    this._DIR_API_SOURCE = _config['DIR_API_SOURCE'];
    this._MODE = _config['MODE'];
    this._INIT_FUNCTION_SPLITED = _config['INIT_FUNCTION_SPLITED'];
    this._INIT_FUNCTION = _config['INIT_FUNCTION'];
    this._GLOBAL_SCRIPTS = _config['GLOBAL_SCRIPTS'];

    window['ORIENT_SUSPENDIBLE_ELEMENTNODE_INTERPRET'] = _config['ORIENT_SUSPENDIBLE_ELEMENTNODE_INTERPRET'];

    this.configObject = _config;

    this.emit('update');
  }

  export () {
    let config = {};
    config['LANGUAGE_DEFAULT'] = this._LANGUAGE_DEFAULT;
    config['LANGUAGE_DECIDER'] = this.LANGUAGE_DECIDER;
    config['LAZY_SCRIPTS'] = ObjectExtends.clone(this.LAZY_SCRIPTS);
    config['EARLY_SCRIPTS'] = ObjectExtends.clone(this.EARLY_SCRIPTS);
    config['STYLES'] = ObjectExtends.clone(this.STYLES);
    config['DIR_I18N'] = this._DIR_I18N; // 직접 속성에 접근하는 이유는 Default 로 잡힌 값을 export하지 않기 위함
    config['DIR_COMPONENT'] = this._DIR_COMPONENT;
    config['DIR_API_SOURCE'] = this._DIR_API_SOURCE;
    config['MODE'] = this._MODE;
    config['INIT_FUNCTION_SPLITED'] = ObjectExtends.clone(this._INIT_FUNCTION_SPLITED);
    config['INIT_FUNCTION'] = this.INIT_FUNCTION;
    config['GLOBAL_SCRIPTS'] = ObjectExtends.clone(this.GLOBAL_SCRIPTS);

    ObjectExtends.mergeByRef(config, this.configObject, false);

    return config;
  }
}

export default Config;