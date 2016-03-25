//import request from 'superagent';
import HTTPRequest from './common/HTTPRequest';
import Config from './Orbit/Config';
import I18N from './Orbit/I18N';
import Resolver from '../serviceCrew/DataResolver/Resolver';
import BuiltinRetriever from './Orbit/Retriever';
import APISourceFactory from './Orbit/APISource/Factory';
import OrbitDocument from './Orbit/Document';

import ObjectExtends from '../util/ObjectExtends';

class Orbit {
  /**
    _window : Browser Window Object
    _inlineConfig : 직접 JSON으로 입력한 Config Object
    _retriever : 프레임웤 리소스를 확장하는 객체
  */
  constructor(_window, _inlineConfig, _retriever) {
    let that = this;

    console.log(Object.keys(this.__proto__)); // prototype 으로 확장을 해야함

    if (_window) {
      this.window = _window;
    } else {
      throw new Error("Need the window.");
    }

    /* Initial Members */
    this.config = new Config(_inlineConfig);
    this.orbitDocument = new OrbitDocument(this.window);
    this.apiSourceFactory = new APISourceFactory(this);
    this.resolver = new Resolver();
    this.i18n = new I18N(this, {
      languageDecider: '',
      languageDefault: ''
    });

    this._retriever = new BuiltinRetriever(that, {
      'relative-dir-i18n': this.config.getField('DIR_I18N'),
      'relative-dir-apisource': this.config.getField('DIR_API_SOURCE'),
      'relative-dir-component': this.config.getField('DIR_COMPONENT')
    }, _retriever);

    // Update Members by Config update
    // config 가 변경될 때 마다 config를 사용하는 객체의 설정을 업데이트한다.
    this.config.on('update', function(_e) {
      // ※ this === this.config


      // DIR PATH
      that.retriever.dirpath_i18n = this.getField('DIR_I18N');
      that.retriever.dirpath_apisource = this.getField('DIR_API_SOURCE');
      that.retriever.dirpath_component = this.getField('DIR_COMPONENT');

      that.i18n.languageDecider = this.getField('LANGUAGE_DECIDER');
      that.i18n.languageDefault = this.getField('LANGUAGE_DEFAULT');
    });


    // Framework Interpreters
    this.bindedInterpretSupporters = {
      executeI18n: this.i18n.executeI18n.bind(this.i18n), // with Framework
      getConfig: this.config.getField.bind(this.config), // with Framework
    };
  }

  set window(_window) {
    this._window = _window;
  }

  get window() {
    return this._window;
  }

  get document() {
    return this.window.document;
  }

  set apiSourceFactory(_apiSourceFactory) {
    this._apiSourceFactory = _apiSourceFactory;
  }

  get apiSourceFactory() {
    return this._apiSourceFactory;
  }

  set retriever(_retriever) {
    this._retriever = _retriever;
  }

  get retriever() {
    return this._retriever;
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

  get forInterpret_executeI18N_func() {
    return this.bindedInterpretSupporters.executeI18n;
  }

  get forInterpret_config_func() {
    return this.bindedInterpretSupporters.getConfig;
  }


  appendScript() {

  }

  /*
    ███████ ██   ██ ████████ ███████ ███    ██ ██████   █████  ██████  ██      ███████      ██████ ██       █████  ███████ ███████     ███████ ██   ██ ██████   ██████  ██████  ████████
    ██       ██ ██     ██    ██      ████   ██ ██   ██ ██   ██ ██   ██ ██      ██          ██      ██      ██   ██ ██      ██          ██       ██ ██  ██   ██ ██    ██ ██   ██    ██
    █████     ███      ██    █████   ██ ██  ██ ██   ██ ███████ ██████  ██      █████       ██      ██      ███████ ███████ ███████     █████     ███   ██████  ██    ██ ██████     ██
    ██       ██ ██     ██    ██      ██  ██ ██ ██   ██ ██   ██ ██   ██ ██      ██          ██      ██      ██   ██      ██      ██     ██       ██ ██  ██      ██    ██ ██   ██    ██
    ███████ ██   ██    ██    ███████ ██   ████ ██████  ██   ██ ██████  ███████ ███████      ██████ ███████ ██   ██ ███████ ███████     ███████ ██   ██ ██       ██████  ██   ██    ██
  */

  // Class Extention 을 제공하기 위해 Class를 export
  static get Retriever() {
    return BuiltinRetriever;
  }

  static get I18N() {
    return I18N;
  }

  static get Config() {
    return Config;
  }

  static get Resolver() {
    return Resolver;
  }

  /*
    ███████ ████████  █████  ████████ ██  ██████      █████  ██████  ██
    ██         ██    ██   ██    ██    ██ ██          ██   ██ ██   ██ ██
    ███████    ██    ███████    ██    ██ ██          ███████ ██████  ██
         ██    ██    ██   ██    ██    ██ ██          ██   ██ ██      ██
    ███████    ██    ██   ██    ██    ██  ██████     ██   ██ ██      ██
  */
  static get ObjectExtends() {
    return ObjectExtends;
  }

  static get ExtendClass() {
    return ObjectExtends.ExtendClass;
  }

  static get APIFactory() {
    return APISourceFactory;
  }

  static get HTTPRequest() {
    return HTTPRequest;
  }
}

export default window.Orbit = Orbit;