import CSS from './CSS.js';
import ContextController from './ContextController.js';

export default class CSSContextController extends ContextController {
  constructor(_css, _serviceManager) {
    super();
    this.serviceManager = _serviceManager;

    this.subject = new CSS(_css);
  }

  save() {
    var self = this;
    var cssJSON = this.subject.export();

    this.serviceManager.saveCSS(this.subject.id, cssJSON, function(_result) {
      self.unsaved = false;
      self.context.feedSaveStateChange();
    });
  }

  modifyCode(_value) {
    this.subject.css = _value;
    this.changedContent();
  }

}