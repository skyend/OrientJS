/**
 * Builder,UI
 * 빌더 UI
 *
 * Document의 변화및 구성을 기록하여 관리한다.
 *
 */


var React = require("react");

// Supporters
import EventDistributor from './ui.workspace/reactMixin/EventDistributor.js';
import ToolFactory from './builder.ToolFactory.js';
import APISource from "./serviceCrew/APISource.js";

// Sub UI Classes
import BuilderWorkSpace from './ui.workspace/Workspace.jsx';
import LoginService from './ui.workspace/LoginService.jsx';
import Enterance from './ui.enterance/Enterance.jsx';

// Data
import DefaultBuilderConfig from "../config/DefaultBuilderConfig.json";

// UI Supervisor
var UI = function(_window, _session, _app) {

  this.app = _app;

  /** Fields **/
  this.window = _window;
  this.session = _session;
  this.observers = {};
  this.dragHoldingElement = null;
  this.isDoingElementHold = false;

  // Global Drag
  this.mouseDawn = false;
  this.mouseDragging = false;
  this.enabledGlobalDrag = false;
  // 글로벌 드래그를 점유중인 오브젝트
  // 글로벌 드래그를 점유중인 오브젝트는 UI 로 부터 드래그 이벤트를 수신할 수 있다.
  // 글로벌 드래그 이벤트를 수신 하기 위해서는 onGlobalDragFromUI, onGlobalDragStopFromUI, onGlobalDragStartFromUI 메소드를 구현하여야 한다.
  this.globalDragOccupyObject = null;

  this.eventMapping();

  // toolFactory
  this.toolFactory = new ToolFactory(_session, DefaultBuilderConfig.tools);


};

UI.prototype.eventMapping = function() {
  let self = this;
  /** window Event Listening **/
  this.window.onresize = function(_e) {
    self.onResize(_e);
  };
  this.window.document.oncontextmenu = function(_e) {
    self.onCallContextMenu();
  };
  // Global Drag
  this.window.document.onmousemove = function(_e) {
    self.onGlobalMouseMove(_e);
  };
  this.window.document.onmousedown = function(_e) {
    self.onGlobalMouseDown(_e);
  };
  this.window.document.onmouseup = function(_e) {
    self.onGlobalMouseUp(_e);
  };

  this.window.document.ondrop = function(_e) {
    //_e.preventDefault();
    //_e.dataTransfer.setData("text/plain", 'nono');
    console.log(_e, 'drop in builder');
    //return false;
  }
}

UI.prototype.onResize = function(e) { //UI화면 리사이즈
  var width = this.window.innerWidth;
  var height = this.window.innerHeight;
  var screenWidth = this.window.outerWidth;
  var screenHeigt = this.window.outerHeight;

  // // resizeListener 이벤트 체크
  // if (typeof this.observers['resizeListener'] === 'function') {
  //   this.observers['resizeListener'](width, height, screenWidth, screenHeigt);
  // }
  //console.log('resize');
  if (this.rootUIInstance !== undefined && typeof this.rootUIInstance.screenResized === 'function')
    this.rootUIInstance.screenResized();
};

/**
 * holdingElementWhileDrag( _target )
 * @Param _target HTML코드 또는 DOMElement
 *
 *
 */
UI.prototype.holdingElementWhileDrag = function(_target) {
  if (typeof _target === 'object') {
    this.dragHoldingElement = _target;
  } else {
    var element = this.window.document.createElement('div');
    element.innerHTML = _target;
    element.style.display = 'inline-block';
    element.style.position = 'fixed';
    element.style.zIndex = 9999999;

    this.dragHoldingElement = element;
  }

  if (this.enabledGlobalDrag && this.mouseDragging) {
    this.startElementHold();
  }
};

UI.prototype.startElementHold = function() {
  if (this.dragHoldingElement !== null) {
    this.isDoingElementHold = true;
    this.window.document.body.appendChild(this.dragHoldingElement);
  }
};

UI.prototype.holingElementTraceToMouse = function(_mouseEvent) {
  if (this.dragHoldingElement !== null) {
    this.dragHoldingElement.style.left = _mouseEvent.clientX + 'px';
    this.dragHoldingElement.style.top = _mouseEvent.clientY + 'px';
  }
};

UI.prototype.stopElementHolding = function() {
  if (this.dragHoldingElement !== null) {
    this.isDoingElementHold = false;
    this.dragHoldingElement.remove();
    this.dragHoldingElement = null;
  }
};

