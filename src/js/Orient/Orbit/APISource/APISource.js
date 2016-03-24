"use strict";
import Request from './Request.js';
import ArrayHandler from '../../../util/ArrayHandler';
import ObjectExtends from '../../../util/ObjectExtends';

import SuperAgent from 'superagent';

export default class APISource {
  constructor(_APISourceData, _orbit) {
    this.clazz = 'APISource';

    this.orbit = _orbit;

    this.importData = _APISourceData;

    this.host = '';
    this.import(_APISourceData);
  }

  get key() {
    return this.name;
  }

  setHost(_iceHost) {
    this.host = _iceHost;
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

    if (req !== undefined) {
      return '/api/' + this.nt_tid + '/' + req.crudPoint;
    } else {
      return '';
    }
  }

  getRequestURL(_reqId) {
    return this.host + this.getRequestLocation(_reqId)
  }


  executeRequest(_requestId, _fields, _head, _cb) {

    let req = this.findRequest(_requestId);

  }

  /*
    application/x-www-form-urlencoded: The default value if the attribute is not specified.
    multipart/form-data: The value used for an <input> element with the type attribute set to "file".
    text/plain (HTML5)
  */
  /**
    ExecuteRequest
    _enctypeOrComplete : 'multipart/form-data' | 'application/x-www-form-urlencoded' | completeCallback(Function) : default: 'application/x-www-form-urlencoded' // 전송 타입
  */
  executeRequest2(_requestId, _fields, _heads, _enctypeOrComplete, _complete) {
    let enctype, complete;
    let fields = _fields || {};
    let that = this;
    let req = this.findRequest(_requestId);
    let url;

    if (this.clazz === 'ICEAPISource') fields.t = 'api';

    if (typeof _enctypeOrComplete === 'function') {
      complete = _enctypeOrComplete;
      enctype = 'application/x-www-form-urlencoded';
    } else {
      complete = _complete;
      enctype = _enctypeOrComplete;
    }

    //fields = Object.assign(req.getFieldsObjectWithResolve(), fields);
    fields = ObjectExtends.merge(req.getFieldsObjectWithResolve(), fields, true);

    console.log(req.getFieldsObjectWithResolve());

    if (req.crud === '**') {
      url = req.customURL;
    } else {
      url = this.getRequestURL(_requestId); //this.host + "/api/" + this.nt_tid + "/" + req.crudPoint;
    }

    console.log(fields, 'fields', this);
    if (req.method === 'get') {
      SuperAgent.get(url)
        .query(fields)
        .end(function(err, res) {
          if (err !== null) {
            console.warn(`API Source Request Error. SourceId: ${that.id}, RequestId:${_requestId}`, that);

            complete(null);
          } else {
            complete(res.body, res.statusCode);
          }
        });
    } else if (req.method === 'post') {

      SuperAgent.post(url)
        .type('form')
        .send(enctype === 'multipart/form-data' ? this.convertFieldsToFormData(fields) : fields)
        .end(function(err, res) {
          if (res === null) {
            console.warn(`API Source Request Error. SourceId: ${that.id}, RequestId:${_requestId}`, that);

            complete(null);
          } else {
            complete(res.body, res.statusCode);
          }
        });
    } else {
      console.error(`지원하지 않는 Http Method(${req.method}) 입니다. invalid`, this);
    }
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


  import (_APISource) {
    let APISource = _APISource || {};

    this.id = APISource._id;
    this.host = APISource.host;
    this.name = APISource.name;
    this.title = APISource.title;
    this.icon = APISource.icon;
    this.serviceId = APISource.serviceId;
    this.created = APISource.created;
    this.requests = APISource.requests || [];
    this.requests = this.requests.map(function(_r) {
      return new Request(_r);
    });
  }

  export () {
    return {
      //_id: this.id,
      host: this.host,
      name: this.name,
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