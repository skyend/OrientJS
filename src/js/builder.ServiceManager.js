/**
 * ServiceManager
 *
 *
 */
import _ from 'underscore';
import request from 'superagent';

import PageContextController from './serviceCrew/PageContextController.js';
import DocumentContextController from './serviceCrew/DocumentContextController.js';
import ApiSourceContextController from './serviceCrew/ApiSourceContextController.js';
import ApiInterfaceContextController from './serviceCrew/ApiInterfaceContextController.js';
import ICEServerDriver from './builder.ICEServer.js';
import ObjectExplorer from './util/ObjectExplorer.js';




class ServiceManager {

  constructor(_app, _service_id) {
    this.app = _app;
    this.service_id = _service_id;

    this.pageContextControllers = {};
    this.docContextControllers = {};
    this.apiSourceContextControllers = {};
    this.apiInterfaceContextControllers = {};

    this.iceHost = "http://icedev.i-on.net";

    this.iceDriver = new ICEServerDriver(this.iceHost);

    this.sampleDatas = {};

    this.chechedApiResources = {};
  }

  //http://dcsf-dev03.i-on.net:8081/api/broadcast_series/list.json?t=api
  getNodeTypeData(_nodeTypeId) {

    return this.app.session.certifiedRequestJSON(this.iceHost + "/api/" + _nodeTypeId + "/list.json?t=api");
  }

  createDocument(_title, _type, _complete) {
    //console.log('create ', _title, _type);

    this.app.gelateriaRequest.createDocument(this.service_id, _title, _type, function(_result) {
      _complete(_result);
    });
  }

  getDocumentList(_complete) {
    this.app.gelateriaRequest.getDocumentList(this.service_id, function(_result) {
      _result.list = _result.list.sort(function(_a, _b) {
        if (_a.title.localeCompare(_b.title) > 0) {
          return 1;
        } else {
          return -1;
        }
      });

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
      _result.list = _result.list.sort(function(_a, _b) {
        if (_a.title.localeCompare(_b.title) > 0) {
          return 1;
        } else {
          return -1;
        }
      });

      _complete(_result);
    });
  }

  savePage(_page_id, _pageDataObject, _complete) {
    console.log("Save Page", _page_id, _documentDataObject);

    this.app.gelateriaRequest.savePage(this.service_id, _page_id, _pageDataObject, function(_result) {
      _complete(_result);
    });
  }

  createApisource(_title, _nt_tid, _icon, _nid, _complete) {
    //console.log('create ', _title, _type);

    this.app.gelateriaRequest.createApisource(this.service_id, _title, _nt_tid, _icon, _nid, function(_result) {
      _complete(_result);
    });
  }

  getApisourceList(_complete) {
    this.app.gelateriaRequest.getApisourceList(this.service_id, function(_result) {
      _result.list = _result.list.sort(function(_a, _b) {
        if (_a.title.localeCompare(_b.title) > 0) {
          return 1;
        } else {
          return -1;
        }
      });

      _complete(_result);
    });
  }

  saveAPISource(_apisource_id, _apisourceDataObject, _complete) {
    this.app.gelateriaRequest.saveAPISource(this.service_id, _apisource_id, _apisourceDataObject, function(_result) {
      _complete(_result);
    });
  }

  createAPIInterface(_title, _complete) {
    //console.log('create ', _title, _type);

    this.app.gelateriaRequest.createAPIInterface(this.service_id, _title, function(_result) {
      _complete(_result);
    });
  }

  getApiinterfaceList(_complete) {
    this.app.gelateriaRequest.getAPIInterfaceList(this.service_id, function(_result) {

      _result.list = _result.list.sort(function(_a, _b) {
        if (_a.title.localeCompare(_b.title) > 0) {
          return 1;
        } else {
          return -1;
        }
      });

      _complete(_result);
    });
  }

  saveAPIInterface(_apiinterface_id, _apiinterfaceDataObject, _complete) {
    this.app.gelateriaRequest.saveAPIInterface(this.service_id, _apiinterface_id, _apiinterfaceDataObject, function(_result) {
      _complete(_result);
    });
  }

  getAPIInterface(_apiInterfaceId, _complete) {

    this.app.gelateriaRequest.loadApiinterface(this.service_id, _apiInterfaceId, function(_result) {

      if (_result.result === 'success') {
        _complete(_result.apiinterface);
      } else {
        alert("apisource 로드 실패. " + _result.reason);
      }

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

  removeCachedContext(_context) {

    if (_context.contextType === 'page') {
      return delete this.pageContextControllers[_context.pageID];
    }

    if (_context.contextType === 'document') {
      return delete this.docContextControllers[_context.documentID];
    }

    if (_context.contextType === 'apiSource') {
      return delete this.apiSourceContextControllers[_context.apiSourceID];
    }

    if (_context.contextType === 'apiInterface') {
      return delete this.apiInterfaceContextControllers[_context.apiInterfaceID];
    }

    throw new Error("Not found context Controller");
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
          var apiSourceContextController = new ApiSourceContextController(_result.apisource, self.app.session, self);

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

  getApiInterfaceContextController(_apiInterfaceId, _complete) {
    var self = this;
    if (this.apiInterfaceContextControllers[_apiInterfaceId] === undefined) {
      this.app.gelateriaRequest.loadApiinterface(this.service_id, _apiInterfaceId, function(_result) {

        if (_result.result === 'success') {
          var apiInterfaceContextController = new ApiInterfaceContextController(_result.apiinterface, self.app.session, self);

          self.apiInterfaceContextControllers[_apiInterfaceId] = apiInterfaceContextController;

          _complete(self.apiInterfaceContextControllers[_apiInterfaceId]);
        } else {
          alert("apiinterface 로드 실패. " + _result.reason);
        }

      });
    } else {
      _complete(this.apiInterfaceContextControllers[_apiInterfaceId]);
    }
  }
}


export default ServiceManager;