/* MouseMove 상태를 캐치하여 드래그를 지속하며 드래그를 점유하는 객체에게 전달한다. */
UI.prototype.onGlobalMouseMove = function(_e) {
  if (this.enabledGlobalDrag) {
    if (this.mouseDawn) {
      if (this.mouseDragging) {
        //console.log('global drag..');
        this.progressGlobalDrag(_e);
      } else {
        //console.log('global drag start');
        this.startGlobalDrag(_e);
      }
    }
  }
};

UI.prototype.startGlobalDrag = function(_e) {
  this.coverHelper();
  this.mouseDragging = true;


  if (this.globalDragOccupyObject !== null) {
    if (typeof this.globalDragOccupyObject.onGlobalDragStartFromUI === 'function') {
      this.globalDragOccupyObject.onGlobalDragStartFromUI.apply(this.globalDragOccupyObject, [_e]);
    } else {
      throw new Error("You must implement to onGlobalDragStartFromUI(MouseEvent) Method in current Object");
    }

    this.startElementHold();
  }
};

UI.prototype.progressGlobalDrag = function(_e) {

  if (this.globalDragOccupyObject !== null) {

    if (typeof this.globalDragOccupyObject.onGlobalDragFromUI === 'function') {
      this.globalDragOccupyObject.onGlobalDragFromUI.apply(this.globalDragOccupyObject, [_e]);

    } else {
      throw new Error("You must implement to onGlobalDragFromUI(MouseEvent) Method in current Object");
    }

    this.holingElementTraceToMouse(_e);
  }
};

/* MouseDown 상태를 캐치하여 globalDrag를 시작할 수 있도록 mouseDawn상태로 변경한다. */
UI.prototype.onGlobalMouseDown = function(_e) {
  if (this.enabledGlobalDrag) {
    this.toMouseDawn();
  }
};

/* MouseUp 이벤트를 캐치하여 globalDrag 를 중지한다. */
UI.prototype.onGlobalMouseUp = function(_e) {
  if (this.enabledGlobalDrag) {
    this.mouseDawn = false;

    if (this.mouseDragging) {
      //console.log('global drag end');
      this.stopGlobalDrag(_e);
    }
  }
};

UI.prototype.stopGlobalDrag = function(_e) {
  this.mouseDragging = false;
  this.uncoverHelper();

  if (this.globalDragOccupyObject !== null) {
    if (typeof this.globalDragOccupyObject.onGlobalDragStopFromUI === 'function') {
      this.globalDragOccupyObject.onGlobalDragStopFromUI.apply(this.globalDragOccupyObject, [_e]);
    } else {
      throw new Error("You must implement to onGlobalDragStopFromUI(MouseEvent) Method in current Object");
    }

    this.stopElementHolding();
  }

  // 드래그가 끝날 때 자동 드래그 자원 반환
  if (this.autoGlobalDragReturn) {
    this.autoGlobalDragReturn = false;

    this.disableGlobalDrag();
    this.returnOccupyMouseDown();
    this.returnOccupiedGlobalDrag();

  }
};

UI.prototype.onCallContextMenu = function(_e) {

  // MouseDawn 상태에서 ContextMenu를 호출하면 MouseDawn을 해제한다.
  if (this.mouseDawn) {
    this.returnOccupyMouseDown();
  }
};

/* 임의로 mouseDown 상태로 변경한다. */
UI.prototype.toMouseDawn = function() {
  this.mouseDawn = true;
};

/* 임의로 mouseDown 상태를 해제한다. */
UI.prototype.returnOccupyMouseDown = function() {
  this.mouseDawn = false;
};

/* GlobalDrag 활성화 */
UI.prototype.enableGlobalDrag = function() {
  this.enabledGlobalDrag = true;
};

/* GobalDrag 비활성화 */
UI.prototype.disableGlobalDrag = function() {
  this.enabledGlobalDrag = false;
  this.mouseDawn = false;
  this.mouseDragging = false;
};

/* 객체가 GlobalDrag 자원을 점유하고자 할 때 이 메소드를 호출한다. */
UI.prototype.occupyGlobalDrag = function(_object, _autoReturn) {

  if (this.globalDragOccupyObject === null) {
    this.globalDragOccupyObject = _object;
    this.autoGlobalDragReturn = _autoReturn;
  } else {
    console.warn('Already occupy global drag');
  }
};

/* Global Drag 자원을 반환한다. */
UI.prototype.returnOccupiedGlobalDrag = function() {
  this.globalDragOccupyObject = null;
};

