/**
 * ServiceManager
 *
 *
 */
var _ = require('underscore');

var DocumentContextController = require('./serviceCrew/DocumentContextController.js');
var ObjectExplorer = require('./util/ObjectExplorer.js');

var ServiceManager = function(_session, _serviceKey) {
  this.serviceKey = _serviceKey;
  this.session = _session;
  this.docContextControllers = {};
  this.sampleDatas = {};

  this.sampleDatas['broadcast_series'] = this.session.certifiedRequestJSON("http://dcsf-dev03.i-on.net:8081/api/broadcast_series/list.json?t=api&count=5");

  console.log(ObjectExplorer.getValueByKeyPath(this.sampleDatas['broadcast_series'], 'items/0/nid'));


  this.init();
};

ServiceManager.prototype.init = function() {
  this.meta = this.session.certifiedRequestJSON("/BuildingProjectData/Services/" + this.serviceKey + "/service.json");
};

ServiceManager.prototype.getDocumentMetaList = function() {
  return this.meta.documents;
};

ServiceManager.prototype.getPageMetaList = function() {
  return this.meta.pages;
};

ServiceManager.prototype.getDocumentMetaById = function(_id) {
  var metaList = this.getDocumentMetaList();

  var index = _.findIndex(metaList, {
    id: _id
  });

  return metaList[index];
}

ServiceManager.prototype.loadDocumentByMeta = function(_documentMeta) {
  var documentURL = "/BuildingProjectData/Services/" + this.serviceKey + "/Documents/" + _documentMeta.key + ".json";

  var documentJSON = this.session.certifiedRequestJSON(documentURL);

  return documentJSON;
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
    } else if (_namespace === 'data') {
      return ObjectExplorer.getValueByKeyPath(self.sampleDatas, _want) || _matched;
    } else if (_namespace === 'text') {
      return _want;
    }
  });
};


ServiceManager.prototype.getDocumentContextController = function(_documentId) {

  if (this.docContextControllers[_documentId] === undefined) {
    var docMeta = this.getDocumentMetaById(_documentId);
    var docJSON = this.loadDocumentByMeta(docMeta);

    var documentContextController = new DocumentContextController(docJSON, this.session, this);

    this.docContextControllers[_documentId] = documentContextController;
  }


  return this.docContextControllers[_documentId];
};

module.exports = ServiceManager;