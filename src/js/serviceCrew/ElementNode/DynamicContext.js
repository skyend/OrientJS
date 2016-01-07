import Gelato from '../StandAloneLib/Gelato';
import Factory from './Factory';
import Sizzle from 'sizzle';

class DynamicContext {
  constructor(_element) {
    this.element = _element;

    this.elementNode = Factory.takeElementNode(undefined, undefined, 'html', undefined, undefined);
    this.elementNode.buildByElement(_element);
    console.log(this.elementNode);
  }

  processing(_complete) {
    this.feedbackLoadState();
    //this.endFeedBack();
    _complete();
  }

  feedbackLoadState() {
    let computedStyle = window.getComputedStyle(this.element);

    if (computedStyle.position === 'static') {
      this.element.setAttribute('fix-placeholder', '');
    }

    let placeholder = Gelato.one().page.doc.createElement('div');

    placeholder.setAttribute('is-dynamic-context-placeholder', '');

    placeholder.innerHTML = '<i class="fa fa-spin fa-sun-o"/>';

    this.element.appendChild(placeholder);
  }

  endFeedBack() {
    this.element.removeAttribute('fix-placeholder', '');

    let placeholder = Sizzle('[is-dynamic-context-placeholder]', this.element)[0];
    placeholder.remove();
  }
}

export default DynamicContext;