class ApiSourceContextController {
  constructor(_apisource, _session, _serviceManager) {
    this.attached = false;
    this.apiSourceContext = null;
    this.running = false;
    this.nodeTypeId = _apisource.nt_tid;
    this.nodetypeIcon = _apisource.icon;
    this.title = _apisource.title;

    console.log('Node Type Id', this.nodeTypeId);

    this.session = _session;
    this.serviceManager = _serviceManager;
  }

  attach(_context) {
    this.attached = true;
    this.context = _context;

    var nodeTypeData = this.serviceManager.getNodeTypeData(this.nodeTypeId);
    console.log(nodeTypeData);

    this.context.setState({
      nodeTypeData: nodeTypeData
    });
  }

  get iconURL() {
    if (this.nodetypeIcon !== '') {
      return this.serviceManager.iceHost + '/icon/' + this.nodetypeIcon;
    }

    return undefined;
  }

  get nodetypeData() {

  }

  pause() {

  }

  resume() {

  }
}


module.exports = ApiSourceContextController;