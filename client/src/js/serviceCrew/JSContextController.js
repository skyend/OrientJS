import JS from './JS.js';
import ContextController from './ContextController.js';

export default class JSContextController extends ContextController {
  constructor(_js, _serviceManager) {
    super();
    this.serviceManager = _serviceManager;

    this.subject = new JS(_js);
  }

  save() {
    var self = this;
    var jsJSON = this.subject.export();

    this.serviceManager.saveJS(this.subject.id, jsJSON, function(_result) {
      self.unsaved = false;
      self.context.feedSaveStateChange();
    });
  }

  modifyCode(_value) {
    this.subject.js = _value;
    this.changedContent();
  }

}