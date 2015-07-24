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

    /* Panel Styles */
    //require('./panel/CSSMenu.less');


    //메뉴 데이터 파일
    var LeftMenuListConfig = require("../../config/LeftNavigationConfig.json");      //좌측 네비게이션 메뉴목록
    var RightMenuListConfig = require("../../config/RightNavigationConfig.json");    //우측 네비게이션 메뉴목록

    var HeadToolBar = require('./HeadToolBar.jsx');                     //상단 네비게이션 UI

    var LeftNavigation = require('./PanelNavigation.jsx'); // 좌측 네비게이션 UI
    var RightNavigation = require('./PanelNavigation.jsx'); // 우측 네비게이션 UI


    var DocumentStage = require('./DocumentStage.jsx');                 //중앙 컨텐츠 영역 UI
    var FootStatusBar = require('./FootStatusBar.jsx');                     //하단 상태 표시줄 UI
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
        // Mixin EventDistributor
        mixins:[ require('./reactMixin/EventDistributor.js') ],

        getInitalState(){
            return {};
        },

        // 좌측 메뉴별 탭UI 변경
        /*
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
        },*/

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

        onThrowCatcherCallContextMenu( _eventData, _pass ){

           if( _eventData.for === "StageElement" ){
             console.log(_eventData);

            this.refs['stage-context-menu'].setState({
               display:'on',
               x:_eventData.mouseX,
               y:_eventData.mouseY,
               for:_eventData.for,
               target:_eventData.target,

               memuItems: [
                  {
                     title: "Delete",
                     type: "button",
                     key: "elementDelete",
                     eventName:"StageElementDelete"
                  }, {
                     title: "Clone",
                     type: "button",
                     key: "elementClone",
                     eventName:"StageElementClone"
                  }, {
                     title: "Edit",
                     type: "button",
                     key: "elementEdit",
                     eventName:"StageElementEdit"
                  },
                  "spliter",
                  {
                     title: "Select Parent",
                     type: "button",
                     key: "element-select-parent",
                     eventName:"SelectParentElementByStageElement"
                  }
               ]
            });
         }
            //_pass();
        },

        onThrowCatcherClickElementInStage( _eventData, _pass ){
            console.log("처리완료 임시", _eventData);
            this.offContextMenu();

            //_pass();
        },

        onThrowCatcherStageElementDelete( _eventData, _pass ){
            console.log("처리완료 StageElementDelete", _eventData);
            _eventData.target.element.remove();
            this.offContextMenu();
        },

        onThrowCatcherStageElementClone( _eventData, _pass ){
            console.log("처리완료 StageElementClone", _eventData);
            this.offContextMenu();
        },

        onThrowCatcherStageElementEdit( _eventData, _pass ){
            console.log("처리완료 StageElementEdit", _eventData);
            this.offContextMenu();
        },

        onThrowCatcherSelectParentElementByStageElement( _eventData, _pass ){
            console.log("처리완료 SelectParentElementByStageElement", _eventData);
            this.offContextMenu();
        },

        onThrowCatcherFoldPanel( _eventData, _pass ){
            console.log("처리완료 FoldPanel", _eventData);

            if( _eventData.refPath[0] === 'RightNavigation' ){
                this.rightAreaWidth = _eventData.width;
            } else if ( _eventData.refPath[0] === 'LeftNavigation' ){
                this.leftAreaWidth = _eventData.width;
            }

            this.resizeMiddleArea();
        },

        onThrowCatcherUnfoldPanel( _eventData, _pass ){
            console.log("처리완료 UnfoldPanel", _eventData);

            if( _eventData.refPath[0] === 'RightNavigation' ){
                this.rightAreaWidth = _eventData.width;
            } else if ( _eventData.refPath[0] === 'LeftNavigation' ){
                this.leftAreaWidth = _eventData.width;
            }

            this.resizeMiddleArea();
        },

        onThrowCatcherDisplayPanel( _eventData, _pass ){
            var self = this;
            var action = _eventData.action;
            var target = action.target;

            switch (target) {
                case "LeftPanel":
                    loadPanel(action.parts + ".jsx", function (page, Panel) {
                        loadJson(action.config + ".json", function (page, json) {
                            var config = json;

                            self.refs['LeftNavigation'].setState( {
                                targetPanelItem : _eventData,
                                panelTitle: _eventData.title,
                                panelKey : _eventData.id,
                                panelReactClass : Panel,
                                createPropParams: {items:config, ref:action.parts}
                            });


                        });
                    });
                    break;

                case "RightPanel":
                    loadPanel(action.parts + ".jsx", function (page, Panel) {
                        loadJson(action.config + ".json", function (page, json) {
                            var config = json;

                            self.refs['RightNavigation'].setState( {
                                targetPanelItem : _eventData,
                                panelTitle: _eventData.title,
                                panelKey : _eventData.id,
                                panelReactClass : Panel,
                                createPropParams: {items:config, ref:action.parts}
                            });
                        });
                    });
                    break;
                case "Modal":
                    this.displayModal(action);
                    break;
            }
        },

        offContextMenu(){
           this.refs['stage-context-menu'].setState({display:'off'});
        },

        // 컨텐츠 영역 화면 리사이즈
        resizeMiddleArea(){
            var selfDom = this.getDOMNode();
            var width = selfDom.offsetWidth;
            var height = selfDom.offsetHeight;


            if (typeof this.refs['DocumentStage'] === 'undefined') return;//throw new Error("Not found DocumentStage");

            var headerOffsetHeight = this.refs['HeadToolBar'].getDOMNode().offsetHeight;
            var footerOffsetHeight = this.refs['FootStatusBar'].getDOMNode().offsetHeight;

            var middleAreaWidth = width - this.leftAreaWidth - this.rightAreaWidth;
            var middleAreaHeight = height - headerOffsetHeight - footerOffsetHeight;

            var middleAreaREle = this.refs['DocumentStage'];
            var middleAreaDom = middleAreaREle.getDOMNode();

            middleAreaDom.style.width = middleAreaWidth + 'px';
            middleAreaDom.style.left = this.leftAreaWidth + 'px';
            middleAreaDom.style.top = headerOffsetHeight + "px";

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

        resizeListener(_w, _h, _screenW, _screenH){
            var selfDom = this.getDOMNode();
            selfDom.style.width = _w + 'px';
            selfDom.style.height = _h + 'px';

            this.width = _w;
            this.height = _h;
            this.screenWidth = _screenW;
            this.screenHeight = _screenH;

            this.resizeMiddleArea();
        },

        componentDidMount(){
            var self = this;
            this.leftAreaWidth = this.leftAreaWidth || 0;
            this.rightAreaWidth = this.rightAreaWidth || 0;

            this.props.observers.resizeListener = function (_w, _h, _screenW, _screenH) {
                self.resizeListener(_w, _h, _screenW, _screenH);
            };
        },

        render() {
            var self = this;
            var leftMenuList = LeftMenuListConfig;
            var rightMenuList = RightMenuListConfig;
            var leftNaviRefKey = "LeftNavigation";
            var rightNaviRefKey = "RightNavigation";
            return (
                <div>
                    <HeadToolBar ref='HeadToolBar'/>


                    <LeftNavigation ref={leftNaviRefKey}
                                    naviItemGroups={leftMenuList}
                                    naviWidth={50}
                                    panelWidth={210}
                                    position='left'
                                    onThrow={this.getOnThrow(leftNaviRefKey)}
                                    naviItemFontSize={20}/>

                    <RightNavigation ref={rightNaviRefKey}
                                     naviItemGroups={rightMenuList}
                                     naviWidth={25}
                                     panelWidth={230}
                                     showTitle={true}
                                     verticalText={true}
                                     onThrow={this.getOnThrow(rightNaviRefKey)}
                                     position='right'
                                     naviItemFontSize={16}/>


                   <DocumentStage ref='DocumentStage' />
                    <FootStatusBar ref='FootStatusBar'/>

                    <FloatingMenuBox ref='stage-context-menu'/>
                    <Modal ref="Modal"/>
                    <PushMessage />
                </div>
            )
        }
    });

    module.exports = UIArchitecture;

})();
