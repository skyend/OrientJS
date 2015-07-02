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

    var BuilderHeader = require('./Header.jsx');
    var BuilderLeftPanel = require('./LeftPanel.jsx');

    var React = require('react');

    var ReactSekeleton = React.createClass({
        displayPanel( _panelKey){
            console.log( _panelKey);
        },
        render() {
            var self = this;

            var builderNaviItems = [
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
                        <BuilderHeader />
                    </header>
                    <aside className="nav side-navigation side-left">
                        <BuilderLeftPanel naviWidth={50}
                                          panelWidth={200}
                                          naviItems={builderNaviItems}
                                          onDisplayPanel={function(e){ self.displayPanel(e) }}/>
                    </aside>
                    <aside className="nav side-navigation side-right">

                    </aside>
                </div>
            )
        }
    });

    module.exports = ReactSekeleton;

})();