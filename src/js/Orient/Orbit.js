//import request from 'superagent';
import ObjectExtends from '../util/ObjectExtends';
import HTTPRequest from './Orbit/HTTPRequest';
import Classer from '../util/Classer';
import Resolver from '../serviceCrew/DataResolver/Resolver';

const DEFAULT_I18N_PATH = '/i18n';
const SUPER_DEFAULT_LANG_SET = 'en';


class Orbit {
  constructor(_window) {
    if (_window) {
      this.window = _window;
    } else {
      throw new Error("Need the window.");
    }

    this.resolver = new Resolver();

    // Framework Interpreters
    this.bindedInterpretSupporters = {
      // executeI18n: this.executeI18n.bind(this), // with Framework
      // getConfig: this.getServiceConfig.bind(this), // with Framework
    };
  }

  /*
    {
      "projectId": "asdasdasd",
      "serviceId": "212321212",
      "ice-host": "http://125.131.88.75:8080",
      "apifarm-host": "http://125.131.88.77:8200",
      "resource-base-dir-path": "http://s3.ap-northeast-2.amazonaws.com/kop.images/",

      "default-lang-set": "en",
      "i18n-lang-code": "{{<< cookie@lang }}",

      "commonScripts": [

      ],

      "commonStyles": [

      ]
    }
  */


  set window(_window) {
    this._window = _window;
  }

  get window() {
    return this._window;
  }

  get document() {
    return this.window.document;
  }

  set defaultLangSet(_langSetName) {
    this._defaultLangSet = _langSetName;
  }

  get defaultLangSet() {
    return this._defaultLangSet || SUPER_DEFAULT_LANG_SET;
  }

  set i18N_URL(_i18N_URL) {
    this._i18N_URL = _i18N_URL;
  }

  get i18N_URL() {
    return this._i18N_URL || DEFAULT_I18N_PATH;
  }

  set languageDecider(_languageDecider) {
    this._languageDecider = _languageDecider;
  }

  get languageDecider() {
    return this._languageDecider;
  }

  set lazyScripts(_lazyScripts) {
    this.lazyScripts = _lazyScripts;
  }

  get lazyScripts() { // paths
    return this._lazyScripts || [];
  }

  set earlyScripts(_earlyScripts) {
    this._earlyScripts = _earlyScripts;
  }

  get earlyScripts() { // paths
    return this._earlyScripts || [];
  }

  set styles(_styles) {
    this._styles = _styles;
  }

  get styles() { // paths
    return this._styles || [];
  }

  get HTTPRequest() {
    return HTTPRequest;
  }

  interpret(_text, _defaultDataObject) {
    return this.resolver.resolve(_text, {
      getServiceConfig: this.forInterpret_config_func,
      executeI18n: this.forInterpret_executeI18N_func
    }, _defaultDataObject, this);
  }

  // 외부 config 파일을 사용할 때 이 메서드를 사용한다.
  retriveConfig(_configURL, _function) {
    // 1. 로딩
    // 2. import

  }


  get forInterpret_executeI18N_func() {
    return this.bindedInterpretSupporters.executeI18n;
  }

  get forInterpret_config_func() {
    return this.bindedInterpretSupporters.getConfig;
  }


  import (_config) {
    this.defaultLangSet = _config['default-lang-set'];
    this.languageDecider = _config['i18n-lang-code'];
    this.lazyScripts = _config['lazyScripts'];
    this.earlyScripts = _config['earlyScripts'];
    this.styles = _config['styles'];
    this.i18N_URL = _config['i18n-url'];
  }

  export () {
    let config = {};
    config['default-lang-set'] = this._defaultLangSet;
    config['i18n-lang-code'] = this.languageDecider;
    config['lazyScripts'] = ObjectExtends.clone(this.lazyScripts);
    config['earlyScripts'] = ObjectExtends.clone(this.earlyScripts);
    config['styles'] = ObjectExtends.clone(this.styles);
    config['i18n-url'] = this._i18N_URL;

    return config;
  }
}

export default window.Orbit = Orbit;