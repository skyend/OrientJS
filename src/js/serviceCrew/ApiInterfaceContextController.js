import RequestManager from './RequestManager.js';

class ApiInterfaceContextController extends RequestManager {
  constructor(_apiinterface, _session, _serviceManager) {
    super();
    this.attached = false;
    this.context = null;
    this.running = false;
    this.title = _apiinterface.title;
    this.apiInterface = _apiinterface;

    console.log('Node Type Id', this.nodeTypeId);

    this.session = _session;
    this.serviceManager = _serviceManager;
  }

  attach(_context) {
    this.attached = true;
    this.context = _context;

    // var nodeTypeData = this.serviceManager.getNodeTypeData(this.nodeTypeId);
    // console.log(nodeTypeData);
    //
    // this.context.setState({
    //   nodeTypeData: nodeTypeData
    // });
  }

  pause() {

  }

  resume() {

  }


}


module.exports = ApiInterfaceContextController;