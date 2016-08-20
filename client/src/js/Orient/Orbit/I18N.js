import ObjectExtends from '../../util/ObjectExtends';
import ObjectExplorer from '../../util/ObjectExplorer';

class I18N {
  constructor(_orbit, _options) {
    this.languageDecider = _options.languageDecider;
    this.languageDefault = _options.languageDefault;

    this.orbit = _orbit;


    this.i18nLangSetDict = {}; // 머지 기능 추가
  }

  get languageDecider() {
    return this._languageDecider;
  }

  set languageDecider(_languageDecider) {
    this._languageDecider = _languageDecider;
  }

  get languageDefault() {
    return this._languageDefault;
  }

  set languageDefault(_languageDefault) {
    this._languageDefault = _languageDefault;
  }

  executeI18n(_textCode) {


    let textCode = arguments[0];
    let values = {};
    let textSnippet = this.getI18NTextSnippet(_textCode);

    for (let i = 1; i < arguments.length; i++) {
      values[i - 1] = arguments[i];
    }

    if (textSnippet === null) {
      return `not found i18n textCode : ${_textCode}`;
    }

    return this.orbit.interpret(textSnippet, values);
  }


  getI18NTextSnippet(_textCode) {
    let usingLanguageSet = this.orbit.interpret(this.languageDecider) || this.languageDefault;

    /**
      snippet을 가져오는 과정
      1. i18n-lang-code 에 따라 language set 을 얻는다.
      2. i18n-lang-code 로 얻은 Language set 에서 textCode에 맞는 값을 가져온다. 없을 경우 2.1
        2.1 default-lang-set 에 따라 Language set 을 얻는다.
        2.2 default-lang-set 으로 얻은 Language set 에서 textCode에 맞는 값을 가져온다. 없을 경우 3.1
      3. 반환한다.
      3.1 null을 반환한다.
    */

    let langSet, snippet;
    langSet = this.getI18NLangSet(this.orbit.interpret(this.languageDecider));

    if (langSet !== null) {

      snippet = ObjectExplorer.getValueByKeyPath(langSet, _textCode);

      if (snippet) {
        return snippet;
      }
    }



    langSet = this.getI18NLangSet(this.languageDefault);

    if (langSet === null) {
      return null;
    }

    snippet = ObjectExplorer.getValueByKeyPath(langSet, _textCode);

    return snippet || null;
  }

  getI18NLangSet(_langCode) {
    let langSet = this.i18nLangSetDict[_langCode];
    //console.log("Load i18n lang set", _langCode, this.i18nLangSetDict, this.i18nLangSetDict[_langCode])

    // language Set 이 로드 되지 않았을 때는 undefined 로 유지하며
    // 로드를 시도 했지만 파일을 찾지 못 했을 때는 null 로 유지 한다.

    if (langSet === undefined) {
      langSet = this.orbit.retriever.loadI18NJSONSync(_langCode) || null;

      this.i18nLangSetDict[_langCode] = langSet;
    }

    return langSet;
  }

  /*
    _langCode : Language Code
    _directPath : Direct Path
  */
  prepareLoadingI18NLangSet(_langCode, _directPath){
    if( arguments.length === 1 ){
      this.orbit.retriever.loadI18NJSON(_langCode, function(_json){
        if( _json ){
          this.i18nLangSetDict[_langCode] = ObjectExtends.mergeDeep(this.i18nLangSetDict[_langCode] || {}, _json);
        } else {
          throw new Error(`Fail to load i18n json`);
        }
      }.bind(this));
    } else {
      Orbit.HTTPRequest.request('get',_directPath, {}, function(_err,_res){
        if( _err ){
          throw new Error(`Fail to load i18n json`);
        }

        if( _res.json ){
          this.i18nLangSetDict[_langCode] = ObjectExtends.mergeDeep(this.i18nLangSetDict[_langCode] || {}, _res.json);
        } else {
          throw new Error(`Fail to load i18n json`);
        }
      }.bind(this));
    }
  }
}

export default I18N;
