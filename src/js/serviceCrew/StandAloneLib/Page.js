import _ from 'underscore';
import async from 'async';
import Loader from './Loader';
import Fragment from './Fragment';
import Gelato from './Gelato';
import DynamicContext from '../ElementNode/DynamicContext';
import Factory from '../ElementNode/Factory.js';

class Page {
  constructor(_document) {
    this.doc = _document;

    this.pageSpec = this.getPageSpec();
    this.refStyleList = this.pageSpec.styles;
    this.refScriptList = this.pageSpec.scripts;
    this.runningStyles = {};
    this.runningScripts = {};

    this.runningFragments = [];

    // 스타일은 미리 입력해두어도 서비스 동작에 무관하므로 미리 입력.
    this.appendPageStyles();

    let rootGridElement = this.findRootGrid();
    this.rootGridElement = rootGridElement;

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
  }

  appendPageStyles() {
    this.refStyleList.map((_refString) => {
      this.appendStyleRef(_refString)
    });
  }

  appendPageScripts(_complete) {
    async.eachSeries(this.refScriptList, (_refString, _next) => {
      this.appendScriptRef(_refString, () => {
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

  buildGridNode() {
    //this.rootGridElementNode;
    let elementNode = Factory.takeElementNode(undefined, undefined, 'grid', Gelato.one().page, undefined);
    elementNode.buildByElement(this.rootGridElement);
    console.log(elementNode);

    //this.rootGridElementNode
  }

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
    let fragmentName = _element.getAttribute('fragment-name');

    Loader.loadFragment(fragmentName, function(_fragmentText) {
      let fragment = new Fragment(fragmentName, _fragmentText, _element);

      //fragment.render();

      fragment.buildElementNode();

      fragment.renderByRootElementNodes(function() {

        _complete(fragment);
      });
    });
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
  processingAllDynamicContextInstances() {

    this.runningFragments.map((_fragment) => {
      _fragment.rootElementNodes.map((_rootElementNode) => {
        this.progressElementDynamicContext(_rootElementNode);
      });
    });
  }

  progressElementDynamicContext(_elementNode) {
    let that = this;

    if (typeof _elementNode.treeExplore === 'function') {
      _elementNode.treeExplore((_subElementNode) => {
        if (_subElementNode.isDynamicContext === 'true') {
          _subElementNode.dynamicContext.ready(function() {
            _subElementNode.dynamicContext.start(function done() {
              _subElementNode.childrenIteration((_child) => {
                that.progressElementDynamicContext(_child);
              });
            });
          })
          return null;
        }
      });
    }
  }

  bindTag(_element, _apiSourceId, _requestId, _fields) {

    document.body.innerHTML = '<div> Hello </div>';
  }
}

export default Page;