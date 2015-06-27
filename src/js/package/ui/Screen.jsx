(function(){
    require('./styles/Screen.less');
	
    var React = require("react");
    var $ = require('jquery');

    var BuilderScreen = function(){
		
    };

		BuilderScreen.prototype.getSkeleton = function(){
				var skeletonOffer = this; // 책임자 반환되는 ReactClass 에 대해 감독하며 서로 통신함.
			
				/*
				var Headers = require("./js/Headers.jsx");
        var SideMenu = require("./js/SideMenu.jsx");
        var CustomPanel = require("./js/CustomPanel.jsx");
        var EditorPanel = require("./js/EditorPanel.jsx");
        var FooterPanel = require("./js/FooterPanel.jsx");*/
			
				var ReactSekeleton = React.createClass({
            render: function () {
                return (
                    <div>a
									
                    </div>
                )
            }
        });
			
				return ReactSekeleton;
		}
	
		

    module.exports = BuilderScreen;

})();