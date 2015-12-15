import Request from './API/Request.js';
import _ from 'underscore';

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

  findRequest(_id) {
    let foundReqIdx = _.findIndex(this.requests, {
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

  getRequestLocation(_reqId) {
    let req = this.findRequest(_reqId);

    if (req !== undefined) {
      return '/api/' + this.nt_tid + '/' + req.crudPoint;
    } else {
      return '';
    }
  }

  executeRequest(_requestId, _fields, _heads, _complete) {
    _fields.t = 'api';
    let req = this.findRequest(_requestId);

    this.serviceManager.iceDriver.requestNodeType(req.method, this.nt_tid, req.crudType, _heads, _fields, function(_result) {

      _complete(_result);
    });
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