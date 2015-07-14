/**
 * Builder,App
 * 빌더의 Main
 *
 *
 *
 * Requires(JS) : builder.StageContext.js, builder.UI.js
 */

(function(){
    var StageContext = require('./builder.EditorStageContext.js');
		var UI = require('./builder.UI.js');

    var App = function(){
			this.ui = new UI(window);
			/*
        console.log('ready');
            var contextOne = new StageContext({
            stageLoadedCallback : function(){
                console.log('loaded call')
            }
        });
        contextOne.setIFrameStage(document.getElementById("iframeOne"));

*/
    };
	
		App.prototype.initUI = function(){
				this.ui.render();	
		}

    module.exports = App;
})();