/**
 * ServiceManager
 *
 *
 */
import _ from 'underscore';
import request from 'superagent';

import PageContextController from './serviceCrew/PageContextController.js';
import DocumentContextController from './serviceCrew/DocumentContextController.js';
import ICEAPISourceContextController from './serviceCrew/ICEAPISourceContextController.js';
//import ApiInterfaceContextController from './serviceCrew/ApiInterfaceContextController.js';
import ICEServerDriver from './builder.ICEServer.js';
import ObjectExplorer from './util/ObjectExplorer.js';
import Viewer from './serviceCrew/Viewer.js';
import ICEAPISource from './serviceCrew/ICEAPISource.js';


class ServiceManager {

  constructor(_app, _service_id) {
    this.app = _app;
    this.service_id = _service_id;

    this.pageContextControllers = {};
    this.docContextControllers = {};
    this.apiSourceContextControllers = {};
    this.apiInterfaceContextControllers = {};

    //this.iceHost = "http://icedev.i-on.net";
    this.iceHost = 'http://125.131.88.75:8080';
    this.iceDriver = new ICEServerDriver(this.iceHost);

    this.sampleDatas = {};

    this.chechedApiResources = {};
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

  getDocument(_documentId, _complete) {
    this.app.gelateriaRequest.loadDocument(this.service_id, _documentId, function(_result) {
      if (_result.result === 'success') {
        _complete(_result);
      } else {
        alert("도큐먼트 로드 실패. " + _result.reason);
      }

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
    let self = this;

    this.app.gelateriaRequest.getApisourceList(this.service_id, function(_result) {
      _result.list = _result.list.sort(function(_a, _b) {
        if (_a.title.localeCompare(_b.title) > 0) {
          return 1;
        } else {
          return -1;
        }
      });

      // _result.list = _result.list.map(function(_apiSource) {
      //   return new ICEAPISource(_apiSource, self);
      // });

      _complete(_result);
    });
  }

  getApisourceObjectList(_complete) {
    let self = this;
    this.getApisourceList(function(_result) {

      _result.list = _result.list.map(function(_apiSource) {
        return new ICEAPISource(_apiSource, self);
      });

      _complete(_result);
    })
  }

  getApiSourceListWithInterface(_complete) {
    let self = this;

    this.getApisourceList(function(_asResult) {
      let apiSourceList = _asResult.list;

      self.getApiinterfaceList(function(_aiResult) {
        let apiInterfaceList = _aiResult.list;

        apiSourceList = apiSourceList.map(function(_apiSource) {
          return new ICEAPISource(_apiSource, self);
        });

        _complete(apiSourceList);
      });
    });
  }

  getAPISourceWithInterfaces(_apisource_id, _complete) {
    let self = this;

    this.app.gelateriaRequest.loadApisource(this.service_id, _apisource_id, function(_result) {
      if (_result.result === 'success') {
        self.getApiinterfaceList(function(_aiResult) {
          let apiInterfaceList = _aiResult.list;

          //let apiSource = new APISource(_result.apisource, apiInterfaceList, self);

          _complete(_result.apisource, apiInterfaceList);
        });
      } else {
        alert("Fail API Source load :" + _apisource_id);
      }

    });
  }

  saveAPISource(_apisource_id, _apisourceDataObject, _complete) {
    console.log(_apisourceDataObject);
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

  findPageByAccessPoint(_accessPoint, _complate) {
    this.app.gelateriaRequest.findPageBy(this.service_id, 'accessPoint', _accessPoint, function(_result) {
      _complate(_result);
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
      _complete(this.pageContextControllers[_pageId]);
    }
  }

  getICEAPISourceContextController(_ICEAPISourceId, _complete) {
    var self = this;

    if (this.apiSourceContextControllers[_ICEAPISourceId] === undefined) {



      this.getAPISourceWithInterfaces(_ICEAPISourceId, function(_apiSource, _interfaces) {

        if (_apiSource !== null) {
          _apiSource.interfaceObjects = _interfaces;
          var apiSourceContextController = new ICEAPISourceContextController(_apiSource, self);

          self.apiSourceContextControllers[_ICEAPISourceId] = apiSourceContextController;

          _complete(self.apiSourceContextControllers[_ICEAPISourceId]);
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


  navigateService(_navigateCMDString) {
    /*
      Page Navigate : P@[PageAccessPoint]?[params]#[hash]
      Resource View : S@[StaticResourceID]
    */
    let self = this;
    let matches = _navigateCMDString.match(/^(\w?)@([^?^#^@]+?)(?:\?([^#]+))?(?:#(.+))?$/);
    let navigateType = matches[1];
    let publishType;
    let target = matches[2];
    let params = matches[3] || '';
    let hash = matches[4] || '';

    if (navigateType === 'P') {
      publishType = 'page';
    } else if (navigateType === 'S') {
      publishType = 'staticResource'
    }

    console.log(_navigateCMDString, matches[0], navigateType, target, params, hash);

    if (!/publish=/.test(window.location.search)) {
      // non publish mode == building Mode

      let self = this;
      if (navigateType === 'page') {
        this.findPageByAccessPoint(target, function(_result) {

          if (_result !== null) {
            self.app.uiSupervisor.openPageContext(_result, 'fa-newspaper-o');
          } else {
            alert("존재하지 않는 페이지 입니다.");
          }
        });
      } else if (navigateType === 'staticResource') {

        alert("현재 미지원 기능입니다. ServiceManager.navigateService");
      }
    } else {
      // publish mode
      let paramParts = params.split("&");
      let list = [];
      list.push("publish=" + navigateType);
      list.push("page=" + target);
      list.push("serviceId=" + this.service_id);

      if (publishType === 'page') {
        paramParts.map(function(_paramPart) {
          list.push(_paramPart)
        });

        window.location.href = location.origin + "/?" + list.join("&");
      } else if (navigateType === 'staticResource') {

        alert("현재 미지원 기능입니다. ServiceManager.navigateService");
      }
    }
  }



  newViewer() {
    return new Viewer(this);
  }
}


export default ServiceManager;