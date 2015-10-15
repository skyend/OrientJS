/**
 * ServiceManager
 *
 *
 */
import _ from 'underscore';
import request from 'superagent';

import PageContextController from './serviceCrew/PageContextController.js';
import DocumentContextController from './serviceCrew/DocumentContextController.js';
import ApiSourceContextControllers from './serviceCrew/ApiSourceContextController.js';

import ObjectExplorer from './util/ObjectExplorer.js';

class ServiceManager {

  constructor(_app, _service_id) {
    this.app = _app;
    this.service_id = _service_id;

    this.pageContextControllers = {};
    this.docContextControllers = {};
    this.apiSourceContextControllers = {};

    this.iceHost = "http://icedev.i-on.net";

    this.sampleDatas = {};

    this.chechedApiResources = {};
  }

  //http://dcsf-dev03.i-on.net:8081/api/broadcast_series/list.json?t=api
  getNodeTypeData(_nodeTypeId) {

    return this.app.session.certifiedRequestJSON("http://dcsf-dev03.i-on.net/api/" + _nodeTypeId + "/list.json?t=api");
  }

  getDocumentMetaList() {
    return this.meta.documents;
  }

  getPageMetaList() {
    return this.meta.pages;
  }

  getAPISourceMetaList() {
    return this.meta.apiSources;
  }

  createDocument(_title, _type, _complete) {
    //console.log('create ', _title, _type);

    this.app.gelateriaRequest.createDocument(this.service_id, _title, _type, function(_result) {
      _complete(_result);
    });
  }

  getDocumentList(_complete) {
    this.app.gelateriaRequest.getDocumentList(this.service_id, function(_result) {
      _complete(_result);
    });
  }

  saveDocument(_document_id, _documentDataObject, _complete) {
    console.log("Save Document", _document_id, _documentDataObject);

    this.app.gelateriaRequest.saveDocument(this.service_id, _document_id, _documentDataObject, function(_result) {
      _complete(_result);
    });
  }

  createPage(_title, _complete) {
    //console.log('create ', _title, _type);

    this.app.gelateriaRequest.createPage(this.service_id, _title, function(_result) {
      _complete(_result);
    });
  }

  getPageList(_complete) {
    this.app.gelateriaRequest.getPageList(this.service_id, function(_result) {
      _complete(_result);
    });
  }

  createApisource(_title, _nt_tid, _icon, _complete) {
    //console.log('create ', _title, _type);

    this.app.gelateriaRequest.createApisource(this.service_id, _title, _nt_tid, _icon, function(_result) {
      _complete(_result);
    });
  }

  getApisourceList(_complete) {
    this.app.gelateriaRequest.getApisourceList(this.service_id, function(_result) {
      _complete(_result);
    });
  }

  // Deprecated
  // getDocumentMetaById(_idx) {
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

  getAPISourceMetaById(_id) {
    var metaList = this.getAPISourceMetaList();

    var index = _.findIndex(metaList, {
      id: _id
    });

    return metaList[index];
  }

  // Deprecated
  // loadDocumentByMeta(_documentMeta) {
  //   var documentURL = "/BuildingProjectData/Services/" + this.serviceKey + "/Documents/" + _documentMeta.key + ".json";
  //
  //   var documentJSON = this.session.certifiedRequestJSON(documentURL);
  //
  //   return documentJSON;
  // };

  getICafeAPIDataOfField(_dataPath) {
    var apiResourceKey = _dataPath.split('/')[0];

    if (this.chechedApiResources[apiResourceKey] === undefined) {
      this.chechedApiResources[apiResourceKey] = this.getNodeTypeData(apiResourceKey);
    }


    return ObjectExplorer.getValueByKeyPath(this.chechedApiResources, _dataPath);
  }

  /********
   * resolveString
   * 모든 String 을 바인딩 법칙에 따라 변환하여준다.
   * ${url:...} / ${field:... } / ${title:...}
   */
  resolveString(_text) {
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
  }


  getDocumentContextController(_documentId, _complete) {
    var self = this;

    if (this.docContextControllers[_documentId] === undefined) {
      console.log('서비스 매니저의 서비스아이디', this.service_id);
      this.app.gelateriaRequest.loadDocument(this.service_id, _documentId, function(_result) {


        if (_result.result === 'success') {
          var documentContextController = new DocumentContextController(_result.document, self.app.session, self);

          self.docContextControllers[_documentId] = documentContextController;

          _complete(self.docContextControllers[_documentId])
        } else {
          alert("도큐먼트 로드 실패. " + _result.reason);
        }

      });

    } else {
      _complete(this.docContextControllers[_documentId]);
    }
  }

  getPageContextController(_pageId, _complete) {
    var self = this;

    if (this.pageContextControllers[_pageId] === undefined) {
      console.log('서비스 매니저의 서비스아이디', this.service_id);
      this.app.gelateriaRequest.loadPage(this.service_id, _pageId, function(_result) {


        if (_result.result === 'success') {
          var pageContextController = new PageContextController(_result.page, self.app.session, self);

          self.pageContextControllers[_pageId] = pageContextController;

          _complete(self.pageContextControllers[_pageId])
        } else {
          alert("페이지 로드 실패. " + _result.reason);
        }

      });

    } else {
      _complete(this.docContextControllers[_pageId]);
    }
  }

  getApiSourceContextController(_apiSourceId, _complete) {
    var self = this;
    if (this.apiSourceContextControllers[_apiSourceId] === undefined) {
      this.app.gelateriaRequest.loadApisource(this.service_id, _apiSourceId, function(_result) {

        if (_result.result === 'success') {
          var apiSourceContextController = new ApiSourceContextControllers(_result.apisource, self.app.session, self);

          self.apiSourceContextControllers[_apiSourceId] = apiSourceContextController;

          _complete(self.apiSourceContextControllers[_apiSourceId]);
        } else {
          alert("apisource 로드 실패. " + _result.reason);
        }

      });
    } else {
      _complete(this.apiSourceContextControllers[_apiSourceId]);
    }
  }
}


export default ServiceManager;