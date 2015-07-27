/**
 * Builder,UI
 * 빌더 UI
 *
 * Document의 변화및 구성을 기록하여 관리한다.
 *
 * Requires(JS) : builder.VirtualDom.js
 */

(function() {
   var React = require("react");
   var uiScreen = require('./ui/UIService.jsx');

   var UI = function(_window) {
      var self = this;
      this.window = _window;
      this.uiScreen = uiScreen;

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
      console.log(screenHeigt);
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
               console.log('global drag..');

               if (this.globalDragOccupyObject !== null) {

                  this.globalDragOccupyObject.onGlobalDragFromUI.apply(this.globalDragOccupyObject, [_e]);
               }
            } else {
               console.log('global drag start');
               this.coverHelper();
               this.mouseDragging = true;


               if (this.globalDragOccupyObject !== null) {

                  this.globalDragOccupyObject.onGlobalDragStartFromUI.apply(this.globalDragOccupyObject, [_e]);
               }
            }
         }
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
            console.log('global drag end');
            this.mouseDragging = false;
            this.uncoverHelper();

            if (this.globalDragOccupyObject !== null) {
               this.globalDragOccupyObject.onGlobalDragStopFromUI.apply(this.globalDragOccupyObject, [_e]);
            }
         }
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
   UI.prototype.occupyGlobalDrag = function(_object) {

      if (this.globalDragOccupyObject === null) {
         this.globalDragOccupyObject = _object;
      } else {
         console.warn('Already occupy global drag');
      }
   };

   /* Global Drag 자원을 반환한다. */
   UI.prototype.returnOccupiedGlobalDrag = function() {
      this.globalDragOccupyObject = null;
      console.log(this);
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

   UI.prototype.render = function() {
      var self = this;

      React.render(React.createElement(this.uiScreen, {
         observers: this.observers
      }), this.window.document.getElementsByTagName('BODY')[0]);
      this.onResize();
   }

   module.exports = UI;
})();