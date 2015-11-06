import Request from './Request.js';
import _ from 'underscore';

export default class APISource {
  constructor(_app, _apiSourceData, _apiInterfaceList) {

    this.app = _app;
    this.apiInterfaceList = _apiInterfaceList;
    this.hasNodeTypeData = false;
    this._nodeTypeData = null;

    this.importSource(_apiSourceData);
  }

  addInterface(_interfaceId) {

    this.interfaces = this.interfaces || [];

    let foundIndex = _.findIndex(this.interfaces, function(_id) {
      return _id === _interfaceId;
    });

    if (foundIndex > -1) {
      return false;
    }

    this.interfaces.push(_interfaceId);

    return true;
  }

  setRequestTestFieldPlaceholder(_requestName, _name, _value) {
    this.placeholders[_requestName] = this.placeholders[_requestName] || {};
    this.placeholders[_requestName]['testFields'] = this.placeholders[_requestName]['testFields'] || {};
    this.placeholders[_requestName]['testFields'][_name] = _value;
  }

  getRequestTestFieldPlaceholder(_requestName) {
    return ((this.placeholders[_requestName] || {})['testFields'] || {});
  }

  getRequestHeaderPlaceholder(_requestName) {
    return ((this.placeholders[_requestName] || {})['testHeaders'] || {});
  }

  get followedInterfaceList() {
    return this.interfaces || [];
  }

  existsRequest(_name) {
    return this.requests[_name] !== undefined;
  }

  // addRequest(_name, _crud) {
  //   let newRequest = new Request({
  //     name: _name,
  //     crud: _crud,
  //     fieldList: [],
  //     headerList: [],
  //     customUrlPattern: '',
  //     fieldTestValues: {}
  //   });
  // }

  get requestsList() {
    var self = this;

    return Object.keys(this.requests).map(function(_key) {
      self.requests[_key].name = _key;
      return self.requests[_key];
    });
  }


  // updateRequest(_request) {
  //   let reqName = _request.name;
  //   this.requests[reqName] = _request;
  //   delete this.requests[reqName].name;
  // }
  //
  // deleteRequest(_request) {
  //   let reqName = _request.name;
  //   delete this.requests[reqName];
  // }

  executeTestRequest(_requestName, _end) {
    let self = this;
    let request = this.requests[_requestName];

    let fields = request.calcurateFields(this.nodeTypeData);
    let headers = request.calcurateHeaders();
    //let fieldMap = {};
    //let headerMap = {};

    let fieldPlaceholders = this.getRequestTestFieldPlaceholder(_requestName);

    fields = fields.map(function(_field) {
      _field.testValue = fieldPlaceholders[_field.name];
      return _field;
    });


    this.app.serviceManager.iceDriver.requestNodeType(request.method, this.nt_tid, request.crud, headers, fields, function(_result) {
      request.testResultData = _result;

      request.testDataFrame = request.createResultDataFrame(request.testResultData, self.nodeTypeData.propertytype);

      _end(_result);
    });
  }

  set nodeTypeData(_nodeTypeData) {
    this._nodeTypeData = _nodeTypeData;
    this.hasNodeTypeData = true;
  }

  get nodeTypeData() {
    return this._nodeTypeData || null;
  }


  // 노드타입 데이터를 로드해 자신에게 입력한다.
  prepareNodeTypeData(_end) {
    let self = this;
    this.app.serviceManager.iceDriver.getNodeType(this.nid, function(_result) {
      console.log("prepareNodeTypeData", _result);
      self.nodeTypeData = _result;
      _end(true);
    });
  }

  importSource(_apiSourceData) {
    let self = this;

    this.id = _apiSourceData._id;
    this.nt_tid = _apiSourceData.nt_tid;
    this.title = _apiSourceData.title;
    this.icon = _apiSourceData.icon;
    this.nid = _apiSourceData.nid;
    this.serviceId = _apiSourceData.serviceId;
    this.created = _apiSourceData.created;
    this.requests = _apiSourceData.requests || {}; // {}
    Object.keys(this.requests).map(function(_key) {
      self.requests[_key] = new Request(self.requests[_key]);
    });

    this.interfaces = _apiSourceData.interfaces || []; // []
    this.interfaces.map(function(_interfaceId) {
      let interfaceIndex = _.findIndex(self.apiInterfaceList, function(_interface) {
        return _interface._id === _interfaceId;
      });

      let interfaceObject = self.apiInterfaceList[interfaceIndex];

      Object.keys(interfaceObject.requests || {}).map(function(_key) {
        self.requests[_key] = new Request(interfaceObject.requests[_key]);
      });
    });

    this.placeholders = _apiSourceData.placeholders || {}; // {}
  }

  exportSource() {

    return {
      "_id": this.id,
      "nt_tid": this.nt_tid,
      "title": this.title,
      "icon": this.icon,
      "nid": this.nid,
      "serviceId": this.serviceId,
      "created": this.created,
      "requests": function(self) {
        let requests = {};
        Object.keys(self.requests).map(function(_key) {
          let request = self.requests[_key];

          if (!request.isFrame) {
            requests[_key] = request;
          }
        });
        return requests;
      }(this), // 추후에 배열로 변환하기
      "interfaces": this.interfaces,
      "placeholders": this.placeholders
    }
  }
}

/*
{
    "_id" : ObjectId("5638c32cd2a8f80a000f567d"),
    "nt_tid" : "_tags",
    "title" : "Tag List",
    "icon" : "fugue/stw/tags_label.png",
    "nid" : "202003",
    "serviceId" : "56193d507acb5b7b633dc8ec",
    "created" : "2015-11-03T14:22:36.720Z",
    "requests" : {},
    "interfaces" : [
        "5628af4bd2a8f80a000f566b"
    ],
    "placeholders" : {}
}
*/