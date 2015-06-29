/**
 * Screen.jsx
 * 빌더의 전체적인 UI를 포함하고 컨트롤 하는 클래스
 *
 * Requires(js)  : BuilderNavigation.jsx
 * Requires(css) : Screen.less
 */

(function () {
    require('./styles/Screen.less');

    var BuilderNavigation = require('./BuilderNavigation.jsx');


    var React = require("react");

    var BuilderScreen = function (){
        this.builderNavigation = new BuilderNavigation();
        console.log(this.builderNavigation);
    };

    BuilderScreen.prototype.getSkeleton = function () {
        var skeletonOffer = this; // 책임자 반환되는 ReactClass 에 대해 감독하며 서로 통신함.

        var BuilderNavigationRClass = this.builderNavigation.getSkeleton();
        console.log(BuilderNavigationRClass);
        /*
         var Headers = require("./js/Headers.jsx");
         var SideMenu = require("./js/SideMenu.jsx");
         var CustomPanel = require("./js/CustomPanel.jsx");
         var EditorPanel = require("./js/EditorPanel.jsx");
         var FooterPanel = require("./js/FooterPanel.jsx");*/

        var ReactSekeleton = React.createClass({



            render: function () {
                return (
                    <div>
                        <header className="navbar navbar-inverse navbar-fixed-top header">
                            <BuilderNavigationRClass />
                        </header>
                    </div>
                )
            }
        });

        return ReactSekeleton;
    }


    module.exports = BuilderScreen;

})();