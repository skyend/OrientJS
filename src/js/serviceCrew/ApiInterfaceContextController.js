import RequestManager from './RequestManager.js';

class ApiInterfaceContextController extends RequestManager {
  constructor(_apiinterface, _session, _serviceManager) {
    super();
    this.attached = false;
    this.context = null;
    this.running = false;
    this.title = _apiinterface.title;
    this.apiInterface = _apiinterface;
    this.unsaved = false;

    console.log('Node Type Id', this.nodeTypeId);

    this.session = _session;
    this.serviceManager = _serviceManager;
  }

  attach(_context) {
    this.attached = true;
    this.context = _context;
  }

  pause() {

  }

  resume() {

  }

  save() {
    this.unsaved = false;
    this.context.feedSaveStateChange();
  }

  changedContent() {
    // 이미 저장되지 않은 상태라면 처리를 스킵
    if (this.unsaved) return;
    this.unsaved = true;
    this.context.feedSaveStateChange();
  }

  get isUnsaved() {
    return this.unsaved;
  }

}


module.exports = ApiInterfaceContextController;