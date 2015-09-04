/**
 * ServiceManager
 *
 *
 */
var _ = require('underscore');

var DocumentContextController = require('./serviceCrew/DocumentContextController.js');


var ServiceManager = function(_session, _serviceKey) {
  this.serviceKey = _serviceKey;
  this.session = _session;
  this.docContextControllers = {};

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
  var resultString = _text.replace(/\${\w+:.+?}/g, '{{Temporary Resolved}}');

  var sampleUrlMap = {
    image01: 'http://html5up.net/uploads/demos/strongly-typed/images/pic01.jpg',
    image02: 'http://html5up.net/uploads/demos/strongly-typed/images/pic02.jpg',
    image03: 'http://html5up.net/uploads/demos/strongly-typed/images/pic03.jpg',
    image04: 'http://html5up.net/uploads/demos/strongly-typed/images/pic04.jpg',
    image05: 'http://html5up.net/uploads/demos/strongly-typed/images/pic05.jpg',
    image06: 'http://html5up.net/uploads/demos/strongly-typed/images/pic06.jpg',
    image07: 'http://html5up.net/uploads/demos/strongly-typed/images/pic07.jpg'
  };

  if (/\${url:.+?}/.test(_text)) {
    var urlKey = _text.replace(/^\${url:(.+?)}$/, "$1");

    resultString = sampleUrlMap[urlKey];
  }

  return resultString;
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