UI.prototype.coverHelper = function() {
  /* 화면 전체를 덮는 투명한 DIV 요소 생성 iframe 의 인터셉터를 방지하기 위함 */
  var div = this.window.document.createElement('div');
  div.style.width = '100%';
  div.style.height = '100%';
  div.style.position = 'fixed';
  div.style.top = '0';
  div.style.left = '0';
  div.style.zIndex = 999999999;
  div.style.cursor = 'move';
  div.setAttribute('id', '___GlobalDragHelper___');

  this.window.document.body.appendChild(div);
};

UI.prototype.uncoverHelper = function() {
  var cover;

  while (cover = this.window.document.querySelector('#___GlobalDragHelper___')) {
    this.window.document.body.removeChild(cover);
  }

};



/**************
 * Service Handling
 *
 *
 *
 */
UI.prototype.setProjectManager = function(_projectManager) {
  this.projectManager = _projectManager;

  this.rootUIInstance.setState({
    'projectMeta': _projectManager.meta
  });
};

UI.prototype.loadDocumentList = function(_complete) {
  self.app.serviceManager.getDocumentList(function(_result) {
    if (_result.result === 'success') {
      console.log('load document list', _result);
      _complete(_result);
    }
  });
};

UI.prototype.loadDocument = function(_documentId, _complete) {
  self.app.serviceManager.getDocument(_documentId, function(_result) {
    if (_result.result === 'success') {
      console.log('load document', _result);
      _complete(_result);
    }
  });
};

UI.prototype.loadPageList = function(_complete) {
  self.app.serviceManager.getPageList(function(_result) {
    if (_result.result === 'success') {
      console.log('load page list', _result);
      _complete(_result);
    }
  });
};

/****************************************************************/
/**************************** Builder Logic *********************/
/****************************************************************/

UI.prototype.onThrowCatcherIMustPreviewComponent = function(_eventData, _pass) {

  if (_eventData.refPath[0] === 'ComponentPalette') {

    _eventData.path[0].setState({
      previewComponent: this.session.componentPool.getComponentFromRemote(_eventData.componentKey, _eventData.packageKey, _eventData.syncWindowContext)
    });
  }
};

UI.prototype.onThrowCatcherGetComponent = function(_eventData, _pass) {
  var key = _eventData.componentKey;
  //console.log(_eventData, 'get');
  var loadedComponent = this.session.componentPool.getComponentFromRemote(_eventData.componentKey, _eventData.packageKey);

  _eventData.return(null, loadedComponent);
};

UI.prototype.onThrowCatcherNeedServiceResourcesMeta = function(_eventData) {
  var who = _eventData.path[0];
  console.log(this.projectManager);
  this.app.serviceManager.loadMetaData(function(__meta) {
    who.setState({
      pageMetaList: __meta.pages,
      documentMetaList: __meta.documents,
      apiSourceMetaList: __meta.apiSources
    });
  });
};

UI.prototype.onThrowCatcherBringApiSourceContext = function(_eventData) {
  console.log('BringApiSourceContext', _eventData);
  var self = this;
  var apiSource = _eventData.apiSource;

  // Document Meta 정보로 DocumentContextController를 얻는다
  var apiSourceContextController = this.app.serviceManager.getApiSourceContextController(apiSource.id, function(_apisourceContextController) {

    self.rootUIInstance.openStageContext({
      apiSourceID: apiSource.id,
      contextID: 'apiSource#' + apiSource.id,
      contextTitle: apiSource.title,
      contextType: 'apiSource',
      contextController: _apisourceContextController,
      iconClass: _eventData.iconClass
    });
  });


};




UI.prototype.onThrowCatcherBringApiInterfaceContext = function(_eventData) {
  console.log('BringApiSourceContext', _eventData);
  var self = this;
  var apiInterface = _eventData.apiInterface;

  // Document Meta 정보로 DocumentContextController를 얻는다
  var apiSourceContextController = this.app.serviceManager.getApiInterfaceContextController(apiInterface._id, function(_apiInterfaceContextController) {

    self.rootUIInstance.openStageContext({
      apiInterfaceID: apiInterface._id,
      contextID: 'apiInterface#' + apiInterface._id,
      contextTitle: apiInterface.title,
      contextType: 'apiInterface',
      contextController: _apiInterfaceContextController,
      iconClass: _eventData.iconClass
    });
  });
};


