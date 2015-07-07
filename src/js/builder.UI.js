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

		this.window.onresize = function(e){
			self.onResize(e);
		};
    };

	UI.prototype.onResize = function(e){ //UI화면 리사이즈
		var width = this.window.innerWidth;
		var height = this.window.innerHeight;
		// resizeListener 이벤트 체크
		if( typeof this.observers['resizeListener'] === 'function' ){
			this.observers['resizeListener'](width, height);
		}
	};

	UI.prototype.render = function(){
		var self = this;

		React.render( React.createElement( this.uiScreen, {observers:this.observers}), this.window.document.getElementsByTagName('BODY')[0] );
		this.onResize();
	}

    module.exports = UI;
})();