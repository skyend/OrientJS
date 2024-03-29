"use strict";
import Request from './Request.js';
import ArrayHandler from '../../../util/ArrayHandler';
import ObjectExtends from '../../../util/ObjectExtends';



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
        var url = this.getRequestURL(_requestId); //this.host + "/api/" + this.nt_tid + "/" + req.crudPoint;
      }

      return '/api/' + this.nt_tid + '/' + req.crudPoint;
    } else {
      return '';
    }
  }

  assemblyURLWithRequest(_reqId) {

    let urlSnippet = this.getRequestLocation(_reqId);
    if (!/http:\/\//.test(urlSnippet)) {

      return this.host + urlSnippet;
    } else {
      return urlSnippet;
    }
  }

  resolvefieldObject(_fieldObject) {
    let keys = Object.keys(_fieldObject);
    let resolvedObject = {};
    let key;
    for (let i = 0; i < keys.length; i++) {
      key = keys[i];
      if (typeof _fieldObject[key] === 'string') {
        resolvedObject[key] = this.orbit.interpret(_fieldObject[key]);
      } else {
        resolvedObject[key] = _fieldObject[key];
      }
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
  executeRequest(_requestId, _fields, _head, _cb, _enctype, _use_ssl,_withCredential = false) {
    let that = this;
    let req = this.findRequest(_requestId);

    if (!req) throw new Error(`Not found a request[${_requestId}] of APISource[${this.__filepath__}]`);

    let withCredentials = req.withCredentials || _withCredential;
    if( typeof withCredentials !== 'boolean' && typeof withCredentials === 'string' ){
      withCredentials = orbit.interpret(withCredentials);
      if( typeof withCredentials !== 'boolean' ){
        console.warn('WithCredential flag value is ' + JSON.stringify( withCredentials ) );
      }
    }



    let fieldObject = ObjectExtends.merge(this.getDefaultFields(), ObjectExtends.merge(this.resolvefieldObject(req.getFieldsObject()), _fields, true), true);

    // let resolvedFieldObject = this.resolvefieldObject(fieldObject);
    // console.log(fieldObject);
    // let keys = Object.keys(fieldObject);
    // let isValid = true;
    // let matterFields = [];
    // keys.map(function(_key) {
    //   if (_key) {
    //     if (fieldObject[_key] === null || fieldObject[_key] === undefined) {
    //       matterFields.push(_key);
    //       isValid = false;
    //     }
    //   }
    // });
    //
    // if (isValid) {
    this.orbit.HTTPRequest.request(req.method, this.assemblyURLWithRequest(_requestId), fieldObject, function(_err, _res) {

      that.processAfterResponse(_err, _res, _cb);
    }, _enctype, true, false, _use_ssl, withCredentials);
    // } else {
    //   console.warn(`[${matterFields.join(',')}] 필드에 undefined 또는 null이 포함되어 있어 ${this.__filepath__}:${_requestId} 요청을 실행 하지 않습니다.`);
    // }
  }

  executeRequestSync(_requestId, _fields, _head, _cb, _enctype, _use_ssl,_withCredential = false) {
    let that = this;
    let req = this.findRequest(_requestId);

    if (!req) throw new Error(`Not found a request[${_requestId}] of APISource[${this.__filepath__}]`);

    let withCredentials = req.withCredentials || _withCredential;
    if( typeof withCredentials !== 'boolean' && typeof withCredentials === 'string' ){
      withCredentials = orbit.interpret(withCredentials);
      if( typeof withCredentials !== 'boolean' ){
        console.warn('WithCredential flag value is ' + JSON.stringify( withCredentials ) );
      }
    }

    let fieldObject = ObjectExtends.merge(this.getDefaultFields(), ObjectExtends.merge(this.resolvefieldObject(req.getFieldsObject()), _fields, true));


    // let resolvedFieldObject = this.resolvefieldObject(fieldObject);
    // let keys = Object.keys(fieldObject);
    //
    // let matterFields = [];
    // let isValid = true;
    // keys.map(function(_key) {
    //   if (_key) {
    //     if (fieldObject[_key] === null || fieldObject[_key] === undefined) {
    //       matterFields.push(_key);
    //       isValid = false;
    //     }
    //   }
    // });

    // if (isValid) {
    this.orbit.HTTPRequest.requestSync(req.method, this.assemblyURLWithRequest(_requestId), fieldObject, function(_err, _res) {

      that.processAfterResponse(_err, _res, _cb);
    }, _enctype,false, false, _use_ssl, withCredentials);
    // } else {
    //   console.warn(`[${matterFields.join(',')}] 필드에 undefined 또는 null이 포함되어 있어 ${this.__filepath__}:${_requestId} 요청을 실행 하지 않습니다.`);
    // }
  }


  // Proposal Override
  processAfterResponse(_err, _res, _passCB) {
    if (_err) {

      _passCB(_err, null, null);
    } else {

      _passCB(null, _res.json, _res);
    }
  }


  import (_APISource) {
    let APISource = _APISource || {};
    let that = this;
    this.id = APISource._id;
    this.name = APISource.name;
    this.title = APISource.title;
    this.icon = APISource.icon;
    this.serviceId = APISource.serviceId;
    this.created = APISource.created;
    this.requests = APISource.requests || [];
    this.requests = this.requests.map(function(_r) {

      return new Request(_r, that.orbit);
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