UI.prototype.onThrowCatcherBringDocumentContext = function(_eventData) {
  console.log('BringDocumentContext', _eventData);
  //console.log('BringDocumentContext', _eventData.document);
  var documentMeta = _eventData.document;
  var self = this;
  // Document Meta 정보로 DocumentContextController를 얻는다
  this.app.serviceManager
    .getDocumentContextController(documentMeta._id, function(_documentContextController) {

      self.rootUIInstance.openStageContext({
        documentID: documentMeta._id,
        contextID: 'document#' + documentMeta._id,
        contextTitle: documentMeta.title,
        contextType: 'document',
        contextController: _documentContextController,
        iconClass: _eventData.iconClass
      });
    });

};

UI.prototype.onThrowCatcherBringPageContext = function(_eventData) {

  //console.log('BringDocumentContext', _eventData.document);
  var page = _eventData.page;
  var self = this;
  // Document Meta 정보로 DocumentContextController를 얻는다
  this.app.serviceManager
    .getPageContextController(page._id, function(_pageContextController) {
      self.rootUIInstance.openStageContext({
        pageID: page._id,
        contextID: 'page#' + page._id,
        contextTitle: page.title,
        contextType: 'page',
        contextController: _pageContextController,
        iconClass: _eventData.iconClass
      });
    });
};

UI.prototype.onThrowCatcherDestroyContext = function(_eventData) {
  var context = _eventData.context;
  this.app.serviceManager.removeCachedContext(context);
};


UI.prototype.onThrowCatcherNeedStateComponentPackageMeta = function(_eventData) {
  var who = _eventData.path[0];
  //console.log('meta', this.session.getComponentPool().getAvailablePackageMeta());

  who.setState({
    availableComponentPackageMeta: this.session.getComponentPool().getAvailablePackageMeta()
  });
};

UI.prototype.onThrowCatcherRequestAttachTool = function(_eventData) {
  var self = this;

  this.toolFactory.getToolEgg(_eventData.toolKey, _eventData.params, function(__egg) {

    self.rootUIInstance.attachTool(_eventData.where, _eventData.attachOptions || {}, __egg)
  });
};


UI.prototype.onThrowCatcherStoreToolState = function(_eventData) {

  this.toolFactory.storeToolState(_eventData.toolKey, _eventData.state);
};

UI.prototype.onThrowCatcherCreateNewDocument = function(_eventData) {
  var self = this;
  this.app.serviceManager.createDocument(_eventData.title, _eventData.type, function(_result) {

    if (_result.result === 'success') {
      _eventData.path[0].successDocumentCreate();

      self.loadDocumentList(function(_result) {
        console.log('loaded', _result);

        self.toolFactory.storeToolState("ServiceResources", {
          documentList: _result.list
        });
      });
    } else {
      _eventData.path[0].failDocumentCreate();
    }
  });
};

UI.prototype.onThrowCatcherCreateNewPage = function(_eventData) {
  var self = this;
  this.app.serviceManager.createPage(_eventData.title, function(_result) {

    if (_result.result === 'success') {
      _eventData.path[0].successPageCreate();

      self.loadPageList(function(_result) {
        console.log('loaded', _result);

        self.toolFactory.storeToolState("ServiceResources", {
          pageList: _result.list
        });
      });
    } else {
      _eventData.path[0].failPageCreate();
    }
  });
};

UI.prototype.onThrowCatcherAddNodeType = function(_eventData) {
  var self = this;

  _eventData.nodetypes.map(function(_nodetype) {


    self.app.serviceManager.createApisource(_nodetype.nt_ntypenm.display, _nodetype.nt_tid, _nodetype.icon, _nodetype.nid, function(_result) {

      if (_result.result === 'success') {
        _eventData.path[0].successApiSourceCreate(_nodetype.nt_tid);
      } else {
        _eventData.path[0].failPageCreate(_nodetype.nt_tid);
      }
    });
  });
};

UI.prototype.onThrowCatcherCreateNewAPIInterface = function(_eventData) {
  this.app.serviceManager.createAPIInterface(_eventData.title, function(_result) {

    if (_result.result === 'success') {
      _eventData.path[0].successInterfaceCreate();
      //
      // self.loadPageList(function(_result) {
      //   console.log('loaded', _result);
      //
      //   self.toolFactory.storeToolState("ServiceResources", {
      //     apiinterfaceList: _result.list
      //   });
      // });
    } else {
      _eventData.path[0].failInterfaceCreate();
    }
  });
};

