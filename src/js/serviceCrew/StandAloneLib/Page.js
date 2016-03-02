import _ from 'underscore';
import async from 'async';
import Loader from './Loader';
import FragmentHelper from './Fragment';
import Gelato from './Gelato';
import DynamicContext from '../ElementNode/DynamicContext';
import Factory from '../ElementNode/Factory.js';
import Document from '../Document';
import ObjectExplorer from '../../util/ObjectExplorer';


class Page {
  constructor(_document) {
    this.doc = _document;

    this.pageSpec = this.getPageSpec();
    this.refStyleList = this.pageSpec.styles;
    this.refScriptList = this.pageSpec.scripts;
    this.runningStyles = {};
    this.runningScripts = {};

    this.runningFragments = [];

    this.i18nLangSetDict = {};

    this.attachENModificationStyle();

    let rootGridElement = this.findRootGrid();
    this.rootGridElement = rootGridElement;
    this.bodyFragment = null;

    this.stripStringEN = true;
    this.standAlone = true;
  }

  getHTMLDocument() {
    return this.doc;
  }

  getScreenSizing() {
    return 'desktop';
  }

  getPageSpec() {
    return JSON.parse(this.doc.getElementById('page-meta').innerHTML);
  }

  setConfig(_config) {
    this.iceHost = _config['ice-host'];
    this.apiFarmHost = _config['apifarm-host'];

    this.config = _config;
  }

