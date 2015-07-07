/**
 * Screen.jsx
 * 빌더의 전체적인 UI를 포함하고 컨트롤 하는 클래스
 *
 * Requires(js)  : BuilderNavigation.jsx
 * Requires(css) : Screen.less
 */

(function () {
    require('./styles/UIArchitecture.less');
    var LeftMenuListConfig = require("json!../../config/LeftMenuListConfig.json");
    var RightMenuListConfig = require("json!../../config/RightMenuListConfig.json");
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

            var leftMenuList = LeftMenuListConfig;

            var rightMenuList = RightMenuListConfig;

            return (
                <div>
                    <Header/>
                    <LeftNavigation items={leftMenuList} naviWidth={50} panelWidth={210} onResize={this.onResizeLeftPanel} onDisplayPanel={this.onDisplayLeftPanel}/>
                    <RightNavigation items={rightMenuList} naviWidth={25} panelWidth={230} onResize={this.onResizeRightPanel} onDisplayPanel={this.onDisplayRightPanel}/>
                    <Contents ref='middle-area'/>
                    <Footer/>
                </div>
            )
        }
    });

    module.exports = UIArchitecture;

})();