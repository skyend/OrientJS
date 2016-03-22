//import request from 'superagent';
import HTTPRequest from './Orbit/HTTPRequest';
import Config from './Orbit/Config';
import Resolver from '../serviceCrew/DataResolver/Resolver';
import BuiltinRetriever from './Orbit/Retriever';


class Orbit {
  /**
    _window : Browser Window Object
    _inlineConfig : 직접 JSON으로 입력한 Config Object
    _retriever : 프레임웤 리소스를 로딩해주는 객체
  */
  constructor(_window, _inlineConfig, _retriever) {
    let that = this;

    if (_window) {
      this.window = _window;
    } else {
      throw new Error("Need the window.");
    }

    this.resolver = new Resolver();
    this.config = new Config(_inlineConfig);
    this.config.on('update', function(_e) {
      // config 가 변경될 때 마다 BuiltinRetriever를 업데이트 한다.
      that._defaultRetriever = new BuiltinRetriever({
        'relative-dir-i18n': this.getField('DIR_I18N'),
        'relative-dir-apisource': this.getField('DIR_API_SOURCE'),
        'relative-dir-component': this.getField('DIR_COMPONENT')
      });
    });

    this.retriever = _retriever;

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

  set retriever(_retriever) {
    this._retriever = _retriever;
  }

  get retriever() {
    return this._retriever;
  }

  get defaultRetriever() {
    return this._defaultRetriever;
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
}

export default window.Orbit = Orbit;