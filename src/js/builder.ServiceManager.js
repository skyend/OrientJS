/**
 * ServiceManager
 *
 *
 */
var _ = require('underscore');
var request = require('superagent');

var DocumentContextController = require('./serviceCrew/DocumentContextController.js');
var ApiSourceContextControllers = require('./serviceCrew/ApiSourceContextController.js');

var ObjectExplorer = require('./util/ObjectExplorer.js');

var ServiceManager = function(_app, _service_id) {
  this.app = _app;
  this.service_id = _service_id;
  this.serviceKey = 'ionTest';
  this.docContextControllers = {};
  this.apiSourceContextControllers = {};
  this.sampleDatas = {};

  this.chechedApiResources = {};

  //this.sampleDatas['broadcast_series'] = this.session.certifiedRequestJSON("http://dcsf-dev03.i-on.net:8081/api/broadcast_series/list.json?t=api");
};

ServiceManager.prototype.init = function() {
  this.meta = this.app.session.certifiedRequestJSON("/BuildingProjectData/Services/" + this.serviceKey + "/service.json");
};

ServiceManager.prototype.loadMetaData = function(_complete) {
  var serviceIdx = 1;
  var self = this;

  this.app.gelateriaRequest.loadService(serviceIdx, function(_result) {
    console.log(_result);
    self.meta = _result;
    _complete(_result);
  });
};

//http://dcsf-dev03.i-on.net:8081/api/broadcast_series/list.json?t=api
ServiceManager.prototype.getNodeTypeData = function(_nodeTypeId) {

  return this.app.session.certifiedRequestJSON("http://dcsf-dev03.i-on.net/api/" + _nodeTypeId + "/list.json?t=api");
};

ServiceManager.prototype.getDocumentMetaList = function() {
  return this.meta.documents;
};

ServiceManager.prototype.getPageMetaList = function() {
  return this.meta.pages;
};

ServiceManager.prototype.getAPISourceMetaList = function() {
  return this.meta.apiSources;
};

ServiceManager.prototype.createDocument = function(_title, _type, _complete) {
  //console.log('create ', _title, _type);

  this.app.gelateriaRequest.createDocument(this.meta._id, _title, _type, function() {
    _complete();
  });
};

// Deprecated
// ServiceManager.prototype.getDocumentMetaById = function(_idx) {
//   var metaList = this.getDocumentMetaList();
//   console.log(_idx, metaList);
//   var index = _.findIndex(metaList, {
//     idx: _idx
//   });
//
//
//
//   return metaList[index];
// };

ServiceManager.prototype.getAPISourceMetaById = function(_id) {
  var metaList = this.getAPISourceMetaList();

  var index = _.findIndex(metaList, {
    id: _id
  });

  return metaList[index];
};

// Deprecated
// ServiceManager.prototype.loadDocumentByMeta = function(_documentMeta) {
//   var documentURL = "/BuildingProjectData/Services/" + this.serviceKey + "/Documents/" + _documentMeta.key + ".json";
//
//   var documentJSON = this.session.certifiedRequestJSON(documentURL);
//
//   return documentJSON;
// };

ServiceManager.prototype.getICafeAPIDataOfField = function(_dataPath) {
  var apiResourceKey = _dataPath.split('/')[0];

  if (this.chechedApiResources[apiResourceKey] === undefined) {
    this.chechedApiResources[apiResourceKey] = this.getNodeTypeData(apiResourceKey);
  }


  return ObjectExplorer.getValueByKeyPath(this.chechedApiResources, _dataPath);
};

/********
 * resolveString
 * 모든 String 을 바인딩 법칙에 따라 변환하여준다.
 * ${url:...} / ${field:... } / ${title:...}
 */
ServiceManager.prototype.resolveString = function(_text) {
  var self = this;
  var sampleUrlMap = {
    image01: 'http://html5up.net/uploads/demos/strongly-typed/images/pic01.jpg',
    image02: 'http://html5up.net/uploads/demos/strongly-typed/images/pic02.jpg',
    image03: 'http://html5up.net/uploads/demos/strongly-typed/images/pic03.jpg',
    image04: 'http://html5up.net/uploads/demos/strongly-typed/images/pic04.jpg',
    image05: 'http://html5up.net/uploads/demos/strongly-typed/images/pic05.jpg',
    image06: 'http://html5up.net/uploads/demos/strongly-typed/images/pic06.jpg',
    image07: 'http://html5up.net/uploads/demos/strongly-typed/images/pic07.jpg'
  };


  return _text.replace(/\${(\w+):(.+?)}/g, function(_matched, _namespace, _want) {
    if (_namespace === 'url') {
      return sampleUrlMap[_want] || _matched;
    } else if (_namespace === 'api') {

      return self.getICafeAPIDataOfField(_want) || _matched;
    } else if (_namespace === 'text') {
      return _want;
    }
  });
};


ServiceManager.prototype.getDocumentContextController = function(_documentIdx, _complete) {
  var self = this;

  if (this.docContextControllers[_documentIdx] === undefined) {

    this.app.gelateriaRequest.loadDocument(this.meta.idx, _documentIdx, function(_docJSON) {
      var documentContextController = new DocumentContextController(_docJSON, self.app.session, self);

      self.docContextControllers[_documentIdx] = documentContextController;

      _complete(self.docContextControllers[_documentIdx])
    });

  } else {
    _complete(this.docContextControllers[_documentIdx]);
  }
};

ServiceManager.prototype.getApiSourceContextController = function(_apiSourceId) {

  if (this.apiSourceContextControllers[_apiSourceId] === undefined) {
    var apiSourceMeta = this.getAPISourceMetaById(_apiSourceId);

    var apiSourceContextController = new ApiSourceContextControllers(apiSourceMeta, this.app.session, this);

    this.apiSourceContextControllers[_apiSourceId] = apiSourceContextController;
  }

  console.log(this.apiSourceContextControllers[_apiSourceId]);
  return this.apiSourceContextControllers[_apiSourceId];
};


module.exports = ServiceManager;