import ICEAPISource from './ICEAPISource';



class APIFarmSource extends ICEAPISource {
  constructor(_APISourceData, _orbit) {
    super(_APISourceData, _orbit);
    if ((Orient.bn === 'ie' && Orient.bv <= 10) || (Orient.bn === 'safari' && Orient.bv <= 534)) {
      ICEAPISource.call(this, _APISourceData, _orbit);
    }

    this.clazz = 'APIFarmSource';

    this.host = this.orbit.config.getField('FARM_HOST');
    this.meta = null;
  }

  getMetaPath() {
    return `/config/api/service/read.json?serviceId=${this.farmServiceId}&typeId=${this.classId}`
  }

  getMetaURL() {
    return this.host + this.getMetaPath();
  }

  getDefaultFields() {
    let defaultFields = {};
    let farm_api_options = this.orbit.config.getField("API_FARM_OPTIONS");

    if (farm_api_options) {
      if (farm_api_options.common_fields) {
        let fields = farm_api_options.common_fields,
          field, field_name, field_value;
        for (let i = 0; i < fields.length; i++) {
          field = fields[i]; // object
          field_name = field.name;
          field_value = field.value;
          if (field_value) {
            defaultFields[field_name] = field_value;
          }
        }
      }
    }

    return defaultFields;
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

    if (!this.farmServiceId) {
      console.error(`Not found 'farmServiceId' in`, this.importData);
    }

    if (!this.classId) {
      console.error(`Not found 'classId' in`, this.importData);
    }

    if (req !== undefined) {
      return `/api/${this.farmServiceId}/${this.classId}/${req.crudPoint}`; //'/api/' + this.nt_tid + '/' + req.crudPoint;
    } else {
      return '';
    }
  }

  import (_APISourceData) {
    let APISourceData = _APISourceData || {};
    super.import(APISourceData);

    this.farmServiceId = APISourceData.farmServiceId;
    this.classId = APISourceData.classId;
  }

  export () {
    let exportO = super.export();
    exportO.classId = this.nt_tid;
    exportO.farmServiceId = this.nid;

    return exportO;
  }
}

Orbit.APIFactory.RegisterNewType('farm', APIFarmSource);

export default APIFarmSource;