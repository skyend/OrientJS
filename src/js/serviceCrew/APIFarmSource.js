import ICEAPISource from './ICEAPISource';
import SuperAgent from 'superagent';
import Request from './API/Request';

class APIFarmSource extends ICEAPISource {
  constructor(_APISourceData, _serviceManager) {
    super(_APISourceData, _serviceManager);
    this.clazz = 'APIFarmSource';

    this.meta = null;
  }

  get key() {
    return `farm/${this.farmServiceId}/${this.classId}`;
  }

  getMetaPath() {
    return `/config/api/service/read.json?serviceId=${this.farmServiceId}&typeId=${this.classId}`
  }

  getMetaURL() {
    return this.host + this.getMetaPath();
  }

  loadTypeOfService(_complete) {
    SuperAgent.get(this.getMetaURL())
      .end(function(err, res) {
        if (err !== null) {
          complete(null);
        } else {
          complete(res.body, res.statusCode);
        }
      });
  }

  prepareMeta(_complete) {
    let that = this;
    this.loadTypeOfService(function(_result) {
      if (_result === null) {
        throw new Error('Fail load APIFarm meta');
      }

      that.meta = _result;
    })
  }


  getRequestLocation(_reqId) {
    let req = this.findRequest(_reqId);
    //http://125.131.88.77:8200/api/vod/category/list.json

    if (req !== undefined) {
      return `/api/${this.farmServiceId}/${this.classId}/${req.crudPoint}`; //'/api/' + this.nt_tid + '/' + req.crudPoint;
    } else {
      return '';
    }
  }

  import (_APIFarmSourceData) {
    let APIFarmSourceData = _APIFarmSourceData || {};

    this.id = APIFarmSourceData._id;
    this.farmServiceId = APIFarmSourceData.farmServiceId;
    this.classId = APIFarmSourceData.classId;
    this.title = APIFarmSourceData.title;
    this.icon = APIFarmSourceData.icon;
    this.serviceId = APIFarmSourceData.serviceId;
    this.created = APIFarmSourceData.created;
    this.requests = APIFarmSourceData.requests || [];
    this.requests = this.requests.map(function(_r) {
      return new Request(_r);
    });
  }

  export () {
    return {
      //_id: this.id,
      farmServiceId: this.farmServiceId, // system / [service] / type / api
      classId: this.classId, // system / [service] / [type] / api
      title: this.title,
      icon: this.icon,
      serviceId: this.serviceId,
      created: this.created,
      requests: this.requests.map(function(_request) {
        return _request.export();
      })
    }
  }
}

export default APIFarmSource;