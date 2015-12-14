import Request from './Request.js';

export default class ICEAPISource {
  constructor(_ICEAPISourceData, _serviceManager) {
    this.serviceManager = _serviceManager;

    this.nodeTypeMeta = null;

    this.import(_ICEAPISourceData);
  }



  loadNodeTypeMeta(_complete) {
    let self = this;

    this.serviceManager.iceDriver.getNodeType(this.nid, function(_result) {
      _complete(_result);
    });
  }

  prepareNodeTypeMeta(_complete) {
    console.log("Prepare");
    let self = this;

    this.loadNodeTypeMeta(function(_nodeTypeMeta) {
      self.nodeTypeMeta = _nodeTypeMeta;

      _complete(_nodeTypeMeta);
    });
  }

  addNewRequest(_name, _crud) {
    let newRequest = new Request({
      name: _name,
      crud: _crud
    });

    this.requests.push(newRequest);
  }


  import (_ICEAPISourceData) {
    let ICEAPISourceData = _ICEAPISourceData || {};

    this.id = ICEAPISourceData._id;
    this.nt_tid = ICEAPISourceData.nt_tid;
    this.title = ICEAPISourceData.title;
    this.icon = ICEAPISourceData.icon;
    this.nid = ICEAPISourceData.nid;
    this.serviceId = ICEAPISourceData.serviceId;
    this.created = ICEAPISourceData.created;
    this.requests = ICEAPISourceData.requests || [];

  }

  export () {
    return {
      //_id: this.id,
      nt_tid: this.nt_tid,
      title: this.title,
      icon: this.icon,
      nid: this.nid,
      serviceId: this.serviceId,
      created: this.created,
      requests: this.requests.map(function(_request) {
        return _request.export();
      })
    }
  }
}