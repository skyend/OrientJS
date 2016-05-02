import Worker from './Worker';


/**
 * TemplateParser
 *
 * Work Parameters
 *  template_path: String
 */
class TemplateParser extends Worker {
  constructor(_agent, _params) {
    super(_agent);
    this.params = _params;

  }


}

export default TemplateParser;