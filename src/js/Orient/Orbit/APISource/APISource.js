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

    this.import(_APISourceData);
  }


  addNewRequest(_name, _crud) {
    let newRequest = new Request({
      name: _name,
      crud: _crud
    });

    this.requests.push(newRequest);
  }

  findRequest(_id) {
    let foundReqIdx = ArrayHandler.findIndex(this.requests, function(_req) {
      return _req.id === _id;
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


  // Proposal Override
  getRequestLocation(_reqId) {
    let req = this.findRequest(_reqId);

    if (req !== undefined) {
      if (req.crud === '**') {
        return req.customURL;
      } else {
        url = this.getRequestURL(_requestId); //this.host + "/api/" + this.nt_tid + "/" + req.crudPoint;
      }

      return '/api/' + this.nt_tid + '/' + req.crudPoint;
    } else {
      return '';
    }
  }

  assemblyURLWithRequest(_reqId) {

    let urlSnippet = this.getRequestLocation(_reqId);
    if (/http:\/\//.test(urlSnippet)) {

      return this.host + urlSnippet;
    } else {
      return urlSnippet;
    }
  }

  resolvefieldObject(_fieldObject) {
    let keys = Object.keys(_fieldObject)
    let resolvedObject = {};
    let key;
    for (let i = 0; i < keys.length; i++) {
      key = keys[i];

      resolvedObject[key] = this.orbit.interpret(_fieldObject[key]);
    }

    return resolvedObject;
  }


  // Proposal Override
  getDefaultFields() {
    return {};
  }

  /*
    application/x-www-form-urlencoded: The default value if the attribute is not specified.
    multipart/form-data: The value used for an <input> element with the type attribute set to "file".
    text/plain (HTML5)
  */
  executeRequest(_requestId, _fields, _head, _cb, _enctypeOrComplete) {
    let that = this;
    let req = this.findRequest(_requestId);

    let fieldObject = ObjectExtends.merge(this.getDefaultFields(), ObjectExtends.merge(req.getFieldsObject(), _fields, true));
    let resolvedFieldObject = this.resolvefieldObject(fieldObject);

    this.orbit.HTTPRequest.request(req.method, this.assemblyURLWithRequest(_requestId), resolvedFieldObject, function(_err, _res) {

      that.processAfterResponse(_err, _res, _cb);
    }, _enctypeOrComplete);
  }


  // Proposal Override
  processAfterResponse(_err, _res, _passCB) {
    _passCB(_err, _res.body, _res.statusCode);
  }


  import (_APISource) {
    let APISource = _APISource || {};

    this.id = APISource._id;
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
      _id: this.id,
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