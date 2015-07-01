/**
 * Screen.jsx
 * 빌더의 전체적인 UI를 포함하고 컨트롤 하는 클래스
 *
 * Requires(js)  : BuilderNavigation.jsx
 * Requires(css) : Screen.less
 */

(function () {
    require('./styles/Screen.less');

    var Utils = require('../builder.Utils.js');
    var EventEmitter = require('../lib/EventEmitter.js');

    var BuilderNavigation = require('./BuilderNavigation.jsx');
    var VerticalNavigation = require('./VerticalNavigation.jsx');


    var React = require("react");

    var BuilderScreen = function (){
        this.builderNavigation = new BuilderNavigation({

        });

        this.projectNavigation = new VerticalNavigation({
            naviWidth: 50,
            initialPanelWidth: 200
        });

        this.projectNavigation.on('clickNaviItem', function( _e){
            console.log('click Item', _e);
        });

        this.helperNavigation = new VerticalNavigation({
            naviWidth: 50,
            initialPanelWidth: 200
        });

        this.helperNavigation.on('clickNaviItem', function( _e){

        });

    };

    BuilderScreen.prototype.getSkeleton = function () {
        var skeletonOffer = this; // 책임자 반환되는 ReactClass 에 대해 감독하며 서로 통신함.

        var BuilderNavigationRClass = this.builderNavigation.getSkeleton();
        var ProjectNavigationRClass = this.projectNavigation.getSkeleton();
        var HelperNavigationRClass = this.helperNavigation.getSkeleton();

        /*
         var Headers = require("./js/Headers.jsx");
         var SideMenu = require("./js/SideMenu.jsx");
         var CustomPanel = require("./js/CustomPanel.jsx");
         var EditorPanel = require("./js/EditorPanel.jsx");
         var FooterPanel = require("./js/FooterPanel.jsx");*/

        var ReactSekeleton = React.createClass({

            render: function () {

                var projectNaviItems = [
                    { itemKey : 'component-palette', itemIcon:'th', itemTitle: 'Component' },
                    { itemKey : 'project-tree', itemIcon:'briefcase', itemTitle: 'Project tree' },
                    { itemKey : 'sitemap', itemIcon:'grain', itemTitle: 'Sitemap' },
                    { itemKey : 'theme', itemIcon:'leaf', itemTitle: 'Theme' },
                    { itemKey : 'style', itemIcon:'header', itemTitle: 'style' },
                    { itemKey : 'string', itemIcon:'globe', itemTitle: 'String with I18N' },
                    { itemKey : 'image', itemIcon:'picture', itemTitle: 'Images' },
                    { itemKey : 'script', itemIcon:'leaf', itemTitle: 'Script' },
                    { itemKey : 'event', itemIcon:'fire', itemTitle: 'Event' },
                    { itemKey : 'api', itemIcon:'cloud-download', itemTitle: 'API' },
                    { itemKey : 'template', itemIcon:'file', itemTitle: 'Template' }
                ];

                var helperNaviItems = [
                    { itemKey : 'theme', itemIcon:'leaf', itemTitle: 'Theme' },
                    { itemKey : 'style', itemIcon:'header', itemTitle: 'style' },
                    { itemKey : 'string', itemIcon:'globe', itemTitle: 'String with I18N' },
                    { itemKey : 'image', itemIcon:'picture', itemTitle: 'Images' },
                    { itemKey : 'script', itemIcon:'leaf', itemTitle: 'Script' },
                    { itemKey : 'event', itemIcon:'fire', itemTitle: 'Event' },
                    { itemKey : 'api', itemIcon:'cloud-download', itemTitle: 'API' },
                    { itemKey : 'template', itemIcon:'file', itemTitle: 'Template' }
                ];

                return (
                    <div>
                        <header className="builder-navigation">
                            <BuilderNavigationRClass />
                        </header>
                        <aside className="nav side-navigation side-left">
                            <ProjectNavigationRClass naviItems={ projectNaviItems } panelPosition='right'/>
                        </aside>
                        <aside className="nav side-navigation side-right">
                            <HelperNavigationRClass naviItems={ helperNaviItems } panelPosition='left'/>
                        </aside>
                    </div>
                )
            }
        });

        return ReactSekeleton;
    }


    module.exports = BuilderScreen;

})();