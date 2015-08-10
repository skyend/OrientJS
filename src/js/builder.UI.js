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

      this.globalDragOccupyObject.onGlobalDragStartFromUI.apply(this.globalDragOccupyObject, [_e]);
    }
  };

  UI.prototype.progressGlobalDrag = function(_e) {

    if (this.globalDragOccupyObject !== null) {

      this.globalDragOccupyObject.onGlobalDragFromUI.apply(this.globalDragOccupyObject, [_e]);
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
      this.globalDragOccupyObject.onGlobalDragStopFromUI.apply(this.globalDragOccupyObject, [_e]);
    }

    // 드래그가 끝날 때 자동 드래그 자원 반환
    if (this.autoGlobalDragReturn) {
      this.autoGlobalDragReturn = false;

      app.ui.disableGlobalDrag();
      app.ui.returnOccupyMouseDown();
      app.ui.returnOccupiedGlobalDrag();

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
          previewComponent: this.session.componentPool.getComponentFromRemote(_eventData.componentKey)
        });
      }
    },

    UI.prototype.builderRender = function() {
      var rootUI = React.render(React.createElement(this.builderScreen, {
        observers: this.observers,
        LeftNavigationConfig: DefaultBuilderConfig.LeftNavigation,
        RightNavigationConfig: DefaultBuilderConfig.RightNavigation,
        Tools: DefaultBuilderConfig.tools,
        AvailableComponents: this.session.componentPool.getAvailableComponents(),
        __keyName: 'uiServicer'
      }), this.window.document.getElementsByTagName('BODY')[0]);

      this.onResize();

      this.uiServicer = rootUI;

      EventDistributor.manualBindForNotReactClass(this, this.uiServicer);
    }

  UI.prototype.loginRender = function() {
    var rootUI = React.render(React.createElement(this.loginScreen),
      this.window.document.getElementsByTagName('BODY')[0]);
    this.onResize();
    this.uiServicer = rootUI;
    console.log(this.uiServicer);

    EventDistributor.manualBindForNotReactClass(this, this.uiServicer);
  }

  module.exports = UI;
})();