  getConfig(_key) {
    return this.config[_key];
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

  appendPageStyles() {
    let gelato = Gelato.one();

    this.refStyleList.map((_refString) => {
      this.appendStyleRef(gelato.interpret(_refString));
    });
  }

  appendPageScripts(_complete) {
    let gelato = Gelato.one();

    async.eachSeries(this.refScriptList, (_refString, _next) => {
      this.appendScriptRef(gelato.interpret(_refString), () => {
        _next();
      });
    }, () => {
      _complete();
    })
  }

  appendStyleRef(_refString) {
    let gelato = Gelato.one();

    if (this.runningStyles[_refString] !== undefined) return;
    this.runningStyles[_refString] = true;

    let ref;
    if (/https?:\/\//.test(_refString)) {
      ref = _refString;
    } else {
      ref = "./css/" + _refString;
    }

    gelato.GD.appendStyleLink(ref);
  }

  appendScriptRef(_refString, _loadedCallback) {
    let gelato = Gelato.one();
    if (this.runningScripts[_refString] !== undefined) {
      _loadedCallback();
      return;
    }
    this.runningScripts[_refString] = true;

    let ref;
    if (/https?:\/\//.test(_refString)) {
      ref = _refString;
    } else {
      ref = "./js/" + _refString;
    }

    gelato.GD.appendScriptLink(ref, _loadedCallback);
  }

  findRootGrid() {
    let bodyChildArray = _.initial(document.body.children);
    let rootGrid = null;

    bodyChildArray.map(function(_child) {
      if (_child.getAttribute('en-type') === 'grid') {
        rootGrid = _child;
      }
    });

    return rootGrid;
  }

  buildBodyFragment() {

    let bodyElementNode = Factory.takeElementNode(undefined, undefined, 'html', Gelato.one().page, undefined);
    bodyElementNode.buildByElement(this.doc.body);
    let bodyFragment = new Document(undefined, undefined, {
      rootElementNodes: [bodyElementNode.export()]
    }, undefined, this);

    this.bodyFragment = bodyFragment;
  }

  /////// NEXT GEN /////////
  buildGridNode() {
    //this.rootGridElementNode;
    let elementNode = Factory.takeElementNode(undefined, undefined, 'grid', Gelato.one().page, undefined);
    elementNode.buildByElement(this.rootGridElement);
    this.rootGridElementNode = elementNode;
  }

  render(_complete) {
    let that = this;
    let bodyElementNode = this.bodyFragment.rootElementNodes[0];

    bodyElementNode.constructDOMs({
      root: true,
      'linkType': 'downstream'
    });


    bodyElementNode.renderWithReplace(that.doc.body.parentElement, that.doc.body);
    // 하나의 fragment에서 rootElementNode 는 다수로 존재 할 수 있지만 Page 에 존재하는 Fragment 의 rootElementNode는 body 태그에 대응하는 elementNode 단 하나만 존재한다.
    // this.bodyFragment.rootElementNodes[0].constructDOMs({
    //   linkType: 'downstream'
    // }, function(_domList) {
    //   // 반환도 배열 타입이지만 요소는 body 태그 하나만 존재한다.
    //   let bodyDOMElement = _domList[0];
    //
    //   that.doc.body.parentElement.replaceChild(bodyDOMElement, that.doc.body);
    //   _complete();
    // });
  }

  loadFragment(_fragmentId, _complete) {
    Loader.loadFragment(_fragmentId, function(_fragmentText) {

      if (_fragmentText !== null) {

        let fragmentHelper = new FragmentHelper(_fragmentId, _fragmentText);
        fragmentHelper.buildElementNode();

        let fragment = new Document();
        fragment.buildByFragmentHTML(_fragmentText);
        //fragment.render();

        _complete(null, fragment);
      } else {
        _complete(new Error(), null);
      }
    });
  }

  /////// NEXT GEN END /////////

  analysisFragmentFollowing() {
    if (this.rootGridElement === null) throw new Error('Not found rootGridElement');
    let fragmentGridList = [];

    Gelato.one().GD.exploreElement(this.rootGridElement, function(_element) {
      if (_element.getAttribute('type') !== 'grid') return null;

      if (_element.hasAttribute('has-fragment'))
        fragmentGridList.push(_element);
    });

    return fragmentGridList;
  }

  // 모든 Fragment를 참조하는 Element 에 Fragment 를 채운다
  fillAllFragmentOfGridElement(_gridElements, _complete) {

    async.eachSeries(_gridElements, (_Gelement, _next) => { // iterator
      Page.fillElementThatReferToTheFragmentByFragment(_Gelement, (_fragment) => {
        this.runningFragments.push(_fragment);
        _next();
      });
    }, (_err) => { // Done
      _complete();
    });
  }

  // 프래그먼트를 참조하는 요소를 프래그먼트로 채운다.
  static fillElementThatReferToTheFragmentByFragment(_element, _complete) {
    let fragmentName = _element.getAttribute('en-ref-fragment');

    Loader.loadFragment(fragmentName, function(_fragmentText) {
      let fragment = new Fragment(fragmentName, _fragmentText, _element);

      //fragment.render();

      fragment.buildElementNode();

      fragment.renderByRootElementNodes(function() {

        _complete(fragment);
      });
    });
  }

  // 동기 로드
  prepareI18NResource(_lang) {
    console.log(_lang);
  }

  //
  // renderRefElementsOfFragments(_complete) {
  //
  //   async.eachSeries(this.runningFragments, (_fragment, _next) => {
  //     _fragment.renderRefElements((_result) => {
  //       _next();
  //     });
  //   }, (_err) => {
  //     _complete();
  //   })
  // }
  //
  // runAllDynamicContext(_complete) {
  //
  //   let asyncTasks = this.selectAllDynamicContexts().map((_dynamicContext) => {
  //     return (_cb) => {
  //       _dynamicContext.processing(() => {
  //         _cb();
  //       });
  //     }
  //   });
  //
  //   async.parallel(asyncTasks, () => {
  //     _complete();
  //   });
  // }
  //
  // selectAllDynamicContexts() {
  //   let dynamicContexts = [];
  //
  //   Gelato.one().GD.exploreBody((_element) => {
  //     if (_element.getAttribute('dynamic-context') === 'true') {
  //       dynamicContexts.push(this.createDynamicContext(_element));
  //       return null;
  //     }
  //   });
  //
  //   return dynamicContexts;
  // }
  //
  // createDynamicContext(_element) {
  //   return new DynamicContext(_element, this);
  // }

  bindTag(_element, _apiSourceId, _requestId, _fields) {

    document.body.innerHTML = '<div> Hello </div>';
  }

  attachENModificationStyle() {
    let style = this.doc.createElement('style');
    style.innerHTML = 'en-action, en-val, en-let, en-if {display:none};';
    this.doc.head.appendChild(style);
  }
}

export default Page;