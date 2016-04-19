import ObjectExtends from '../../util/ObjectExtends';
import Events from 'events';
import HTTPRequest from '../common/HTTPRequest';

const SUPER_LANGUAGE_DEFAULT = 'en';

const DEFAULT_I18N_PATH = '/i18n/';
const DEFAULT_API_SOURCE_PATH = '/api/';
const DEFAULT_COMPONENT_PATH = '/component/';

class Config {
  constructor(_inlineConfig) {
    ObjectExtends.liteExtends(this, Events.EventEmitter.prototype);

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

  //
  set configObject(_configO) {
    this._configObject = _configO;
  }

  get configObject() {
    return this._configObject || {};
  }


  // 외부 config 파일을 사용할 때 이 메서드를 사용한다.
  retrieveConfig(_configURL, _complete) {
    // 1. 로딩
    // 2. import
    let that = this;

    HTTPRequest.request('get', _configURL, {}, function(_err, _res) {

      if (_res !== null) {
        that.import(_res.body);

        that.emit('update');

        _complete();
      } else {
        throw new Error(`Fail load config.`);
      }
    });
  }

  // Config 에 입력된 필드값을 가져온다.
  getField(_name) {;

    if (this[_name]) {
      return this[_name];
    } else {
      if (this.configObject) {
        return this.configObject[_name];
      }
    }
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

    ObjectExtends.mergeByRef(config, this.configObject, false);

    return config;
  }
}

export default Config;