export default class ContextController {
  constructor() {

  }

  pause() {
    this.running = false;

    /* processing */

  }

  resume() {
    this.running = true;

    /* processing */

  }

  // save() {
  //   var self = this;
  //   var docjson = this.document.export();
  //   this.serviceManager.saveDocument(this.document.getDocumentID(), docjson, function(_result) {
  //     self.unsaved = false;
  //     self.context.feedSaveStateChange();
  //   });
  // }

  changedContent() {
    if (this.unsaved) return;
    this.unsaved = true;
    this.context.feedSaveStateChange();
  }

  get isUnsaved() {
    return this.unsaved;
  }
}