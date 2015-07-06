/**
 * Screen.jsx
 * 빌더의 전체적인 UI를 포함하고 컨트롤 하는 클래스
 *
 * Requires(js)  : BuilderNavigation.jsx
 * Requires(css) : Screen.less
 */

(function () {
    require('./styles/UIArchitecture.less');

    var Utils = require('../builder.Utils.js');
    var EventEmitter = require('../lib/EventEmitter.js');

    var Header = require('./Header.jsx');
    var RightNavigation = require('./RightNavigation.jsx');
    var LeftNavigation = require('./LeftNavigation.jsx');
    var Contents = require('./Contents.jsx');
    var Footer = require('./Footer.jsx');

    var React = require('react');

    var UIArchitecture = React.createClass({
        getInitalState(){

            return {};
        },

        onDisplayLeftPanel(_panelKey){
            console.log(_panelKey);
        },

        onDisplayRightPanel(_panelKey){
            console.log(_panelKey);
        },

        onResizeLeftPanel(_width){
            this.leftAreaWidth = _width;

            this.resizeMiddleArea();
        },

        onResizeRightPanel(_width){
            this.rightAreaWidth = _width;

            this.resizeMiddleArea();
        },

        resizeMiddleArea(){
            var selfDom = this.getDOMNode();
            var width = selfDom.offsetWidth;

            var middleAreaWidth = width - this.leftAreaWidth - this.rightAreaWidth;

            if (typeof this.refs['middle-area'] === 'undefined') return;

            var middleAreaDom = this.refs['middle-area'].getDOMNode();

            middleAreaDom.style.width = middleAreaWidth + 'px';
            middleAreaDom.style.left = this.leftAreaWidth + 'px';

            console.log(selfDom.offsetHeight);
        },

        resizeListener(_w, _h){
            var selfDom = this.getDOMNode();
            selfDom.style.width = _w + 'px';
            selfDom.style.height = _h + 'px';

            console.log('resize', _w, _h);


        },

        componentDidMount(){
            var self = this;
            this.leftAreaWidth = this.leftAreaWidth || 0;
            this.rightAreaWidth = this.rightAreaWidth || 0;

            this.props.observers.resizeListener = function (_w, _h) {
                self.resizeListener(_w, _h);
            };

            this.resizeMiddleArea();
        },

        render() {
            var self = this;

            var leftMenuItems = [
                {itemKey: 'component-palette', itemIcon: 'th', itemTitle: 'Component'},
                {itemKey: 'project-tree', itemIcon: 'briefcase', itemTitle: 'Project tree'},
                {itemKey: 'sitemap', itemIcon: 'cube', itemTitle: 'Sitemap'},
                {itemKey: 'theme', itemIcon: 'leaf', itemTitle: 'Theme'},
                {itemKey: 'style', itemIcon: 'header', itemTitle: 'style'},
                {itemKey: 'string', itemIcon: 'globe', itemTitle: 'String with I18N'},
                {itemKey: 'image', itemIcon: 'cloud', itemTitle: 'Images'},
                {itemKey: 'script', itemIcon: 'leaf', itemTitle: 'Script'},
                {itemKey: 'event', itemIcon: 'fire', itemTitle: 'Event'},
                {itemKey: 'api', itemIcon: 'cloud-download', itemTitle: 'API'},
                {itemKey: 'template', itemIcon: 'file', itemTitle: 'Template'}
            ];

            var rightMenuItems = [
                {itemKey: 'theme', itemIcon: 'leaf', itemTitle: 'CSS'},
                {itemKey: 'style', itemIcon: 'header', itemTitle: 'Tree View'},
            ];

            return (
                <div>
                    <Header/>
                    <LeftNavigation items={leftMenuItems}/>
                    <RightNavigation items={rightMenuItems}/>
                    <Contents/>
                    <Footer/>
                </div>
            )
        }
    });

    module.exports = UIArchitecture;

})();