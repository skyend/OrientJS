class I18N {
  constructor(_options) {

  }

  executeI18n(_textCode) {
    let gelato = Gelato.one();

    let textCode = arguments[0];
    let values = {};
    let textSnippet = this.getI18NTextSnippet(_textCode);

    for (let i = 1; i < arguments.length; i++) {
      values[i - 1] = arguments[i];
    }

    if (textSnippet === null) {
      return `not found i18n textCode : ${_textCode}`;
    }

    return gelato.interpret(textSnippet, values);
  }


  getI18NTextSnippet(_textCode) {
    let gelato = Gelato.one();

    let usingLanguageSet = gelato.interpret(this.config['i18n-lang-code']) || this.config['default-lang-set'];

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
    langSet = this.getI18NLangSet(gelato.interpret(this.config['i18n-lang-code']));

    if (langSet !== null) {

      snippet = ObjectExplorer.getValueByKeyPath(langSet, _textCode);

      if (snippet) {
        return snippet;
      }
    }



    langSet = this.getI18NLangSet(this.config['default-lang-set']);

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
      langSet = this.i18nLangSetDict[_langCode] = Loader.loadI18NJSONSync(_langCode) || null;
    }

    return langSet;
  }
}

export default I18N;