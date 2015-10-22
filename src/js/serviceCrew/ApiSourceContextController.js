import _ from 'underscore';
import RequestManager from './RequestManager.js';

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
    this.unsaved = false;
    this.context.feedSaveStateChange();
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

  }

  resume() {

  }


  addInterface(_interfaceId) {

    this.apiSource['interface'] = this.apiSource['interface'] || [];

    let foundIndex = _.findIndex(this.apiSource['interface'], function(_id) {
      return _id === _interfaceId;
    });

    if (foundIndex > -1) {
      return false;
    }

    this.apiSource['interface'].push(_interfaceId);

    return true;
  }

  get followedInterfaceList() {
    return this.apiSource['interface'] || [];
  }



}


module.exports = ApiSourceContextController;