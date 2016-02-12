import Gelato from './Gelato';
import async from 'async';
//import RefElementNode from './ElementNode/RefElementNode';
import Factory from '../ElementNode/Factory.js';

const fragmentSpecStartSignString = "<!--@FragmentMeta";
const fragmentSpecEndSignString = "@FragmentMetaEnd-->";


class Fragment {
  constructor(_name, _fragmentText, _parentElement) {
    this.name = _name;
    this.parentElement = _parentElement;
    this.fragmentText = _fragmentText;
    this.fragmentSpec = this.getFragmentSpec(_fragmentText);

    this.rootElementNodes = null;

    this.rendered = false;

    this.appendFragmentStyles();
  }

  getFragmentSpec(_fragmentText) {
    let fragmentSpecStartIndex = _fragmentText.search(fragmentSpecStartSignString);
    let fragmentSpecEndIndex = _fragmentText.search(fragmentSpecEndSignString);
    if (fragmentSpecStartIndex == -1) throw new Error("Not found FragmentSpec start index");
    if (!(fragmentSpecStartIndex < fragmentSpecEndIndex) && fragmentSpecEndIndex == -1) throw new Error("Not found FragmentSpec end index");
    let FragmentSpecString = _fragmentText.substring(fragmentSpecStartIndex + fragmentSpecStartSignString.length, fragmentSpecEndIndex);

    return JSON.parse(FragmentSpecString);
  }

  appendFragmentStyles() {
    let gelato = Gelato.one();
    (this.fragmentSpec.styles || []).map((_refString) => {
      gelato.page.appendStyleRef(_refString);
    })
  }

  appendFragmentScripts() {
    console.warn("Todo appendFragmentScripts");
    return;
    let gelato = Gelato.one();
    (this.fragmentSpec.scripts || []).map((_refString) => {
      gelato.page.appendScriptRef(_refString);
    })
  }

  render() {
    this.parentElement.innerHTML = this.fragmentText;

    this.rendered = true;
  }

  buildElementNode(_environment) {
    this.rootElementNodes = [];
    let domContainer = document.createElement('div');
    domContainer.innerHTML = this.fragmentText;

    for (let i = 0; i < domContainer.children.length; i++) {
      let elementNode = Factory.takeElementNode(undefined, undefined, 'html', _environment, undefined);
      elementNode.buildByElement(domContainer.children[i]);
      this.rootElementNodes.push(elementNode);
    }
    // IE 지원안함
    //domContainer.remove();
  }

  renderByRootElementNodes(_complete) {
    let that = this;
    this.parentElement.innerHTML = '';


    async.eachSeries(this.rootElementNodes, (_rootElementNode, _next) => {
      // _rootElementNode.realize(undefined, () => {
      //   _rootElementNode.linkHierarchyRealizaion();
      //   _next();
      // });

      _rootElementNode.constructDOMs({},
        function(_element) {
          console.log(_element);
          if (_element !== null) {
            that.parentElement.appendChild(_element);
            _next();
          } else {
            throw new Error("element is null");
          }
        });
    }, () => {
      this.parentElement.innerHTML = '';

      this.rootElementNodes.map((_rootElementNode) => {

        this.parentElement.appendChild(_rootElementNode.realization);
      })
      _complete();
    })
  }

  findRefferenceElement() {
    if (!this.rendered) throw new Error("Fragment was not render.");

    let gelato = Gelato.one();
    let refElements = gelato.$('[en-type="ref"]', this.parentElement);

    return refElements;
  }

  renderRefElements(_complete) {
    let refElements = this.findRefferenceElement();

    let refElementNodes = refElements.map((_refElement) => {
      let refElementNode = Factory.takeElementNode(undefined, undefined, 'ref', undefined, undefined);

      refElementNode.buildByElement(_refElement);

      return refElementNode;
    });

    async.eachSeries(refElementNodes, (_refElementNode, _next) => {

      _refElementNode._sa_renderRefferenced(() => {
        _next();
      })
    }, () => {
      _complete();
    });
  }
}

export default Fragment;
