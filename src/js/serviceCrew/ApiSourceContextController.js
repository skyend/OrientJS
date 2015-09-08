var ApiSourceContextController = function(_apiMeta, _session, _serviceManager) {
  this.attached = false;
  this.apiSourceContext = null;
  this.running = false;
  this.nodeTypeId = _apiMeta.nodeTypeId;
  console.log('Node Type Id', this.nodeTypeId);

  this.session = _session;
  this.serviceManager = _serviceManager;
};

ApiSourceContextController.prototype.attach = function(_context) {
  this.attached = true;
  this.context = _context;

  var nodeTypeData = this.serviceManager.getNodeTypeData(this.nodeTypeId);
  console.log(nodeTypeData);

  this.context.setState({
    nodeTypeData: nodeTypeData
  });
};

ApiSourceContextController.prototype.pause = function() {

};

ApiSourceContextController.prototype.resume = function() {

};


module.exports = ApiSourceContextController;