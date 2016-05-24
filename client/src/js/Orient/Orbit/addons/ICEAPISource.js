"use strict";


import ArrayHandler from '../../../util/ArrayHandler';
import ObjectExtends from '../../../util/ObjectExtends';

class ICEAPISource extends Orbit.APIFactory.APISource {
  constructor(_APISourceData, _orbit) {
    super(_APISourceData, _orbit);
    if (Orbit.bn === 'ie' && Orbit.bv <= 10) {
      Orbit.APIFactory.APISource.call(this, _APISourceData, _orbit);
    }

    this.clazz = 'ICEAPISource';

    this.nodeTypeMeta = null;

    this.host = this.orbit.config.getField('CMS_HOST');
  }

  loadNodeTypeMeta(_complete) {
    let self = this;
    // ICEAPISource 내부에 iceDriver 구현해야 함. serviceManager가 제외되고 orbit에 의존하며 ICEAPISource가 애드온으로 동작하므로
    // this.serviceManager.iceDriver.getNodeType(this.nid, function(_result) {
    //   _complete(_result);
    // });
  }

  prepareNodeTypeMeta(_complete) {
    console.log("Prepare");
    let self = this;

    this.loadNodeTypeMeta(function(_nodeTypeMeta) {
      self.nodeTypeMeta = _nodeTypeMeta;

      _complete(_nodeTypeMeta);
    });
  }

  // APIFarmSource 에서 오버라이딩
  getRequestLocation(_reqId) {
    let req = this.findRequest(_reqId);

    if (!this.nt_tid) {
      console.error(`Not found 'nt_tid' in`, this.importData);
    }


    if (req !== undefined) {
      return '/api/' + this.nt_tid + '/' + req.crudPoint;
    } else {
      return '';
    }
  }

  getRequestURL(_reqId) {
    return this.host + this.getRequestLocation(_reqId)
  }

  getDefaultFields() {
    return {
      t: 'api'
    };
  }

  convertFieldsToFormData(_fields) {
    let formData = new FormData();
    let fieldKeys = Object.keys(_fields);

    fieldKeys.map(function(_key) {
      formData.append(_key, _fields[_key]);
    });

    return formData;
  }

  executeTestRequest(_requestId, _complete) {
    let self = this;

    if (this.nodeTypeMeta === null) {
      this.prepareNodeTypeMeta(function() {
        self.executeTestRequest(_requestId, _complete);
      });
    } else {
      let req = this.findRequest(_requestId);

      let fields = {};

      req.fields.map(function(_field) {
        fields[_field.key] = _field.testValue;
      });

      this.executeRequest(_requestId, fields, {}, function(_result) {
        _complete(_result);
      });
    }
  }

  executeTestRequestAsDataFrame(_requestId, _complete) {
    let self = this;
    this.executeTestRequest(_requestId, function(_result) {

      let reqIndex = ArrayHandler.findIndex(self.requests, {
        id: _requestId
      });

      let req = self.requests[reqIndex];

      if (req.crud === '**') {
        _complete(_result);
      } else {
        let dataframe = self.createResultDataFrame(_result, self.nodeTypeMeta.propertytype);
        console.log(dataframe);
        _complete(dataframe);
      }

    });

  }

  createResultDataFrame(_resultData, _propertytpye) {
    let dataFrame = {};

    if (_resultData.items !== undefined) {
      dataFrame.items = this.makeFrame_item_field(_resultData.items, _propertytpye);
      dataFrame.count = _resultData.count;
    }

    if (_resultData.page !== undefined) {
      dataFrame.page = _resultData.page;
      dataFrame.page.pages = [_resultData.page.pages[0]];
    }

    if (_resultData.read == 1) {
      Object.keys(_propertytpye).map(function(_ptkey) {
        dataFrame[_ptkey] = _resultData[_ptkey] || _ptkey;
      });
    }

    if (_resultData.result !== undefined) {
      dataFrame.result = _resultData.result;
    }

    if (_resultData.success !== undefined) {
      dataFrame.success = _resultData.success;
    }

    return dataFrame;
  }

  makeFrame_item_field(_items, _propertytpye) {
    let sampleItems = [];

    let sampleItem = {};

    let itemData = _items[0] || {};

    Object.keys(_propertytpye).map(function(_ptkey) {
      let pt = _propertytpye[_ptkey];

      sampleItem[_ptkey] = itemData[_ptkey];
    });

    sampleItems.push(sampleItem);

    return sampleItems;
  }


  import (_ICEAPISourceData) {
    let ICEAPISourceData = _ICEAPISourceData || {};
    super.import(ICEAPISourceData);

    this.nt_tid = ICEAPISourceData.nt_tid;
    this.nid = ICEAPISourceData.nid;
  }

  export () {
    let exportO = super.export();
    exportO.nt_tid = this.nt_tid;
    exportO.nid = this.nid;

    return exportO;
  }
}

Orbit.APIFactory.RegisterNewType('cms', ICEAPISource);

export default ICEAPISource;