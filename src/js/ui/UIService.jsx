/**
 * Screen.jsx
 * 빌더의 전체적인 UI를 포함하고 컨트롤 하는 클래스
 *
 * Requires(js)  : BuilderNavigation.jsx
 * Requires(css) : Screen.less
 */
var $ = require('jquery');

require('jquery-ui');
(function () {
    require('./UIService.less');

    //메뉴 데이터 파일
    var LeftMenuListConfig = require("../../config/LeftNavigationConfig.json");      //좌측 네비게이션 메뉴목록
    var RightMenuListConfig = require("../../config/RightNavigationConfig.json");    //우측 네비게이션 메뉴목록

    var HeaderUI = require('./Header.jsx');                     //상단 네비게이션 UI
    var LeftNavigationUI = require('./LeftNavigation.jsx');     //좌측 네비게이션 UI
    var RightNavigationUI = require('./RightNavigation.jsx');   //우측 네비게이션 UI
    var ContentsUI = require('./Contents.jsx');                 //중앙 컨텐츠 영역 UI
    var FooterUI = require('./Footer.jsx');                     //하단 상태 표시줄 UI
    var Modal = require('./Modal.jsx');                         //Modal UI
    var FloatingMenuBox = require('./FloatingMenuBox.jsx');     //StageContextMenu
    var PushMessage = require('./PushMessage.jsx');             //PushMessage

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

    function loadModal(pageName, callback) {
        try {
            var pageBundle = require("bundle!./modal/" + pageName)
        } catch (e) {
            return callback(e);
        }
        pageBundle(function (page) {
            callback(null, page);
        })
    }

    function loadJson(pageName, callback) {
        try {
            var pageBundle = require("bundle!../../config/" + pageName)
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
        onLeftDisplay(_leftMenuListConfig){
            var self = this;
            var action = _leftMenuListConfig.action;
            var target = action.target;
            switch (target) {
                case "LeftPanel":
                    loadPanel(action.parts + ".jsx", function (page, Panel) {
                        loadJson(action.config + ".json", function (page, json) {
                            var config = json;
                            var stateObj = {};
                            stateObj[target] = <Panel items={config}/>;
                            self.refs['LeftNavigation'].setState(stateObj);
                        });
                    });
                    break;
                case "Modal":
                    this.displayModal(action);
                    break;
            }
        },

        displayModal(action){
            var target = action.target;
            var self = this;
            loadModal(action.parts + ".jsx", function (page, Modal) {
                loadJson(action.config + ".json", function (page, json) {
                    var config = json;
                    var stateObj = {};
                    stateObj[target] = <Modal items={config}/>;
                    self.refs['Modal'].setState(stateObj);
                });
            });
        },

        // 우측 메뉴별 탭UI 변경
        onRightDisplay(_rightMenuListConfig){
            var self = this;
            var target = _rightMenuListConfig.target;
            loadPanel(_rightMenuListConfig.UI + ".jsx", function (page, Panel) {
                loadJson(_rightMenuListConfig.config + ".json", function (page, json) {
                    var config = json;
                    var stateObj = {};
                    stateObj[target] = <Panel items={config}/>;
                    self.refs['RightNavigation'].setState(stateObj);
                });
            });
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
            var height = selfDom.offsetHeight;


            if (typeof this.refs['Contents'] === 'undefined') return;

            var headerOffsetHeight = this.refs['Header'].getDOMNode().offsetHeight;
            var footerOffsetHeight = this.refs['Footer'].getDOMNode().offsetHeight;

            var middleAreaWidth = width - this.leftAreaWidth - this.rightAreaWidth;
            var middleAreaHeight = height - headerOffsetHeight - footerOffsetHeight;

            var middleAreaREle = this.refs['Contents'];
            var middleAreaDom = middleAreaREle.getDOMNode();

            middleAreaDom.style.width = middleAreaWidth + 'px';
            middleAreaDom.style.left = this.leftAreaWidth + 'px';


            middleAreaREle.setState({
                control: {
                    type: 'resize',
                    data: {
                        width: middleAreaWidth,
                        height: middleAreaHeight
                    }
                }
            });
        },
        calledContextMenuByStage( _e){
            alert('blocked Default Context Menu');
            console.log('called Context Menu', _e);
        },
        resizeListener(_w, _h){
            var selfDom = this.getDOMNode();
            selfDom.style.width = _w + 'px';
            selfDom.style.height = _h + 'px';
            this.resizeMiddleArea();

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
                    <HeaderUI ref='Header'/>
                    <LeftNavigationUI ref="LeftNavigation" menuList={leftMenuList} naviWidth={50} panelWidth={210}
                                      onResize={this.onResizeLeftPanel} onDisplayPanel={this.onLeftDisplay}/>
                    <RightNavigationUI ref="RightNavigation" menuList={rightMenuList} naviWidth={25} panelWidth={230}
                                       onResize={this.onResizeRightPanel} onDisplayPanel={this.onRightDisplay}/>
                    <ContentsUI ref='Contents' onCalledContextMenu={ this.calledContextMenuByStage }/>
                    <FooterUI ref='Footer'/>
                    <FloatingMenuBox ref='stage-context-menu'/>
                    <Modal ref="Modal"/>
                    <PushMessage />
                </div>
            )
        }
    });

    module.exports = UIArchitecture;

})();