/**
 * ServiceManager
 *
 *
 */
import _ from 'underscore';
import request from 'superagent';
import async from 'async';
import PageContextController from './serviceCrew/PageContextController.js';
import DocumentContextController from './serviceCrew/DocumentContextController.js';
import ICEAPISourceContextController from './serviceCrew/ICEAPISourceContextController.js';
import ComponentContextController from './serviceCrew/ComponentContextController.js';
import CSSContextController from './serviceCrew/CSSContextController.js';
import JSContextController from './serviceCrew/JSContextController.js';

//import ApiInterfaceContextController from './serviceCrew/ApiInterfaceContextController.js';
import ICEServerDriver from './builder.ICEServer.js';
import ObjectExplorer from './util/ObjectExplorer.js';
import Viewer from './serviceCrew/Viewer.js';
import ICEAPISource from './serviceCrew/ICEAPISource.js';


class ServiceManager {

  constructor(_app, _service_id, _readyCallback) {
    let self = this;
    this.app = _app;
    this.service_id = _service_id;

    this.pageContextControllers = {};
    this.docContextControllers = {};
    this.apiSourceContextControllers = {};
    this.apiInterfaceContextControllers = {};
    this.componentContextControllers = {};
    this.cssContextControllers = {};
    this.jsContextControllers = {};

    //this.iceHost = "http://icedev.i-on.net";
    this.iceHost = 'http://125.131.88.77:8080';
    this.iceDriver = new ICEServerDriver(this.iceHost);
    this.gelateriaHost = window.gelateriaHost;
    this.sampleDatas = {};

    this.chechedApiResources = {};



    this.preparedCSSList = null;
    this.preparedJSList = null;
    self.preparedStaticList = null;
    self.preparedComponentList = null;
    async.parallel([
      function(_cb) {
        self.getCSSList(true, function(_result) {
          self.preparedCSSList = _result.list;
          _cb();
        });
      },
      function(_cb) {
        self.getJSList(true, function(_result) {
          self.preparedJSList = _result.list;
          _cb();
        });
      },
      function(_cb) {
        self.getStaticList(function(_result) {
          self.preparedStaticList = _result.list;
          console.log(self.preparedStaticList);
          _cb();
        });
      }
    ], function end() {
      _readyCallback(self);
    });
  }

  createDocument(_title, _type, _complete) {
    //console.log('create ', _title, _type);

    this.app.gelateriaRequest.createDocument(this.service_id, _title, _type, function(_result) {
      _complete(_result);
    });
  }

