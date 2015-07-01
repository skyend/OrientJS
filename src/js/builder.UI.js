/**
 * Builder,UI
 * 빌더 UI
 *
 * Document의 변화및 구성을 기록하여 관리한다.
 *
 * Requires(JS) : builder.VirtualDom.js
 */

(function(){
		//var Utils = require('./builder.Utils.js');
		//var EventEmitter = require('./lib/EventEmitter.js');
		var React = require("react");
		var uiScreen = require('./ui/Screen.jsx');	
		//
    //
    var UI = function(_window){
		//		Utils.extends(EventEmitter, this);
		//
				this.window = _window;
				this.uiScreen = new uiScreen();

		//
		//		this.on('testEvent', function(_data){
		//				console.log(_data);
		//		});
		//
		//		this.emit('testEvent', 'Hello');
    };
    //
		
	
		UI.prototype.render = function(){
				React.render( React.createElement( this.uiScreen.getSkeleton()), this.window.document.getElementsByTagName('BODY')[0] );
		}

    module.exports = UI;
})();