UI.prototype.onThrowCatcherNeedICEHost = function(_eventData) {
  var self = this;

  var iceHost = this.app.serviceManager.iceHost;

  _eventData.path[0].setState({
    iceHost: iceHost
  });
};


UI.prototype.onThrowCatcherUpdateAPISourceList = function(_eventData) {
  var self = this;

  this.app.serviceManager.getApisourceList(function(_result) {
    self.toolFactory.storeToolState("ServiceResources", {
      apisourceList: _result.list
    });
  });
};


UI.prototype.onThrowCatcherNeedAPISourceList = function(_eventData) {
  var self = this;

  this.app.serviceManager.getApisourceList(function(_asResult) {
    let apiSourceList = _asResult.list;

    self.app.serviceManager.getApiinterfaceList(function(_aiResult) {
      let apiInterfaceList = _aiResult.list;

      apiSourceList = apiSourceList.map(function(_apiSource) {
        return new APISource(self.app, _apiSource, apiInterfaceList);
      });

      _eventData.path[0].setState({
        apisourceList: apiSourceList
      });
    });
  });
};
//
// UI.prototype.onThrowCatcherUpdateAPIInterfaceList = function(_eventData) {
//   var self = this;
//
//   this.app.serviceManager.getApiinterfaceList(function(_result) {
//     self.toolFactory.storeToolState("ServiceResources", {
//       apiinterfaceList: _result.list
//     });
//   });
// };

UI.prototype.onThrowCatcherNeedAPIInterfaceList = function(_eventData) {
  var self = this;

  this.app.serviceManager.getApiinterfaceList(function(_result) {
    _eventData.path[0].setState({
      apiInterfaceList: _result.list,
      apiinterfaceList: _result.list,
    });
  });
};


UI.prototype.onThrowCatcherNeedDocumentList = function(_eventData) {
  var self = this;
  this.loadDocumentList(function(_result) {
    console.log('loaded', _result);

    self.toolFactory.storeToolState("ServiceResources", {
      documentList: _result.list
    });

    _eventData.path[0].setState({
      fragments: _result.list
    });
  });
};

UI.prototype.onThrowCatcherNeedDocument = function(_eventData) {
  var self = this;
  this.loadDocument(_eventData.documentId, function(_result) {

    _eventData.path[0].setState({
      fragmentObject: _result.document
    });
  });
};

UI.prototype.onThrowCatcherNeedPageList = function(_eventData) {
  var self = this;
  this.loadPageList(function(_result) {
    console.log('loaded', _result);

    self.toolFactory.storeToolState("ServiceResources", {
      pageList: _result.list
    });
  });
};

UI.prototype.onThrowCatcherExitBuilder = function(_eventData) {

  this.app.finishServiceBuilding();
};


UI.prototype.onThrowCatcherNeedICafeNodeTypes = function(_eventData) {
  //console.log("A");

  this.app.serviceManager.iceDriver.getNodeAllTypes(function(_err, _result) {
    //console.log(_err, _result);
    _eventData.path[0].setState({
      nodetypes: _result
    });
  });
};

UI.prototype.onThrowCatcherNeedRequestResult = function(_eventData) {
  let request = _eventData.request;
  let nodeTypeData = _eventData.nodeTypeData;
  let apiSource = _eventData.apiSource;

  console.log(request);

  this.app.serviceManager.iceDriver.requestWithRequestObject(request, nodeTypeData, apiSource, function(_result) {
    console.log(_result);
    // _eventData.path[0].setState({
    //   requestData: request,
    //   node
    // });
  });
};

UI.prototype.onThrowCatcherNeedNodeTypeData = function(_eventData) {
  let nid = _eventData.nodeTypeNID;

  this.app.serviceManager.iceDriver.getNodeType(nid, function(_result) {
    _eventData.path[0].setState({
      nodeTypeData: _result
    });
  });
}

UI.prototype.onThrowCatcherChangeContextControllerState = function(_eventData) {
  this.rootUIInstance.forceUpdate();
}

UI.prototype.onThrowCatcherGetViewer = function(_eventData) {
  let viewer = this.app.serviceManager.newViewer();

  _eventData.path[0].setViewer(viewer);
}

/****************************************************************/
/**************************** Builder Logic End *****************/
/****************************************************************/
//----------
/****************************************************************/
/**************************** Enterance Logic *******************/
/****************************************************************/
UI.prototype.onThrowCatcherUserSignUp = function(_eventData) {

  this.app.userManager.register(_eventData, function(_result) {
    if (_result.result === 'success') {
      _eventData.path[0].successSignUp();
    } else {
      _eventData.path[0].failSignUp(_result.reason);
    }
  });

};

