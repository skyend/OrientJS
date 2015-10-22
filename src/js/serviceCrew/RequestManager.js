class RequestManager {
  constructor() {
    this['requests'] = this['requests'] || {};
  }

  existsRequest(_name) {
    return this.requests[_name] !== undefined;
  }

  addRequest(_name, _crud) {
    this.requests[_name] = {
      crud: _crud
    };

    this.changedContent();
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
}

export default RequestManager;