/**
 * Builder,UI
 * 빌더 UI
 *
 * Document의 변화및 구성을 기록하여 관리한다.
 *
 * Requires(JS) : builder.VirtualDom.js
 */

(function(){
	var React = require("react");
	var uiScreen = require('./ui/UIArchitecture.jsx');

	var UI = function(_window){
		var self = this;
		this.window = _window;
		this.uiScreen = uiScreen;

		this.observers = {};

		this.window.onresize = function(_e){ self.onResize(_e); };
		this.window.document.onmousemove = function(_e){ self.onGlobalMouseMove(_e); };
		this.window.document.onmousedown = function(_e){ self.onGlobalMouseDown(_e); };
		this.window.document.onmouseup = function(_e){ self.onGlobalMouseUp(_e); };

		this.mouseDawn = false;
		this.mouseDragging = false;
    };

	UI.prototype.onResize = function(e){ //UI화면 리사이즈
		var width = this.window.innerWidth;
		var height = this.window.innerHeight;
		// resizeListener 이벤트 체크
		if( typeof this.observers['resizeListener'] === 'function' ){
			this.observers['resizeListener'](width, height);
		}
	};

	UI.prototype.onGlobalMouseMove = function(){
		if( this.mouseDawn ){
			if( this.mouseDragging ){
				console.log('global drag..');
			} else {
				console.log('global drag start');
				this.coverHelper();
				this.mouseDragging = true;
			}
		}
	};

	UI.prototype.onGlobalMouseDown = function(){

		this.mouseDawn = true;
	};

	UI.prototype.onGlobalMouseUp = function(){
		this.mouseDawn = false;

		if( this.mouseDragging ){
			console.log('global drag end');
			this.mouseDragging = false;
			this.uncoverHelper();
		}
	};

	UI.prototype.coverHelper = function(){
		/* 화면 전체를 덮는 투명한 DIV 요소 생성 iframe 의 인터셉터를 방지하기 위함 */
		var div = this.window.document.createElement('div');
		div.style.width = '100%';
		div.style.height = '100%';
		div.style.position = 'fixed';
		div.style.top = '0';
		div.style.left ='0';
		div.style.zIndex = 999999999;
		div.setAttribute('class', 'Cover-Helper');

		this.window.document.body.appendChild(div);
	};

	UI.prototype.uncoverHelper = function(){
		var cover = this.window.document.querySelector('.Cover-Helper');
		this.window.document.body.removeChild(cover);
	};

	UI.prototype.render = function(){
		var self = this;

		React.render( React.createElement( this.uiScreen, {observers:this.observers}), this.window.document.getElementsByTagName('BODY')[0] );
		this.onResize();
	}

    module.exports = UI;
})();