import RequestManager from './RequestManager.js';

class ApiInterfaceContextController {
  constructor(_apiinterface, _session, _serviceManager) {

    this.attached = false;
    this.context = null;
    this.running = false;
    this.title = _apiinterface.title;
    this.apiInterface = _apiinterface;
    this.requests = this.apiInterface.requests = this.apiInterface.requests || {};

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
    this.running = false;
  }

  resume() {
    this.running = true;
  }

  save() {
    var self = this;


    this.serviceManager.saveAPIInterface(this.apiInterface._id, this.apiInterface, function(_result) {

      self.unsaved = false;
      self.context.feedSaveStateChange();
    });
  }

  existsRequest(_name) {
    return this.requests[_name] !== undefined;
  }

  modifyAddRequest(_name, _crud) {
    if (this.apiSource.addNewRequest(_name, _crud)) {
      this.changedContent();
    } else {
      return false;
    }
  }

  get requestsList() {
    var self = this;

    return Object.keys(this.requests).map(function(_key) {
      self.requests[_key].name = _key;
      return self.requests[_key];
    });
  }


  updateRequest(_request) {
    let reqName = _request.name;
    this.requests[reqName] = _request;
    delete this.requests[reqName].name;

    this.changedContent();
  }

  deleteRequest(_request) {
    let reqName = _request.name;
    delete this.requests[reqName];
    console.log(this.requests);
    this.changedContent();
  }

  // getRequestTestFieldPlaceholder(_requestName, _name, _value) {
  //
  // }
  //
  //
  // setRequestTestFieldPlaceholder(_requestName) {
  //
  // }


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

export default ApiInterfaceContextController;