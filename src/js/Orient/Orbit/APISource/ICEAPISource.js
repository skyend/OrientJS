"use strict";
import Request from './Request.js';
import _ from 'underscore';
import SuperAgent from 'superagent';
import APISource from './APISource';
import ArrayHandler from '../../../util/ArrayHandler';
import ObjectExtends from '../../../util/ObjectExtends';


export default class ICEAPISource extends APISource {
  constructor(_APISourceData, _orbit) {
    super(_APISourceData, _orbit);
    this.clazz = 'ICEAPISource';

    this.nodeTypeMeta = null;
    this.host = '';
  }

  get key() {
    return this.nt_tid;
  }

  setHost(_host) {
    this.host = _host;
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

  addNewRequest(_name, _crud) {
    let newRequest = new Request({
      name: _name,
      crud: _crud
    });

    this.requests.push(newRequest);
  }

  findRequest(_id) {
    let foundReqIdx = ArrayHandler.findIndex(this.requests, {
      id: _id
    });

    if (foundReqIdx !== -1) {
      return this.requests[foundReqIdx];
    } else {
      return undefined;
    }
  }

  changeRequestCRUD(_reqId, _crud) {
    let req = this.findRequest(_reqId);

    if (req !== undefined) {
      req.crud = _crud;
      return true;
    }

    return false;
  }

  changeRequestCustomCRUD(_reqId, _value) {
    let req = this.findRequest(_reqId);

    if (req !== undefined) {
      req.customCrud = _value;
      return true;
    }

    return false;
  }

  changeRequestCustomURL(_reqId, _value) {
    let req = this.findRequest(_reqId);

    if (req !== undefined) {
      req.customURL = _value;
      return true;
    }

    return false;
  }

  changeRequestMethod(_reqId, _method) {
    let req = this.findRequest(_reqId);

    if (req !== undefined) {
      req.method = _method;
      return true;
    }

    return false;
  }

  requestNewField(_requestId) {
    let req = this.findRequest(_requestId);

    if (req !== undefined) {
      req.addNewField();
      return true;
    }

    return false;
  }

  changeRequestFieldKey(_requestId, _fieldId, _value) {
    let req = this.findRequest(_requestId);

    if (req !== undefined) {
      req.changeFieldKey(_fieldId, _value);
      return true;
    }

    return false;
  }

  changeRequestFieldValue(_requestId, _fieldId, _value) {
    let req = this.findRequest(_requestId);

    if (req !== undefined) {
      req.changeFieldValue(_fieldId, _value);
      return true;
    }

    return false;
  }

  changeRequestFieldTestValue(_requestId, _fieldId, _value) {
    let req = this.findRequest(_requestId);

    if (req !== undefined) {
      req.changeFieldTestValue(_fieldId, _value);
      return true;
    }

    return false;
  }

  removeRequestField(_requestId, _fieldId) {
    let req = this.findRequest(_requestId);

    if (req !== undefined) {
      req.removeField(_fieldId);
      return true;
    }

    return false;
  }

  removeRequest(_requestId) {
    let req = this.findRequest(_requestId);

    if (req !== undefined) {
      this.requests = this.requests.filter(function(_r) {
        return _requestId !== _r.id;
      });
      return true;
    }

    return false;
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

    this.id = ICEAPISourceData._id;
    this.nt_tid = ICEAPISourceData.nt_tid;
    this.title = ICEAPISourceData.title;
    this.icon = ICEAPISourceData.icon;
    this.nid = ICEAPISourceData.nid;
    this.serviceId = ICEAPISourceData.serviceId;
    this.created = ICEAPISourceData.created;
    this.requests = ICEAPISourceData.requests || [];
    this.requests = this.requests.map(function(_r) {
      return new Request(_r);
    });
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