UI.prototype.onThrowCatcherUserSignIn = function(_eventData) {

  this.app.userManager.signin(_eventData.id, _eventData.password, function(_result) {
    if (_result.result === 'success') {
      _eventData.path[0].successSignIn(_result);
    } else {
      _eventData.path[0].failSignIn(_result.reason);
    }
  });

};

UI.prototype.onThrowCatcherCreateNewProject = function(_eventData) {
  var name = _eventData.name;
  console.log(name);
  this.app.projectManager.create(name, function(_result) {
    console.log('created project', _result);
  });
};

UI.prototype.onThrowCatcherCreateNewService = function(_eventData) {
  var name = _eventData.name;
  console.log(name);

  this.app.projectManager.createService(name, function(_result) {
    console.log('created project', _result);
  });
};

UI.prototype.onThrowCatcherSelectProject = function(_eventData) {
  console.log("Select project : ", _eventData.project_real_id);
  this.app.projectManager.use(_eventData.project_real_id);
};

UI.prototype.onThrowCatcherServiceBuilderRun = function(_eventData) {
  var serviceId = _eventData.service_id;
  console.log(serviceId, "Start building");

  this.app.startServiceBuilding(serviceId);
}

/****************************************************************/
/**************************** Enterance Logic End ***************/
/****************************************************************/
//----------------
/****************************************************************/
/**************************** Common Logic **********************/
/****************************************************************/

UI.prototype.onThrowCatcherUserSignout = function(_eventData) {
  this.app.userManager.signout();
};

UI.prototype.onThrowCatcherNeedData = function(_eventData) {
  var field = _eventData.field || [];

  for (var i = 0; i < field.length; i++) {

    switch (field[i]) {
      case "user-info":
        this.app.userManager.getCurrent(function(_result) {
          if (_result.result === 'success') {
            _eventData.path[0].setData('user-info', _result.user);
          } else {
            alert("유저 정보 로드 실패.");
          }
        });
        break;
      case "project-list":
        this.app.projectManager.getList(function(_result) {
          if (_result.result === 'success') {
            _eventData.path[0].setData('project-list', _result.list);
          } else {
            alert("프로젝트 목록 로드 실패.");
          }
        });
        break;
      case "service-list":
        this.app.projectManager.getServiceList(function(_result) {
          if (_result.result === 'success') {
            _eventData.path[0].setData('service-list', _result.list);
          } else {
            alert("서비스 목록 로드 실패.");
          }
        });
        break;
    }
  }
};

/****************************************************************/
/**************************** Common Logic End ******************/
/****************************************************************/

UI.prototype.clearRender = function() {
  React.render(React.createElement("DIV"), this.window.document.getElementsByTagName('BODY')[0]);
  this.rootUIInstance = undefined;
};

UI.prototype.builderRender = function() {

  var workspace = React.render(React.createElement(BuilderWorkSpace, {
    //observers: this.observers,
    LeftNavigationConfig: DefaultBuilderConfig.LeftNavigation,
    RightNavigationConfig: DefaultBuilderConfig.RightNavigation,
    BottomNavigationConfig: DefaultBuilderConfig.BottomNavigation,
    Tools: DefaultBuilderConfig.tools,
    Modal: DefaultBuilderConfig.Modal,
    isRoot: true,
    __keyName: 'uiServicer'
  }), this.window.document.getElementsByTagName('BODY')[0]);

  this.rootUIInstance = workspace;
  this.onResize();

  EventDistributor.manualBindForNotReactClass(this, this.rootUIInstance);
};

UI.prototype.enteranceRender = function() {
  var enterance = React.render(React.createElement(Enterance, {
      defaultMainType: this.app.session.isAuthorized() ? 'lobby' : 'signin'
    }),
    this.window.document.getElementsByTagName('BODY')[0]);

  this.rootUIInstance = enterance;
  EventDistributor.manualBindForNotReactClass(this, this.rootUIInstance);
};

UI.prototype.loginRender = function() {

  var rootUI = React.render(React.createElement(LoginService),
    this.window.document.getElementsByTagName('BODY')[0]);

  this.rootUIInstance = rootUI;
  this.onResize();

  EventDistributor.manualBindForNotReactClass(this, this.rootUIInstance);
};

module.exports = UI;