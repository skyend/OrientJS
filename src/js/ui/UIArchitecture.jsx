/**
 * Screen.jsx
 * 빌더의 전체적인 UI를 포함하고 컨트롤 하는 클래스
 *
 * Requires(js)  : BuilderNavigation.jsx
 * Requires(css) : Screen.less
 */

(function () {
    require('./styles/UIArchitecture.less');

    //메뉴 데이터 파일
    var LeftMenuListConfig = require("json!../../config/LeftMenuListConfig.json");      //좌측 네비게이션 메뉴목록
    var RightMenuListConfig = require("json!../../config/RightMenuListConfig.json");    //우측 네비게이션 메뉴목록
    var Utils = require('../builder.Utils.js');
    var EventEmitter = require('../lib/EventEmitter.js');

    //상단 네비게이션 UI
    var HeaderUI = require('./Header.jsx');

    //좌측 네비게이션 UI
    var LeftNavigationUI = require('./LeftNavigation.jsx');     //메뉴 리스트 UI

    //우측 네비게이션 UI
    var RightNavigationUI = require('./RightNavigation.jsx');

    //중앙 컨텐츠 영역 UI
    var ContentsUI = require('./Contents.jsx');

    //하단 상태 표시줄 UI
    var FooterUI = require('./Footer.jsx');

    var React = require('react');

    function loadPanel(pageName, callback) {
        try {
            var pageBundle = require("bundle!./panel/" + pageName)
        } catch (e) {
            return callback(e);
        }
        pageBundle(function (page) {
            callback(null, page);
        })
    }
    function loadJson(pageName, callback) {
        try {
            var pageBundle = require("bundle!json!../../config/" + pageName)
        } catch (e) {
            return callback(e);
        }
        pageBundle(function (page) {
            callback(null, page);
        })
    }



    var UIArchitecture = React.createClass({
        getInitalState(){
            return {};
        },
        // 좌측 메뉴별 탭UI 변경
        onDisplayLeftPanel(_panelData){
            var self = this;
            console.log(_panelData);
            var area = _panelData.area;
            loadPanel(_panelData.UI + ".jsx", function (page, Panel) {
                loadJson(_panelData.config + ".json", function (page, json) {
                    var config = json;
                    var stateObj = {};
                    stateObj[area] = <Panel items={config} />;
                    self.refs['LeftNavigation'].setState(stateObj);
                });
            });
            //switch (_panelData.itemKey) {
            //    case "component-palette" :
            //        this.refs['LeftNavigation'].setState({'PanelUI': <PanelToolsUI items={PanelToolsConfig}/>});
            //        console.log(_panelData.itemKey);
            //        console.log(PanelToolsUI);
            //        break;
            //    case "project-tree" :
            //        this.refs['LeftNavigation'].setState({'PanelUI': <PanelDeviceModeUI items={PanelDeviceModeConfig}/>});
            //        break;
            //
            //}
        },
        /**
         * 우측 메뉴별 탭UI 변경
         */
            onDisplayRightPanel(_panelKey){
            console.log(_panelKey);
        },
        // 좌측 패널에 따른 중앙 리사이즈
        onResizeLeftPanel(_width){
            this.leftAreaWidth = _width;
            this.resizeMiddleArea();
        },
        // 우측 패널 리사이즈
        onResizeRightPanel(_width){
            this.rightAreaWidth = _width;
            this.resizeMiddleArea();
        },
        // 컨텐츠 영역 화면 리사이즈
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
            this.resizeMiddleArea();
            console.log('resize', _w, _h);
        },

        componentDidMount(){
            var self = this;
            this.leftAreaWidth = this.leftAreaWidth || 0;
            this.rightAreaWidth = this.rightAreaWidth || 0;

            this.props.observers.resizeListener = function (_w, _h) {
                self.resizeListener(_w, _h);
            };
        },

        render() {
            var leftMenuList = LeftMenuListConfig;
            var rightMenuList = RightMenuListConfig;

            return (
                <div>
                    <HeaderUI/>
                    <LeftNavigationUI ref="LeftNavigation" menuList={leftMenuList} naviWidth={50} panelWidth={210}
                                      onResize={this.onResizeLeftPanel} onDisplayPanel={this.onDisplayLeftPanel}/>
                    <RightNavigationUI menuList={rightMenuList} naviWidth={25} panelWidth={230}
                                       onResize={this.onResizeRightPanel} onDisplayPanel={this.onDisplayRightPanel}/>
                    <ContentsUI ref='middle-area'/>
                    <FooterUI/>
                </div>
            )
        }
    });

    module.exports = UIArchitecture;

})();