  getDocumentList(_withContent, _complete) {
    this.app.gelateriaRequest.getDocumentList(_withContent, this.service_id, function(_result) {
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

  createCSS(_name, _complete) {
    this.app.gelateriaRequest.createCSS(this.service_id, _name, function(_result) {
      _complete(_result);
    });
  }

  getCSS(_id, _complete) {
    this.app.gelateriaRequest.getCSS(this.service_id, _id, function(_result) {
      _complete(_result);
    });
  }

  saveCSS(_cssId, _cssDataObject, _complete) {
    console.log("Save CSS", _cssId, _cssDataObject);

    this.app.gelateriaRequest.saveCSS(this.service_id, _cssId, _cssDataObject, function(_result) {
      _complete(_result);
    });
  }

  getCSSList(_withContent, _complete) {
    let self = this;

    this.app.gelateriaRequest.getCSSList(_withContent, this.service_id, function(_result) {
      _result.list = _result.list.sort(function(_a, _b) {
        if (_a.name.localeCompare(_b.title) > 0) {
          return 1;
        } else {
          return -1;
        }
      });

      _complete(_result);
    });
  }

  createJS(_name, _complete) {
    this.app.gelateriaRequest.createJS(this.service_id, _name, function(_result) {
      _complete(_result);
    });
  }

  getJS(_id, _complete) {
    this.app.gelateriaRequest.getJS(this.service_id, _id, function(_result) {
      _complete(_result);
    });
  }

  saveJS(_jsId, _jsDataObject, _complete) {

    this.app.gelateriaRequest.saveJS(this.service_id, _jsId, _jsDataObject, function(_result) {
      _complete(_result);
    });
  }

  getJSList(_withContent, _complete) {
    let self = this;

    this.app.gelateriaRequest.getJSList(_withContent, this.service_id, function(_result) {
      _result.list = _result.list.sort(function(_a, _b) {
        if (_a.name.localeCompare(_b.title) > 0) {
          return 1;
        } else {
          return -1;
        }
      });

      _complete(_result);
    });
  }


  getStaticList(_complete) {
    let self = this;

    this.app.gelateriaRequest.getStaticList(this.service_id, function(_result) {
      _result.list = _result.list.sort(function(_a, _b) {
        if (_a.name.localeCompare(_b.title) > 0) {
          return 1;
        } else {
          return -1;
        }
      });

      _complete(_result);
    });
  }

  createComponent(_name, _script, _css, _propStruct, _complete) {
    this.app.gelateriaRequest.createComponent(this.app.currentProjectId, _name, _script, _css, _propStruct, function(_result) {
      _complete(_result);
    });
  }

  getComponentList(_withContent, _complete) {
    let self = this;

    this.app.gelateriaRequest.getComponentList(_withContent, this.app.currentProjectId, function(_result) {
      _result.list = _result.list.sort(function(_a, _b) {
        if (_a.name.localeCompare(_b.title) > 0) {
          return 1;
        } else {
          return -1;
        }
      });

      _complete(_result);
    });
  }

  getComponent(_id, _complete) {
    this.app.gelateriaRequest.getComponent(this.app.currentProjectId, _id, function(_result) {
      _complete(_result);
    });
  }

  saveComponent(_componentId, _componentJSON, _complete) {
    this.app.gelateriaRequest.saveComponent(this.app.currentProjectId, _componentId, _componentJSON, function(_result) {
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

  loadSharedElementNodeList(_withContent, _complete) {
    this.app.gelateriaRequest.loadSharedElementNodeList(_withContent, this.service_id, function(_result) {
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

    if (_context.contextType === 'component') {
      return delete this.componentContextControllers[_context.componentID];
    }

    if (_context.contextType === 'css') {
      return delete this.cssContextControllers[_context.cssID];
    }

    if (_context.contextType === 'js') {
      return delete this.jsContextControllers[_context.jsID];
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

  getComponentContextController(_componentId, _complete) {
    var self = this;

    if (this.componentContextControllers[_componentId] === undefined) {
      this.getComponent(_componentId, function(_result) {

        if (_result.result === 'success') {
          var componentContextController = new ComponentContextController(_result.component, self);

          self.componentContextControllers[_componentId] = componentContextController;

          _complete(self.componentContextControllers[_componentId]);
        } else {
          alert("component 로드 실패. " + _result.reason);
        }

      });
    } else {
      _complete(this.componentContextControllers[_componentId]);
    }
  }

  getCSSContextController(_cssId, _complete) {
    var self = this;

    if (this.cssContextControllers[_cssId] === undefined) {
      this.getCSS(_cssId, function(_result) {

        if (_result.result === 'success') {
          var cssContextController = new CSSContextController(_result.css, self);

          self.cssContextControllers[_cssId] = cssContextController;

          _complete(self.cssContextControllers[_cssId]);
        } else {
          alert("component 로드 실패. " + _result.reason);
        }

      });
    } else {
      _complete(this.cssContextControllers[_cssId]);
    }
  }

  getJSContextController(_jsId, _complete) {
    var self = this;

    if (this.jsContextControllers[_jsId] === undefined) {
      this.getJS(_jsId, function(_result) {

        if (_result.result === 'success') {
          var cssContextController = new JSContextController(_result.js, self);

          self.jsContextControllers[_jsId] = cssContextController;

          _complete(self.jsContextControllers[_jsId]);
        } else {
          alert("component 로드 실패. " + _result.reason);
        }

      });
    } else {
      _complete(this.jsContextControllers[_jsId]);
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
    let target = matches[2];
    let params = matches[3] || '';
    let hash = matches[4] || '';

    if (navigateType === 'P') {
      navigateType = 'page';
    } else if (navigateType === 'S') {
      navigateType = 'staticResource'
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

      if (navigateType === 'page') {
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



  getScriptURLByName(_name) {
    return "http://" + this.gelateriaHost + "/js/contents-retrieve-by-name/" + _name + "?serviceId=" + this.service_id;
  }

  getScriptURLById(_id) {
    let scriptIndex = _.findIndex(this.preparedJSList, {
      _id: _id
    });

    if (scriptIndex !== -1) {
      let script = this.preparedJSList[scriptIndex];

      return "http://" + this.gelateriaHost + "/js/contents-retrieve-by-name/" + script.name + "?serviceId=" + this.service_id;
    } else {
      return null;
    }
  }

  getScriptContents(_id) {
    let scriptIndex = _.findIndex(this.preparedJSList, {
      _id: _id
    });

    if (scriptIndex !== -1) {
      let script = this.preparedJSList[scriptIndex];

      return script.js;
    } else {
      return null;
    }
  }

  getStyleURLByName(_name) {
    return "http://" + this.gelateriaHost + "/css/contents-retrieve-by-name/" + _name + "?serviceId=" + this.service_id;
  }

  getStyleURLById(_id) {
    let styleIndex = _.findIndex(this.preparedCSSList, {
      _id: _id
    });

    if (styleIndex !== -1) {
      let style = this.preparedCSSList[styleIndex];

      return "http://" + this.gelateriaHost + "/css/contents-retrieve-by-name/" + style.name + "?serviceId=" + this.service_id;
    } else {
      return null;
    }
  }

  getStyleContents(_id) {
    let styleIndex = _.findIndex(this.preparedCSSList, {
      _id: _id
    });
    // import 구문은 자동으로 임포트 하여 처리한다.
    // @import url(${style:font-awesome.min.css});

    if (styleIndex !== -1) {
      let style = this.preparedCSSList[styleIndex];

      return this.getStyleContentsByStyle(style);
    } else {
      return null;
    }
  }

  getStyleContentsByName(_name) {
    let styleIndex = _.findIndex(this.preparedCSSList, {
      name: _name
    });

    if (styleIndex !== -1) {
      let style = this.preparedCSSList[styleIndex];

      return this.getStyleContentsByStyle(style);
    } else {
      return null;
    }
  }

  getStyleContentsByStyle(_style) {
    let self = this;
    let css = _style.css;

    css = css.replace(/@import url\(\${style:(.*?)}\);/g, function(_match, _name) {

      return "\n" + self.getStyleContentsByName(_name) + '\n';
    });

    return css;
  }

  getImageURLByName(_name) {
    let staticIndex = _.findIndex(this.preparedStaticList, function(_static) {
      return _static.type === 'image' && _static.name === _name;
    });

    let staticResource = this.preparedStaticList[staticIndex];

    return "http://" + this.gelateriaHost + "/static/image/" + staticResource.filename;
  }

  getImageStaticByName(_name) {
    let staticIndex = _.findIndex(this.preparedStaticList, function(_static) {
      return _static.name === _name;
    });

    let staticResource = this.preparedStaticList[staticIndex];

    return "http://" + this.gelateriaHost + "/static/" + staticResource.type + "/" + staticResource.filename;
  }
}


export default ServiceManager;