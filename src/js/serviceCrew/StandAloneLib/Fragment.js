import Gelato from './Gelato';
import async from 'async';
//import RefElementNode from './ElementNode/RefElementNode';
import Factory from '../ElementNode/Factory.js';

const fragmentSpecStartSignString = "<!--@FragmentSpec";
const fragmentSpecEndSignString = "@FragmentSpecEnd-->";


class Fragment {
  constructor(_name, _fragmentText, _parentElement) {
    this.name = _name;
    this.parentElement = _parentElement;
    this.fragmentText = _fragmentText;
    this.fragmentSpec = this.getFragmentSpec(_fragmentText);

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
    this.fragmentSpec.css.map((_refString) => {
      gelato.page.appendStyleRef(_refString);
    })
  }

  render() {
    this.parentElement.innerHTML = this.fragmentText;
    this.rendered = true;
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