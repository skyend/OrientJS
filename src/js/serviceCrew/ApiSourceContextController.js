import _ from 'underscore';
import RequestManager from './RequestManager.js';
import ICEServer from '../builder.ICEServer.js';
import APISource from './APISource.js';

class ApiSourceContextController extends RequestManager {
  constructor(_apisource, _session, _serviceManager) {
    super();
    this.attached = false;
    this.apiSourceContext = null;
    this.running = false;
    this.nodeTypeId = _apisource.nt_tid;
    this.nodetypeIcon = _apisource.icon;
    this.title = _apisource.title;
    this.nid = _apisource.nid;

    this.apiSource = _apisource;
    this.requests = this.apiSource.requests = this.apiSource.requests || {};
    this.apiSource.interfaces = this.apiSource.interfaces || [];
    this.apiSource.placeholders = this.apiSource.placeholders || {};



    this.unsaved = false;
    console.log('Node Type Id', this.nodeTypeId);

    this.session = _session;
    this.serviceManager = _serviceManager;
  }

  attach(_context) {
    this.attached = true;
    this.context = _context;
  }

  get iconURL() {
    if (this.nodetypeIcon !== '') {
      return this.serviceManager.iceHost + '/icon/' + this.nodetypeIcon;
    }

    return undefined;
  }

  save() {
    var self = this;
    console.log(this.apiSource);
    this.serviceManager.saveAPISource(this.apiSource._id, this.apiSource, function(_result) {

      self.unsaved = false;
      self.context.feedSaveStateChange();
    });
  }

  changedContent() {
    if (this.unsaved) return;
    this.unsaved = true;
    this.context.feedSaveStateChange();
  }

  get isUnsaved() {
    return this.unsaved;
  }

  getNodetypeData(_complete) {
    this.serviceManager.iceDriver.getNodeType(this.nid, function(_result) {
      _complete(_result);
    });
  }

  pause() {
    this.running = false;
  }

  resume() {
    this.running = true;
  }


  addInterface(_interfaceId) {

    this.apiSource['interfaces'] = this.apiSource['interfaces'] || [];

    let foundIndex = _.findIndex(this.apiSource['interfaces'], function(_id) {
      return _id === _interfaceId;
    });

    if (foundIndex > -1) {
      return false;
    }

    this.apiSource['interfaces'].push(_interfaceId);

    this.changedContent();

    return true;
  }

  setRequestTestFieldPlaceholder(_requestName, _name, _value) {
    this.apiSource.placeholders[_requestName] = this.apiSource.placeholders[_requestName] || {};
    this.apiSource.placeholders[_requestName]['testFields'] = this.apiSource.placeholders[_requestName]['testFields'] || {};
    this.apiSource.placeholders[_requestName]['testFields'][_name] = _value;

    this.changedContent();
  }

  getRequestTestFieldPlaceholder(_requestName) {
    return ((this.apiSource.placeholders[_requestName] || {})['testFields'] || {});
  }

  getRequestHeaderPlaceholder(_requestName) {
    return ((this.apiSource.placeholders[_requestName] || {})['testHeaders'] || {});
  }

  needFollowInterfacesState() {
    var self = this;
    this.context.state.followInterfaces = [];

    for (var i = 0; i < this.apiSource['interfaces'].length; i++) {
      this.serviceManager.getAPIInterface(this.apiSource['interfaces'][i], function(_interface) {
        console.log(_interface, 'loaded interface');
        self.context.state.followInterfaces.push(_interface);

        self.context.setState({
          followInterfaces: self.context.state.followInterfaces
        });
      });
    }
  }

  get followedInterfaceList() {
    return this.apiSource['interfaces'] || [];
  }

  executeRequestTest(_request, _fields, _headers, _end) {
    console.log("Request ", _request);

    let fields = _fields || [];
    let headers = _headers || [];
    let testValueSet = this.getRequestTestFieldPlaceholder(_request.name);
    let testHeaderValueSet = this.getRequestHeaderPlaceholder(_request.name);
    console.log(testValueSet);
    fields = fields.map(function(_field) {

      let cloneField = _.clone(_field);

      if (cloneField.testValue === undefined || cloneField.testValue === '') {
        cloneField.testValue = testValueSet[_field.name] || '';
      }

      return cloneField;
    });

    console.log(_request);


    ICEServer.getInstance().requestNodeType(_request.method, this.nodeTypeId, _request.crud, headers, fields, function(_result) {
      console.log(_result);
      _end(_result);
    });

    // console.log(this.apiSource);
    // this.apiSource.executeTestRequest(_request.name, _end)

  }


}


module.exports = ApiSourceContextController;