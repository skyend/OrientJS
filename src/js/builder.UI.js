/**
 * Builder,UI
 * 빌더 UI
 *
 * Document의 변화및 구성을 기록하여 관리한다.
 *
 */

(function() {
  var React = require("react");
  var EventDistributor = require('./ui/reactMixin/EventDistributor.js');

  var builderScreen = require('./ui/BuilderService.jsx');
  var loginScreen = require('./ui/LoginService.jsx');
  var DefaultBuilderConfig = require("../config/DefaultBuilderConfig.json");

  var UI = function(_window, _session) {
    var self = this;
    this.window = _window;
    this.session = _session;
    this.builderScreen = builderScreen;
    this.loginScreen = loginScreen;
    this.observers = {};
    this.dragHoldingElement = null;
    this.isDoingElementHold = false;

    this.window.onresize = function(_e) {
      self.onResize(_e);
    };

    /* Global Drag */
    this.window.document.onmousemove = function(_e) {
      self.onGlobalMouseMove(_e);
    };
    this.window.document.onmousedown = function(_e) {
      self.onGlobalMouseDown(_e);
    };
    this.window.document.onmouseup = function(_e) {
      self.onGlobalMouseUp(_e);
    };
    this.window.document.oncontextmenu = function(_e) {
      self.onCallContextMenu();
    };

    this.mouseDawn = false;
    this.mouseDragging = false;
    this.enabledGlobalDrag = false;

    // 글로벌 드래그를 점유중인 오브젝트
    // 글로벌 드래그를 점유중인 오브젝트는 UI 로 부터 드래그 이벤트를 수신할 수 있다.
    // 글로벌 드래그 이벤트를 수신 하기 위해서는 onGlobalDragFromUI, onGlobalDragStopFromUI, onGlobalDragStartFromUI 메소드를 구현하여야 한다.
    this.globalDragOccupyObject = null;
  };

  UI.prototype.onResize = function(e) { //UI화면 리사이즈
    var width = this.window.innerWidth;
    var height = this.window.innerHeight;
    var screenWidth = this.window.outerWidth;
    var screenHeigt = this.window.outerHeight;

    // resizeListener 이벤트 체크
    if (typeof this.observers['resizeListener'] === 'function') {
      this.observers['resizeListener'](width, height, screenWidth, screenHeigt);
    }
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

  UI.prototype.onThrowCatcherRootTest = function(_eventData) {
    console.log('Approached', _eventData);
  };

  UI.prototype.onThrowCatcherIMustPreviewComponent = function(_eventData, _pass) {

    if (_eventData.refPath[0] === 'ComponentPalette') {

      _eventData.path[0].setState({
        previewComponent: this.session.componentPool.getComponentFromRemote(_eventData.componentKey, _eventData.packageKey)
      });
    }
  };

  UI.prototype.onThrowCatcherGetComponent = function(_eventData, _pass) {
    var key = _eventData.componentKey;
    //console.log(_eventData, 'get');
    var loadedComponent = this.session.componentPool.getComponentFromRemote(_eventData.componentKey, _eventData.packageKey);

    _eventData.return(null, loadedComponent)
  };

  /**************
   * Service Handling
   *
   *
   *
   */
  UI.prototype.setProjectManager = function(_projectManager) {
    this.projectManager = _projectManager;

    this.uiServicer.setState({
      'projectMeta': _projectManager.meta
    });
  };

  UI.prototype.onThrowCatcherNeedServiceResourcesMeta = function(_eventData) {
    var who = _eventData.path[0];

    who.setState({
      pageMetaList: this.projectManager.serviceManager.getPageMetaList(),
      documentMetaList: this.projectManager.serviceManager.getDocumentMetaList(),
    });
  };

  UI.prototype.onThrowCatcherBringDocumentContext = function(_eventData) {
    console.log('BringDocumentContext', _eventData);
    //console.log('BringDocumentContext', _eventData.document);
    var documentMeta = _eventData.documentMeta;

    // Document Meta 정보로 DocumentContextController를 얻는다
    var documentContextController = this.projectManager.serviceManager.getDocumentContextController(documentMeta.id);

    this.uiServicer.openDirectContext({
      documentID: documentMeta.id,
      contextID: 'document#' + documentMeta.id,
      contextName: documentMeta.name,
      contextType: 'document',
      contextController: documentContextController,
      iconClass: _eventData.iconClass
    });
  };


  UI.prototype.onThrowCatcherNeedStateComponentPackageMeta = function(_eventData, _pass) {
    var who = _eventData.path[0];
    //console.log('meta', this.session.getComponentPool().getAvailablePackageMeta());

    who.setState({
      availableComponentPackageMeta: this.session.getComponentPool().getAvailablePackageMeta()
    });
  };





  UI.prototype.builderRender = function() {
    var rootUI = React.render(React.createElement(this.builderScreen, {
      observers: this.observers,
      LeftNavigationConfig: DefaultBuilderConfig.LeftNavigation,
      RightNavigationConfig: DefaultBuilderConfig.RightNavigation,
      Tools: DefaultBuilderConfig.tools,
      Modal: DefaultBuilderConfig.Modal,
      __keyName: 'uiServicer'
    }), this.window.document.getElementsByTagName('BODY')[0]);

    this.onResize();

    this.uiServicer = rootUI;

    EventDistributor.manualBindForNotReactClass(this, this.uiServicer);
  };

  UI.prototype.loginRender = function() {
    var rootUI = React.render(React.createElement(this.loginScreen),
      this.window.document.getElementsByTagName('BODY')[0]);
    this.onResize();

    this.uiServicer = rootUI; << << << < HEAD
      === === =
      //console.log(this.uiServicer);
      >>> >>> > ParallelDocumentDirecting

    EventDistributor.manualBindForNotReactClass(this, this.uiServicer);
  };

  module.exports = UI;
})();